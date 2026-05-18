import { WkMenu } from '../src/index.js'
import { mount } from './_utils.js'

const SIMPLE_HARNESS = {
  components: { WkMenu },
  data() {
    return { open: false }
  },
  template: `
    <WkMenu :open="open" @change="open = $event">
      <template #trigger="{ toggle, attrs, triggerRef }">
        <button ref="triggerBtn" :ref="triggerRef" type="button" v-bind="attrs" @click="toggle">trigger</button>
      </template>
      <div>Item A</div>
      <div>Item B</div>
    </WkMenu>
  `
}

describe('WkMenu', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('does not render the floating element when closed', () => {
    const w = mount(SIMPLE_HARNESS)
    expect(document.body.querySelector('.ui-menu')).toBeNull()
    w.unmount && w.unmount()
  })

  it('renders the floating element in the portal root when opened', async () => {
    const w = mount(SIMPLE_HARNESS, { data: () => ({ open: true }) })
    await w.vm.$nextTick()
    const floating = document.body.querySelector('.ui-menu')
    expect(floating).not.toBeNull()
    const portal = document.body.querySelector('#wk-portal-root')
    expect(portal).not.toBeNull()
    expect(portal.contains(floating)).toBe(true)
    w.unmount && w.unmount()
  })

  it('exposes aria-haspopup and aria-expanded on the trigger via slot attrs', async () => {
    const w = mount(SIMPLE_HARNESS)
    await w.vm.$nextTick()
    const trigger = w.find('button')
    expect(trigger.attributes('aria-haspopup')).toBe('menu')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    w.vm.open = true
    await w.vm.$nextTick()
    expect(trigger.attributes('aria-expanded')).toBe('true')
    w.unmount && w.unmount()
  })

  it('does not toggle when disabled', async () => {
    const Harness = {
      components: { WkMenu },
      data: () => ({ open: false }),
      template: `
        <WkMenu :open="open" :disabled="true" @change="open = $event">
          <template #trigger="{ toggle, attrs, triggerRef }">
            <button :ref="triggerRef" v-bind="attrs" @click="toggle">trigger</button>
          </template>
          <div>A</div>
        </WkMenu>
      `
    }
    const w = mount(Harness)
    await w.vm.$nextTick()
    await w.find('button').trigger('click')
    await w.vm.$nextTick()
    expect(w.vm.open).toBe(false)
    expect(document.body.querySelector('.ui-menu')).toBeNull()
    w.unmount && w.unmount()
  })

  it('emits open and close lifecycle events', async () => {
    let openCount = 0
    let closeCount = 0
    const Harness = {
      components: { WkMenu },
      data: () => ({ open: false }),
      methods: {
        onOpen() {
          openCount++
        },
        onClose() {
          closeCount++
        }
      },
      template: `
        <WkMenu :open="open" @change="open = $event" @open="onOpen" @close="onClose">
          <template #trigger="{ toggle, attrs, triggerRef }">
            <button :ref="triggerRef" v-bind="attrs" @click="toggle">t</button>
          </template>
          <div>A</div>
        </WkMenu>
      `
    }
    const w = mount(Harness)
    await w.vm.$nextTick()
    w.vm.open = true
    await w.vm.$nextTick()
    expect(openCount).toBe(1)
    w.vm.open = false
    await w.vm.$nextTick()
    expect(closeCount).toBe(1)
    w.unmount && w.unmount()
  })

  it('emits select and closes when selectItem is called via injected menu', async () => {
    const InjectItem = {
      inject: ['menu'],
      props: ['value'],
      template: '<div class="inject-item" @click="menu.selectItem(value)">{{ value }}</div>'
    }
    const Harness = {
      components: { WkMenu, InjectItem },
      data: () => ({ open: true, picked: '' }),
      template: `
        <WkMenu :open="open" @change="open = $event" @select="picked = $event">
          <template #trigger="{ toggle, triggerRef }">
            <button :ref="triggerRef" @click="toggle">t</button>
          </template>
          <InjectItem value="a" />
          <InjectItem value="b" />
        </WkMenu>
      `
    }
    const w = mount(Harness)
    await w.vm.$nextTick()
    const item = document.body.querySelector('.inject-item')
    expect(item).not.toBeNull()
    item.click()
    await w.vm.$nextTick()
    expect(w.vm.picked).toBe('a')
    expect(w.vm.open).toBe(false)
    w.unmount && w.unmount()
  })
})
