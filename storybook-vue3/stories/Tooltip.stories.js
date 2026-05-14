import WkTooltip from '../../src/components/tooltip/Tooltip.vue'

const SIDES = ['top', 'bottom', 'left', 'right']
const COLORS = ['default', 'brand', 'destructive']

export default {
  title: 'Display/Tooltip',
  component: WkTooltip,
  argTypes: {
    side: { control: { type: 'inline-radio' }, options: SIDES },
    color: { control: { type: 'inline-radio' }, options: COLORS },
    title: { control: 'text' },
    arrow: { control: 'boolean' },
    open: { control: 'boolean' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Hover tooltip that teleports its bubble to `document.body` to avoid overflow clipping. ' +
          'Position is computed via `getBoundingClientRect` and updated on scroll/resize. ' +
          '`side` controls placement direction; `color` selects the semantic palette; ' +
          '`arrow` toggles the CSS triangle pointer. Default slot is the trigger; ' +
          '`content` slot overrides `title` for rich HTML inside the bubble.'
      }
    }
  }
}

const Template = args => ({
  components: { WkTooltip },
  data() {
    return { args }
  },
  template: `
    <div style="padding:60px;display:flex;justify-content:center;">
      <WkTooltip v-bind="args">
        <button style="padding:8px 16px;border:1px solid #e5e7eb;border-radius:8px;cursor:pointer;font-size:14px;">
          Hover me
        </button>
      </WkTooltip>
    </div>
  `
})

export const Primary = Template.bind({})
Primary.args = { title: 'Tooltip text', side: 'top', color: 'default', arrow: true, open: false }
Primary.parameters = {
  docs: { description: { story: 'Hover the button to show the tooltip. Set `open` to force it always visible.' } }
}

export const AllSides = () => ({
  components: { WkTooltip },
  data() {
    return { sides: SIDES }
  },
  template: `
    <div style="padding:80px;display:flex;gap:48px;justify-content:center;align-items:center;flex-wrap:wrap;">
      <WkTooltip v-for="side in sides" :key="side" :side="side" :title="side" :open="true">
        <button style="padding:8px 16px;border:1px solid #e5e7eb;border-radius:8px;font-size:14px;cursor:pointer;">
          {{ side }}
        </button>
      </WkTooltip>
    </div>
  `
})
AllSides.parameters = {
  docs: { description: { story: 'All four placement sides with `open` forced so they render statically.' } }
}

export const Colors = () => ({
  components: { WkTooltip },
  data() {
    return { colors: COLORS }
  },
  template: `
    <div style="padding:80px;display:flex;gap:48px;justify-content:center;align-items:center;flex-wrap:wrap;">
      <WkTooltip v-for="color in colors" :key="color" :color="color" :title="color" :open="true">
        <button style="padding:8px 16px;border:1px solid #e5e7eb;border-radius:8px;font-size:14px;cursor:pointer;">
          {{ color }}
        </button>
      </WkTooltip>
    </div>
  `
})
Colors.parameters = {
  docs: { description: { story: 'Default (dark), brand (primary color), and destructive (red) palettes.' } }
}

export const NoArrow = () => ({
  components: { WkTooltip },
  template: `
    <div style="padding:80px;display:flex;justify-content:center;">
      <WkTooltip title="No arrow pointer" :arrow="false" :open="true">
        <button style="padding:8px 16px;border:1px solid #e5e7eb;border-radius:8px;font-size:14px;cursor:pointer;">
          Hover
        </button>
      </WkTooltip>
    </div>
  `
})
NoArrow.parameters = {
  docs: { description: { story: '`arrow=false` removes the CSS triangle pointer from the bubble.' } }
}

export const RichContent = () => ({
  components: { WkTooltip },
  template: `
    <div style="padding:80px;display:flex;justify-content:center;">
      <WkTooltip :open="true" :max-width="220">
        <button style="padding:8px 16px;border:1px solid #e5e7eb;border-radius:8px;font-size:14px;cursor:pointer;">
          Rich tip
        </button>
        <template #content>
          Use the <strong>content</strong> slot for rich&nbsp;HTML
        </template>
      </WkTooltip>
    </div>
  `
})
RichContent.parameters = {
  docs: { description: { story: '`content` slot overrides the `title` prop for rich HTML inside the bubble.' } }
}
