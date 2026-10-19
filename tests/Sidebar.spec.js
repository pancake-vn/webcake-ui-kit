import { WkSidebar } from '../src/index.js'
import { mount } from './_utils.js'

const ITEMS = [
  { key: '1', label: 'Dashboard' },
  {
    key: '2',
    label: 'Reports',
    children: [
      { key: '2-1', label: 'Weekly' },
      { key: '2-2', label: 'Monthly' }
    ]
  },
  { key: 'd1', type: 'divider' },
  { key: 'g1', type: 'group', label: 'Admin', children: [{ key: '3', label: 'Users' }] },
  { key: '4', label: 'Settings', badge: '5' },
  { key: '5', label: 'Disabled', disabled: true }
]

describe('WkSidebar', () => {
  it('renders the nav wrapper', () => {
    const w = mount(WkSidebar, { props: { items: ITEMS } })
    expect(w.find('.ui-sidebar').exists()).toBe(true)
  })

  it('renders leaf items', () => {
    const w = mount(WkSidebar, { props: { items: ITEMS } })
    // Dashboard, Settings, Disabled + Users (group child)
    expect(w.findAll('.ui-sidebar__leaf').length).toBeGreaterThanOrEqual(3)
  })

  it('renders a divider', () => {
    const w = mount(WkSidebar, { props: { items: ITEMS } })
    expect(w.find('.ui-sidebar__divider').exists()).toBe(true)
  })

  it('renders a group', () => {
    const w = mount(WkSidebar, { props: { items: ITEMS } })
    expect(w.find('.ui-sidebar__group').exists()).toBe(true)
  })

  it('renders a submenu', () => {
    const w = mount(WkSidebar, { props: { items: ITEMS } })
    expect(w.find('.ui-sidebar__submenu').exists()).toBe(true)
  })

  it('submenu children are hidden by default (no defaultOpenKeys)', () => {
    const w = mount(WkSidebar, { props: { items: ITEMS } })
    const nested = w.find('.ui-sidebar__submenu .ui-sidebar__menu')
    expect(nested.exists()).toBe(true)
    expect(nested.isVisible()).toBe(false)
  })

  it('submenu children are visible when key in defaultOpenKeys', () => {
    const w = mount(WkSidebar, { props: { items: ITEMS, defaultOpenKeys: ['2'] } })
    expect(w.find('.ui-sidebar__submenu .ui-sidebar__menu').isVisible()).toBe(true)
  })

  it('clicking a submenu trigger emits toggle with the item key', async () => {
    const w = mount(WkSidebar, { props: { items: ITEMS } })
    await w.find('.ui-sidebar__submenu .ui-sidebar-item').trigger('click')
    expect(w.emitted('toggle')).toBeTruthy()
    expect(w.emitted('toggle')[0][0]).toBe('2')
  })

  it('clicking a submenu trigger emits open-change with next keys array', async () => {
    const w = mount(WkSidebar, { props: { items: ITEMS } })
    await w.find('.ui-sidebar__submenu .ui-sidebar-item').trigger('click')
    expect(w.emitted('open-change')).toBeTruthy()
    expect(w.emitted('open-change')[0][0]).toEqual(['2'])
  })

  it('clicking open submenu again removes key from open-change', async () => {
    const w = mount(WkSidebar, { props: { items: ITEMS, defaultOpenKeys: ['2'] } })
    await w.find('.ui-sidebar__submenu .ui-sidebar-item').trigger('click')
    expect(w.emitted('open-change')[0][0]).toEqual([])
  })

  it('clicking a leaf emits select with the item key', async () => {
    const w = mount(WkSidebar, { props: { items: ITEMS } })
    await w.find('.ui-sidebar__leaf .ui-sidebar-item').trigger('click')
    expect(w.emitted('select')).toBeTruthy()
    expect(w.emitted('select')[0][0]).toBe('1')
  })

  it('clicking a leaf emits update:activeKey with the item key', async () => {
    const w = mount(WkSidebar, { props: { items: ITEMS } })
    await w.find('.ui-sidebar__leaf .ui-sidebar-item').trigger('click')
    expect(w.emitted('update:activeKey')).toBeTruthy()
    expect(w.emitted('update:activeKey')[0][0]).toBe('1')
  })

  it('activeKey marks the matching leaf with --active', () => {
    const w = mount(WkSidebar, { props: { items: ITEMS, activeKey: '1' } })
    expect(w.find('.ui-sidebar-item--active').exists()).toBe(true)
  })

  it('disabled leaf renders --disabled class', () => {
    const w = mount(WkSidebar, { props: { items: ITEMS } })
    expect(w.find('.ui-sidebar-item--disabled').exists()).toBe(true)
  })

  it('disabled leaf click does not emit select', async () => {
    const w = mount(WkSidebar, { props: { items: ITEMS } })
    await w.find('.ui-sidebar-item--disabled').trigger('click')
    expect(w.emitted('select')).toBeFalsy()
  })

  it('badge prop renders the badge element with correct text', () => {
    const w = mount(WkSidebar, { props: { items: ITEMS } })
    const badge = w.find('.ui-sidebar-item__badge')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toBe('5')
  })

  it('size=large applies --large class to items', () => {
    const w = mount(WkSidebar, { props: { items: ITEMS, size: 'large' } })
    expect(w.find('.ui-sidebar-item--large').exists()).toBe(true)
  })

  it('renders header slot inside .ui-sidebar__header', () => {
    const Harness = {
      components: { WkSidebar },
      props: ['items'],
      template: `
        <WkSidebar :items="items">
          <template #header><div class="test-header">Header</div></template>
        </WkSidebar>
      `
    }
    const w = mount(Harness, { props: { items: ITEMS } })
    expect(w.find('.ui-sidebar__header').exists()).toBe(true)
    expect(w.find('.test-header').exists()).toBe(true)
  })

  it('renders footer slot inside .ui-sidebar__footer', () => {
    const Harness = {
      components: { WkSidebar },
      props: ['items'],
      template: `
        <WkSidebar :items="items">
          <template #footer><div class="test-footer">Footer</div></template>
        </WkSidebar>
      `
    }
    const w = mount(Harness, { props: { items: ITEMS } })
    expect(w.find('.ui-sidebar__footer').exists()).toBe(true)
    expect(w.find('.test-footer').exists()).toBe(true)
  })

  it('does not render .ui-sidebar__header when slot is omitted', () => {
    const w = mount(WkSidebar, { props: { items: ITEMS } })
    expect(w.find('.ui-sidebar__header').exists()).toBe(false)
  })

  it('does not render .ui-sidebar__footer when slot is omitted', () => {
    const w = mount(WkSidebar, { props: { items: ITEMS } })
    expect(w.find('.ui-sidebar__footer').exists()).toBe(false)
  })
})
