import WkAvatarStack from '../../src/components/avatar-stack/AvatarStack.vue'

const ITEMS = [
  { src: 'https://i.pravatar.cc/80?img=12' },
  { src: 'https://i.pravatar.cc/80?img=14' },
  { src: 'https://i.pravatar.cc/80?img=15' },
  { src: 'https://i.pravatar.cc/80?img=16' },
  { src: 'https://i.pravatar.cc/80?img=17' },
  { src: 'https://i.pravatar.cc/80?img=18' },
  { src: 'https://i.pravatar.cc/80?img=19' },
  { src: 'https://i.pravatar.cc/80?img=20' },
  { src: 'https://i.pravatar.cc/80?img=21' },
  { src: 'https://i.pravatar.cc/80?img=22' }
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
          'Overlapping stack of avatars. `items` is an array of `{ name, src, alt }` objects. ' +
          '`max` limits visible items and shows an overflow avatar with a "+N" label. ' +
          '`overflowLabel` is a function `(count) => string` for custom text. ' +
          '`animation` applies a CSS animation to all items; respects `prefers-reduced-motion`.'
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
  docs: { description: { story: 'Five avatars with no overflow limit.' } }
}

export const WithOverflow = () => ({
  components: { WkAvatarStack },
  data() {
    return { items: ITEMS }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:16px;align-items:flex-start;">
      <div style="display:flex;align-items:center;gap:16px;">
        <span style="color:#6b7280;font-size:11px;width:40px;">max 3</span>
        <WkAvatarStack :items="items" :max="3" />
      </div>
      <div style="display:flex;align-items:center;gap:16px;">
        <span style="color:#6b7280;font-size:11px;width:40px;">max 2</span>
        <WkAvatarStack :items="items" :max="2" />
      </div>
      <div style="display:flex;align-items:center;gap:16px;">
        <span style="color:#6b7280;font-size:11px;width:40px;">max 1</span>
        <WkAvatarStack :items="items" :max="1" />
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
      <div style="display:flex;flex-direction:column;gap:4px;">
        <span style="color:#6b7280;font-size:11px;">regular</span>
        <WkAvatarStack :items="items" size="regular" :max="4" />
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;">
        <span style="color:#6b7280;font-size:11px;">small</span>
        <WkAvatarStack :items="items" size="small" :max="4" />
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
    description: { story: 'All four animation values. `prefers-reduced-motion` disables animations automatically.' }
  }
}

export const CustomOverflow = () => ({
  components: { WkAvatarStack },
  data() {
    return {
      items: ITEMS,
      overflowLabel: n => `${n} more`
    }
  },
  template: `<WkAvatarStack :items="items" :max="3" :overflow-label="overflowLabel" />`
})
CustomOverflow.parameters = {
  docs: { description: { story: '`overflowLabel` function formats the overflow count. Default is "+N".' } }
}
