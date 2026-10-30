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

  // --- items prop + submenu (DropdownMenuItems) ---

  describe('items menu', () => {
    const ITEMS = [
      { key: 'copy', label: 'Copy' },
      {
        key: 'share',
        label: 'Share',
        children: [
          { key: 'email', label: 'Email' },
          { key: 'link', label: 'Copy link' }
        ]
      },
      { key: 'delete', label: 'Delete', destructive: true }
    ]

    const openMenu = async () => {
      const w = mount(WkDropdown, {
        props: { items: ITEMS },
        slots: { default: '<button class="trig">menu</button>' }
      })
      await w.find('.trig').trigger('click')
      await w.vm.$nextTick()
      return w
    }

    it('renders the items menu in the portal', async () => {
      const w = await openMenu()
      const menu = document.body.querySelector('.ui-dropdown-items')
      expect(menu).not.toBeNull()
      const labels = Array.from(menu.querySelectorAll('.ui-menuitem__label')).map(n => n.textContent.trim())
      expect(labels).toEqual(expect.arrayContaining(['Copy', 'Share', 'Delete']))
      w.unmount && w.unmount()
    })

    it('shows a chevron on a parent item with children', async () => {
      const w = await openMenu()
      const shareEntry = document.body.querySelector('.ui-menuitem[data-key="share"]')
      expect(shareEntry).not.toBeNull()
      // chevron-right rendered in the suffix slot for items with children
      expect(shareEntry.querySelector('.ui-menuitem__suffix svg')).not.toBeNull()
      w.unmount && w.unmount()
    })

    it('opens a submenu panel when a parent item is clicked', async () => {
      const w = await openMenu()
      expect(document.body.querySelectorAll('.ui-dropdown-items').length).toBe(1)
      const share = document.body.querySelector('.ui-menuitem[data-key="share"]')
      share.click()
      await w.vm.$nextTick()
      // a second (recursive) panel appears for the children
      expect(document.body.querySelectorAll('.ui-dropdown-items').length).toBe(2)
      const childLabels = Array.from(
        document.body.querySelectorAll('.ui-dropdown-items')[1].querySelectorAll('.ui-menuitem__label')
      ).map(n => n.textContent.trim())
      expect(childLabels).toEqual(expect.arrayContaining(['Email', 'Copy link']))
      w.unmount && w.unmount()
    })

    it('closes the submenu panel on a second click of the parent', async () => {
      const w = await openMenu()
      const share = document.body.querySelector('.ui-menuitem[data-key="share"]')
      share.click()
      await w.vm.$nextTick()
      expect(document.body.querySelectorAll('.ui-dropdown-items').length).toBe(2)
      document.body.querySelector('.ui-menuitem[data-key="share"]').click()
      await w.vm.$nextTick()
      expect(document.body.querySelectorAll('.ui-dropdown-items').length).toBe(1)
      w.unmount && w.unmount()
    })

    it('clicking a parent does not emit select', async () => {
      const w = await openMenu()
      document.body.querySelector('.ui-menuitem[data-key="share"]').click()
      await w.vm.$nextTick()
      expect(w.emitted('select')).toBeFalsy()
      w.unmount && w.unmount()
    })

    it('emits select with the key when a top-level leaf item is clicked', async () => {
      const w = await openMenu()
      document.body.querySelector('.ui-menuitem[data-key="copy"]').click()
      await w.vm.$nextTick()
      expect(w.emitted('select')).toBeTruthy()
      expect(w.emitted('select')[0][0]).toBe('copy')
      w.unmount && w.unmount()
    })

    it('emits select with the nested key from a submenu leaf', async () => {
      const w = await openMenu()
      document.body.querySelector('.ui-menuitem[data-key="share"]').click()
      await w.vm.$nextTick()
      document.body.querySelector('.ui-menuitem[data-key="email"]').click()
      await w.vm.$nextTick()
      expect(w.emitted('select')[0][0]).toBe('email')
      w.unmount && w.unmount()
    })

    it('closes the menu after selecting a leaf (closeOnSelect default)', async () => {
      const w = await openMenu()
      document.body.querySelector('.ui-menuitem[data-key="copy"]').click()
      await w.vm.$nextTick()
      expect(document.body.querySelector('.ui-dropdown-items')).toBeNull()
      w.unmount && w.unmount()
    })

    it('does not select a disabled item', async () => {
      const w = mount(WkDropdown, {
        props: {
          items: [
            { key: 'a', label: 'A', disabled: true },
            { key: 'b', label: 'B' }
          ]
        },
        slots: { default: '<button class="trig">menu</button>' }
      })
      await w.find('.trig').trigger('click')
      await w.vm.$nextTick()
      document.body.querySelector('.ui-menuitem[data-key="a"]').click()
      await w.vm.$nextTick()
      expect(w.emitted('select')).toBeFalsy()
      w.unmount && w.unmount()
    })
  })
})
