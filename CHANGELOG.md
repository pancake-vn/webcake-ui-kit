# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.33] - 2026-07-23

### Added
- `WkDropdown` and `WkMenu` accept a new `persistent` prop to keep the overlay open when clicking outside.
- `WkTag` emits a new `click` event.
- New `WkiFrameCornersDash` and `WkiOpacity` icons.

### Changed
- `WkDropdown`'s overlay now defaults to a 280px width instead of auto-sizing to its trigger.
- `WkMenu` sizes its overlay to an exact `width` instead of a `min-width`, so custom widths no longer expand with content.
- `WkDatePicker` calendar weekday and day cells grow from 32px to 36px, with updated mini-size typography tokens.
- Heading 2 typography scales up from 30px/30px to 32px/40px font-size/line-height.

### Fixed
- `WkButton` label now stretches to fill the available space, fixing icon/label alignment.
- `WkDialog` fixes z-index stacking across multiple open dialogs and now cleans up correctly when unmounted under Vue 2.
- `WkDropdown`, `WkMenu`, `WkSlider`, and `WkTooltip` now clean up their event listeners and timers correctly when unmounted under Vue 2.
- `WkSelect` now forwards external `class` and `style` bindings to its root element consistently on both Vue 2 and Vue 3.

## [1.1.32] - 2026-07-21

### Added
- `WkInputNumber` supports a new `draggable` prop that lets users click-and-drag horizontally on the field to change its value, with a matching `ew-resize` cursor.
- New `WkiFrameCorners` icon.

## [1.1.31] - 2026-07-18

### Fixed
- `WkDatePicker` fixes dayjs plugin resolution so calendar and time panels load correctly under both the Vue 3 (Vite) and Vue 2 (webpack) bundlers.

## [1.1.30] - 2026-07-09

### Added
- New `WkDatePicker` component with calendar and time panels for selecting a single date.
- New `wkMessage` imperative service for showing global toast-style messages (`success`, `error`, `info`, `warning`, `loading`), with configurable placement, duration, and max count.
- New `WkProgress` component with a `value`/`max`-driven progress bar.

### Changed
- `WkRadio` and `WkRadioGroup` now accept `String`, `Number`, or `Boolean` values, not just strings.
- `WkTable` row drag-and-drop now reorders rows live as you drag over them, instead of only on drop.
- `WkTable` column resize handle grows to full height on hover, and the resize indicator line is thicker with an updated accent color.
- `WkTable` shows an animated sticky-border reveal on the last fixed-left column while scrolling horizontally.
- `WkMenu` no longer caps its width at 320px.

### Fixed
- `WkInput` no longer shows the native calendar picker indicator on date-typed fields.

## [1.1.29] - 2026-07-06

### Added
- `WkAlert` gains a new `success` type alongside the existing `neutral`, `error`, `warning`, and `info` types.
- `WkSelectOption` supports new `prefix` and `suffix` slots for leading and trailing content inside an option.
- `WkDropdown`, `WkSelect`, and `WkTooltip` accept new `overlayClassName` and `overlayStyle` props for customizing their floating overlay panel.
- `WkDropdown` accepts a new `showChecked` prop to control whether a checkmark is shown next to the active menu item; it now defaults to hidden.
- `WkTable` supports row drag-and-drop reordering via a new `isDrag` prop, a drag handle column, and a `drag-record` event with an animated reorder transition.
- `WkTable` columns can be pinned to the left or right edge via `fixed` and made user-resizable via `resizable`, with sticky-column shadows on scroll.

### Changed
- `WkTable` now renders with a rounded, bordered container and switches to `ResizeObserver`-based layout syncing for smoother horizontal scrolling and header/body alignment.
- `WkSelect` multiple-mode trigger height switches from a fixed height to `min-height` so it grows naturally as tags wrap.
- `WkInput` decoration icon wrapper uses `min-width` instead of a fixed `width` so wider custom decorations are no longer clipped.
- Color tokens: warning colors now derive from amber instead of yellow/orange, new `positive` color tokens support the `WkAlert` success state, and the unused `--warning-text`/`--infor-text` tokens are removed in favor of `--warning`/`--infor`.

### Fixed
- Click-outside detection now correctly ignores clicks inside nested portal-hosted overlays, such as a `WkSelect` menu opened inside a `WkDropdown`, preventing the parent overlay from closing prematurely.
- `WkDropdown` destructive menu items keep their subtle red background when also active, instead of losing it.

## [1.1.28] - 2026-07-02

### Fixed
- `WkSelect` now derives an option's label from its slot text content when no explicit `label` prop is provided, fixing labels for options rendered via slots on both Vue 2 and Vue 3.

## [1.1.27] - 2026-07-02

### Added
- New `WkAlert` component with `neutral`, `error`, `warning`, and `info` types, optional `title`/`description` props, `closable` button, and `icon`/`description`/`action` slots.
- `WkSelect` accepts a new `append` prop to render trailing text inside the trigger, alongside the existing `prepend`.

### Changed
- Color tokens: `--info-subtle`/`--info-border`/`--info-text` are renamed to `--infor-subtle`/`--infor-border`/`--infor-text`, and new `--destructive-border-subtle`, `--warning-border-subtle`, and `--infor-border-subtle` tokens are added; warning and info text colors are adjusted for better contrast in both light and dark themes.
- `WkSwitch` off-state track background changes from `--border-primary` to `--color-neutral-300`.
- `WkDropdown` destructive menu items now show a subtle red hover background.
- `WkTextarea` field now hides overflow and adds a custom scrollbar (track border, content-box-clipped thumb) instead of relying on the default browser scrollbar.

## [1.1.26] - 2026-06-27

### Fixed

- `WkDropdown` menu items no longer render an empty icon wrapper element when no `icon` is provided; the icon `<span>` is now conditionally omitted for all item types (flat, grouped, and nested).

## [1.1.25] - 2026-06-27

### Added

- `WkDropdown` accepts a new `size` prop (`sm`, `md`, `lg`, default `md`) that controls item height, padding, gap, and font size in the dropdown menu; icon size scales automatically with the chosen size.
- `WkSelect` accepts a new `optionSize` prop (`xs`, `md`, `lg`, default `md`) for controlling the size of dropdown option items independently from the trigger size.
- `WkToggle` and `WkToggleGroup` add a `mini` size variant (24px height), the smallest available toggle size.
- `WkToggle` and `WkToggleGroup` add a new `xs` size variant (28px height) that now sits between `mini` and `sm`; the previous `xs` slot is renamed to `mini`.
- Four new icon components: `WkiSlash2`, `WkiSquareNumber`, `WkiRows3Add`, and `WkiColumns3Add`.

### Changed

- `WkSelectOption` size prop values changed from `regular`/`large` to `sm`/`md`/`lg`; when `size` is not set explicitly, the option inherits the parent `WkSelect` size automatically.
- `WkSelect` `tagSize` mapping updated so `xs` and `sm` trigger sizes produce `sm` tags, and `md` and `lg` trigger sizes produce `md` tags.
- `WkSelect` multiple-mode trigger uses a fixed `height` instead of `min-height`, keeping multi-value triggers at a consistent height.
- `WkBreadcrumb` separator icon updated from `WkiSlash` to `WkiSlash2` (14px, `--mid-alt` color) for a more refined visual weight.
- `--accent-0` design token uses solid opaque colors in both light (`#fafafa`) and dark (`--color-neutral-900`) themes instead of semi-transparent rgba values.

### Fixed

- `WkButtonGroup` border-radius override now uses a doubled class selector to correctly outrank per-size radius rules from `button.css`, ensuring grouped buttons have squared inner edges at all sizes.
- `WkDialog` `sub-text` slot now renders below the header action row instead of inside the title column, matching the intended layout.
- `WkTable` vertical scrollbar is wider (10px) with a track border and content-box-clipped thumb, matching the intended scrollbar design.

## [1.1.24] - 2026-06-26

### Fixed

- `WkToggle` icon-only `xs` size variant now renders as a square; `min-width` was incorrectly set to `24px` instead of matching the `28px` `min-height`.

## [1.1.23] - 2026-06-26

### Fixed

- Global stylesheet no longer forces `var(--font-family-sans)` onto every element via the `*` selector; font family now inherits from the consuming application as intended.

## [1.1.22] - 2026-06-19

### Fixed

- `WkSelectOption` checkmark icon is now only rendered in `multiple` and `tags` mode; in single-select mode the checkmark was incorrectly displayed next to the chosen option.
- `WkSelect` `xs` size variant trigger now uses the `--radius` border-radius token instead of `--rounded-lg`, matching the intended design.
- `WkSelect` search input no longer applies a hardcoded `font-size: 12px`; the size now inherits correctly from the component's typography context.

## [1.1.21] - 2026-06-18

### Fixed

- `WkTable` `customRow` and `customHeader` callbacks now correctly wire `onXxx`-style keys as DOM event listeners on both Vue 2 and Vue 3; previously, those keys were spread via `v-bind` and treated as raw attributes in Vue 2, so click, dblclick, and similar handlers had no effect.

## [1.1.20] - 2026-06-18

### Added

- New `WkTextarea` component for multi-line text input with `size` (`default`, `mini`), `roundness` (`default`, `round`), `error`, `disabled`, `readonly`, `resizable`, `autosize`, `showCount`, and `maxLength` props; emits `input`, `change`, `focus`, and `blur` and supports `v-model` on both Vue 2 and Vue 3.
- `WkTable` adds a `virtual` boolean prop that enables virtual scrolling, rendering only the visible rows plus a configurable `overscan` buffer to keep large datasets smooth.
- `WkTable` adds `customRow` and `customHeader` function props for injecting arbitrary HTML attributes onto each body `<tr>` or header `<th>` element at render time.
- `WkTable` row selection now supports Shift+click to extend the selection by a contiguous range, and Cmd/Ctrl+click on a row body to toggle a single row without opening the row.

### Changed

- `WkTable` no longer emits a `row-click` event; row-body clicks now only participate in Shift/Cmd modifier-key multi-select.
- `WkTag` base gap now uses the `--spacing-6` design token instead of a hardcoded value, and the `sm` size variant gains an explicit `--spacing-2xs` gap.

## [1.1.19] - 2026-06-17

### Added

- New `WkTable` component for rendering data tables with columns defined via a `columns` prop array; supports client-side sorting (ascending / descending / none) by clicking any column whose descriptor includes a `sorter`, optional row selection via a leading `WkCheckbox` column controlled by `selectedRowKeys`, a `bordered` prop for outer border and column dividers, vertical scroll with a sticky header via `height` or `scroll.y`, horizontal scroll via `scroll.x`, `headerCell` and `bodyCell` named slots for custom cell rendering, and a built-in `WkEmpty` empty state.
- New `WkiClippingMask` icon component is available.
- `WkDropdown` accepts a new `value` prop (String or Array) that marks the matching item(s) as active in the dropdown menu with a checkmark indicator and highlighted background.

### Changed

- `WkTypography` `color` prop now accepts any raw CSS color value in addition to design-token names; previously, only recognized token names passed the validator.

### Fixed

- `WkButton` link variant no longer renders a visible border.
- `WkCheckbox` indicator box is now correctly positioned using `inset: 0`.
- `WkEmpty` title now uses the `paragraph-regular` typography variant, aligning with the current design-token set.
- Floating panels (dropdowns, menus) no longer steal focus back to the trigger when the user has already focused a different element while the close animation was running.

## [1.1.18] - 2026-06-15

### Added

- `WkSelect` now exposes an `empty` named slot so consumers can replace the default "No data" empty state with custom content.

## [1.1.17] - 2026-06-13

### Fixed

- `WkSelect` search input placeholder text is now rendered at 14px instead of inheriting an unpredictable size from the surrounding context.

## [1.1.16] - 2026-06-13

### Fixed

- `WkSelect` now displays the placeholder text in `multiple` and `tags` mode when no items are selected and the inline search input is not visible.
- `WkSelect` now shows the "No data" empty state when the options list is completely empty, not only when all options are hidden by the active search query.
- `WkSelect` search input font size is now consistently rendered at 12px instead of inheriting from the surrounding context.

## [1.1.15] - 2026-06-13

### Added

- New `WkiGeneratePrompt` icon component is available.
- `WkSelectOption` now renders a checkmark icon next to the currently selected option.
- `WkSidebarItem` supports an icon-only mode: when no label text or default slot content is provided, the item collapses to a compact square (32 × 32 px, 36 × 36 px for `large`) and hides the label span.
- `WkSelect` displays a "No data" empty state via `WkEmpty` when all options are filtered out by the active search query.

### Changed

- `WkEmpty` title and description are now rendered with `WkTypography` instead of raw `<p>` tags, delegating typographic styling to the shared typography system.
- `WkSelectOption` label text is now truncated with an ellipsis when it overflows the available option width.
- `WkTooltip` z-index is now managed by the shared layer manager (`nextZIndex()`) instead of a hardcoded `1050`, ensuring tooltips stack correctly above other floating layers.
- `WkDialog` bumps the shared layer-manager counter to its own z-index on open, so tooltips and dropdowns rendered inside a dialog always land above it.

### Fixed

- `WkSelect` in `tags` mode no longer creates a new tag when Enter is pressed during IME composition (e.g. CJK input methods).
- `WkSelectOption` now registers its rendered slot text as the searchable label, fixing search filtering for options that use the default slot instead of the `label` prop.

## [1.1.14] - 2026-06-11

### Added

- `WkInputNumber` accepts a `centered` boolean prop that center-aligns the text inside the input field.

## [1.1.13] - 2026-06-11

### Added

- `WkInputNumber` accepts `prefix` and `suffix` named slots for rendering decorative content (icons, units, labels) at either end of the input field; slots are conditionally rendered and sized to 20px (16px for `tiny` and `xs` sizes) using `--muted-fg` for color.

## [1.1.12] - 2026-06-11

### Added

- New `WkInputNumber` component for numeric text input with configurable `min`, `max`, `step`, and `precision` props that clamp and round the committed value automatically.
- `WkInputNumber` accepts a `size` prop (`'tiny'` | `'xs'` | `'sm'` | `'md'` | `'lg'`) and a `roundness` prop (`'default'` | `'round'`) matching the sizing and shape conventions of `WkInput`.
- `WkInputNumber` supports `error`, `disabled`, and `readonly` states via boolean props of the same name.
- `WkInputNumber` increments or decrements the value by `step` when the user presses Arrow Up or Arrow Down, and emits a `pressEnter` event when Enter is pressed.
- `WkInputNumber` supports dual v-model: `value` / `input` for Vue 2 and `modelValue` / `update:modelValue` for Vue 3.

### Fixed

- `WkTabs` `value` prop type constraint relaxed from `[String, Number]` to untyped, preventing spurious prop validator warnings when the active tab key is a value that does not strictly match either type.

## [1.1.11] - 2026-06-09

### Fixed

- `WkSelect` now correctly resolves and displays the selected label when options are provided via the default slot (as `WkSelectOption` components) instead of through the `options` prop.

## [1.1.10] - 2026-06-09

### Added

- `WkSelect` accepts a new `mode` prop (`'single'` | `'multiple'` | `'tags'`); `multiple` renders selected values as removable `WkTag` chips and emits an array, while `tags` additionally lets the user type a new entry and press Enter to create it on the fly.
- `WkSelect` accepts a new `searchable` prop (Boolean) that shows an inline text input inside the trigger to filter available options as the user types.
- `WkSelect` accepts a new `filterOption` prop (Function) to supply a custom filter predicate for searchable mode.
- `WkInput` accepts a new `tiny` size (24px height) in its `size` prop, with appropriately scaled padding and a smaller default border radius for dense contexts.
- Four new icon components are available: `WkiLayersUp`, `WkiLayersDown`, `WkiLayersUpToTop`, and `WkiLayersDownToBottom`.
- New semantic color tokens `--warning-subtle`, `--warning-border`, `--warning-text`, `--info-subtle`, `--info-border`, and `--info-text` are defined for both light and dark themes.

### Changed

- `WkSelect` `size` prop default value is renamed from `'default'` to `'md'`, aligning with the naming used by `WkInput` and `WkButton`; existing usages passing `size="default"` will now trigger a prop validator warning.
- `WkSelect` `value` prop now accepts `Array` in addition to `String`, and defaults to `null` instead of `''`; in multi-select mode the `change` and `update:modelValue` events emit an array.
- `WkTag` close button now uses the `WkiX` icon component instead of an inline SVG path.

## [1.1.9] - 2026-06-08

### Added

- `WkSlider` accepts a new `width` prop (String or Number) to explicitly set the slider's width as an inline style on the root element.
- `WkSlider` accepts a new `stepRanges` prop (Array of `{ step, to }` objects) enabling variable step sizes across different segments of the value range; thumb dragging, track clicks, and keyboard navigation all respect each segment's step size.

### Changed

- `WkSlider` thumb dragging now uses delta-based pixel accumulation with sub-step carry-over instead of absolute pointer-to-value mapping, producing more accurate and smooth positioning when dragging slowly or across segments with varying step densities.

### Fixed

- `WkSlider` removes the `min-width: 120px` CSS constraint, allowing the component to be placed in narrower containers without overflowing.

## [1.1.8] - 2026-06-04

### Fixed

- `WkTabs` `select` method now declares the `val` variable before using it, fixing a ReferenceError that prevented any tab from being selected when `allowDeselect` is `false` (the default).

## [1.1.7] - 2026-06-04

### Added

- `WkTabs` accepts a new `allowDeselect` boolean prop; when `true`, clicking the active tab deselects it and emits `undefined`.

### Changed

- `WkSelect`, `WkSlider`, and `WkTabs` now accept a `modelValue` prop and emit `update:modelValue`, enabling Vue 3 `v-model` syntax alongside the existing `value`/`change` pattern used for Vue 2.
- `WkSlider` `value` prop now accepts an `Array` in addition to `Number`, allowing the range variant to be initialized and driven via `v-model`.

### Fixed

- `WkInput` and `WkSelect` size heights are now fixed (`height`) rather than minimum (`min-height`), ensuring all size variants (xs: 28px, sm: 32px, md: 36px, lg: 40px) render at their intended exact height.

## [1.1.6] - 2026-06-04

### Added

- `WkiGenerateImage` is a new custom icon component available as a `Wki`-prefixed export, built on the shared `BaseIcon` wrapper.

### Changed

- `WkSelect` chevron icon color is updated from `--muted-fg` to `--primary-fg`, making the dropdown arrow more visually prominent.
- `WkDialog` content area padding is adjusted to asymmetric vertical/horizontal spacing (`--spacing-sm` top/bottom, `--spacing-md` left/right) instead of uniform `--spacing-md`.

## [1.1.5] - 2026-06-01

### Added

- `WkButton` accepts a new `mini` size (24px height) in its `size` prop, intended for dense or toolbar contexts.

### Changed

- `WkButton` `xs` size height is updated from 24px to 28px to sit between `mini` and `sm`; existing `size="xs"` usages will appear slightly taller.
- `WkDialog` header action buttons (minimize, fullscreen, close) now render as `WkButton` with `variant="ghost"` and `size="sm"` instead of bare `<button>` elements, giving them consistent focus rings, hover states, and disabled handling.

### Fixed

- `WkButton` `link` variant no longer carries a fixed height or padding, so it flows inline with surrounding text without unexpected whitespace.
- `WkInput` `xs` size with `roundness="default"` now uses the `--radius` token for its border radius instead of `--rounded-lg`, matching the intended design spec.
- Icon base styles are extracted from a scoped inline `<style>` block in `BaseIcon` into the shared `src/styles/icons.css` file, preventing style duplication when multiple icon components are mounted.

## [1.1.4] - 2026-05-22

### Fixed

- All `Wki*` icon components now correctly apply `size`, `color`, and `strokeWidth` CSS to the inner SVG element; the shared `BaseIcon` wrapper previously used `::v-deep` scoped styles that are not supported in Vue 3, causing icon sizing and coloring to be silently ignored.

## [1.1.3] - 2026-05-22

### Fixed

- `WkDropdown` menu item list now applies a `--spacing-3xs` gap between entries, restoring the expected vertical spacing between items.
- `WkSelect` option list now applies a `--spacing-3xs` gap between options, restoring the expected vertical spacing in the dropdown.

## [1.1.2] - 2026-05-21

### Fixed

- `WkDropdown` menu item icons now receive the `colorIcon` value via the icon component's `color` prop instead of an inline CSS `color` style, so icon coloring works correctly with `Wki*` icon components.

## [1.1.1] - 2026-05-20

### Added

- `WkiSectionBuilder` and `WkiClickButton` are two new custom icon components available as `Wki`-prefixed exports, built on the shared `BaseIcon` wrapper.
- `WkDropdown` menu items now accept `color` and `colorIcon` string properties to apply inline color styling to an item's label and icon respectively; the properties are honored on regular items, group labels, submenu labels, and their children.
- A new `--card-hover` design token is added to the shared token sheet for both light (`--color-neutral-50`) and dark (`--color-brand-neutrals-800`) themes.

### Changed

- `WkAccordionItem`, `WkBreadcrumb`, `WkCheckbox`, `WkDialog`, `WkPagination`, `WkSelect`, `WkSidebarGroupLabel`, and `WkSpinner` now use the shared Lucide-generated `Wki*` icon components internally instead of the private hand-crafted icon wrappers, which have been removed.

### Fixed

- `WkAlertDialog` now forwards consumer-supplied attributes (`$attrs`) to the underlying `WkDialog`, preventing them from being silently dropped.

## [1.1.0] - 2026-05-19

### Added

- 1711 Lucide icon components are now available as `Wki`-prefixed exports (e.g., `WkiArrowDown`, `WkiCheck`, `WkiSearch`); all icons are Vue 2/3 dual-compatible and accept `size`, `color`, `strokeWidth`, and `fill` props via the shared `BaseIcon` wrapper.
- `WkDropdown` menu items and submenu labels now support a `destructive` boolean property that renders the item in `--destructive-text` color; the property is honored on top-level items, submenu group labels, and submenu children.

### Changed

- The 17 remaining hand-crafted icon components (`WkiSurvey`, `WkiButton`, `WkiTab`, `WkiImageMarquee`, `WkiPadding`, `WkiCreateBom`, `WkiLine`, `WkiRectangleDot`, `WkiSmallDot`, `WkiBottom`, `WkiTop`, `WkiRight`, `WkiLeft`, `WkiTopLeft`, `WkiTopRight`, `WkiBottomRight`, `WkiBottomLeft`) are now built on the shared `BaseIcon` wrapper, giving them consistent `size`, `color`, `strokeWidth`, and `fill` prop support.

### Removed

- `WkiSection` is no longer exported from the icon library.

## [1.0.30] - 2026-05-18

### Added

- `WkSidebarItem` chevron area now exposes an `icon-right` named slot, allowing consumers to replace the default expand/collapse chevron with a custom icon.

### Fixed

- `WkMenu` now auto-detects its trigger element from the first non-portal child when no explicit trigger reference is set, preventing broken positioning in portal-based usage patterns.

## [1.0.29] - 2026-05-18

### Added

- `WkMenu` is a new portal-based floating menu primitive that handles placement, z-index stacking, click-outside dismissal, Escape/Tab keyboard handling, and focus management; it is the shared foundation for overlay components.
- `WkDropdown` is a new dropdown component built on `WkMenu` that supports click and hover trigger modes, an `items` prop for structured menu lists (regular items, groups, submenus, dividers), configurable placement and width, and `open`/`close`/`select` events.
- `WkAvatarStack` now accepts an `avatar` scoped slot (bound with `avatar`, `index`, and `size`) for fully custom avatar rendering per item.

### Changed

- `WkSelect` dropdown panel is now rendered through the shared `WkMenu` portal layer, providing correct z-index stacking, Escape/Tab keyboard dismissal, and automatic trigger-width anchoring.
- `WkSelectOption` now renders with `role="option"`, `aria-selected`, and `aria-disabled` ARIA attributes for improved screen-reader accessibility.
- `WkAvatarStack` items now receive descending z-index values so avatar images overlap in the correct visual order.
- `WkDialog` and `WkTooltip` portal attachment now uses the shared portal-root module instead of appending directly to `document.body`.
- Design tokens in the shared token sheet are remapped from `--color-neutral-*` to the `--color-brand-neutrals-*` palette; notification tokens are renamed from `--positive-500`, `--info-500`, and `--warning-500` to `--green-500`, `--blue-500`, and `--yellow-500`; a new `--sidebar-hover` token is added.

### Fixed

- `WkBadge` destructive variant now renders a red focus ring using `--focus-ring-error` on `:focus-visible` instead of the generic neutral ring.
- `WkSidebarItem` hover background is corrected to use the new `--sidebar-hover` token, the focus-visible ring is widened to `3px`, and the active background is updated to `--sidebar-accent`.

## [1.0.28] - 2026-05-16

### Added

- `WkInput` accepts a new `centered` boolean prop (default `false`); when `true`, the native input field renders its text center-aligned.

### Fixed

- Fixed `WkInput` wrapper incorrectly carrying `position: relative`, which caused unintended stacking-context and offset side effects when the component was placed inside positioned containers.

## [1.0.27] - 2026-05-16

### Fixed

- Fixed `WkInput` wrapper imposing a hardcoded `width: 100%` and `max-width: 320px`, which prevented consumers from controlling the component's width through their own layout or explicit size styles.

## [1.0.26] - 2026-05-16

### Fixed

- Fixed `WkInput` ignoring consumer-supplied `class` on the wrapper element in Vue 3 by explicitly forwarding `$attrs.class` to the wrapper div and stripping it from the `v-bind="$attrs"` spread on the native `<input>`, preventing the class from being applied to the inner input instead of the outer container.

## [1.0.25] - 2026-05-16

### Fixed

- Fixed `WkTabs` `stretchItems` class binding in Vue 2 by removing the erroneous `this.` prefix from the template expression, which caused the binding to be silently ignored in Vue 2.
- Fixed `WkSidebarGroupLabel` horizontal padding by removing the extra `var(--spacing-sm)` side padding so all four sides use the uniform `var(--spacing-xs)` value.

## [1.0.24] - 2026-05-16

### Fixed

- Fixed `WkTabs` `stretchItems` prop having no effect by correcting a misplaced CSS rule: `.ui-tabs__item--stretch` was nested inside `.ui-tabs__item`, making it match only descendants instead of the item element itself, so `flex: 1` was never applied.

## [1.0.23] - 2026-05-16

### Fixed

- Fixed `WkDialog` body content overflowing its container by adding `max-width: 100%` to the body inner element.
- Fixed `WkSidebarGroupLabel` label text typography to use design-token-based `paragraph-mini` font values (size, line-height, letter-spacing) and updated spacing tokens for gap and padding to match the intended design.

## [1.0.22] - 2026-05-16

### Added

- `WkTabs` accepts a new `stretchItems` boolean prop (default `false`); when `true`, each tab item expands to fill an equal share of the tab bar width via `flex: 1`.

## [1.0.21] - 2026-05-16

### Added

- `WkTabs` tab items now support an `icon` property (a Vue component reference) on each tab data object; the icon is rendered automatically via `<component :is="tab.icon" />` without requiring a slot.
- `WkTabs` exposes a new `label` scoped slot (bound with `tab`) that wraps the full tab content (icon, label, and counter), enabling complete custom rendering per tab.
- `WkTabs` exposes a new `icon` scoped slot (bound with `tab`) for overriding how a tab's icon component is rendered while keeping the default label and counter.

### Changed

- `WkTabs` tab icon slot is renamed from `tab-icon` to `icon`; update any `<template #tab-icon="{ tab }">` usage to `<template #icon="{ tab }">`.

### Fixed

- Fixed `WkTabs` tab item layout by separating the outer button element (block `flex`, fills available width) from a new inner wrapper (`inline-flex`, sizes to content), correcting stretch and alignment behavior.
- Fixed `WkTabs` icon container not constraining nested SVG elements to the expected 20×20 px dimensions.

## [1.0.20] - 2026-05-15

### Fixed

- Fixed `WkiBottomLeft` icon not being importable via `webcake-ui-kit/src/icons` by adding its missing named export to `src/icons/index.js`.

## [1.0.19] - 2026-05-15

### Added

- New icon components `WkiBottom`, `WkiBottomRight`, `WkiCreateBom`, `WkiLeft`, `WkiLine`, `WkiRectangleDot`, `WkiRight`, `WkiSmallDot`, `WkiTop`, `WkiTopLeft`, and `WkiTopRight` added to `src/icons/`, each accepting `size` (Number, default `16`) and `color` (String, default `currentColor`) props and exported from `webcake-ui-kit/src/icons`.

## [1.0.18] - 2026-05-14

### Added

- New `WkAvatar` component with `size` (regular/small/tiny/extra-tiny), `roundness` (round/roundrect), `src`, `alt`, `name`, and `online` props; falls back to a name initial or slot content when the image fails to load.
- New `WkAvatarStack` component for displaying a row of overlapping avatars from an `items` array, with a `max` prop to cap the visible count and a customizable overflow badge showing the remaining count.
- New `WkEmpty` component for empty-state layouts supporting `default`, `outline`, `background`, and `outline-dashed` variants, with `title`, `description`, `media`, and default action slots.
- New `WkEmptyIcon` component for use inside empty states; wraps slotted content in a 40×40 px rounded container and normalizes inner SVG icons to 24×24 px.
- New `WkField` component for form field composition, supporting `vertical` and `horizontal` layouts, `label`, `helpText`, `errorText`, `required`, and `error` props, with `label`, `message`, and `message-icon` slots.
- New `WkTooltip` component with configurable `side` (top/right/bottom/left), `color`, `title`, `arrow`, and `maxWidth` props; tooltip is triggered by hover or focus on the slotted trigger element.

### Fixed

- Fixed `WkButton` icon SVG sizing in Vue 2: replaced `:deep(svg)` with `::v-deep svg` in the size-variant CSS rules (xs, sm, md, lg, xl), restoring correct icon dimensions in Vue 2 builds.
- Fixed `WkDivider` vertical variant incorrectly stretching to fill its flex container's cross axis by removing the `align-self: stretch` rule.

## [1.0.17] - 2026-05-14

### Fixed

- Fixed `WkButton` icon-only size variants (`xs`, `sm`, `md`, `lg`, `xl`) incorrectly using `min-width` instead of `width`, which allowed the button to grow wider than its intended fixed dimension.

## [1.0.16] - 2026-05-14

### Fixed

- Fixed `WkiPadding` icon not being importable via `webcake-ui-kit/src/icons` by adding its missing named export to `src/icons/index.js`.

## [1.0.15] - 2026-05-14

### Added

- New `Padding` icon SFC added at `src/icons/Padding.vue`, accepting `size` (Number, default `16`) and `color` (String, default `currentColor`) props; available via direct import from `webcake-ui-kit/src/icons/Padding.vue`.

## [1.0.14] - 2026-05-14

### Fixed

- Fixed `WkDialog` width constraint on small viewports by replacing `min()` with equivalent `width` + `max-width` properties, improving compatibility with browsers that do not support the CSS `min()` function.

## [1.0.13] - 2026-05-14

### Changed

- `WkSelect` `size` prop value `"mini"` is renamed to `"xs"`; update `size="mini"` to `size="xs"` in any consumer to avoid the value silently falling back to the default size.
- `WkTabs` `size` prop value `"mini"` is renamed to `"xs"`; update `size="mini"` to `size="xs"` in any consumer.
- `WkAccordionItem`, `WkBreadcrumb`, `WkCheckbox`, `WkDialog`, `WkPagination`, `WkSelect`, `WkSidebarGroupLabel`, and `WkSpinner` now render their icons via a new shared icon component system instead of per-component inline SVGs, standardising stroke-width (1.75) and sizing across the library.

### Fixed

- Fixed `WkCheckbox` checkmark alignment: removed a 1 px top/left offset on the inner box element that caused the check icon to appear visually mispositioned.

## [1.0.12] - 2026-05-13

### Fixed

- Fixed `WkTabs` tab items not stretching to fill available width by adding `flex: 1` to the item element.

## [1.0.11] - 2026-05-13

### Fixed

- Fixed `WkSidebarItem` hover style: both collapsed and expanded items now show a unified background highlight (`--color-brand-neutrals-50`) on hover, replacing the previous split behavior of a background fill for collapsed and a box-shadow ring for expanded.

## [1.0.10] - 2026-05-13

### Added

- New `WkiImageMarquee` icon component exported from `src/icons/`.

### Changed

- `WkiButton`, `WkiSection`, `WkiSurvey`, and `WkiTab` icons now accept `size` (Number, default `16`) and `color` (String, default `currentColor`) props, replacing previously hardcoded pixel dimensions and fill colors.

### Fixed

- Storybook story titles for all components now use a flat two-level path (e.g., `Forms/Button`) instead of the incorrect three-level `Components/Forms/Button` prefix.

## [1.0.9] - 2026-05-13

### Fixed

- Fixed `WkSidebarItem` hover styles: collapsed items now show a background highlight on hover; expanded items show a box-shadow outline ring instead of a background fill.
- Fixed `WkSidebarItem` active state: background now uses `--color-brand-neutrals-200` and no longer overrides text color or font weight; default text color and collapsed icon color now use direct neutral tokens instead of deprecated sidebar-scoped tokens.

## [1.0.8] - 2026-05-12

### Fixed

- Fixed `WkSidebarItem` vertical padding (corrected token from `--spacing-5` to `--spacing-2xs`), enforced a fixed height of 32 px, and corrected the icon size from 16×16 px to 20×20 px.

## [1.0.7] - 2026-05-12

### Added

- New icon components `WkiButton` and `WkiTab` exported from `src/icons/index.js`.

## [1.0.6] - 2026-05-12

### Added

- New icon components `WkiSection` and `WkiSurvey` exported from `src/icons/index.js`.

### Fixed

- Fixed icon size in the collapsed state of `WkSidebarItem` (corrected from 18×18 px to 20×20 px).

## [1.0.4] - 2026-05-12

### Added

- New `WkTypography` component for rendering semantic text with design-system type styles; supports `variant` (heading-1–4, paragraph-large/regular/small/mini, caption, caption-mini, monospaced), `as` (tag override), `weight`, `color`, and `align` props, plus a default slot.
- Typography CSS utility classes (`wk-heading-1`, `wk-paragraph-regular`, etc.) and weight modifiers (`wk-weight-medium`, `wk-weight-bold`) are now included in `src/styles/typography.css` for use without the component.

### Fixed

- Fixed icon size inside `WkTabs` tab items being too small (16×16 px corrected to 20×20 px).

## [1.0.2] - 2026-05-12

### Fixed

- Fixed layer color token in components.

### Added

- Storybook now includes a Changelog docs page sourced from `CHANGELOG.md`.

### Internal

- Release script (`scripts/release.js`) is now idempotent (safely resumes after a failed publish) and prompts for npm 2FA OTP; auto-creates a GitHub Release on publish.

## [1.0.1] - 2026-05-12

### Added

- New components: `WkPagination`, `WkSelect` / `WkSelectOption`, `WkDivider`, `WkRadio` / `WkRadioGroup`, `WkRichSwitchGroup`, `WkSidebarGroupLabel`, `WkSidebarItem`, `WkSlider`, `WkSpinner`, `WkSwitch` / `WkSwitchGroup`, `WkTabs`, `WkTag`.
- GitHub Actions workflow for CI/CD deploy (`.github/workflows/deploy.yml`).

### Changed

- All public exports are now prefixed with `Wk` (e.g. `Accordion` → `WkAccordion`, `Button` → `WkButton`). Update imports accordingly.
- Renamed component folders to kebab-case (`radio_group` → `radio-group`, `switch_group` → `switch-group`, `sidebar_item` → `sidebar-item`, `select_option` → `select-option`, `rich_switch_group` → `rich-switch-group`, `sidebar_group_label` → `sidebar-group-label`).
- Refined `Button`, `Select`, and `Spinner` styles.

### Fixed

- Vue 2 / Vue 3 playgrounds updated to register the new components and exercise them in showcase pages.
