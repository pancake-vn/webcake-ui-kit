import { WkDialog } from '../src/index.js'
import { mount } from './_utils.js'

describe('WkDialog', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('does not render dialog content when closed', () => {
    const w = mount(WkDialog, { props: { open: false } })
    expect(document.querySelector('.ui-dialog-wrap')).toBeNull()
    w.unmount && w.unmount()
  })

  it('renders dialog content when open', async () => {
    const w = mount(WkDialog, { props: { open: true, title: 'Hello' } })
    await w.vm.$nextTick()
    expect(document.querySelector('.ui-dialog-wrap')).not.toBeNull()
    expect(document.body.textContent).toContain('Hello')
    w.unmount && w.unmount()
  })

  it('mounts into #wk-portal-root inside body', async () => {
    const w = mount(WkDialog, { props: { open: true, title: 'Portal' } })
    await w.vm.$nextTick()
    const root = document.body.querySelector('#wk-portal-root')
    expect(root).not.toBeNull()
    expect(root.querySelector('.ui-dialog-root')).not.toBeNull()
    w.unmount && w.unmount()
  })

  it('emits change(false) and cancel when close button is clicked', async () => {
    const w = mount(WkDialog, { props: { open: true, closable: true } })
    await w.vm.$nextTick()
    const closeBtn = document.body.querySelector('[aria-label="Close"]')
    closeBtn.click()
    await w.vm.$nextTick()
    expect(w.emitted('cancel')).toBeTruthy()
    expect(w.emitted('change')).toBeTruthy()
    expect(w.emitted('change').pop()[0]).toBe(false)
    w.unmount && w.unmount()
  })

  it('renders title and sub-text props', async () => {
    const w = mount(WkDialog, { props: { open: true, title: 'T', subText: 'S' } })
    await w.vm.$nextTick()
    expect(document.body.textContent).toContain('T')
    expect(document.body.textContent).toContain('S')
    w.unmount && w.unmount()
  })

  it('respects showHeader=false', async () => {
    const w = mount(WkDialog, { props: { open: true, showHeader: false, title: 'T' } })
    await w.vm.$nextTick()
    expect(document.querySelector('.ui-dialog-header')).toBeNull()
    w.unmount && w.unmount()
  })

  it('hides footer when footer=false', async () => {
    const w = mount(WkDialog, { props: { open: true, footer: false } })
    await w.vm.$nextTick()
    expect(document.querySelector('.ui-dialog-footer')).toBeNull()
    w.unmount && w.unmount()
  })

  it('removes portal node from DOM on unmount', async () => {
    const w = mount(WkDialog, { props: { open: true } })
    await w.vm.$nextTick()
    expect(document.body.querySelector('#wk-portal-root')).not.toBeNull()
    w.unmount && w.unmount()
    expect(document.body.querySelector('.ui-dialog-root')).toBeNull()
  })
})
