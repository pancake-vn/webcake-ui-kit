import WkProgress from '../../src/components/progress/Progress.vue'

export default {
  title: 'Display/Progress',
  component: WkProgress,
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    max: { control: { type: 'number', min: 1 } }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Horizontal progress bar. `value` is clamped to `[0, max]`. ' +
          'Set `max` to any positive number — percent is computed as `value / max * 100`. ' +
          'Fully accessible via `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.'
      }
    }
  }
}

const Template = args => ({
  components: { WkProgress },
  data() {
    return { args }
  },
  template: '<div style="width:320px;"><WkProgress v-bind="args" /></div>'
})

export const Primary = Template.bind({})
Primary.args = { value: 60, max: 100 }

export const AllVariants = () => ({
  components: { WkProgress },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;width:320px;">
      <div v-for="pct in [0, 25, 50, 75, 100]" :key="pct" style="display:flex;align-items:center;gap:12px;">
        <span style="color:#6b7280;font-size:12px;width:36px;text-align:right;">{{ pct }}%</span>
        <WkProgress :value="pct" style="flex:1;" />
      </div>
    </div>
  `
})
AllVariants.parameters = {
  docs: { description: { story: '0 %, 25 %, 50 %, 75 %, and 100 % fill levels.' } }
}

export const Interactive = () => ({
  components: { WkProgress },
  data() {
    return { current: 40 }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:16px;width:320px;">
      <WkProgress :value="current" />
      <div style="display:flex;align-items:center;gap:12px;">
        <input type="range" min="0" max="100" step="1" :value="current" @input="current = Number($event.target.value)" style="flex:1;" />
        <code style="font-size:13px;width:40px;">{{ current }}%</code>
      </div>
    </div>
  `
})
Interactive.parameters = {
  docs: { description: { story: 'Drag the slider to see the bar animate smoothly via `transition: width 0.2s ease`.' } }
}

export const CustomMax = () => ({
  components: { WkProgress },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;width:320px;">
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="color:#6b7280;font-size:12px;width:80px;">3 of 12</span>
        <WkProgress :value="3" :max="12" style="flex:1;" />
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="color:#6b7280;font-size:12px;width:80px;">7 of 12</span>
        <WkProgress :value="7" :max="12" style="flex:1;" />
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="color:#6b7280;font-size:12px;width:80px;">12 of 12</span>
        <WkProgress :value="12" :max="12" style="flex:1;" />
      </div>
    </div>
  `
})
CustomMax.parameters = {
  docs: {
    description: { story: '`max` can be any positive number — useful for step-based progress (e.g. 3/12 steps).' }
  }
}
