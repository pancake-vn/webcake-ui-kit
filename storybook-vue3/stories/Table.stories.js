import WkTable from '../../src/components/table/Table.vue'
import WkButton from '../../src/components/button/Button.vue'
import WkTag from '../../src/components/tag/Tag.vue'

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const COLUMNS = [
  { title: 'Name', dataIndex: 'name', key: 'name', width: 200 },
  { title: 'Age', dataIndex: 'age', key: 'age', width: 80, align: 'center' },
  { title: 'Role', dataIndex: 'role', key: 'role', width: 140 },
  { title: 'Status', dataIndex: 'status', key: 'status', width: 120 }
]

const DATA = [
  { key: '1', name: 'Alice Johnson', age: 30, role: 'Admin', status: 'Active' },
  { key: '2', name: 'Bob Smith', age: 25, role: 'Editor', status: 'Active' },
  { key: '3', name: 'Carol White', age: 28, role: 'Viewer', status: 'Inactive' },
  { key: '4', name: 'David Lee', age: 34, role: 'Editor', status: 'Active' },
  { key: '5', name: 'Eva Brown', age: 22, role: 'Viewer', status: 'Pending' }
]

// ---------------------------------------------------------------------------
// Default export
// ---------------------------------------------------------------------------

export default {
  title: 'Data/Table',
  component: WkTable,
  parameters: {
    docs: {
      description: {
        component: `
Advanced data table (v2). Compared with \`WkTable\`, it adds:
- **Row drag-and-drop** via \`rowDraggable\` prop
- **Sticky columns** (left/right) via \`column.fixed\`
- **Row / header height** control (\`rowHeight\`, \`headerHeight\`)
- **Custom row hooks** (\`customRow\`, \`customHeaderRow\`)
- **enableFixedLeft** shorthand to pin the first column without a scroll container

**\`columns\` descriptor fields:**
\`\`\`js
{
  title:     'Name',   // header label
  dataIndex: 'name',   // record field to render
  key:       'name',   // unique column key (fallback: dataIndex)
  width:     200,      // px number or CSS string
  align:     'left',   // 'left' | 'center' | 'right'
  fixed:     'left',   // 'left' | 'right' — sticky column
  ellipsis:  true,     // truncate cell text with ellipsis
}
\`\`\`

**Object props — \`rowSelection\`:**
\`\`\`js
{
  selectedRowKeys: [],             // controlled selection (array of row keys)
  onChange:  (keys, rows) => {},   // fires when selection changes
  onSelect:  (record, selected, selectedRows, e) => {}, // single row toggled
  onSelectAll:  (selected, selectedRows, changeRows) => {}, // header checkbox
  onSelectNone: () => {},          // deselect-all
  hideSelectAll: false,            // hide the header "select all" checkbox
  columnWidth:   36,               // px width of the selection column
  type: 'checkbox',                // 'checkbox' (default) | 'radio'
}
\`\`\`

**Object props — \`rowDraggable\`:**
\`\`\`js
{
  handleReorder: (fromIndex, toIndex, newDisplay) => {}, // called after drag drop — update dataSource here
  columnWidth:          36,   // px width of the drag-handle column
  enableAnimationFlip:  false // FLIP transition between old and new positions
}
\`\`\`

**Object props — \`scroll\`:**
\`\`\`js
{
  x: 1200, // total table width (px) — enables horizontal scroll
  y: 400,  // max body height (px) — sticky header, body scrolls vertically
}
\`\`\`
        `.trim()
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Primary = () => ({
  components: { WkTable },
  data() {
    return { columns: COLUMNS, data: DATA }
  },
  template: `
    <div style="padding: 24px; max-width: 960px;">
      <WkTable :columns="columns" :data-source="data" />
    </div>
  `
})
Primary.parameters = {
  docs: { description: { story: 'Basic table — four columns, five rows, no extras.' } }
}

export const Bordered = () => ({
  components: { WkTable },
  data() {
    return { columns: COLUMNS, data: DATA }
  },
  template: `
    <div style="padding: 24px; max-width: 960px;">
      <WkTable :columns="columns" :data-source="data" :bordered="true" />
    </div>
  `
})
Bordered.parameters = {
  docs: { description: { story: '`bordered` adds outer border and vertical column dividers.' } }
}

export const AllVariants = () => ({
  components: { WkTable },
  data() {
    return { columns: COLUMNS, data: DATA }
  },
  template: `
    <div style="padding: 24px; max-width: 960px; display: flex; flex-direction: column; gap: 40px;">
      <div>
        <p style="margin: 0 0 10px; font-size: 13px; font-weight: 500; color: #6b7280;">Default</p>
        <WkTable :columns="columns" :data-source="data" />
      </div>
      <div>
        <p style="margin: 0 0 10px; font-size: 13px; font-weight: 500; color: #6b7280;">Bordered</p>
        <WkTable :columns="columns" :data-source="data" :bordered="true" />
      </div>
    </div>
  `
})
AllVariants.parameters = {
  docs: { description: { story: 'Default and bordered layouts side by side.' } }
}

export const LoadingState = () => ({
  components: { WkTable, WkButton },
  data() {
    return { columns: COLUMNS, data: DATA, loading: true }
  },
  template: `
    <div style="padding: 24px; max-width: 960px; display: flex; flex-direction: column; gap: 12px;">
      <WkButton size="sm" @click="loading = !loading">Toggle loading</WkButton>
      <WkTable :columns="columns" :data-source="data" :loading="loading" />
    </div>
  `
})
LoadingState.parameters = {
  docs: { description: { story: '`loading` overlays a spinner on top of the table body. Click the button to toggle.' } }
}

export const EmptyState = () => ({
  components: { WkTable },
  data() {
    return { columns: COLUMNS }
  },
  template: `
    <div style="padding: 24px; max-width: 960px; display: flex; flex-direction: column; gap: 32px;">
      <div>
        <p style="margin: 0 0 10px; font-size: 13px; font-weight: 500; color: #6b7280;">Default empty</p>
        <WkTable :columns="columns" :data-source="[]" />
      </div>
      <div>
        <p style="margin: 0 0 10px; font-size: 13px; font-weight: 500; color: #6b7280;">Custom emptyText</p>
        <WkTable :columns="columns" :data-source="[]" empty-text="Không có dữ liệu phù hợp" />
      </div>
    </div>
  `
})
EmptyState.parameters = {
  docs: { description: { story: 'Empty state with default text and custom `emptyText` prop.' } }
}

export const WithRowSelection = () => ({
  components: { WkTable },
  data() {
    return {
      columns: COLUMNS,
      data: DATA,
      selectedKeys: ['1', '3']
    }
  },
  computed: {
    rowSelection() {
      const self = this
      return {
        selectedRowKeys: self.selectedKeys,
        // Fires on every selection change — update selectedRowKeys here
        onChange(keys /*, selectedRows */) {
          self.selectedKeys = keys
        },
        // Optional: fired when a single row checkbox changes
        onSelect(record, selected /*, selectedRows, nativeEvent */) {
          console.log('onSelect', record.key, selected)
        },
        // Optional: fired when the header "select all" checkbox changes
        onSelectAll(selected /*, selectedRows, changeRows */) {
          console.log('onSelectAll', selected)
        },
        // Optional: fired when clicking "deselect all" (custom UI)
        onSelectNone() {
          self.selectedKeys = []
        },
        hideSelectAll: false, // set true to hide the header checkbox
        columnWidth: 40, // px width of the checkbox column
        type: 'checkbox' // 'checkbox' | 'radio'
      }
    }
  },
  template: `
    <div style="padding: 24px; max-width: 960px; display: flex; flex-direction: column; gap: 12px;">
      <p style="margin: 0; font-size: 13px; color: #6b7280;">
        Selected keys: <strong>{{ selectedKeys.join(', ') || 'none' }}</strong>
      </p>
      <WkTable :columns="columns" :data-source="data" :row-selection="rowSelection" />
    </div>
  `
})
WithRowSelection.parameters = {
  docs: {
    description: {
      story: `
Pass a \`rowSelection\` object to enable the leading checkbox column.

\`\`\`js
rowSelection: {
  selectedRowKeys: [],             // controlled: array of selected row keys
  onChange:  (keys, rows) => {},   // fires whenever selection changes — update selectedRowKeys here
  onSelect:  (record, selected, selectedRows, nativeEvent) => {}, // optional: single-row toggle
  onSelectAll:  (selected, selectedRows, changeRows) => {},        // optional: header checkbox
  onSelectNone: () => {},          // optional: deselect-all action
  hideSelectAll: false,            // hide the header "select all" checkbox
  columnWidth:   40,               // px width of the checkbox column (default 36)
  type: 'checkbox',                // 'checkbox' (default) | 'radio'
}
\`\`\`
      `.trim()
    }
  }
}

export const WithRowDraggable = () => ({
  components: { WkTable },
  data() {
    return {
      columns: [
        { title: 'Name', dataIndex: 'name', key: 'name', width: 200 },
        { title: 'Role', dataIndex: 'role', key: 'role', width: 140 },
        { title: 'Status', dataIndex: 'status', key: 'status', width: 120 }
      ],
      data: DATA.slice(),
      lastMove: null
    }
  },
  computed: {
    rowDraggable() {
      const self = this
      return {
        // Called after drag ends — reorder data source here
        handleReorder(fromIndex, toIndex, _newDisplay) {
          const next = self.data.slice()
          const [moved] = next.splice(fromIndex, 1)
          next.splice(toIndex, 0, moved)
          self.data = next
          self.lastMove = moved.name + ': row ' + (fromIndex + 1) + ' → ' + (toIndex + 1)
        },
        columnWidth: 36, // px width of the drag-handle column
        enableAnimationFlip: true // FLIP animation when rows reorder
      }
    }
  },
  template: `
    <div style="padding: 24px; max-width: 700px; display: flex; flex-direction: column; gap: 12px;">
      <p style="margin: 0; font-size: 13px; color: #6b7280;">
        Drag the handle on the left to reorder rows.
        <span v-if="lastMove" style="margin-left: 8px; color: #4f46e5; font-weight: 500;">{{ lastMove }}</span>
      </p>
      <WkTable :columns="columns" :data-source="data" :row-draggable="rowDraggable" :bordered="true" />
    </div>
  `
})
WithRowDraggable.parameters = {
  docs: {
    description: {
      story: `
Pass a \`rowDraggable\` object to enable the drag-handle column on the left.

\`\`\`js
rowDraggable: {
  // REQUIRED: called after the user drops a row — update dataSource here
  handleReorder(fromIndex, toIndex, newDisplay) {
    const next = data.slice()
    const [moved] = next.splice(fromIndex, 1)
    next.splice(toIndex, 0, moved)
    data = next
  },
  columnWidth:         36,    // px width of the drag-handle column (default 36)
  enableAnimationFlip: true,  // FLIP animation between old and new positions
}
\`\`\`
      `.trim()
    }
  }
}

export const FixedHeader = () => ({
  components: { WkTable },
  data() {
    return {
      columns: COLUMNS,
      data: Array.from({ length: 20 }, function (_, i) {
        return {
          key: String(i + 1),
          name: 'User ' + (i + 1),
          age: 20 + i,
          role: ['Admin', 'Editor', 'Viewer'][i % 3],
          status: i % 2 === 0 ? 'Active' : 'Inactive'
        }
      })
    }
  },
  template: `
    <div style="padding: 24px; max-width: 960px;">
      <p style="margin: 0 0 12px; font-size: 13px; color: #6b7280;">
        20 rows — header is sticky, body scrolls inside a 300px viewport.
      </p>
      <WkTable
        :columns="columns"
        :data-source="data"
        :scroll="{ y: 300 }"
      />
    </div>
  `
})
FixedHeader.parameters = {
  docs: {
    description: {
      story:
        '`scroll: { y: 300 }` caps the body height and renders a sticky header above. The header and body are separate `<table>` elements that share column widths.'
    }
  }
}

export const FixedColumns = () => ({
  components: { WkTable },
  data() {
    return {
      columns: [
        { title: 'Name', dataIndex: 'name', key: 'name', width: 160, fixed: 'left' },
        { title: 'Age', dataIndex: 'age', key: 'age', width: 80, align: 'center' },
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
    <div style="padding: 24px; max-width: 620px;">
      <p style="margin: 0 0 12px; font-size: 13px; color: #6b7280;">
        <strong>Name</strong> fixed left · <strong>Status</strong> fixed right. Scroll horizontally.
      </p>
      <WkTable
        :columns="columns"
        :data-source="data"
        :bordered="true"
        :scroll="{ x: 1200 }"
      />
    </div>
  `
})
FixedColumns.parameters = {
  docs: {
    description: {
      story:
        'Set `fixed: "left"` or `fixed: "right"` on a column descriptor combined with `scroll: { x: <total-width> }` to pin columns during horizontal scroll. ' +
        'Shadow lines appear automatically on the last fixed-left and first fixed-right columns.'
    }
  }
}

export const CustomBodyCell = () => ({
  components: { WkTable, WkTag },
  data() {
    return { columns: COLUMNS, data: DATA }
  },
  template: `
    <div style="padding: 24px; max-width: 960px;">
      <WkTable :columns="columns" :data-source="data">
        <template #bodyCell="{ column, text, record }">
          <span v-if="column.dataIndex === 'status'">
            <WkTag
              :color="text === 'Active' ? 'green' : text === 'Inactive' ? 'red' : 'orange'"
            >{{ text }}</WkTag>
          </span>
          <strong v-else-if="column.dataIndex === 'name'" style="color: #111827;">{{ text }}</strong>
          <span v-else>{{ text }}</span>
        </template>
      </WkTable>
    </div>
  `
})
CustomBodyCell.parameters = {
  docs: {
    description: {
      story: `
\`#bodyCell\` scoped slot for custom cell rendering.

Slot props:
\`\`\`js
{ column, text, record, index }
\`\`\`

- \`column\` — the column descriptor object
- \`text\`   — raw value from \`record[column.dataIndex]\`
- \`record\` — full row data object
- \`index\`  — row index in the display array
      `.trim()
    }
  }
}

export const WithRowAndColumnSelection = () => ({
  components: { WkTable },
  data() {
    return {
      columns: COLUMNS,
      data: DATA,
      selectedKeys: []
    }
  },
  computed: {
    rowSelection() {
      const self = this
      return {
        selectedRowKeys: self.selectedKeys,
        onChange(keys) {
          self.selectedKeys = keys
        },
        type: 'checkbox'
      }
    }
  },
  template: `
    <div style="padding: 24px; max-width: 960px; display: flex; flex-direction: column; gap: 40px;">
      <div>
        <p style="margin: 0 0 10px; font-size: 13px; font-weight: 500; color: #6b7280;">
          Selection + Bordered — selected: {{ selectedKeys.join(', ') || 'none' }}
        </p>
        <WkTable
          :columns="columns"
          :data-source="data"
          :row-selection="rowSelection"
          :bordered="true"
        />
      </div>
      <div>
        <p style="margin: 0 0 10px; font-size: 13px; font-weight: 500; color: #6b7280;">
          Selection + Fixed Header
        </p>
        <WkTable
          :columns="columns"
          :data-source="data"
          :row-selection="rowSelection"
          :scroll="{ y: 220 }"
        />
      </div>
    </div>
  `
})
WithRowAndColumnSelection.parameters = {
  docs: { description: { story: 'Row selection combined with bordered layout and fixed-header scroll.' } }
}

export const Matrix = () => ({
  components: { WkTable },
  data() {
    return {
      columns: COLUMNS,
      data: DATA,
      selectedKeys: []
    }
  },
  computed: {
    rowSelection() {
      const self = this
      return {
        selectedRowKeys: self.selectedKeys,
        onChange(keys) {
          self.selectedKeys = keys
        }
      }
    }
  },
  template: `
    <div style="padding: 24px; max-width: 960px; display: flex; flex-direction: column; gap: 40px;">
      <div>
        <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: #9ca3af;">Default</p>
        <WkTable :columns="columns" :data-source="data" />
      </div>
      <div>
        <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: #9ca3af;">Bordered + Selection</p>
        <WkTable :columns="columns" :data-source="data" :bordered="true" :row-selection="rowSelection" />
      </div>
      <div>
        <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: #9ca3af;">Fixed header (scroll.y=200) + Selection</p>
        <WkTable :columns="columns" :data-source="data" :scroll="{ y: 200 }" :row-selection="rowSelection" />
      </div>
      <div>
        <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: #9ca3af;">Loading</p>
        <WkTable :columns="columns" :data-source="data" :loading="true" />
      </div>
      <div>
        <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: #9ca3af;">Empty state</p>
        <WkTable :columns="columns" :data-source="[]" />
      </div>
    </div>
  `
})
Matrix.parameters = {
  docs: {
    description: { story: 'Feature matrix: default · bordered+selection · fixed-header+selection · loading · empty.' }
  }
}
