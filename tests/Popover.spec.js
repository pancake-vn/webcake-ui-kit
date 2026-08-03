import { WkPopover } from '../src/index.js'
import { mount } from './_utils.js'

describe('WkPopover', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders trigger slot inside anchor', () => {
    const w = mount(WkPopover, {
      slots: {
        trigger: '<button class="pop-trigger">Open</button>',
        default: '<div class="pop-content">Content</div>'
      }
    })
    expect(w.find('.ui-popover__anchor').exists()).toBe(true)
    expect(w.find('.pop-trigger').exists()).toBe(true)
    w.unmount && w.unmount()
  })

  it('opens overlay on click', async () => {
    const w = mount(WkPopover, {
      slots: {
        trigger: '<button class="pop-btn">Open</button>',
        default: '<div class="pop-body">body</div>'
      }
    })
    await w.find('.ui-popover__anchor').trigger('click')
    await w.vm.$nextTick()
    expect(document.body.querySelector('.ui-menu')).not.toBeNull()
    w.unmount && w.unmount()
  })

  it('closes overlay on second click', async () => {
    const w = mount(WkPopover, {
      slots: {
        trigger: '<button class="pop-btn">Open</button>',
        default: '<div>body</div>'
      }
    })
    await w.find('.ui-popover__anchor').trigger('click')
    await w.vm.$nextTick()
    expect(document.body.querySelector('.ui-menu')).not.toBeNull()
    await w.find('.ui-popover__anchor').trigger('click')
    await w.vm.$nextTick()
    expect(document.body.querySelector('.ui-menu')).toBeNull()
    w.unmount && w.unmount()
  })

  it('does not open when disabled', async () => {
    const w = mount(WkPopover, {
      props: { disabled: true },
      slots: {
        trigger: '<button class="pop-btn">Open</button>',
        default: '<div>body</div>'
      }
    })
    await w.find('.ui-popover__anchor').trigger('click')
    await w.vm.$nextTick()
    expect(document.body.querySelector('.ui-menu')).toBeNull()
    w.unmount && w.unmount()
  })

  it('renders default slot content inside overlay', async () => {
    const w = mount(WkPopover, {
      slots: {
        trigger: '<button class="pop-btn">Open</button>',
        default: '<div class="pop-inner">Hello popover</div>'
      }
    })
    await w.find('.ui-popover__anchor').trigger('click')
    await w.vm.$nextTick()
    expect(document.body.querySelector('.pop-inner')).not.toBeNull()
    expect(document.body.querySelector('.pop-inner').textContent).toContain('Hello popover')
    w.unmount && w.unmount()
  })

  it('opens in controlled mode via open prop', async () => {
    const Harness = {
      components: { WkPopover },
      data: () => ({ isOpen: false }),
      template: `
        <WkPopover :open="isOpen" @change="isOpen = $event">
          <template #trigger><button class="ctrl-btn">t</button></template>
          <div class="ctrl-body">content</div>
        </WkPopover>
      `
    }
    const w = mount(Harness)
    w.vm.isOpen = true
    await w.vm.$nextTick()
    expect(document.body.querySelector('.ui-menu')).not.toBeNull()
    w.vm.isOpen = false
    await w.vm.$nextTick()
    expect(document.body.querySelector('.ui-menu')).toBeNull()
    w.unmount && w.unmount()
  })

  it('emits change when opening', async () => {
    let emitted = null
    const Harness = {
      components: { WkPopover },
      methods: {
        onChange(v) {
          emitted = v
        }
      },
      template: `
        <WkPopover @change="onChange">
          <template #trigger><button class="ev-btn">t</button></template>
          <div>body</div>
        </WkPopover>
      `
    }
    const w = mount(Harness)
    await w.find('.ui-popover__anchor').trigger('click')
    await w.vm.$nextTick()
    expect(emitted).toBe(true)
    w.unmount && w.unmount()
  })

  it('emits open event when opening', async () => {
    let openFired = false
    const Harness = {
      components: { WkPopover },
      methods: {
        onOpen() {
          openFired = true
        }
      },
      template: `
        <WkPopover @open="onOpen">
          <template #trigger><button class="ev-btn">t</button></template>
          <div>body</div>
        </WkPopover>
      `
    }
    const w = mount(Harness)
    await w.find('.ui-popover__anchor').trigger('click')
    await w.vm.$nextTick()
    expect(openFired).toBe(true)
    w.unmount && w.unmount()
  })

  it('emits close event when closing', async () => {
    let closeFired = false
    const Harness = {
      components: { WkPopover },
      methods: {
        onClose() {
          closeFired = true
        }
      },
      template: `
        <WkPopover @close="onClose">
          <template #trigger><button class="ev-btn">t</button></template>
          <div>body</div>
        </WkPopover>
      `
    }
    const w = mount(Harness)
    await w.find('.ui-popover__anchor').trigger('click')
    await w.vm.$nextTick()
    await w.find('.ui-popover__anchor').trigger('click')
    await w.vm.$nextTick()
    expect(closeFired).toBe(true)
    w.unmount && w.unmount()
  })
})
