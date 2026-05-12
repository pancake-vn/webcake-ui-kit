import { WkAlertDialog } from '../src/index.js'
import { mount } from './_utils.js'

describe('WkAlertDialog', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders title and description when open', async () => {
    const w = mount(WkAlertDialog, {
      props: { open: true, title: 'Are you sure?', description: 'This cannot be undone.' }
    })
    await w.vm.$nextTick()
    expect(document.body.textContent).toContain('Are you sure?')
    expect(document.body.textContent).toContain('This cannot be undone.')
    w.unmount && w.unmount()
  })

  it('renders configurable ok/cancel text', async () => {
    const w = mount(WkAlertDialog, { props: { open: true, okText: 'Delete', cancelText: 'Keep' } })
    await w.vm.$nextTick()
    expect(document.body.textContent).toContain('Delete')
    expect(document.body.textContent).toContain('Keep')
    w.unmount && w.unmount()
  })

  it('emits ok when OK button is clicked', async () => {
    const w = mount(WkAlertDialog, { props: { open: true, okText: 'OK', cancelText: 'No' } })
    await w.vm.$nextTick()
    const buttons = Array.from(document.body.querySelectorAll('button'))
    const okBtn = buttons.find(b => b.textContent.trim() === 'OK')
    okBtn.click()
    await w.vm.$nextTick()
    expect(w.emitted('ok')).toBeTruthy()
    w.unmount && w.unmount()
  })

  it('emits cancel and change(false) when Cancel is clicked', async () => {
    const w = mount(WkAlertDialog, { props: { open: true, okText: 'OK', cancelText: 'Cancel' } })
    await w.vm.$nextTick()
    const buttons = Array.from(document.body.querySelectorAll('button'))
    const cancelBtn = buttons.find(b => b.textContent.trim() === 'Cancel')
    cancelBtn.click()
    await w.vm.$nextTick()
    expect(w.emitted('cancel')).toBeTruthy()
    expect(w.emitted('change')).toBeTruthy()
    expect(w.emitted('change').pop()[0]).toBe(false)
    w.unmount && w.unmount()
  })

  it('reads modelValue when provided', async () => {
    const w = mount(WkAlertDialog, { props: { modelValue: true, open: false, title: 'Hello' } })
    await w.vm.$nextTick()
    expect(document.body.textContent).toContain('Hello')
    w.unmount && w.unmount()
  })
})
