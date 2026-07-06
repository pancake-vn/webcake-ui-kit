import WkTable from '../../src/components/table/Table.vue'

const COLUMNS_BASIC = [
  { title: 'Name', dataIndex: 'name', key: 'name', width: 200 },
  { title: 'Age', dataIndex: 'age', key: 'age', align: 'right', width: 100 },
  { title: 'Role', dataIndex: 'role', key: 'role', width: 150 },
  { title: 'Status', dataIndex: 'status', key: 'status', width: 120 }
]

const DATA_BASIC = [
  { key: '1', name: 'Alice Johnson', age: 30, role: 'Admin', status: 'Active' },
  { key: '2', name: 'Bob Smith', age: 25, role: 'Editor', status: 'Active' },
  { key: '3', name: 'Carol White', age: 28, role: 'Viewer', status: 'Inactive' },
  { key: '4', name: 'David Lee', age: 34, role: 'Editor', status: 'Active' },
  { key: '5', name: 'Eva Brown', age: 22, role: 'Viewer', status: 'Pending' }
]

export default {
  title: 'Data/Table',
  component: WkTable,
  parameters: {
    docs: {
      description: {
        component:
          'Data table with optional row selection, column sorting, sticky header/body scroll, ' +
          'and `#headerCell` / `#bodyCell` scoped slots for custom renderers. ' +
          '`columns` accepts `{ title, dataIndex, key?, width?, align?, sorter?, ellipsis? }`. ' +
          '`rowKey` can be a record field name (string) or a function `(record) => key`.'
      }
    }
  }
}

export const Primary = () => ({
  components: { WkTable },
  data() {
    return { columns: COLUMNS_BASIC, data: DATA_BASIC }
  },
  template: `
    <div style="padding: 24px; max-width: 960px;">
      <WkTable :columns="columns" :data-source="data" />
    </div>
  `
})
Primary.parameters = {
  docs: { description: { story: 'Basic table with four columns and five rows.' } }
}

export const Bordered = () => ({
  components: { WkTable },
  data() {
    return { columns: COLUMNS_BASIC, data: DATA_BASIC }
  },
  template: `
    <div style="padding: 24px; max-width: 960px;">
      <WkTable :columns="columns" :data-source="data" bordered />
    </div>
  `
})
Bordered.parameters = {
  docs: { description: { story: '`bordered` adds outer border and vertical column dividers.' } }
}

export const AllVariants = () => ({
  components: { WkTable },
  data() {
    return { columns: COLUMNS_BASIC, data: DATA_BASIC }
  },
  template: `
    <div style="padding: 24px; max-width: 960px; display: flex; flex-direction: column; gap: 40px;">
      <div>
        <p style="margin: 0 0 12px; font-size: 13px; font-weight: 500; color: #6b7280;">Default</p>
        <WkTable :columns="columns" :data-source="data" />
      </div>
      <div>
        <p style="margin: 0 0 12px; font-size: 13px; font-weight: 500; color: #6b7280;">Bordered</p>
        <WkTable :columns="columns" :data-source="data" bordered />
      </div>
    </div>
  `
})
AllVariants.parameters = {
  docs: { description: { story: 'Default vs bordered layout side by side.' } }
}

export const WithRowSelection = () => ({
  components: { WkTable },
  data() {
    return {
      columns: COLUMNS_BASIC,
      data: DATA_BASIC,
      selectedKeys: ['1']
    }
  },
  methods: {
    onSelectionChange(keys) {
      this.selectedKeys = keys
    }
  },
  template: `
    <div style="padding: 24px; max-width: 960px;">
      <p style="margin: 0 0 12px; font-size: 13px; color: #6b7280;">
        Selected: {{ selectedKeys.join(', ') || 'none' }}
      </p>
      <WkTable
        :columns="columns"
        :data-source="data"
        row-selection
        :selected-row-keys="selectedKeys"
        @update:selectedRowKeys="onSelectionChange"
      />
    </div>
  `
})
WithRowSelection.parameters = {
  docs: {
    description: {
      story:
        'Row selection via leading checkbox column. ' +
        'Pass `:selected-row-keys` + `@update:selectedRowKeys` for controlled mode. ' +
        'Header checkbox toggles all rows.'
    }
  }
}

export const WithSorting = () => ({
  components: { WkTable },
  data() {
    return {
      columns: [
        { title: 'Name', dataIndex: 'name', key: 'name', sorter: true },
        { title: 'Age', dataIndex: 'age', key: 'age', align: 'right', sorter: (a, b) => a.age - b.age },
        { title: 'Role', dataIndex: 'role', key: 'role' }
      ],
      data: DATA_BASIC,
      lastSort: null
    }
  },
  methods: {
    onSortChange(s) {
      this.lastSort = s.order ? s.field + ' ' + s.order : 'none'
    }
  },
  template: `
    <div style="padding: 24px; max-width: 960px;">
      <p style="margin: 0 0 12px; font-size: 13px; color: #6b7280;">
        Sort: {{ lastSort || 'none' }}
      </p>
      <WkTable :columns="columns" :data-source="data" @sort-change="onSortChange" />
    </div>
  `
})
WithSorting.parameters = {
  docs: {
    description: {
      story:
        '`sorter: true` uses default locale-compare / numeric sort. ' +
        '`sorter: (a, b) => ...` uses a custom comparator. ' +
        'Click a sortable header to cycle ascend → descend → none.'
    }
  }
}

export const WithEmptyState = () => ({
  components: { WkTable },
  data() {
    return { columns: COLUMNS_BASIC, data: [] }
  },
  template: `
    <div style="padding: 24px; max-width: 960px; display: flex; flex-direction: column; gap: 32px;">
      <div>
        <p style="margin: 0 0 12px; font-size: 13px; font-weight: 500; color: #6b7280;">Default empty text</p>
        <WkTable :columns="columns" :data-source="data" />
      </div>
      <div>
        <p style="margin: 0 0 12px; font-size: 13px; font-weight: 500; color: #6b7280;">Custom emptyText prop</p>
        <WkTable :columns="columns" :data-source="data" empty-text="No results found" />
      </div>
      <div>
        <p style="margin: 0 0 12px; font-size: 13px; font-weight: 500; color: #6b7280;">Custom #emptyText slot</p>
        <WkTable :columns="columns" :data-source="data">
          <template #emptyText>
            <div style="padding: 32px; text-align: center; color: #9ca3af; font-size: 13px;">
              🗂 No records match your filter
            </div>
          </template>
        </WkTable>
      </div>
    </div>
  `
})
WithEmptyState.parameters = {
  docs: {
    description: {
      story: 'Three ways to customise the empty state: default WkEmpty, `emptyText` prop, or `#emptyText` slot.'
    }
  }
}

export const ScrollableY = () => ({
  components: { WkTable },
  data() {
    return {
      columns: COLUMNS_BASIC,
      data: Array.from({ length: 20 }, (_, i) => ({
        key: String(i + 1),
        name: 'User ' + (i + 1),
        age: 20 + i,
        role: ['Admin', 'Editor', 'Viewer'][i % 3],
        status: i % 2 === 0 ? 'Active' : 'Inactive'
      }))
    }
  },
  template: `
    <div style="padding: 24px; max-width: 960px;">
      <WkTable :columns="columns" :data-source="data" :height="280" />
    </div>
  `
})
ScrollableY.parameters = {
  docs: {
    description: {
      story:
        '`height` caps the body and enables vertical scroll with a sticky header. ' +
        'A scrollbar-gutter column is added to the header automatically.'
    }
  }
}

export const WithCustomCellRenderers = () => ({
  components: { WkTable },
  data() {
    return { columns: COLUMNS_BASIC, data: DATA_BASIC }
  },
  template: `
    <div style="padding: 24px; max-width: 960px;">
      <WkTable :columns="columns" :data-source="data">
        <template #headerCell="{ column }">
          <span style="font-style: italic;">{{ column.title }}</span>
        </template>
        <template #bodyCell="{ column, text }">
          <span
            v-if="column.key === 'status'"
            :style="{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 500,
              background: text === 'Active' ? '#dcfce7' : text === 'Inactive' ? '#fee2e2' : '#fef9c3',
              color: text === 'Active' ? '#166534' : text === 'Inactive' ? '#991b1b' : '#854d0e'
            }"
          >{{ text }}</span>
          <span v-else>{{ text }}</span>
        </template>
      </WkTable>
    </div>
  `
})
WithCustomCellRenderers.parameters = {
  docs: {
    description: {
      story:
        '`#headerCell` and `#bodyCell` scoped slots for custom rendering. ' +
        'Slot props: `column`, `record`, `text`, `index`.'
    }
  }
}

export const Matrix = () => ({
  components: { WkTable },
  data() {
    return {
      data: DATA_BASIC,
      colsNoKey: [
        { title: 'Name', dataIndex: 'name', key: 'name', sorter: true },
        { title: 'Age', dataIndex: 'age', key: 'age', align: 'right', sorter: (a, b) => a.age - b.age },
        { title: 'Role', dataIndex: 'role', key: 'role' }
      ]
    }
  },
  template: `
    <div style="padding: 24px; max-width: 960px; display: flex; flex-direction: column; gap: 40px;">
      <div>
        <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: #9ca3af;">Selection + Sort + Bordered</p>
        <WkTable :columns="colsNoKey" :data-source="data" row-selection bordered />
      </div>
      <div>
        <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: #9ca3af;">Selection + Scroll</p>
        <WkTable :columns="colsNoKey" :data-source="data" row-selection :height="200" />
      </div>
    </div>
  `
})
Matrix.parameters = {
  docs: { description: { story: 'Combination of props: selection + sort + bordered; selection + scroll.' } }
}

export const FocusVisible = () => ({
  components: { WkTable },
  data() {
    return {
      columns: [
        { title: 'Name', dataIndex: 'name', key: 'name', sorter: true },
        { title: 'Age', dataIndex: 'age', key: 'age', align: 'right', sorter: (a, b) => a.age - b.age }
      ],
      data: DATA_BASIC
    }
  },
  template: `
    <div style="padding: 24px; max-width: 960px;">
      <p style="margin: 0 0 12px; font-size: 13px; color: #6b7280;">Tab to sortable headers and press Enter/Space to sort.</p>
      <WkTable :columns="columns" :data-source="data" />
    </div>
  `
})
FocusVisible.parameters = {
  docs: {
    description: {
      story: 'Sortable column headers are keyboard accessible (`tabindex="0"`, Enter/Space triggers sort).'
    }
  }
}

const COLUMNS_HUGE = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age', align: 'right' },
  { title: 'Role', dataIndex: 'role', key: 'role' }
]
const DATA_HUGE = Array.from({ length: 10000 }, (_, i) => ({
  key: 'v' + i,
  name: 'User ' + (i + 1),
  age: 20 + (i % 30),
  role: 'Role ' + (i % 5)
}))

export const Virtualized = () => ({
  components: { WkTable },
  data() {
    return { columns: COLUMNS_HUGE, data: DATA_HUGE, selected: ['v500'] }
  },
  template: `
    <div style="padding: 24px; max-width: 960px;">
      <p style="margin: 0 0 12px; font-size: 13px; color: #6b7280;">
        10,000 rows — only the rows in the viewport (plus overscan) are in the DOM.
      </p>
      <WkTable
        :columns="columns"
        :data-source="data"
        bordered
        virtual
        :height="500"
        :row-height="39"
        row-selection
        :selected-row-keys="selected"
        @update:selectedRowKeys="selected = $event"
      />
    </div>
  `
})
Virtualized.parameters = {
  docs: {
    description: {
      story:
        'Virtualized body via the `virtual` prop. Renders only the visible window over a 10,000-row ' +
        'dataset while preserving full native scroll height, sticky header, and selection state ' +
        '(e.g. `v500`) for rows outside the window. Requires a vertical-scroll viewport (`height` or ' +
        '`scroll.y`) and a fixed numeric `row-height`. `overscan` (default 8) tunes the buffer.'
    }
  }
}

export const ResizableColumns = () => ({
  components: { WkTable },
  data() {
    return {
      columns: [
        { title: 'Name', dataIndex: 'name', key: 'name', width: 180, resizable: true, minWidth: 80 },
        { title: 'Age', dataIndex: 'age', key: 'age', width: 80, resizable: true, minWidth: 60, align: 'right' },
        { title: 'Role', dataIndex: 'role', key: 'role', width: 140, resizable: true, minWidth: 80 },
        { title: 'Department', dataIndex: 'dept', key: 'dept', width: 160, resizable: true, minWidth: 100 },
        { title: 'Status', dataIndex: 'status', key: 'status', width: 120, resizable: false }
      ],
      data: [
        { key: '1', name: 'Alice Johnson', age: 30, role: 'Admin', dept: 'Engineering', status: 'Active' },
        { key: '2', name: 'Bob Smith', age: 25, role: 'Editor', dept: 'Product', status: 'Active' },
        { key: '3', name: 'Carol White', age: 28, role: 'Viewer', dept: 'Design', status: 'Inactive' },
        { key: '4', name: 'David Lee', age: 34, role: 'Editor', dept: 'Engineering', status: 'Active' },
        { key: '5', name: 'Eva Brown', age: 22, role: 'Viewer', dept: 'Marketing', status: 'Pending' }
      ]
    }
  },
  template: `
    <div style="padding: 24px; max-width: 900px;">
      <p style="margin: 0 0 12px; font-size: 13px; color: #6b7280;">
        Drag the resize handle (right edge of a column header) to change its width.
        The last column has <code>resizable: false</code>.
      </p>
      <WkTable :columns="columns" :data-source="data" bordered />
    </div>
  `
})
ResizableColumns.parameters = {
  docs: {
    description: {
      story:
        'Add `resizable: true` to a column descriptor to show a drag handle on its right edge. ' +
        'Optionally set `minWidth` (px, default 40) to clamp the minimum. ' +
        'Columns with `fixed: "right"` resize leftward automatically.'
    }
  }
}

export const DragAndDropRows = () => ({
  components: { WkTable },
  data() {
    return {
      columns: [
        { title: 'Name', dataIndex: 'name', key: 'name', width: 200 },
        { title: 'Role', dataIndex: 'role', key: 'role', width: 140 },
        { title: 'Status', dataIndex: 'status', key: 'status', width: 120 }
      ],
      data: [
        { key: '1', name: 'Alice Johnson', role: 'Admin', status: 'Active' },
        { key: '2', name: 'Bob Smith', role: 'Editor', status: 'Active' },
        { key: '3', name: 'Carol White', role: 'Viewer', status: 'Inactive' },
        { key: '4', name: 'David Lee', role: 'Editor', status: 'Active' },
        { key: '5', name: 'Eva Brown', role: 'Viewer', status: 'Pending' }
      ],
      lastMove: null
    }
  },
  methods: {
    onDragRecord({ record, fromIndex, toIndex }) {
      const next = this.data.slice()
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      this.data = next
      this.lastMove = record.name + ': ' + fromIndex + ' → ' + toIndex
    }
  },
  template: `
    <div style="padding: 24px; max-width: 600px;">
      <p style="margin: 0 0 12px; font-size: 13px; color: #6b7280;">
        Drag the grip handle on the left to reorder rows.
        <span v-if="lastMove" style="margin-left:8px; color:#6366f1; font-weight:500;">{{ lastMove }}</span>
      </p>
      <WkTable
        :columns="columns"
        :data-source="data"
        is-drag
        bordered
        @drag-record="onDragRecord"
      />
    </div>
  `
})
DragAndDropRows.parameters = {
  docs: {
    description: {
      story:
        'Enable row drag-and-drop with `is-drag`. ' +
        'A grip handle column is prepended automatically. ' +
        'On drop the component emits `drag-record` with `{ record, fromIndex, toIndex }` plus the native `DragEvent`. ' +
        'The parent is responsible for updating `data-source` — splice `fromIndex` out and insert at `toIndex`. ' +
        'Rows animate with a FLIP transition after each reorder.'
    }
  }
}

export const FixedColumns = () => ({
  components: { WkTable },
  data() {
    return {
      columns: [
        { title: 'Name', dataIndex: 'name', key: 'name', width: 160, fixed: 'left' },
        { title: 'Age', dataIndex: 'age', key: 'age', width: 80, align: 'right' },
        { title: 'Role', dataIndex: 'role', key: 'role', width: 140 },
        { title: 'Department', dataIndex: 'dept', key: 'dept', width: 160 },
        { title: 'Location', dataIndex: 'loc', key: 'loc', width: 160 },
        { title: 'Joined', dataIndex: 'joined', key: 'joined', width: 140 },
        { title: 'Manager', dataIndex: 'manager', key: 'manager', width: 160 },
        { title: 'Status', dataIndex: 'status', key: 'status', width: 120, fixed: 'right' }
      ],
      data: [
        {
          key: '1',
          name: 'Alice Johnson',
          age: 30,
          role: 'Admin',
          dept: 'Engineering',
          loc: 'Hanoi',
          joined: '2020-03-01',
          manager: 'Charlie',
          status: 'Active'
        },
        {
          key: '2',
          name: 'Bob Smith',
          age: 25,
          role: 'Editor',
          dept: 'Product',
          loc: 'Ho Chi Minh',
          joined: '2021-07-15',
          manager: 'Alice',
          status: 'Active'
        },
        {
          key: '3',
          name: 'Carol White',
          age: 28,
          role: 'Viewer',
          dept: 'Design',
          loc: 'Da Nang',
          joined: '2019-11-20',
          manager: 'Alice',
          status: 'Inactive'
        },
        {
          key: '4',
          name: 'David Lee',
          age: 34,
          role: 'Editor',
          dept: 'Engineering',
          loc: 'Hanoi',
          joined: '2018-05-10',
          manager: 'Charlie',
          status: 'Active'
        },
        {
          key: '5',
          name: 'Eva Brown',
          age: 22,
          role: 'Viewer',
          dept: 'Marketing',
          loc: 'Hanoi',
          joined: '2022-01-08',
          manager: 'Bob',
          status: 'Pending'
        }
      ]
    }
  },
  template: `
    <div style="padding: 24px; max-width: 600px;">
      <p style="margin: 0 0 12px; font-size: 13px; color: #6b7280;">
        <strong>Name</strong> is fixed left, <strong>Status</strong> is fixed right. Scroll horizontally to see both stay in place.
      </p>
      <WkTable
        :columns="columns"
        :data-source="data"
        bordered
        :scroll="{ x: 1200 }"
      />
    </div>
  `
})
FixedColumns.parameters = {
  docs: {
    description: {
      story:
        'Set `fixed: "left"` or `fixed: "right"` on a column to pin it during horizontal scroll. ' +
        'Combine with `scroll: { x: <totalWidth> }` to enable the horizontal scrollbar. ' +
        'Shadow lines appear automatically on the last fixed-left and first fixed-right columns.'
    }
  }
}

export const ColumnSchema = () => ({
  components: { WkTable },
  data() {
    return {
      columns: [
        { title: 'Name', dataIndex: 'name', key: 'name', width: 180, fixed: 'left', resizable: true, minWidth: 80 },
        { title: 'Age', dataIndex: 'age', key: 'age', width: 80, align: 'right', sorter: (a, b) => a.age - b.age },
        { title: 'Role', dataIndex: 'role', key: 'role', width: 140, sorter: true },
        { title: 'Note', dataIndex: 'note', key: 'note', width: 200, ellipsis: true },
        { title: 'Status', dataIndex: 'status', key: 'status', width: 120, fixed: 'right' }
      ],
      data: [
        {
          key: '1',
          name: 'Alice Johnson',
          age: 30,
          role: 'Admin',
          note: 'Long note that gets truncated with ellipsis when it overflows the cell width',
          status: 'Active'
        },
        { key: '2', name: 'Bob Smith', age: 25, role: 'Editor', note: 'Short note', status: 'Active' },
        {
          key: '3',
          name: 'Carol White',
          age: 28,
          role: 'Viewer',
          note: 'Another long description that demonstrates the ellipsis truncation feature',
          status: 'Inactive'
        }
      ]
    }
  },
  template: `
    <div style="padding: 24px; max-width: 860px;">
      <WkTable :columns="columns" :data-source="data" bordered :scroll="{ x: 900 }" />
    </div>
  `
})
ColumnSchema.parameters = {
  docs: {
    description: {
      story: `
All fields accepted by a column descriptor object:

\`\`\`js
{
  title:      'Name',              // header label (also accepts #headerCell slot)
  dataIndex:  'name',             // record field to render (also used as fallback key)
  key:        'name',             // unique column key — defaults to dataIndex
  width:      180,                // number (px) or CSS string e.g. '20%'
  align:      'left',             // 'left' (default) | 'center' | 'right'
  fixed:      'left',             // 'left' | 'right' — pin column during horizontal scroll
  resizable:  true,               // show drag handle on column edge
  minWidth:   80,                 // minimum px width during resize (default 40)
  ellipsis:   true,               // truncate cell text with text-overflow: ellipsis
  sorter:     true,               // true → default locale/numeric sort
  sorter:     (a, b) => a.age - b.age  // or a custom comparator function
}
\`\`\`
      `.trim()
    }
  }
}
