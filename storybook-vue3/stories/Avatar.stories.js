import WkAvatar from '../../src/components/avatar/Avatar.vue'

const SIZES = ['regular', 'small', 'tiny', 'extra-tiny']
const ROUNDNESS = ['round', 'roundrect']

export default {
  title: 'Display/Avatar',
  component: WkAvatar,
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: SIZES },
    roundness: { control: { type: 'inline-radio' }, options: ROUNDNESS },
    src: { control: 'text' },
    alt: { control: 'text' },
    name: { control: 'text' },
    online: { control: 'boolean' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Displays a user avatar with image, fallback initials, and an optional online indicator. ' +
          '`src` shows an image; when absent or broken the `name` prop (or default slot) renders as fallback text. ' +
          '`online` adds a green status dot. Four `size` values and two `roundness` options.'
      }
    }
  }
}

const Template = args => ({
  components: { WkAvatar },
  data() {
    return { args }
  },
  template: `<WkAvatar v-bind="args" />`
})

export const Primary = Template.bind({})
Primary.args = {
  src: 'https://i.pravatar.cc/80',
  alt: 'User avatar',
  size: 'regular',
  roundness: 'round',
  online: false
}
Primary.parameters = {
  docs: { description: { story: 'Avatar with an image source. Toggle `online` to show the status dot.' } }
}

export const Fallback = () => ({
  components: { WkAvatar },
  data() {
    return { sizes: SIZES }
  },
  template: `
    <div style="display:flex;gap:16px;align-items:flex-end;">
      <div v-for="size in sizes" :key="size" style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <WkAvatar :size="size" name="JD" />
        <span style="color:#6b7280;font-size:11px;">{{ size }}</span>
      </div>
    </div>
  `
})
Fallback.parameters = {
  docs: { description: { story: 'Fallback initials across all four sizes when no `src` is provided.' } }
}

export const AllSizes = () => ({
  components: { WkAvatar },
  data() {
    return { sizes: SIZES }
  },
  template: `
    <div style="display:flex;gap:16px;align-items:flex-end;">
      <div v-for="size in sizes" :key="size" style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <WkAvatar :size="size" src="https://i.pravatar.cc/80" alt="User" />
        <span style="color:#6b7280;font-size:11px;">{{ size }}</span>
      </div>
    </div>
  `
})
AllSizes.parameters = {
  docs: { description: { story: 'All four sizes: regular (40px), small (32px), tiny (24px), extra-tiny (20px).' } }
}

export const Roundness = () => ({
  components: { WkAvatar },
  template: `
    <div style="display:flex;gap:24px;align-items:center;">
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <WkAvatar roundness="round" name="JD" />
        <span style="color:#6b7280;font-size:11px;">round</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <WkAvatar roundness="roundrect" name="JD" />
        <span style="color:#6b7280;font-size:11px;">roundrect</span>
      </div>
    </div>
  `
})
Roundness.parameters = {
  docs: { description: { story: '`round` is fully circular; `roundrect` uses a large border-radius square.' } }
}

export const OnlineStatus = () => ({
  components: { WkAvatar },
  template: `
    <div style="display:flex;gap:16px;align-items:center;">
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <WkAvatar name="AL" :online="true" size="regular" />
        <span style="color:#6b7280;font-size:11px;">online</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <WkAvatar name="BG" :online="true" size="small" />
        <span style="color:#6b7280;font-size:11px;">online sm</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <WkAvatar name="CD" :online="false" size="regular" />
        <span style="color:#6b7280;font-size:11px;">offline</span>
      </div>
    </div>
  `
})
OnlineStatus.parameters = {
  docs: { description: { story: '`online` adds a green indicator dot with a white ring border.' } }
}
