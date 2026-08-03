import WkDrawer from '../../src/components/drawer/Drawer.vue'
import WkButton from '../../src/components/button/Button.vue'

const PLACEMENTS = ['bottom', 'top', 'left', 'right']

export default {
  title: 'Overlays/Drawer',
  component: WkDrawer,
  argTypes: {
    placement: { control: { type: 'inline-radio' }, options: PLACEMENTS },
    size: { control: 'text' },
    showHandle: { control: 'boolean' },
    mask: { control: 'boolean' },
    maskClosable: { control: 'boolean' },
    keyboard: { control: 'boolean' },
    blur: { control: 'boolean' },
    onOpen: { action: 'open' },
    onClose: { action: 'close' },
    'onAfter-close': { action: 'after-close' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Edge-docked overlay panel (bottom sheet by default) with a drag handle, backdrop mask, ' +
          'keyboard (Esc), maskClosable, body scroll lock and focus management. ' +
          'Placement supports bottom / top / left / right. ' +
          'Dual-compat v-model: Vue 2 uses `v-model` on the `open` prop; Vue 3 uses `v-model` on `modelValue`.'
      }
    }
  }
}

const Template = args => ({
  components: { WkDrawer, WkButton },
  data() {
    return { open: false }
  },
  computed: {
    bound() {
      return args
    }
  },
  template: `
    <div>
      <WkButton variant="primary" @click="open = true">Open drawer</WkButton>
      <WkDrawer v-model="open" v-bind="bound">
        <div style="display:flex; flex-direction:column; gap:12px; padding:24px; min-height: 500px">
          <h3 style="margin:0">Drawer content</h3>
          <p style="margin:0">Drag the handle, press Esc, or click the backdrop to close.</p>
          <WkButton size="sm" @click="open = false">Close</WkButton>
        </div>
      </WkDrawer>
    </div>
  `
})

export const Primary = Template.bind({})
Primary.args = { placement: 'bottom', showHandle: true }

export const AllVariants = args => ({
  components: { WkDrawer, WkButton },
  data() {
    return { open: false, placement: 'bottom', placements: PLACEMENTS }
  },
  computed: {
    bound() {
      return args
    }
  },
  methods: {
    show(p) {
      this.placement = p
      this.open = true
    }
  },
  template: `
    <div style="display:flex; gap:12px; flex-wrap:wrap">
      <WkButton v-for="p in placements" :key="p" size="sm" @click="show(p)">{{ p }}</WkButton>
      <WkDrawer v-model="open" :placement="placement" v-bind="bound">
        <div style="display:flex; flex-direction:column; gap:12px; padding:24px; min-height: 500px">
          <h3 style="margin:0">{{ placement }} drawer</h3>
          <WkButton size="sm" @click="open = false">Close</WkButton>
        </div>
      </WkDrawer>
    </div>
  `
})
AllVariants.args = { showHandle: true }

export const Matrix = () => ({
  components: { WkDrawer, WkButton },
  data() {
    return { open: false, placement: 'bottom', handle: true, placements: PLACEMENTS }
  },
  methods: {
    show(p, h) {
      this.placement = p
      this.handle = h
      this.open = true
    }
  },
  template: `
    <div style="display:grid; grid-template-columns:auto 1fr 1fr; gap:12px; align-items:center">
      <div></div><strong>handle on</strong><strong>handle off</strong>
      <template v-for="p in placements">
        <strong :key="p + '-label'">{{ p }}</strong>
        <WkButton :key="p + '-on'" size="sm" @click="show(p, true)">open</WkButton>
        <WkButton :key="p + '-off'" size="sm" variant="outline" @click="show(p, false)">open</WkButton>
      </template>
      <WkDrawer v-model="open" :placement="placement" :showHandle="handle">
        <div style="display:flex; flex-direction:column; gap:12px; padding:24px; min-height: 500px">
          <h3 style="margin:0">{{ placement }} · handle {{ handle ? 'on' : 'off' }}</h3>
          <WkButton size="sm" @click="open = false">Close</WkButton>
        </div>
      </WkDrawer>
    </div>
  `
})

export const WithContent = () => ({
  components: { WkDrawer, WkButton },
  data() {
    return { open: false }
  },
  template: `
    <div>
      <WkButton variant="primary" @click="open = true">Open drawer</WkButton>
      <WkDrawer v-model="open" placement="right" :size="420">
        <div style="display:flex; flex-direction:column; gap:16px; padding:24px">
          <h3 style="margin:0">Filters</h3>
          <p style="margin:0">A right-side drawer with a fixed 420px width hosting arbitrary slot content.</p>
          <ul style="margin:0; padding-left:18px; display:flex; flex-direction:column; gap:8px">
            <li>Category</li>
            <li>Price range</li>
            <li>Availability</li>
          </ul>
          <WkButton size="sm" @click="open = false">Apply</WkButton>
        </div>
      </WkDrawer>
    </div>
  `
})
