import WkHoverCard from '../../src/components/hover-card/HoverCard.vue'
import WkButton from '../../src/components/button/Button.vue'
import WkAvatar from '../../src/components/avatar/Avatar.vue'

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
  title: 'Overlays/HoverCard',
  component: WkHoverCard,
  argTypes: {
    placement: { control: { type: 'select' }, options: PLACEMENTS },
    trigger: { control: { type: 'check' }, options: ['hover', 'click'] },
    openDelay: { control: 'number' },
    closeDelay: { control: 'number' },
    offset: { control: 'number' },
    width: { control: 'number' },
    disabled: { control: 'boolean' },
    closeOnEsc: { control: 'boolean' },
    anchorWidth: { control: 'boolean' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Rich preview card that appears on hover or click. ' +
          'Unlike Popover, the default trigger is `["hover"]` and it has configurable open/close delays. ' +
          'Focus events (focusin/focusout) also trigger open/close for keyboard accessibility. ' +
          '`#trigger` slot renders the anchor; default slot renders the card content. ' +
          'Dual-compat v-model: Vue 2 `open` prop, Vue 3 `modelValue`.'
      }
    }
  }
}

const Template = args => ({
  components: { WkHoverCard, WkButton },
  data() {
    return { args, isOpen: false }
  },
  template: `
    <div style="padding: 80px; display: flex; justify-content: center;">
      <WkHoverCard v-bind="args" v-model="isOpen">
        <template #trigger>
          <WkButton size="sm">Hover me</WkButton>
        </template>
        <div style="padding: 16px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,.1); min-width: 220px;">
          <p style="margin: 0 0 4px; font-weight: 600; font-size: 14px;">Preview card</p>
          <p style="margin: 0; font-size: 13px; color: #6b7280;">Rich content appears on hover with a delay.</p>
        </div>
      </WkHoverCard>
    </div>
  `
})

export const Primary = Template.bind({})
Primary.args = { placement: 'bottom', trigger: ['hover'], openDelay: 200, closeDelay: 150 }
Primary.parameters = {
  docs: {
    description: {
      story:
        'Default hover trigger. Opens after 200ms, closes after 150ms — move mouse between anchor and card without it flickering.'
    }
  }
}

export const ClickTrigger = () => ({
  components: { WkHoverCard, WkButton },
  data() {
    return { isOpen: false }
  },
  template: `
    <div style="padding: 80px; display: flex; justify-content: center;">
      <WkHoverCard v-model="isOpen" :trigger="['click']" placement="bottom">
        <template #trigger>
          <WkButton size="sm">Click to open</WkButton>
        </template>
        <div style="padding: 16px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,.1); min-width: 200px;">
          <p style="margin: 0; font-size: 13px; color: #6b7280;">Toggle via click — no hover delay.</p>
        </div>
      </WkHoverCard>
    </div>
  `
})
ClickTrigger.parameters = {
  docs: { description: { story: '`trigger: ["click"]` toggles open/close on click without any delay timers.' } }
}

export const AllVariants = () => ({
  components: { WkHoverCard, WkButton },
  data() {
    return {
      groups: [
        { label: 'Hover (default)', trigger: ['hover'], placement: 'bottom' },
        { label: 'Click', trigger: ['click'], placement: 'bottom' },
        { label: 'Hover + Click', trigger: ['hover', 'click'], placement: 'bottom' },
        { label: 'Disabled', trigger: ['hover'], placement: 'bottom', disabled: true }
      ]
    }
  },
  template: `
    <div style="padding: 80px; display: flex; gap: 24px; flex-wrap: wrap; justify-content: center; align-items: flex-start;">
      <div v-for="(g, i) in groups" :key="i" style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
        <span style="font-size: 12px; color: #6b7280; font-weight: 500;">{{ g.label }}</span>
        <WkHoverCard :trigger="g.trigger" :placement="g.placement" :disabled="g.disabled">
          <template #trigger>
            <WkButton size="sm" :disabled="g.disabled">{{ g.label }}</WkButton>
          </template>
          <div style="padding: 12px 16px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,.1); min-width: 140px;">
            <p style="margin: 0; font-size: 13px;">{{ g.label }}</p>
          </div>
        </WkHoverCard>
      </div>
    </div>
  `
})
AllVariants.parameters = {
  docs: { description: { story: 'Hover-only, click-only, both triggers, and disabled — four modes side by side.' } }
}

export const AllPlacements = () => ({
  components: { WkHoverCard, WkButton },
  data() {
    return { placements: PLACEMENTS }
  },
  template: `
    <div style="padding: 80px; display: flex; flex-wrap: wrap; gap: 16px; justify-content: center;">
      <WkHoverCard
        v-for="p in placements"
        :key="p"
        :placement="p"
        :trigger="['hover']"
        :open-delay="0"
      >
        <template #trigger>
          <WkButton size="xs">{{ p }}</WkButton>
        </template>
        <div style="padding: 8px 12px; background: #fff; border: 1px solid #e5e7eb; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,.1); font-size: 12px; white-space: nowrap;">
          {{ p }}
        </div>
      </WkHoverCard>
    </div>
  `
})
AllPlacements.parameters = {
  docs: { description: { story: 'All 12 placement positions. `openDelay=0` for instant preview.' } }
}

export const WithDelay = () => ({
  components: { WkHoverCard, WkButton },
  data() {
    return {
      configs: [
        { label: 'Fast (50ms / 50ms)', openDelay: 50, closeDelay: 50 },
        { label: 'Default (200ms / 150ms)', openDelay: 200, closeDelay: 150 },
        { label: 'Slow (600ms / 400ms)', openDelay: 600, closeDelay: 400 }
      ]
    }
  },
  template: `
    <div style="padding: 80px; display: flex; gap: 24px; flex-wrap: wrap; justify-content: center; align-items: flex-start;">
      <div v-for="c in configs" :key="c.label" style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
        <span style="font-size: 11px; color: #6b7280; font-weight: 500; text-align: center;">{{ c.label }}</span>
        <WkHoverCard :open-delay="c.openDelay" :close-delay="c.closeDelay" placement="bottom">
          <template #trigger>
            <WkButton size="sm">Hover</WkButton>
          </template>
          <div style="padding: 10px 14px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,.1); font-size: 13px; white-space: nowrap;">
            open {{ c.openDelay }}ms / close {{ c.closeDelay }}ms
          </div>
        </WkHoverCard>
      </div>
    </div>
  `
})
WithDelay.parameters = {
  docs: {
    description: {
      story: '`openDelay` and `closeDelay` (ms) control how long after hover intent before the card appears/disappears.'
    }
  }
}

export const RichContent = () => ({
  components: { WkHoverCard, WkButton, WkAvatar },
  data() {
    return { isOpen: false }
  },
  template: `
    <div style="padding: 80px; display: flex; justify-content: center;">
      <WkHoverCard v-model="isOpen" :trigger="['hover']" placement="bottom-start" :width="260">
        <template #trigger>
          <span style="font-size: 14px; font-weight: 500; color: #4f46e5; cursor: pointer; border-bottom: 1px dashed #4f46e5;">@alice_johnson</span>
        </template>
        <div style="padding: 16px; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,.12);">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
            <WkAvatar name="Alice Johnson" size="md" />
            <div>
              <p style="margin: 0; font-weight: 600; font-size: 14px;">Alice Johnson</p>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">@alice_johnson</p>
            </div>
          </div>
          <p style="margin: 0; font-size: 13px; color: #374151;">Product designer. Building design systems and accessible UIs.</p>
          <p style="margin: 4px 0 0; font-size: 12px; color: #9ca3af;">Joined March 2020</p>
        </div>
      </WkHoverCard>
    </div>
  `
})
RichContent.parameters = {
  docs: {
    description: {
      story: 'A typical use case: hover over a username to preview a user profile card. Uses `width` and `Avatar`.'
    }
  }
}
