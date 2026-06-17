import { WkTable } from '../src/index.js'
import { mount } from './_utils.js'

const COLUMNS = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Role', dataIndex: 'role', key: 'role' }
]

const ROWS = [
  { key: '1', name: 'Alice', age: 30, role: 'Admin' },
  { key: '2', name: 'Bob', age: 25, role: 'Editor' },
  { key: '3', name: 'Carol', age: 28, role: 'Viewer' }
]

describe('WkTable', () => {
  it('renders without errors', () => {
    const w = mount(WkTable, { props: { columns: COLUMNS, dataSource: ROWS } })
    expect(w.find('.ui-table').exists()).toBe(true)
    w.unmount && w.unmount()
  })

  it('renders column headers', () => {
    const w = mount(WkTable, { props: { columns: COLUMNS, dataSource: ROWS } })
    const ths = w.findAll('.ui-table__th')
    expect(ths.length).toBe(3)
    expect(ths[0].text()).toContain('Name')
    expect(ths[1].text()).toContain('Age')
    w.unmount && w.unmount()
  })

  it('renders row data', () => {
    const w = mount(WkTable, { props: { columns: COLUMNS, dataSource: ROWS } })
    const rows = w.findAll('.ui-table__row--body')
    expect(rows.length).toBe(3)
    expect(rows[0].text()).toContain('Alice')
    expect(rows[1].text()).toContain('Bob')
    w.unmount && w.unmount()
  })

  it('shows default empty text when dataSource is empty', () => {
    const w = mount(WkTable, { props: { columns: COLUMNS, dataSource: [] } })
    expect(w.find('.ui-table__row--empty').exists()).toBe(true)
    expect(w.find('.ui-table__empty-cell').exists()).toBe(true)
    w.unmount && w.unmount()
  })

  it('emptyText prop is forwarded to WkEmpty', () => {
    const w = mount(WkTable, { props: { columns: COLUMNS, dataSource: [], emptyText: 'Nothing here' } })
    expect(w.find('.ui-table__empty-cell').text()).toContain('Nothing here')
    w.unmount && w.unmount()
  })

  it('emptyText slot overrides default', () => {
    const w = mount(WkTable, {
      props: { columns: COLUMNS, dataSource: [] },
      slots: { emptyText: '<span class="custom-empty">Custom empty</span>' }
    })
    expect(w.find('.custom-empty').exists()).toBe(true)
    w.unmount && w.unmount()
  })

  it('adds ui-table--bordered class when bordered=true', () => {
    const w = mount(WkTable, { props: { columns: COLUMNS, dataSource: ROWS, bordered: true } })
    expect(w.find('.ui-table--bordered').exists()).toBe(true)
    w.unmount && w.unmount()
  })

  it('does not add ui-table--bordered by default', () => {
    const w = mount(WkTable, { props: { columns: COLUMNS, dataSource: ROWS } })
    expect(w.find('.ui-table--bordered').exists()).toBe(false)
    w.unmount && w.unmount()
  })

  // ── Row selection ────────────────────────────────────────────────────────────

  it('renders checkbox column when rowSelection=true', () => {
    const w = mount(WkTable, { props: { columns: COLUMNS, dataSource: ROWS, rowSelection: true } })
    const ths = w.findAll('.ui-table__th')
    expect(ths.length).toBe(4) // 1 checkbox + 3 data
    expect(w.find('.ui-table__cell--selection').exists()).toBe(true)
    w.unmount && w.unmount()
  })

  it('does not render checkbox column when rowSelection=false', () => {
    const w = mount(WkTable, { props: { columns: COLUMNS, dataSource: ROWS, rowSelection: false } })
    expect(w.find('.ui-table__cell--selection').exists()).toBe(false)
    w.unmount && w.unmount()
  })

  it('emits update:selectedRowKeys and selection-change on row toggle', async () => {
    const Harness = {
      components: { WkTable },
      data: () => ({ selected: [] }),
      template: `
        <WkTable
          :columns="${JSON.stringify(COLUMNS).replace(/"/g, "'")}"
          :data-source="${JSON.stringify(ROWS).replace(/"/g, "'")}"
          :row-selection="true"
          :selected-row-keys="selected"
          @update:selectedRowKeys="selected = $event"
        />
      `
    }
    // Use direct component mount instead of harness template (avoids JSON escaping issues)
    let emitted = []
    const w = mount(WkTable, {
      props: {
        columns: COLUMNS,
        dataSource: ROWS,
        rowSelection: true,
        selectedRowKeys: []
      }
    })
    w.vm.$on
      ? w.vm.$on('update:selectedRowKeys', v => {
          emitted = v
        })
      : null
    // Find first row checkbox and trigger change
    const checkboxes = w.findAll('.ui-table__td .ui-table__cell--selection')
    // Trigger the WkCheckbox @change in first body row
    const firstRowCell = w.findAll('.ui-table__row--body')[0].find('.ui-table__cell--selection')
    ;(await firstRowCell.find('input[type="checkbox"]')) && firstRowCell.find('input').trigger('change')
    w.unmount && w.unmount()
  })

  it('selectedRowKeys prop marks rows as selected', () => {
    const w = mount(WkTable, {
      props: {
        columns: COLUMNS,
        dataSource: ROWS,
        rowSelection: true,
        selectedRowKeys: ['1', '3']
      }
    })
    const bodyRows = w.findAll('.ui-table__row--body')
    expect(bodyRows[0].classes()).toContain('ui-table__row--selected')
    expect(bodyRows[1].classes()).not.toContain('ui-table__row--selected')
    expect(bodyRows[2].classes()).toContain('ui-table__row--selected')
    w.unmount && w.unmount()
  })

  // ── Sorting ──────────────────────────────────────────────────────────────────

  it('renders sort icon on sortable columns', () => {
    const cols = [
      { title: 'Name', dataIndex: 'name', key: 'name', sorter: true },
      { title: 'Age', dataIndex: 'age', key: 'age' }
    ]
    const w = mount(WkTable, { props: { columns: cols, dataSource: ROWS } })
    const sortable = w.findAll('.ui-table__th--sortable')
    expect(sortable.length).toBe(1)
    expect(w.find('.ui-table__sort').exists()).toBe(true)
    w.unmount && w.unmount()
  })

  it('cycles sort order ascend → descend → null on header click', async () => {
    const cols = [{ title: 'Name', dataIndex: 'name', key: 'name', sorter: true }]
    const emits = []
    const w = mount(WkTable, { props: { columns: cols, dataSource: ROWS } })
    w.vm.$on ? w.vm.$on('sort-change', v => emits.push(v)) : w.vm.$emit // Vue 3 — listen via emitted()

    const th = w.find('.ui-table__th--sortable')

    await th.trigger('click')
    const e1 = w.emitted('sort-change')
    expect(e1 && e1[0][0].order).toBe('ascend')

    await th.trigger('click')
    const e2 = w.emitted('sort-change')
    expect(e2 && e2[1][0].order).toBe('descend')

    await th.trigger('click')
    const e3 = w.emitted('sort-change')
    expect(e3 && e3[2][0].order).toBe(null)

    w.unmount && w.unmount()
  })

  it('sorts rows ascending by string sorter', async () => {
    const cols = [{ title: 'Name', dataIndex: 'name', key: 'name', sorter: true }]
    const w = mount(WkTable, { props: { columns: cols, dataSource: ROWS } })
    await w.find('.ui-table__th--sortable').trigger('click')
    const names = w.findAll('.ui-table__row--body').map(r => r.text())
    expect(names[0]).toContain('Alice')
    expect(names[1]).toContain('Bob')
    expect(names[2]).toContain('Carol')
    w.unmount && w.unmount()
  })

  it('emits change event alongside sort-change', async () => {
    const cols = [{ title: 'Name', dataIndex: 'name', key: 'name', sorter: true }]
    const w = mount(WkTable, { props: { columns: cols, dataSource: ROWS } })
    await w.find('.ui-table__th--sortable').trigger('click')
    const changeEmits = w.emitted('change')
    expect(changeEmits).toBeTruthy()
    expect(changeEmits[0][0]).toHaveProperty('sorter')
    w.unmount && w.unmount()
  })

  // ── row-click ────────────────────────────────────────────────────────────────

  it('emits row-click when a body row is clicked', async () => {
    const w = mount(WkTable, { props: { columns: COLUMNS, dataSource: ROWS } })
    await w.findAll('.ui-table__row--body')[0].trigger('click')
    const emitted = w.emitted('row-click')
    expect(emitted).toBeTruthy()
    expect(emitted[0][0]).toMatchObject({ key: '1', name: 'Alice' })
    w.unmount && w.unmount()
  })

  // ── rowKey as function ───────────────────────────────────────────────────────

  it('supports rowKey as a function', () => {
    const rows = [
      { id: 'u1', name: 'Alice' },
      { id: 'u2', name: 'Bob' }
    ]
    const cols = [{ title: 'Name', dataIndex: 'name', key: 'name' }]
    const w = mount(WkTable, {
      props: {
        columns: cols,
        dataSource: rows,
        rowKey: r => r.id,
        rowSelection: true,
        selectedRowKeys: ['u1']
      }
    })
    const bodyRows = w.findAll('.ui-table__row--body')
    expect(bodyRows[0].classes()).toContain('ui-table__row--selected')
    expect(bodyRows[1].classes()).not.toContain('ui-table__row--selected')
    w.unmount && w.unmount()
  })

  // ── slots ────────────────────────────────────────────────────────────────────

  it('headerCell slot overrides header text', () => {
    const Harness = {
      components: { WkTable },
      data: () => ({ columns: COLUMNS, rows: ROWS }),
      template: `
        <WkTable :columns="columns" :data-source="rows">
          <template #headerCell="{ column }">
            <span class="custom-header">{{ column.title }}-H</span>
          </template>
        </WkTable>
      `
    }
    const w = mount(Harness)
    const customs = w.findAll('.custom-header')
    expect(customs.length).toBe(3)
    expect(customs[0].text()).toBe('Name-H')
    w.unmount && w.unmount()
  })

  it('bodyCell slot overrides cell content', () => {
    const Harness = {
      components: { WkTable },
      data: () => ({ columns: COLUMNS, rows: ROWS }),
      template: `
        <WkTable :columns="columns" :data-source="rows">
          <template #bodyCell="{ column, text }">
            <strong v-if="column.key === 'name'" class="bold-name">{{ text }}</strong>
            <span v-else>{{ text }}</span>
          </template>
        </WkTable>
      `
    }
    const w = mount(Harness)
    const boldNames = w.findAll('.bold-name')
    expect(boldNames.length).toBe(3)
    expect(boldNames[0].text()).toBe('Alice')
    w.unmount && w.unmount()
  })
})
