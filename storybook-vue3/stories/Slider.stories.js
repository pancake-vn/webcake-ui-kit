import WkSlider from '../../src/components/slider/Slider.vue'

export default {
  title: 'Forms/Slider',
  component: WkSlider,
  argTypes: {
    orientation: { control: { type: 'inline-radio' }, options: ['horizontal', 'vertical'] },
    disabled: { control: 'boolean' },
    range: { control: 'boolean' },
    value: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Drag slider for selecting a numeric value or range. `range` enables a two-thumb mode bound to `rangeValue: [min, max]`. ' +
          'Supports mouse, touch, and keyboard (Arrow keys, Home, End). Emits `change` and `input` with the new value.'
      }
    }
  }
}

const Template = args => ({
  components: { WkSlider },
  setup() {
    return { args }
  },
  template: `<div style="width:280px;padding:20px 0;"><WkSlider v-bind="args" /></div>`
})

export const Primary = Template.bind({})
Primary.args = { value: 50, min: 0, max: 100, step: 1 }

export const AllVariants = () => ({
  components: { WkSlider },
  template: `
    <div style="display:flex;flex-direction:column;gap:32px;align-items:flex-start;width:300px;padding:8px 0;">
      <div style="display:flex;flex-direction:column;gap:8px;width:100%;">
        <span style="color:#6b7280;font-size:12px;">default (value: 30)</span>
        <WkSlider :value="30" />
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;width:100%;">
        <span style="color:#6b7280;font-size:12px;">disabled (value: 60)</span>
        <WkSlider :value="60" disabled />
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;width:100%;">
        <span style="color:#6b7280;font-size:12px;">range (rangeValue: [20, 70])</span>
        <WkSlider range :range-value="[20, 70]" />
      </div>
    </div>
  `
})
AllVariants.parameters = {
  docs: { description: { story: 'Standard, disabled, and range configurations.' } }
}

export const Interactive = () => ({
  components: { WkSlider },
  data() {
    return { val: 40 }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;width:300px;">
      <WkSlider :value="val" @change="val = $event" />
      <code style="font-size:13px;">value = {{ val }}</code>
    </div>
  `
})
Interactive.parameters = {
  docs: { description: { story: 'Drag the thumb or use keyboard arrows. `@change` updates the value.' } }
}

export const InteractiveRange = () => ({
  components: { WkSlider },
  data() {
    return { range: [20, 75] }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;width:300px;">
      <WkSlider range :range-value="range" @change="range = $event" />
      <code style="font-size:13px;">range = {{ range }}</code>
    </div>
  `
})
InteractiveRange.parameters = {
  docs: {
    description: { story: 'Two-thumb range slider. `rangeValue` is `[min, max]`; `@change` emits the updated pair.' }
  }
}

export const VerticalOrientation = () => ({
  components: { WkSlider },
  data() {
    return { val: 60 }
  },
  template: `
    <div style="display:flex;gap:40px;align-items:center;">
      <div style="height:200px;padding:0 8px;">
        <WkSlider orientation="vertical" :value="val" @change="val = $event" />
      </div>
      <code style="font-size:13px;">value = {{ val }}</code>
    </div>
  `
})
VerticalOrientation.parameters = {
  docs: { description: { story: 'Vertical orientation — drag vertically or use arrow keys.' } }
}

export const FocusVisible = () => ({
  components: { WkSlider },
  template: `
    <div style="display:flex;flex-direction:column;gap:32px;width:300px;padding:8px 0;">
      <WkSlider :value="50" />
      <WkSlider range :range-value="[25, 75]" />
    </div>
  `
})
FocusVisible.parameters = {
  docs: { description: { story: 'Tab to each thumb to verify `:focus-visible` ring.' } }
}
