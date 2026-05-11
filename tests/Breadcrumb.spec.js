import { Breadcrumb } from '../src/index.js'
import { mount } from './_utils.js'

describe('Breadcrumb', () => {
  const items = [{ label: 'Home', href: '/' }, { label: 'Library', href: '/library' }, { label: 'Data' }]

  it('renders all items', () => {
    const w = mount(Breadcrumb, { props: { items } })
    expect(w.text()).toContain('Home')
    expect(w.text()).toContain('Library')
    expect(w.text()).toContain('Data')
  })

  it('marks the last item as current (aria-current=page)', () => {
    const w = mount(Breadcrumb, { props: { items } })
    expect(w.find('[aria-current="page"]').exists()).toBe(true)
    expect(w.find('[aria-current="page"]').text()).toContain('Data')
  })

  it('renders anchor tags for items with href', () => {
    const w = mount(Breadcrumb, { props: { items } })
    const anchors = w.findAll('a')
    expect(anchors.length).toBe(2)
  })

  it('emits click with item, index and event', async () => {
    const w = mount(Breadcrumb, { props: { items } })
    await w.find('a').trigger('click')
    const evt = w.emitted('click')
    expect(evt).toBeTruthy()
    expect(evt[0][0]).toEqual(items[0])
    expect(evt[0][1]).toBe(0)
  })

  it('switches separator type via prop', () => {
    const w = mount(Breadcrumb, { props: { items, separator: 'slash' } })
    expect(w.findAll('.ui-breadcrumb__separator').length).toBe(items.length - 1)
  })
})
