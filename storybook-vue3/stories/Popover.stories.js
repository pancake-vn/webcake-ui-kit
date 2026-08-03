import WkPopover from '../../src/components/popover/Popover.vue'
import WkButton from '../../src/components/button/Button.vue'

const PLACEMENTS = [
  'top',
  'top-start',
  'top-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end',
  'right',
  'right-start',
  'right-end'
]

export default {
  title: 'Overlays/Popover',
  component: WkPopover,
  argTypes: {
    placement: { control: { type: 'select' }, options: PLACEMENTS },
    trigger: { control: { type: 'check' }, options: ['click', 'hover'] },
    offset: { control: { type: 'number' } },
    width: { control: { type: 'number' } },
    disabled: { control: 'boolean' },
    persistent: { control: 'boolean' },
    closeOnEsc: { control: 'boolean' },
    anchorWidth: { control: 'boolean' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Floating overlay anchored to a trigger element. ' +
          'Supports `click`, `hover`, or both triggers. ' +
          '`placement` accepts 12 positions (top/bottom/left/right with -start/-end variants). ' +
          '`#trigger` slot exposes `{ isOpen }`. Default slot exposes `{ close, isOpen }`. ' +
          'Dual-compat v-model: Vue 2 uses `v-model` on the `open` prop; Vue 3 uses `v-model` on `modelValue`.'
      }
    }
  }
}

const Template = args => ({
  components: { WkPopover, WkButton },
  data() {
    return { args, isOpen: false }
  },
  template: `
    <div style="padding: 80px; display: flex; justify-content: center;">
      <WkPopover v-bind="args" v-model="isOpen">
        <template #trigger>
          <WkButton size="sm">Click me</WkButton>
        </template>
        <div style="padding: 12px 16px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,.1); min-width: 180px;">
          <p style="margin: 0 0 8px; font-weight: 500; font-size: 14px;">Popover title</p>
          <p style="margin: 0; font-size: 13px; color: #6b7280;">Some description content.</p>
        </div>
      </WkPopover>
    </div>
  `
})

export const Primary = Template.bind({})
Primary.args = { placement: 'bottom-start', trigger: ['click'], offset: 8, closeOnEsc: true }
Primary.parameters = {
  docs: { description: { story: 'Click trigger with `bottom-start` placement. `v-model` controls open state.' } }
}

export const HoverTrigger = () => ({
  components: { WkPopover, WkButton },
  data() {
    return { isOpen: false }
  },
  template: `
    <div style="padding: 80px; display: flex; justify-content: center;">
      <WkPopover v-model="isOpen" :trigger="['hover']" placement="top">
        <template #trigger>
          <WkButton size="sm">Hover me</WkButton>
        </template>
        <div style="padding: 12px 16px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,.1);">
          <p style="margin: 0; font-size: 13px;">Opens on hover, closes when mouse leaves either the trigger or the panel.</p>
        </div>
      </WkPopover>
    </div>
  `
})
HoverTrigger.parameters = {
  docs: {
    description: {
      story:
        '`trigger: ["hover"]` — panel stays open while hovering either the anchor or the content (80ms grace period).'
    }
  }
}

export const BothTriggers = () => ({
  components: { WkPopover, WkButton },
  data() {
    return { isOpen: false }
  },
  template: `
    <div style="padding: 80px; display: flex; justify-content: center;">
      <WkPopover v-model="isOpen" :trigger="['click', 'hover']" placement="bottom">
        <template #trigger>
          <WkButton size="sm">Click or hover</WkButton>
        </template>
        <div style="padding: 12px 16px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,.1);">
          <p style="margin: 0; font-size: 13px;">Triggered by either click or hover.</p>
        </div>
      </WkPopover>
    </div>
  `
})
BothTriggers.parameters = {
  docs: { description: { story: '`trigger: ["click", "hover"]` enables both interaction modes simultaneously.' } }
}

export const AllVariants = () => ({
  components: { WkPopover, WkButton },
  data() {
    return {
      groups: [
        { label: 'Click (default)', trigger: ['click'], placement: 'bottom' },
        { label: 'Hover', trigger: ['hover'], placement: 'bottom' },
        { label: 'Disabled', trigger: ['click'], placement: 'bottom', disabled: true },
        { label: 'Persistent', trigger: ['click'], placement: 'bottom', persistent: true }
      ],
      opens: [false, false, false, false]
    }
  },
  template: `
    <div style="padding: 80px; display: flex; gap: 24px; flex-wrap: wrap; justify-content: center; align-items: flex-start;">
      <div v-for="(g, i) in groups" :key="i" style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
        <span style="font-size: 12px; color: #6b7280; font-weight: 500;">{{ g.label }}</span>
        <WkPopover
          :trigger="g.trigger"
          :placement="g.placement"
          :disabled="g.disabled"
          :persistent="g.persistent"
          :open="opens[i]"
          @change="v => opens.splice(i, 1, v)"
        >
          <template #trigger>
            <WkButton size="sm" :disabled="g.disabled">Open</WkButton>
          </template>
          <div style="padding: 12px 16px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,.1); min-width: 140px;">
            <p style="margin: 0; font-size: 13px;">{{ g.label }}</p>
          </div>
        </WkPopover>
      </div>
    </div>
  `
})
AllVariants.parameters = {
  docs: { description: { story: 'Click, hover, disabled, and persistent variants side by side.' } }
}

export const AllPlacements = () => ({
  components: { WkPopover, WkButton },
  data() {
    return { placements: PLACEMENTS }
  },
  template: `
    <div style="padding: 80px; display: flex; flex-wrap: wrap; gap: 16px; justify-content: center;">
      <WkPopover
        v-for="p in placements"
        :key="p"
        :placement="p"
        :trigger="['hover']"
      >
        <template #trigger>
          <WkButton size="xs">{{ p }}</WkButton>
        </template>
        <div style="padding: 8px 12px; background: #fff; border: 1px solid #e5e7eb; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,.1); font-size: 12px; white-space: nowrap;">
          placement: {{ p }}
        </div>
      </WkPopover>
    </div>
  `
})
AllPlacements.parameters = {
  docs: { description: { story: 'All 12 placement variants. Hover each button to see the popover position.' } }
}

export const WithWidth = () => ({
  components: { WkPopover, WkButton },
  data() {
    return { isOpen: false }
  },
  template: `
    <div style="padding: 80px; display: flex; justify-content: center;">
      <WkPopover v-model="isOpen" :width="280" placement="bottom-start">
        <template #trigger>
          <WkButton size="sm">Fixed 280px width</WkButton>
        </template>
        <div style="padding: 16px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,.1);">
          <p style="margin: 0 0 8px; font-weight: 500; font-size: 14px;">Custom width</p>
          <p style="margin: 0; font-size: 13px; color: #6b7280;">The <code>width</code> prop sets a fixed pixel width on the overlay panel.</p>
        </div>
      </WkPopover>
    </div>
  `
})
WithWidth.parameters = {
  docs: { description: { story: '`width` prop pins the overlay to a fixed pixel width (here 280px).' } }
}

export const AnchorWidth = () => ({
  components: { WkPopover, WkButton },
  data() {
    return { isOpen: false }
  },
  template: `
    <div style="padding: 80px; display: flex; justify-content: center;">
      <WkPopover v-model="isOpen" :anchor-width="true" placement="bottom-start">
        <template #trigger>
          <WkButton size="sm" style="width: 240px;">Anchor-width trigger</WkButton>
        </template>
        <div style="padding: 12px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,.1);">
          <p style="margin: 0; font-size: 13px; color: #6b7280;">Panel matches the anchor's width.</p>
        </div>
      </WkPopover>
    </div>
  `
})
AnchorWidth.parameters = {
  docs: {
    description: {
      story: '`anchor-width` makes the overlay as wide as the trigger element — useful for dropdown-style pickers.'
    }
  }
}

export const WithCloseSlot = () => ({
  components: { WkPopover, WkButton },
  data() {
    return { isOpen: false }
  },
  template: `
    <div style="padding: 80px; display: flex; justify-content: center;">
      <WkPopover v-model="isOpen" placement="bottom">
        <template #trigger>
          <WkButton size="sm">Open</WkButton>
        </template>
        <template #default="{ close }">
          <div style="padding: 16px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,.1); min-width: 200px; display: flex; flex-direction: column; gap: 12px;">
            <p style="margin: 0; font-size: 13px; font-weight: 500;">Confirm action?</p>
            <div style="display: flex; gap: 8px; justify-content: flex-end;">
              <WkButton size="xs" variant="outline" @click="close">Cancel</WkButton>
              <WkButton size="xs" variant="primary" @click="close">Confirm</WkButton>
            </div>
          </div>
        </template>
      </WkPopover>
    </div>
  `
})
WithCloseSlot.parameters = {
  docs: {
    description: {
      story: 'Default slot receives `{ close, isOpen }`. Use `close()` to dismiss the panel from inside the content.'
    }
  }
}
