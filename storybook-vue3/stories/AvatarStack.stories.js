import WkAvatarStack from '../../src/components/avatar-stack/AvatarStack.vue'
import WkAvatar from '../../src/components/avatar/Avatar.vue'
import WkTooltip from '../../src/components/tooltip/Tooltip.vue'

const ITEMS = [
  { name: 'Alice Nguyen', src: 'https://i.pravatar.cc/80?img=12', alt: 'Alice Nguyen' },
  { name: 'Bob Tran', src: 'https://i.pravatar.cc/80?img=14', alt: 'Bob Tran' },
  { name: 'Carol Le', src: 'https://i.pravatar.cc/80?img=15', alt: 'Carol Le' },
  { name: 'David Pham', src: 'https://i.pravatar.cc/80?img=16', alt: 'David Pham' },
  { name: 'Eva Hoang', src: 'https://i.pravatar.cc/80?img=17', alt: 'Eva Hoang' },
  { name: 'Frank Do', src: 'https://i.pravatar.cc/80?img=18', alt: 'Frank Do' },
  { name: 'Grace Vu', src: 'https://i.pravatar.cc/80?img=19', alt: 'Grace Vu' },
  { name: 'Henry Bui', src: 'https://i.pravatar.cc/80?img=20', alt: 'Henry Bui' },
  { name: 'Iris Ly', src: 'https://i.pravatar.cc/80?img=21', alt: 'Iris Ly' },
  { name: 'Jack Dinh', src: 'https://i.pravatar.cc/80?img=22', alt: 'Jack Dinh' }
]

export default {
  title: 'Display/AvatarStack',
  component: WkAvatarStack,
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['regular', 'small'] },
    max: { control: { type: 'number', min: 0 } },
    animation: { control: { type: 'select' }, options: ['none', 'pulse', 'bounce', 'ring'] }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Overlapping stack of avatars. `items` is an array of objects passed to the `#avatar` slot. ' +
          'Use `#avatar="{ avatar, index, size }"` to render custom content (e.g. with Tooltip). ' +
          'When no `#avatar` slot is provided, items are rendered as `WkAvatar` using `src`, `alt`, `name`. ' +
          '`max` limits visible items and shows a "+N" overflow chip. ' +
          '`animation` applies a CSS animation to all items (pulse / bounce / ring); respects `prefers-reduced-motion`.'
      }
    }
  }
}

const Template = args => ({
  components: { WkAvatarStack },
  data() {
    return { args, items: ITEMS }
  },
  template: `<WkAvatarStack v-bind="args" :items="items" />`
})

export const Primary = Template.bind({})
Primary.args = { size: 'regular', max: 0, animation: 'none' }
Primary.parameters = {
  docs: { description: { story: 'Default rendering — `items` rendered as WkAvatar, no overflow limit.' } }
}

export const WithOverflow = () => ({
  components: { WkAvatarStack },
  data() {
    return { items: ITEMS }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:16px;align-items:flex-start;">
      <div v-for="n in [3,2,1]" :key="n" style="display:flex;align-items:center;gap:16px;">
        <span style="color:#6b7280;font-size:11px;width:40px;">max {{ n }}</span>
        <WkAvatarStack :items="items" :max="n" />
      </div>
    </div>
  `
})
WithOverflow.parameters = {
  docs: { description: { story: '`max` trims the visible list and shows a "+N" overflow avatar.' } }
}

export const Sizes = () => ({
  components: { WkAvatarStack },
  data() {
    return { items: ITEMS }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:16px;align-items:flex-start;">
      <div v-for="s in ['regular', 'small']" :key="s" style="display:flex;align-items:center;gap:16px;">
        <span style="color:#6b7280;font-size:11px;width:52px;">{{ s }}</span>
        <WkAvatarStack :items="items" :size="s" :max="4" />
      </div>
    </div>
  `
})
Sizes.parameters = {
  docs: { description: { story: 'Both size values (regular / small) with overflow.' } }
}

export const Animations = () => ({
  components: { WkAvatarStack },
  data() {
    return {
      animations: ['none', 'pulse', 'bounce', 'ring'],
      items: ITEMS.slice(0, 3)
    }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:16px;">
      <div v-for="anim in animations" :key="anim" style="display:flex;align-items:center;gap:16px;">
        <span style="color:#6b7280;font-size:11px;width:48px;">{{ anim }}</span>
        <WkAvatarStack :items="items" :animation="anim" />
      </div>
    </div>
  `
})
Animations.parameters = {
  docs: {
    description: { story: 'All four animation values. `prefers-reduced-motion` disables pulse and bounce.' }
  }
}

export const CustomOverflow = () => ({
  components: { WkAvatarStack },
  data() {
    return { items: ITEMS, overflowLabel: n => `${n} more` }
  },
  template: `<WkAvatarStack :items="items" :max="3" :overflow-label="overflowLabel" />`
})
CustomOverflow.parameters = {
  docs: { description: { story: '`overflowLabel` function formats the overflow count. Default is "+N".' } }
}

export const WithAvatarSlot = () => ({
  components: { WkAvatarStack, WkAvatar, WkTooltip },
  data() {
    return { items: ITEMS.slice(0, 5) }
  },
  template: `
    <WkAvatarStack :items="items" :max="4">
      <template #avatar="{ avatar, size }">
        <WkTooltip :title="avatar.name" side="top">
          <WkAvatar :src="avatar.src" :alt="avatar.alt" :size="size" />
        </WkTooltip>
      </template>
      <template #overflow="{ count }">+{{ count }}</template>
    </WkAvatarStack>
  `
})
WithAvatarSlot.parameters = {
  docs: {
    description: {
      story:
        'Use `#avatar="{ avatar, index, size }"` to wrap each item — here with WkTooltip showing the full name on hover. ' +
        'The slot replaces the default WkAvatar rendering entirely, so you control markup, props, and decorations.'
    }
  }
}

export const ManyItems = () => ({
  components: { WkAvatarStack },
  data() {
    return { items: ITEMS }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:16px;align-items:flex-start;">
      <span style="color:#6b7280;font-size:11px;">10 items — z-index scales automatically</span>
      <WkAvatarStack :items="items" />
    </div>
  `
})
ManyItems.parameters = {
  docs: {
    description: {
      story: '10 avatars with no max. Z-index is calculated in JS so the ring overlaps correctly beyond 4 items.'
    }
  }
}

export const AllVariants = () => ({
  components: { WkAvatarStack, WkAvatar, WkTooltip },
  data() {
    return { items: ITEMS }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:24px;align-items:flex-start;">
      <div style="display:flex;align-items:center;gap:16px;">
        <span style="color:#6b7280;font-size:11px;width:120px;">default slot</span>
        <WkAvatarStack :items="items" :max="5" />
      </div>
      <div style="display:flex;align-items:center;gap:16px;">
        <span style="color:#6b7280;font-size:11px;width:120px;">small + overflow</span>
        <WkAvatarStack :items="items" :max="3" size="small" />
      </div>
      <div style="display:flex;align-items:center;gap:16px;">
        <span style="color:#6b7280;font-size:11px;width:120px;">#avatar + tooltip</span>
        <WkAvatarStack :items="items" :max="5">
          <template #avatar="{ avatar, size }">
            <WkTooltip :title="avatar.name" side="top">
              <WkAvatar :src="avatar.src" :alt="avatar.alt" :size="size" />
            </WkTooltip>
          </template>
        </WkAvatarStack>
      </div>
      <div style="display:flex;align-items:center;gap:16px;">
        <span style="color:#6b7280;font-size:11px;width:120px;">animation ring</span>
        <WkAvatarStack :items="items.slice(0,3)" animation="ring" />
      </div>
    </div>
  `
})
