import WkTable from '../../src/components/table/Table.vue'

const COLUMNS_BASIC = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age', align: 'right' },
  { title: 'Role', dataIndex: 'role', key: 'role' },
  { title: 'Status', dataIndex: 'status', key: 'status' }
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
    <div style="padding: 24px;">
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
    <div style="padding: 24px;">
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
    <div style="padding: 24px; display: flex; flex-direction: column; gap: 40px;">
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
    <div style="padding: 24px;">
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
    <div style="padding: 24px;">
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
    <div style="padding: 24px; display: flex; flex-direction: column; gap: 32px;">
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
    <div style="padding: 24px;">
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
    <div style="padding: 24px;">
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
    <div style="padding: 24px; display: flex; flex-direction: column; gap: 40px;">
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
    <div style="padding: 24px;">
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
