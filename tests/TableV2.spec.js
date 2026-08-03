import { WkTableV2 } from '../src/index.js'
import { mount } from './_utils.js'

const COLUMNS = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age', align: 'center' }
]

const ROWS = [
  { key: '1', name: 'Alice', age: 30 },
  { key: '2', name: 'Bob', age: 25 }
]

describe('WkTableV2', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders root element', () => {
    const w = mount(WkTableV2, { props: { columns: COLUMNS, dataSource: ROWS } })
    expect(w.find('.ui-table-v2').exists()).toBe(true)
    w.unmount && w.unmount()
  })

  it('renders column headers', () => {
    const w = mount(WkTableV2, { props: { columns: COLUMNS, dataSource: ROWS } })
    const headers = w.findAll('.ui-table-v2__header-cell')
    expect(headers.length).toBe(2)
    expect(headers[0].text()).toContain('Name')
    expect(headers[1].text()).toContain('Age')
    w.unmount && w.unmount()
  })

  it('renders row data', () => {
    const w = mount(WkTableV2, { props: { columns: COLUMNS, dataSource: ROWS } })
    const rows = w.findAll('.ui-table-v2__row')
    expect(rows.length).toBe(2)
    expect(rows[0].text()).toContain('Alice')
    expect(rows[1].text()).toContain('Bob')
    w.unmount && w.unmount()
  })

  it('adds bordered class when bordered=true', () => {
    const w = mount(WkTableV2, { props: { columns: COLUMNS, dataSource: ROWS, bordered: true } })
    expect(w.find('.ui-table-v2__table--bordered').exists()).toBe(true)
    w.unmount && w.unmount()
  })

  it('shows empty state when dataSource is empty', () => {
    const w = mount(WkTableV2, { props: { columns: COLUMNS, dataSource: [] } })
    expect(w.find('.ui-table-v2__empty').exists()).toBe(true)
    w.unmount && w.unmount()
  })

  it('does not show empty state when data exists', () => {
    const w = mount(WkTableV2, { props: { columns: COLUMNS, dataSource: ROWS } })
    expect(w.find('.ui-table-v2__empty').exists()).toBe(false)
    w.unmount && w.unmount()
  })

  it('shows loading overlay when loading=true', () => {
    const w = mount(WkTableV2, { props: { columns: COLUMNS, dataSource: ROWS, loading: true } })
    expect(w.find('.ui-table-v2__loading-overlay').exists()).toBe(true)
    w.unmount && w.unmount()
  })

  it('adds selection column when rowSelection provided', () => {
    const w = mount(WkTableV2, {
      props: {
        columns: COLUMNS,
        dataSource: ROWS,
        rowSelection: { selectedRowKeys: [], onChange: () => {} }
      }
    })
    const headers = w.findAll('.ui-table-v2__header-cell')
    expect(headers.length).toBe(3)
    w.unmount && w.unmount()
  })

  it('renders bodyCell slot content', () => {
    const Harness = {
      components: { WkTableV2 },
      data: () => ({ columns: COLUMNS, rows: ROWS }),
      template: `
        <WkTableV2 :columns="columns" :data-source="rows">
          <template #bodyCell="{ column, text }">
            <span v-if="column.dataIndex === 'name'" class="custom-name">{{ text }}</span>
          </template>
        </WkTableV2>
      `
    }
    const w = mount(Harness)
    expect(w.find('.custom-name').exists()).toBe(true)
    expect(w.find('.custom-name').text()).toBe('Alice')
    w.unmount && w.unmount()
  })

  it('passes record to bodyCell slot', () => {
    const Harness = {
      components: { WkTableV2 },
      data: () => ({ columns: COLUMNS, rows: ROWS }),
      template: `
        <WkTableV2 :columns="columns" :data-source="rows">
          <template #bodyCell="{ column, record }">
            <span v-if="column.dataIndex === 'name'" :data-key="record.key" class="record-cell">{{ record.name }}</span>
          </template>
        </WkTableV2>
      `
    }
    const w = mount(Harness)
    expect(w.find('.record-cell').attributes('data-key')).toBe('1')
    w.unmount && w.unmount()
  })

  it('updates displayed rows when dataSource changes', async () => {
    const w = mount(WkTableV2, { props: { columns: COLUMNS, dataSource: ROWS } })
    expect(w.findAll('.ui-table-v2__row').length).toBe(2)
    await w.setProps({ dataSource: [{ key: '3', name: 'Carol', age: 22 }] })
    expect(w.findAll('.ui-table-v2__row').length).toBe(1)
    expect(w.find('.ui-table-v2__row').text()).toContain('Carol')
    w.unmount && w.unmount()
  })
})
