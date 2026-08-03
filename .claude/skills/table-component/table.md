=======================Table=============================
AntD-Vue's table is two components stacked:

- table/ (the "smart" wrapper) — InternalTable in table/Table.tsx. Owns data features: sort, filter,
  selection, pagination. It never renders cells; it only transforms the columns array and transforms the
  data array, then hands both to the engine (table/Table.tsx:603 renders <RcTable>).
- vc-table/ (the "dumb" engine) — vc-table/Table.tsx. Owns rendering & layout: colgroup, fixed header,
  sticky columns, scroll sync, width measurement. It knows nothing about sorting or filtering.

Everything below follows this seam: features = column/data transforms (layer 1), layout = measurement +
sticky offsets (layer 2).

---

1. Calculate column widths

The engine never trusts declared widths for layout math — it measures the real DOM and feeds widths back
reactively.

- Flatten first. vc-table/hooks/useColumns.tsx:19-44 flatColumns() recursively flattens column groups
  into a flat leaf list (grouped headers become one row of leaves), and normalizes fixed: true → 'left'
  (line 24).
- Zero-height measure cells. vc-table/Body/MeasureCell.tsx:15-31 — each column renders an invisible <td
  style="height:0"> wrapped in a VCResizeObserver. On mount and on every resize it emits
  columnResize(columnKey, offsetWidth).
- Widths live in a Map. vc-table/Table.tsx:339 colsWidths = Map<Key,number>; onColumnResize (402-413)
  writes to it only if the table is visible and the value actually changed (avoids render thrash).
  colWidths (343-345) projects the map to an ordered array by colsKeys.
- Measurement is conditional. Table.tsx:624 passes measureColumnWidth = fixHeader || horizonScroll ||
  isSticky to <Body>. Plain tables skip measuring entirely — native table-layout:auto handles them for
  free. Measurement only turns on when sticky/scroll actually needs pixel offsets.
- <colgroup> is the width applicator. vc-table/ColGroup.tsx:10-36 builds <col style="width">, iterating
  backwards and skipping trailing width-less cols (mustInsert, 17-32) so it emits the minimum number of
  <col>s.
- Table layout mode. Table.tsx:544-562 mergedTableLayout: fixed when there are fixed columns (unless
  scroll.x==='max-content' → auto, 552), or when fixHeader/sticky/any ellipsis column exists; otherwise
  auto. fixed is what makes measured <col> widths authoritative.

Takeaway: declared width is only a hint; the source of truth is a ResizeObserver-fed Map, projected to an
array, applied via <colgroup>, under table-layout:fixed.

---

2. Scroll x / y body

- Three booleans drive everything (Table.tsx:348-354): fixHeader = !!scroll.y, horizonScroll = !!scroll.x
  || expandFixed, fixColumn = horizonScroll && any column fixed.
- Three style objects (Table.tsx:379-400): scrollYStyle = {overflowY:'scroll', maxHeight: scroll.y};
  scrollXStyle = {overflowX:'auto'}; scrollTableStyle = {width: scroll.x, minWidth:'100%'}. Note the
  subtlety at 392-393: horizontal-scroll-but-no-y sets overflowY:hidden to kill a phantom vertical
  scrollbar.
- Two render branches. If fixHeader || isSticky (Table.tsx:682): header and body become separate tables —
  a <FixedHolder> header (751) + a scrollable body <div ref=scrollBodyRef> (708-733). Otherwise (799-823)
  it's one <table> in a single scroll container.
- Header ↔ body horizontal sync (Table.tsx:433-464). onScroll reads scrollLeft and calls forceScroll(...)
  on header, body, summary, and the sticky scrollbar (448-451). A timeout-lock
  (setScrollTarget/getScrollTarget, 415 + 445) records who initiated the scroll so the programmatic sync of
  the other elements doesn't bounce back and cause a feedback loop.
- Ping shadows (457-462): pingedLeft = scrollLeft > 0, pingedRight = scrollLeft < scrollWidth -
  clientWidth → -ping-left/-ping-right classes (832-833) that toggle the fixed-column shadow. RTL flips the
  math.
- Header can't be scrolled by the user (its wrapper is overflow:hidden, FixedHolder/index.tsx:154), so it
  captures wheel events and forwards deltaX as a scroll (FixedHolder/index.tsx:74-80).
- Scrollbar-gutter alignment. The body has a vertical scrollbar; the header doesn't. FixedHolder appends
  a phantom scrollbar spacer column (index.tsx:104-118, width = combinationScrollBarSize) so header columns
  stay pixel-aligned with body columns. Scrollbar size is measured once via getTargetScrollBarSize
  (Table.tsx:507).
- Synthetic sticky scrollbar (vc-table/stickyScrollBar.tsx) — for sticky mode, a fake bottom scrollbar
  that stays in the viewport. Thumb width = bodyWidth \* (bodyWidth/scrollWidth) (46-47); dragging maps back
  to body.scrollLeft (86-97).

---

3. Sticky (fixed) columns

Pure CSS position: sticky + accumulated pixel offsets — no JS scroll handlers per cell.

- Offset accumulation — vc-table/hooks/useStickyOffsets.ts:14-50. Walk columns left→right accumulating
  left[i] = Σ widths[0..i-1]; simultaneously walk right→left accumulating right. One pass, both directions
  (24-44). RTL swaps which accumulator gets which end.
- Per-cell fixed info — vc-table/utils/fixUtil.ts:16-69 getCellFixedInfo. For a fixed-left cell, fixLeft
  = stickyOffsets.left[colStart] (30). lastFixLeft (the shadow boundary) is true when the next column isn't
  fixed-left (52-54); firstFixRight is symmetric (55-57). RTL handled separately (44-51). The engine
  precomputes the whole fixedInfoList once per render (Table.tsx:572-582).
- Application — vc-table/Cell/index.tsx:298-311: if isFixLeft → position:sticky; left:${fixLeft}px
  (mirror for right). Boundary classes -fix-left-last / -fix-right-first (336-349) carry the shadow.
  Everything is gated by supportSticky (129) so unsupported browsers degrade gracefully.

Takeaway: sticky = (prefix-sum of measured widths) → left/right px on position:sticky cells + a "last
fixed" class for the shadow. This is exactly the model your Table.vue already implements by hand
(\_stickyOffset, \_isLastFixedLeft) — AntD just derives the widths from ResizeObserver instead of your
syncScrollbarGutter measurement.

---

4. Resize column

- Public API (table/demo/resizable-column.vue:20-125): mark a column resizable: true + width (+ optional
  minWidth/maxWidth), and handle @resizeColumn="(w, col) => col.width = w". The user owns the width state —
  AntD only reports the new width.
- Handle rendering — vc-table/Header/HeaderRow.tsx:93-102: when col.resizable, a <DragHandle> is rendered
  into the header Cell's dragHandle slot (Cell/index.tsx:364), receiving width/minWidth/maxWidth/column.
- Drag math — vc-table/Header/DragHandle.tsx. On mousedown/touchstart it captures startX and baseWidth =
  parentNode.getBoundingClientRect().width (117). On move: w = clamp(baseWidth - (startX - pageX),
  minWidth, maxWidth) (98-100), rAF-throttled (101-104), calling onResizeColumn(w,
  column.**originColumn**).
- The callback path — onResizeColumn is injected from table/context.ts:42-44; provided in
  table/Table.tsx:208-212 where it does emit('resizeColumn', w, col). So: drag → context callback →
  component emit → user mutates col.width → reactive re-render with the new <col> width.

Contrast with your Table.vue: yours is self-contained (onResizeStart/Move/End write columnWidths[key]
internally, Table.vue:799-834). AntD externalizes width state to the consumer; yours keeps it internal
(simpler API, but not controllable from outside).

---

5. Filter column

Same "inject into title + transform the data" pattern as sort.

- Collect state — table/hooks/useFilter/index.tsx:28-70: any column with filters / filterDropdown /
  onFilter gets a FilterState {key, filteredKeys}. Controlled via filteredValue (40-51), uncontrolled via
  defaultFilteredValue (52-62); mergedFilterStates (231-274) auto-detects which mode.
- Inject dropdown — injectFilter (72-134) replaces the column title with a <FilterDropdown> that closes
  over triggerFilter.
- Apply filter — getFilterData (167-188) is a reduce over all filter states: each active column does
  data.filter(record => filteredKeys.some(key => onFilter(key, record))). The reduce is how multiple column
  filters compose (AND across columns, OR within a column).
- Commit — triggerFilter (278-283) swaps that column's state, calls setFilterStates, and fires
  onFilterChange.

5b. Sort column (same architecture)

- collectSortStates (useSorter.tsx:62-107) → injectSorter (109-243) adds the up/down carets (133-148) and
  wires customHeaderCell.onClick → triggerSorter(nextSortOrder). Direction cycles through the
  sortDirections array (nextSortDirection, 47-53): ascend → descend → none.
- getSortData (271-323) sorts by multiplePriority descending (276-278) then runs a stable multi-key
  compare loop (291-311) — that's how sorter: { multiple: N } multi-column sort works.

The unifying pattern — the column-transform pipeline

table/Table.tsx:519-526:
transformColumns = cols =>
transformTitleColumns(
transformSelectionColumns(
transformFilterColumns(
transformSorterColumns(
transformBasicColumns(cols)))))
Each transform is a pure columns → columns function that injects one concern (basic slots → sorter icon →
filter dropdown → selection checkbox → final title). The data flows through the mirror pipeline:
sortedData (348, getSortData) → mergedData (372, getFilterData) → pageData (423, pagination slice). Both
converge in triggerOnChange (282-320), which fires the single public onChange(pagination, filters,
sorter, extra) with extra.currentDataSource = getFilterData(getSortData(...)).

---

6. Drag-and-drop column

There is no native column drag-and-drop in AntD-Vue. Worth stating plainly because the file naming
misleads:

- vc-table/Header/DragHandle.tsx is the resize handle (§4), not a column-reorder handle. Its "drag" is
  width dragging.
- Column reordering is left entirely to userland — you own columns state, so you reorder that array
  yourself (typically with vuedraggable/SortableJS on your own header render) and reassign it.
- Row reordering is likewise userland — the table/demo/order-column.vue demo wraps rows with a
  third-party sortable and rewrites dataSource on drop; the core does nothing special beyond stable rowKey
  re-rendering.

This is the one place your Table.vue does more than AntD: you have first-class row drag-and-drop built in
(isDrag, onDragStart/Over/Drop, FLIP animation at Table.vue:680-797, drag-record emit). AntD
deliberately leaves that to the consumer.

---

How this maps back to your Table.vue

Your component already mirrors AntD's concepts (sticky offsets, last-fixed shadow class, measured
colWidths, header/body scroll sync). The architectural differences worth noting if you keep evolving it:

┌─────────────┬─────────────────────────────────┬────────────────────────────────────────────────────┐
│ Concern │ AntD engine │ Your Table.vue │
├─────────────┼─────────────────────────────────┼────────────────────────────────────────────────────┤
│ Width │ ResizeObserver per-column Map │ one getBoundingClientRect sweep of the first body │
│ source │ (Table.tsx:339) │ row (syncScrollbarGutter, Table.vue:580-593) │
├─────────────┼─────────────────────────────────┼────────────────────────────────────────────────────┤
deliberately leaves that to the consumer.

---

How this maps back to your Table.vue

Your component already mirrors AntD's concepts (sticky offsets, last-fixed shadow class, measured
colWidths, header/body scroll sync). The architectural differences worth noting if you keep evolving it:

┌─────────────┬─────────────────────────────────┬────────────────────────────────────────────────────┐
│ Concern │ AntD engine │ Your Table.vue │
├─────────────┼─────────────────────────────────┼────────────────────────────────────────────────────┤
│ Width │ ResizeObserver per-column Map │ one getBoundingClientRect sweep of the first body │
│ source │ (Table.tsx:339) │ row (syncScrollbarGutter, Table.vue:580-593) │
├─────────────┼─────────────────────────────────┼────────────────────────────────────────────────────┤
│ Empty state │ -empty class + noData │ new isEmpty → drop fixed-layout (the fix we just │
│ │ short-circuit (FixedHolder:165) │ made) │
├─────────────┼─────────────────────────────────┼────────────────────────────────────────────────────┤
│ Resize │ externalized via @resizeColumn │ internal columnWidths map │
│ width │ │ │
├─────────────┼─────────────────────────────────┼────────────────────────────────────────────────────┤
│ Row DnD │ userland │ built in (your advantage) │
├─────────────┼─────────────────────────────────┼────────────────────────────────────────────────────┤
│ Filter/sort │ column-transform pipeline │ sort only, computed in rows (Table.vue:383-393); │
│ │ (Table.tsx:519) │ no filter │
└─────────────┴─────────────────────────────────┴────────────────────────────────────────────────────┘

The single biggest robustness lesson from AntD relevant to the empty-table bug you just hit: AntD
measures each column independently via ResizeObserver and short-circuits layout on noData, so it never
depends on a body row existing to compute header widths — which is exactly the fragility your isEmpty
guard now works around.

Want me to sketch how to port any specific one of these into Table.vue (e.g. ResizeObserver-per-column
width measurement, or a filter transform), or is this read-through what you needed?

converge in triggerOnChange (282-320), which fires the single public onChange(pagination, filters,
sorter, extra) with extra.currentDataSource = getFilterData(getSortData(...)).

---

6. Drag-and-drop column

There is no native column drag-and-drop in AntD-Vue. Worth stating plainly because the file naming
misleads:

- vc-table/Header/DragHandle.tsx is the resize handle (§4), not a column-reorder handle. Its "drag" is
  width dragging.
- Column reordering is left entirely to userland — you own columns state, so you reorder that array
  yourself (typically with vuedraggable/SortableJS on your own header render) and reassign it.
- Row reordering is likewise userland — the table/demo/order-column.vue demo wraps rows with a
  third-party sortable and rewrites dataSource on drop; the core does nothing special beyond stable rowKey
  re-rendering.

This is the one place your Table.vue does more than AntD: you have first-class row drag-and-drop built in
(isDrag, onDragStart/Over/Drop, FLIP animation at Table.vue:680-797, drag-record emit). AntD
deliberately leaves that to the consumer.

---

How this maps back to your Table.vue

Your component already mirrors AntD's concepts (sticky offsets, last-fixed shadow class, measured
colWidths, header/body scroll sync). The architectural differences worth noting if you keep evolving it:

┌─────────────┬─────────────────────────────────┬────────────────────────────────────────────────────┐
│ Concern │ AntD engine │ Your Table.vue │
├─────────────┼─────────────────────────────────┼────────────────────────────────────────────────────┤
│ Width │ ResizeObserver per-column Map │ one getBoundingClientRect sweep of the first body │
│ source │ (Table.tsx:339) │ row (syncScrollbarGutter, Table.vue:580-593) │
├─────────────┼─────────────────────────────────┼────────────────────────────────────────────────────┤
│ Empty state │ -empty class + noData │ new isEmpty → drop fixed-layout (the fix we just │
│ │ short-circuit (FixedHolder:165) │ made) │
├─────────────┼─────────────────────────────────┼────────────────────────────────────────────────────┤
│ Resize │ externalized via @resizeColumn │ internal columnWidths map │
│ width │ │ │
├─────────────┼─────────────────────────────────┼────────────────────────────────────────────────────┤
│ Row DnD │ userland │ built in (your advantage) │
├─────────────┼─────────────────────────────────┼────────────────────────────────────────────────────┤
│ Filter/sort │ column-transform pipeline │ sort only, computed in rows (Table.vue:383-393); │
│ │ (Table.tsx:519) │ no filter │
└─────────────┴─────────────────────────────────┴────────────────────────────────────────────────────┘

The single biggest robustness lesson from AntD relevant to the empty-table bug you just hit: AntD
measures each column independently via ResizeObserver and short-circuits layout on noData, so it never
depends on a body row existing to compute header widths — which is exactly the fragility your isEmpty
guard now works around.

Want me to sketch how to port any specific one of these into Table.vue (e.g. ResizeObserver-per-column
width measurement, or a filter transform), or is this read-through what you needed?

converge in triggerOnChange (282-320), which fires the single public onChange(pagination, filters,
sorter, extra) with extra.currentDataSource = getFilterData(getSortData(...)).

---

6. Drag-and-drop column

There is no native column drag-and-drop in AntD-Vue. Worth stating plainly because the file naming
misleads:

- vc-table/Header/DragHandle.tsx is the resize handle (§4), not a column-reorder handle. Its "drag" is
  width dragging.
- Column reordering is left entirely to userland — you own columns state, so you reorder that array
  yourself (typically with vuedraggable/SortableJS on your own header render) and reassign it.
- Row reordering is likewise userland — the table/demo/order-column.vue demo wraps rows with a
  third-party sortable and rewrites dataSource on drop; the core does nothing special beyond stable rowKey
  re-rendering.

This is the one place your Table.vue does more than AntD: you have first-class row drag-and-drop built in
(isDrag, onDragStart/Over/Drop, FLIP animation at Table.vue:680-797, drag-record emit). AntD
deliberately leaves that to the consumer.

---

How this maps back to your Table.vue

Your component already mirrors AntD's concepts (sticky offsets, last-fixed shadow class, measured
colWidths, header/body scroll sync). The architectural differences worth noting if you keep evolving it:

┌─────────────┬─────────────────────────────────┬────────────────────────────────────────────────────┐
│ Concern │ AntD engine │ Your Table.vue │
├─────────────┼─────────────────────────────────┼────────────────────────────────────────────────────┤
│ Width │ ResizeObserver per-column Map │ one getBoundingClientRect sweep of the first body │
│ source │ (Table.tsx:339) │ row (syncScrollbarGutter, Table.vue:580-593) │
├─────────────┼─────────────────────────────────┼────────────────────────────────────────────────────┤
│ Empty state │ -empty class + noData │ new isEmpty → drop fixed-layout (the fix we just │
│ │ short-circuit (FixedHolder:165) │ made) │
├─────────────┼─────────────────────────────────┼────────────────────────────────────────────────────┤
│ Resize │ externalized via @resizeColumn │ internal columnWidths map │
│ width │ │ │
├─────────────┼─────────────────────────────────┼────────────────────────────────────────────────────┤
│ Row DnD │ userland │ built in (your advantage) │
├─────────────┼─────────────────────────────────┼────────────────────────────────────────────────────┤
│ Filter/sort │ column-transform pipeline │ sort only, computed in rows (Table.vue:383-393); │
│ │ (Table.tsx:519) │ no filter │
└─────────────┴─────────────────────────────────┴────────────────────────────────────────────────────┘
