import { vi } from 'vitest'
import { WkHoverCard } from '../src/index.js'
import { mount } from './_utils.js'

describe('WkHoverCard', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders trigger slot inside anchor', () => {
    const w = mount(WkHoverCard, {
      slots: {
        trigger: '<button class="hc-trigger">hover me</button>',
        default: '<div class="hc-content">Content</div>'
      }
    })
    expect(w.find('.ui-hover-card__anchor').exists()).toBe(true)
    expect(w.find('.hc-trigger').exists()).toBe(true)
    w.unmount && w.unmount()
  })

  it('opens on mouseenter after delay (openDelay=0)', async () => {
    vi.useFakeTimers()
    const w = mount(WkHoverCard, {
      props: { openDelay: 0 },
      slots: {
        trigger: '<button class="hc-btn">hover</button>',
        default: '<div class="hc-body">body</div>'
      }
    })
    await w.find('.ui-hover-card__anchor').trigger('mouseenter')
    vi.advanceTimersByTime(0)
    await w.vm.$nextTick()
    expect(document.body.querySelector('.ui-menu')).not.toBeNull()
    vi.useRealTimers()
    w.unmount && w.unmount()
  })

  it('closes on mouseleave after delay (closeDelay=0)', async () => {
    vi.useFakeTimers()
    const w = mount(WkHoverCard, {
      props: { openDelay: 0, closeDelay: 0 },
      slots: {
        trigger: '<button class="hc-btn">hover</button>',
        default: '<div class="hc-body">body</div>'
      }
    })
    await w.find('.ui-hover-card__anchor').trigger('mouseenter')
    vi.advanceTimersByTime(0)
    await w.vm.$nextTick()
    expect(document.body.querySelector('.ui-menu')).not.toBeNull()
    await w.find('.ui-hover-card__anchor').trigger('mouseleave')
    vi.advanceTimersByTime(0)
    await w.vm.$nextTick()
    expect(document.body.querySelector('.ui-menu')).toBeNull()
    vi.useRealTimers()
    w.unmount && w.unmount()
  })

  it('opens in controlled mode via open prop', async () => {
    const Harness = {
      components: { WkHoverCard },
      data: () => ({ isOpen: false }),
      template: `
        <WkHoverCard :open="isOpen" @change="isOpen = $event">
          <template #trigger><button class="ctrl-btn">t</button></template>
          <div class="ctrl-body">body</div>
        </WkHoverCard>
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

  it('does not open when disabled', async () => {
    vi.useFakeTimers()
    const w = mount(WkHoverCard, {
      props: { disabled: true, openDelay: 0 },
      slots: {
        trigger: '<button class="hc-btn">hover</button>',
        default: '<div>body</div>'
      }
    })
    await w.find('.ui-hover-card__anchor').trigger('mouseenter')
    vi.advanceTimersByTime(0)
    await w.vm.$nextTick()
    expect(document.body.querySelector('.ui-menu')).toBeNull()
    vi.useRealTimers()
    w.unmount && w.unmount()
  })

  it('opens on click when trigger includes click', async () => {
    const w = mount(WkHoverCard, {
      props: { trigger: ['click'] },
      slots: {
        trigger: '<button class="hc-click">click me</button>',
        default: '<div class="hc-body">body</div>'
      }
    })
    await w.find('.ui-hover-card__anchor').trigger('click')
    await w.vm.$nextTick()
    expect(document.body.querySelector('.ui-menu')).not.toBeNull()
    w.unmount && w.unmount()
  })

  it('renders default slot content in panel', async () => {
    vi.useFakeTimers()
    const w = mount(WkHoverCard, {
      props: { openDelay: 0 },
      slots: {
        trigger: '<button class="hc-btn">hover</button>',
        default: '<p class="hc-text">Hello HoverCard</p>'
      }
    })
    await w.find('.ui-hover-card__anchor').trigger('mouseenter')
    vi.advanceTimersByTime(0)
    await w.vm.$nextTick()
    expect(document.body.querySelector('.hc-text')).not.toBeNull()
    expect(document.body.querySelector('.hc-text').textContent).toContain('Hello HoverCard')
    vi.useRealTimers()
    w.unmount && w.unmount()
  })

  it('emits open event when opening', async () => {
    vi.useFakeTimers()
    let openFired = false
    const Harness = {
      components: { WkHoverCard },
      methods: {
        onOpen() {
          openFired = true
        }
      },
      template: `
        <WkHoverCard :open-delay="0" @open="onOpen">
          <template #trigger><button class="ev-btn">t</button></template>
          <div>body</div>
        </WkHoverCard>
      `
    }
    const w = mount(Harness)
    await w.find('.ui-hover-card__anchor').trigger('mouseenter')
    vi.advanceTimersByTime(0)
    await w.vm.$nextTick()
    expect(openFired).toBe(true)
    vi.useRealTimers()
    w.unmount && w.unmount()
  })

  it('emits close event when closing', async () => {
    vi.useFakeTimers()
    let closeFired = false
    const Harness = {
      components: { WkHoverCard },
      methods: {
        onClose() {
          closeFired = true
        }
      },
      template: `
        <WkHoverCard :open-delay="0" :close-delay="0" @close="onClose">
          <template #trigger><button class="ev-btn">t</button></template>
          <div>body</div>
        </WkHoverCard>
      `
    }
    const w = mount(Harness)
    await w.find('.ui-hover-card__anchor').trigger('mouseenter')
    vi.advanceTimersByTime(0)
    await w.vm.$nextTick()
    await w.find('.ui-hover-card__anchor').trigger('mouseleave')
    vi.advanceTimersByTime(0)
    await w.vm.$nextTick()
    expect(closeFired).toBe(true)
    vi.useRealTimers()
    w.unmount && w.unmount()
  })
})
