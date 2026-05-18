import { WkDropdown } from '../src/index.js'
import { mount } from './_utils.js'

describe('WkDropdown', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders the default slot as trigger', () => {
    const w = mount(WkDropdown, {
      slots: {
        default: '<button class="my-btn">Open</button>',
        overlay: '<div class="my-item">Item</div>'
      }
    })
    expect(w.find('.my-btn').exists()).toBe(true)
    w.unmount && w.unmount()
  })

  it('opens overlay on click', async () => {
    const w = mount(WkDropdown, {
      slots: {
        default: '<button class="my-btn">Open</button>',
        overlay: '<div class="my-item">Item</div>'
      }
    })
    await w.find('.my-btn').trigger('click')
    await w.vm.$nextTick()
    const floating = document.body.querySelector('.ui-menu')
    expect(floating).not.toBeNull()
    expect(floating.querySelector('.my-item')).not.toBeNull()
    w.unmount && w.unmount()
  })

  it('closes overlay on second click', async () => {
    const w = mount(WkDropdown, {
      slots: {
        default: '<button class="my-btn">Open</button>',
        overlay: '<div>Item</div>'
      }
    })
    await w.find('.my-btn').trigger('click')
    await w.vm.$nextTick()
    expect(document.body.querySelector('.ui-menu')).not.toBeNull()
    await w.find('.my-btn').trigger('click')
    await w.vm.$nextTick()
    expect(document.body.querySelector('.ui-menu')).toBeNull()
    w.unmount && w.unmount()
  })

  it('does not open when disabled', async () => {
    const w = mount(WkDropdown, {
      props: { disabled: true },
      slots: {
        default: '<button class="my-btn">Open</button>',
        overlay: '<div>Item</div>'
      }
    })
    await w.find('.my-btn').trigger('click')
    await w.vm.$nextTick()
    expect(document.body.querySelector('.ui-menu')).toBeNull()
    w.unmount && w.unmount()
  })

  it('works in controlled mode with open prop', async () => {
    const Harness = {
      components: { WkDropdown },
      data: () => ({ open: false }),
      template: `
        <WkDropdown :open="open" @change="open = $event">
          <button class="ctrl-btn">trigger</button>
          <template #overlay><div class="ctrl-item">Option</div></template>
        </WkDropdown>
      `
    }
    const w = mount(Harness)
    w.vm.open = true
    await w.vm.$nextTick()
    expect(document.body.querySelector('.ui-menu')).not.toBeNull()
    w.vm.open = false
    await w.vm.$nextTick()
    expect(document.body.querySelector('.ui-menu')).toBeNull()
    w.unmount && w.unmount()
  })

  it('emits open and close events', async () => {
    let openFired = false
    let closeFired = false
    const Harness = {
      components: { WkDropdown },
      methods: {
        onOpen() {
          openFired = true
        },
        onClose() {
          closeFired = true
        }
      },
      template: `
        <WkDropdown @open="onOpen" @close="onClose">
          <button class="ev-btn">t</button>
          <template #overlay><div>x</div></template>
        </WkDropdown>
      `
    }
    const w = mount(Harness)
    await w.find('.ev-btn').trigger('click')
    await w.vm.$nextTick()
    expect(openFired).toBe(true)
    await w.find('.ev-btn').trigger('click')
    await w.vm.$nextTick()
    expect(closeFired).toBe(true)
    w.unmount && w.unmount()
  })
})
