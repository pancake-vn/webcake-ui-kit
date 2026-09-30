import { WkTable } from '../src/index.js'
import { mount } from './_utils.js'

const COLUMNS = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age', align: 'center' }
]

const ROWS = [
  { key: '1', name: 'Alice', age: 30 },
  { key: '2', name: 'Bob', age: 25 }
]

describe('WkTable', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders root element', () => {
    const w = mount(WkTable, { props: { columns: COLUMNS, dataSource: ROWS } })
    expect(w.find('.ui-table').exists()).toBe(true)
    w.unmount && w.unmount()
  })

  it('renders column headers', () => {
    const w = mount(WkTable, { props: { columns: COLUMNS, dataSource: ROWS } })
    const headers = w.findAll('.ui-table__header-cell')
    expect(headers.length).toBe(2)
    expect(headers[0].text()).toContain('Name')
    expect(headers[1].text()).toContain('Age')
    w.unmount && w.unmount()
  })

  it('renders row data', () => {
    const w = mount(WkTable, { props: { columns: COLUMNS, dataSource: ROWS } })
    const rows = w.findAll('.ui-table__row')
    expect(rows.length).toBe(2)
    expect(rows[0].text()).toContain('Alice')
    expect(rows[1].text()).toContain('Bob')
    w.unmount && w.unmount()
  })

  it('adds bordered class when bordered=true', () => {
    const w = mount(WkTable, { props: { columns: COLUMNS, dataSource: ROWS, bordered: true } })
    expect(w.find('.ui-table__table--bordered').exists()).toBe(true)
    w.unmount && w.unmount()
  })

  it('shows empty state when dataSource is empty', () => {
    const w = mount(WkTable, { props: { columns: COLUMNS, dataSource: [] } })
    expect(w.find('.ui-table__empty').exists()).toBe(true)
    w.unmount && w.unmount()
  })

  it('does not show empty state when data exists', () => {
    const w = mount(WkTable, { props: { columns: COLUMNS, dataSource: ROWS } })
    expect(w.find('.ui-table__empty').exists()).toBe(false)
    w.unmount && w.unmount()
  })

  it('shows loading overlay when loading=true', () => {
    const w = mount(WkTable, { props: { columns: COLUMNS, dataSource: ROWS, loading: true } })
    expect(w.find('.ui-table__loading-overlay').exists()).toBe(true)
    w.unmount && w.unmount()
  })

  it('adds selection column when rowSelection provided', () => {
    const w = mount(WkTable, {
      props: {
        columns: COLUMNS,
        dataSource: ROWS,
        rowSelection: { selectedRowKeys: [], onChange: () => {} }
      }
    })
    const headers = w.findAll('.ui-table__header-cell')
    expect(headers.length).toBe(3)
    w.unmount && w.unmount()
  })

  it('renders bodyCell slot content', () => {
    const Harness = {
      components: { WkTable },
      data: () => ({ columns: COLUMNS, rows: ROWS }),
      template: `
        <WkTable :columns="columns" :data-source="rows">
          <template #bodyCell="{ column, text }">
            <span v-if="column.dataIndex === 'name'" class="custom-name">{{ text }}</span>
          </template>
        </WkTable>
      `
    }
    const w = mount(Harness)
    expect(w.find('.custom-name').exists()).toBe(true)
    expect(w.find('.custom-name').text()).toBe('Alice')
    w.unmount && w.unmount()
  })

  it('passes record to bodyCell slot', () => {
    const Harness = {
      components: { WkTable },
      data: () => ({ columns: COLUMNS, rows: ROWS }),
      template: `
        <WkTable :columns="columns" :data-source="rows">
          <template #bodyCell="{ column, record }">
            <span v-if="column.dataIndex === 'name'" :data-key="record.key" class="record-cell">{{ record.name }}</span>
          </template>
        </WkTable>
      `
    }
    const w = mount(Harness)
    expect(w.find('.record-cell').attributes('data-key')).toBe('1')
    w.unmount && w.unmount()
  })

  it('updates displayed rows when dataSource changes', async () => {
    const w = mount(WkTable, { props: { columns: COLUMNS, dataSource: ROWS } })
    expect(w.findAll('.ui-table__row').length).toBe(2)
    await w.setProps({ dataSource: [{ key: '3', name: 'Carol', age: 22 }] })
    expect(w.findAll('.ui-table__row').length).toBe(1)
    expect(w.find('.ui-table__row').text()).toContain('Carol')
    w.unmount && w.unmount()
  })
})

describe('WkTable — row selection', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('marks selected rows with --selected class', async () => {
    const w = mount(WkTable, {
      props: {
        columns: COLUMNS,
        dataSource: ROWS,
        rowSelection: { selectedRowKeys: ['1'], onChange: () => {} }
      }
    })
    await w.vm.$nextTick()
    const rows = w.findAll('.ui-table__row')
    expect(rows[0].classes()).toContain('ui-table__row--selected')
    expect(rows[1].classes()).not.toContain('ui-table__row--selected')
    w.unmount && w.unmount()
  })

  it('does not mark rows when selectedRowKeys is empty', () => {
    const w = mount(WkTable, {
      props: {
        columns: COLUMNS,
        dataSource: ROWS,
        rowSelection: { selectedRowKeys: [], onChange: () => {} }
      }
    })
    expect(w.find('.ui-table__row--selected').exists()).toBe(false)
    w.unmount && w.unmount()
  })

  it('updates row selected state when selectedRowKeys prop changes', async () => {
    const Harness = {
      components: { WkTable },
      data: () => ({ cols: COLUMNS, rows: ROWS, keys: [] }),
      computed: {
        rs() {
          return {
            selectedRowKeys: this.keys,
            onChange: k => {
              this.keys = k
            }
          }
        }
      },
      template: `<WkTable :columns="cols" :data-source="rows" :row-selection="rs" />`
    }
    const w = mount(Harness)
    await w.vm.$nextTick()
    expect(w.find('.ui-table__row--selected').exists()).toBe(false)
    w.vm.keys = ['2']
    await w.vm.$nextTick()
    const rows = w.findAll('.ui-table__row')
    expect(rows[0].classes()).not.toContain('ui-table__row--selected')
    expect(rows[1].classes()).toContain('ui-table__row--selected')
    w.unmount && w.unmount()
  })

  it('hideSelectAll hides header checkbox', () => {
    const w = mount(WkTable, {
      props: {
        columns: COLUMNS,
        dataSource: ROWS,
        rowSelection: { selectedRowKeys: [], onChange: () => {}, hideSelectAll: true }
      }
    })
    expect(w.find('.ui-table__header .wrapper-option').exists()).toBe(false)
    w.unmount && w.unmount()
  })

  it('shows header checkbox when hideSelectAll is false', () => {
    const w = mount(WkTable, {
      props: {
        columns: COLUMNS,
        dataSource: ROWS,
        rowSelection: { selectedRowKeys: [], onChange: () => {}, hideSelectAll: false }
      }
    })
    expect(w.find('.ui-table__header .wrapper-option').exists()).toBe(true)
    w.unmount && w.unmount()
  })

  it('selectionHeader slot is hidden when no rows selected', () => {
    const Harness = {
      components: { WkTable },
      data: () => ({ cols: COLUMNS, rows: ROWS, keys: [] }),
      computed: {
        rs() {
          return {
            selectedRowKeys: this.keys,
            onChange: k => {
              this.keys = k
            }
          }
        }
      },
      template: `
        <WkTable :columns="cols" :data-source="rows" :row-selection="rs">
          <template #selectionHeader><span class="bulk-label">bulk</span></template>
        </WkTable>
      `
    }
    const w = mount(Harness)
    expect(w.find('.bulk-label').exists()).toBe(false)
    w.unmount && w.unmount()
  })

  it('selectionHeader slot is visible when rows are selected', async () => {
    const Harness = {
      components: { WkTable },
      data: () => ({ cols: COLUMNS, rows: ROWS, keys: ['1'] }),
      computed: {
        rs() {
          return {
            selectedRowKeys: this.keys,
            onChange: k => {
              this.keys = k
            }
          }
        }
      },
      template: `
        <WkTable :columns="cols" :data-source="rows" :row-selection="rs">
          <template #selectionHeader><span class="bulk-label">bulk</span></template>
        </WkTable>
      `
    }
    const w = mount(Harness)
    await w.vm.$nextTick()
    expect(w.find('.bulk-label').exists()).toBe(true)
    w.unmount && w.unmount()
  })

  it('selectionHeader slot appears when selectedRowKeys changes from empty to non-empty', async () => {
    const Harness = {
      components: { WkTable },
      data: () => ({ cols: COLUMNS, rows: ROWS, keys: [] }),
      computed: {
        rs() {
          return {
            selectedRowKeys: this.keys,
            onChange: k => {
              this.keys = k
            }
          }
        }
      },
      template: `
        <WkTable :columns="cols" :data-source="rows" :row-selection="rs">
          <template #selectionHeader><span class="bulk-label">bulk</span></template>
        </WkTable>
      `
    }
    const w = mount(Harness)
    expect(w.find('.bulk-label').exists()).toBe(false)
    w.vm.keys = ['1']
    await w.vm.$nextTick()
    expect(w.find('.bulk-label').exists()).toBe(true)
    w.unmount && w.unmount()
  })

  it('selectionHeader slot disappears when selectedRowKeys is cleared externally', async () => {
    const Harness = {
      components: { WkTable },
      data: () => ({ cols: COLUMNS, rows: ROWS, keys: ['1'] }),
      computed: {
        rs() {
          return {
            selectedRowKeys: this.keys,
            onChange: k => {
              this.keys = k
            }
          }
        }
      },
      template: `
        <WkTable :columns="cols" :data-source="rows" :row-selection="rs">
          <template #selectionHeader><span class="bulk-label">bulk</span></template>
        </WkTable>
      `
    }
    const w = mount(Harness)
    await w.vm.$nextTick()
    expect(w.find('.bulk-label').exists()).toBe(true)
    w.vm.keys = []
    await w.vm.$nextTick()
    expect(w.find('.bulk-label').exists()).toBe(false)
    w.unmount && w.unmount()
  })

  it('bulk th has --bulk class when selectionHeader is active', async () => {
    const Harness = {
      components: { WkTable },
      data: () => ({ cols: COLUMNS, rows: ROWS, keys: ['1'] }),
      computed: {
        rs() {
          return {
            selectedRowKeys: this.keys,
            onChange: k => {
              this.keys = k
            }
          }
        }
      },
      template: `
        <WkTable :columns="cols" :data-source="rows" :row-selection="rs">
          <template #selectionHeader><span class="bulk-label">bulk</span></template>
        </WkTable>
      `
    }
    const w = mount(Harness)
    await w.vm.$nextTick()
    expect(w.find('.ui-table__header-cell--bulk').exists()).toBe(true)
    w.unmount && w.unmount()
  })

  it('does not enter bulk mode without #selectionHeader slot even when rows selected', async () => {
    const w = mount(WkTable, {
      props: {
        columns: COLUMNS,
        dataSource: ROWS,
        rowSelection: { selectedRowKeys: ['1'], onChange: () => {} }
      }
    })
    await w.vm.$nextTick()
    expect(w.find('.ui-table__header-cell--bulk').exists()).toBe(false)
    w.unmount && w.unmount()
  })
})
