import { WkDrawer } from '../src/index.js'
import { mount } from './_utils.js'

describe('WkDrawer', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('does not render the panel when closed', () => {
    const w = mount(WkDrawer, { props: { open: false } })
    expect(document.querySelector('.ui-drawer')).toBeNull()
    w.unmount && w.unmount()
  })

  it('renders the panel and mask when open', async () => {
    const w = mount(WkDrawer, { props: { open: true } })
    await w.vm.$nextTick()
    expect(document.querySelector('.ui-drawer')).not.toBeNull()
    expect(document.querySelector('.ui-drawer-mask')).not.toBeNull()
    w.unmount && w.unmount()
  })

  it('mounts into #wk-portal-root inside body', async () => {
    const w = mount(WkDrawer, { props: { open: true } })
    await w.vm.$nextTick()
    const root = document.body.querySelector('#wk-portal-root')
    expect(root).not.toBeNull()
    expect(root.querySelector('.ui-drawer-root')).not.toBeNull()
    w.unmount && w.unmount()
  })

  it('defaults to bottom placement', async () => {
    const w = mount(WkDrawer, { props: { open: true } })
    await w.vm.$nextTick()
    expect(document.querySelector('.ui-drawer').classList.contains('ui-drawer--bottom')).toBe(true)
    w.unmount && w.unmount()
  })

  it('applies each placement class', async () => {
    for (const p of ['bottom', 'top', 'left', 'right']) {
      const w = mount(WkDrawer, { props: { open: true, placement: p } })
      await w.vm.$nextTick()
      expect(document.querySelector(`.ui-drawer--${p}`)).not.toBeNull()
      w.unmount && w.unmount()
      document.body.innerHTML = ''
    }
  })

  it('renders the handle by default and hides it when showHandle=false', async () => {
    const w1 = mount(WkDrawer, { props: { open: true } })
    await w1.vm.$nextTick()
    expect(document.querySelector('.ui-drawer__handle')).not.toBeNull()
    w1.unmount && w1.unmount()
    document.body.innerHTML = ''

    const w2 = mount(WkDrawer, { props: { open: true, showHandle: false } })
    await w2.vm.$nextTick()
    expect(document.querySelector('.ui-drawer__handle')).toBeNull()
    w2.unmount && w2.unmount()
  })

  it('does not render the mask when mask=false', async () => {
    const w = mount(WkDrawer, { props: { open: true, mask: false } })
    await w.vm.$nextTick()
    expect(document.querySelector('.ui-drawer-mask')).toBeNull()
    expect(document.querySelector('.ui-drawer')).not.toBeNull()
    w.unmount && w.unmount()
  })

  it('applies size as height for bottom/top and width for left/right', async () => {
    const wb = mount(WkDrawer, { props: { open: true, placement: 'bottom', size: 200 } })
    await wb.vm.$nextTick()
    expect(document.querySelector('.ui-drawer').style.height).toBe('200px')
    wb.unmount && wb.unmount()
    document.body.innerHTML = ''

    const wr = mount(WkDrawer, { props: { open: true, placement: 'right', size: '320px' } })
    await wr.vm.$nextTick()
    expect(document.querySelector('.ui-drawer').style.width).toBe('320px')
    wr.unmount && wr.unmount()
  })

  it('closes via mask click and emits the v-model contract', async () => {
    const w = mount(WkDrawer, { props: { open: true, modelValue: true } })
    await w.vm.$nextTick()
    document.querySelector('.ui-drawer-mask').click()
    await w.vm.$nextTick()
    expect(w.emitted('change')).toBeTruthy()
    expect(w.emitted('change').pop()[0]).toBe(false)
    expect(w.emitted('update:modelValue')).toBeTruthy()
    expect(w.emitted('update:modelValue').pop()[0]).toBe(false)
    w.unmount && w.unmount()
  })

  it('does not close on mask click when maskClosable=false', async () => {
    const w = mount(WkDrawer, { props: { open: true, maskClosable: false } })
    await w.vm.$nextTick()
    document.querySelector('.ui-drawer-mask').click()
    await w.vm.$nextTick()
    expect(w.emitted('change')).toBeFalsy()
    w.unmount && w.unmount()
  })

  it('closes on Escape and not when keyboard=false', async () => {
    const w1 = mount(WkDrawer, { props: { open: true } })
    await w1.vm.$nextTick()
    document.querySelector('.ui-drawer').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await w1.vm.$nextTick()
    expect(w1.emitted('change').pop()[0]).toBe(false)
    w1.unmount && w1.unmount()
    document.body.innerHTML = ''

    const w2 = mount(WkDrawer, { props: { open: true, keyboard: false } })
    await w2.vm.$nextTick()
    document.querySelector('.ui-drawer').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await w2.vm.$nextTick()
    expect(w2.emitted('change')).toBeFalsy()
    w2.unmount && w2.unmount()
  })

  it('emits open when it becomes visible and close when it hides', async () => {
    const w = mount(WkDrawer, { props: { open: false } })
    await w.vm.$nextTick()
    await w.setProps({ open: true })
    await w.vm.$nextTick()
    expect(w.emitted('open')).toBeTruthy()
    await w.setProps({ open: false })
    await w.vm.$nextTick()
    expect(w.emitted('close')).toBeTruthy()
    w.unmount && w.unmount()
  })

  it('renders default slot content', async () => {
    const w = mount(WkDrawer, {
      props: { open: true },
      slots: { default: '<p class="drawer-slot">Hello drawer</p>' }
    })
    await w.vm.$nextTick()
    expect(document.querySelector('.drawer-slot')).not.toBeNull()
    expect(document.body.textContent).toContain('Hello drawer')
    w.unmount && w.unmount()
  })

  it('removes the portal node from the DOM on unmount', async () => {
    const w = mount(WkDrawer, { props: { open: true } })
    await w.vm.$nextTick()
    expect(document.body.querySelector('.ui-drawer-root')).not.toBeNull()
    w.unmount && w.unmount()
    expect(document.body.querySelector('.ui-drawer-root')).toBeNull()
  })
})
