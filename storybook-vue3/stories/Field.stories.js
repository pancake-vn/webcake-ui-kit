import WkField from '../../src/components/field/Field.vue'
import WkInput from '../../src/components/input/Input.vue'
import WkSelect from '../../src/components/select/Select.vue'
import WkRadioGroup from '../../src/components/radio-group/RadioGroup.vue'
import WkCheckboxGroup from '../../src/components/checkbox-group/CheckboxGroup.vue'
import WkSlider from '../../src/components/slider/Slider.vue'

const FIELD_OPTIONS = [
  { label: 'Option 1', value: 'a' },
  { label: 'Option 2', value: 'b' },
  { label: 'Option 3', value: 'c' }
]

export default {
  title: 'Forms/Field',
  component: WkField,
  argTypes: {
    layout: { control: { type: 'inline-radio' }, options: ['vertical', 'horizontal'] },
    label: { control: 'text' },
    required: { control: 'boolean' },
    helpText: { control: 'text' },
    errorText: { control: 'text' },
    align: { control: { type: 'inline-radio' }, options: ['start', 'center'] }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Layout wrapper that pairs a label with a form control and an optional help/error message. ' +
          'Two `layout` modes: `vertical` (label stacked above) and `horizontal` (label beside, width via `labelWidth`). ' +
          '`errorText` overrides `helpText` and applies the error class. ' +
          'Supports `label`, `message`, and `message-icon` named slots for rich content.'
      }
    }
  }
}

export const Primary = () => ({
  components: { WkField, WkInput },
  data() {
    return { text: '' }
  },
  template: `
    <WkField label="Email address" help-text="We will never share your email." style="max-width:360px;">
      <WkInput v-model="text" placeholder="Enter your email..." />
    </WkField>
  `
})
Primary.parameters = {
  docs: { description: { story: 'Vertical layout with label and help text wrapping a `WkInput`.' } }
}

export const VerticalLayout = () => ({
  components: { WkField, WkInput, WkSelect, WkRadioGroup, WkCheckboxGroup, WkSlider },
  data() {
    return {
      text: '',
      select: '',
      radio: 'a',
      slider: 50,
      options: FIELD_OPTIONS
    }
  },
  template: `
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:24px;max-width:720px;">
      <WkField label="Label">
        <WkInput v-model="text" placeholder="Value" />
      </WkField>
      <WkField label="Label">
        <WkSelect :value="select" :options="options" @change="select = $event" />
      </WkField>
      <WkField label="Label" align="start">
        <WkRadioGroup :value="radio" :options="options" @change="radio = $event" />
      </WkField>
      <WkField label="Label" align="start">
        <div style="display:flex;flex-direction:column;gap:8px;">
          <WkCheckboxGroup label="Option 1" :model-value="true" />
          <WkCheckboxGroup label="Option 2" />
          <WkCheckboxGroup label="Option 3" />
        </div>
      </WkField>
      <WkField label="Label">
        <WkSlider :value="slider" @change="slider = $event" />
      </WkField>
    </div>
  `
})
VerticalLayout.parameters = {
  docs: {
    description: {
      story: 'Vertical layout wrapping `WkInput`, `WkSelect`, `WkRadioGroup`, `WkCheckboxGroup`, and `WkSlider`.'
    }
  }
}

export const HorizontalLayout = () => ({
  components: { WkField, WkInput, WkSelect, WkRadioGroup, WkCheckboxGroup, WkSlider },
  data() {
    return {
      text: '',
      select: '',
      radio: 'a',
      slider: 50,
      options: FIELD_OPTIONS
    }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:16px;max-width:520px;">
      <WkField layout="horizontal" label="Label">
        <WkInput v-model="text" placeholder="Value" />
      </WkField>
      <WkField layout="horizontal" label="Label">
        <WkSelect :value="select" :options="options" @change="select = $event" />
      </WkField>
      <WkField layout="horizontal" label="Label" align="start">
        <WkRadioGroup :value="radio" :options="options.slice(0, 2)" direction="horizontal" @change="radio = $event" />
      </WkField>
      <WkField layout="horizontal" label="Label" align="start">
        <div style="display:flex;flex-direction:column;gap:8px;">
          <WkCheckboxGroup label="Option 1" />
          <WkCheckboxGroup label="Option 2" />
          <WkCheckboxGroup label="Option 3" />
        </div>
      </WkField>
      <WkField layout="horizontal" label="Label">
        <WkSlider :value="slider" @change="slider = $event" />
      </WkField>
    </div>
  `
})
HorizontalLayout.parameters = {
  docs: {
    description: {
      story:
        'Horizontal layout. `labelWidth` (default 120px) sets the label column. `align="start"` top-aligns the label for multi-line controls.'
    }
  }
}

export const States = () => ({
  components: { WkField, WkInput, WkSelect },
  data() {
    return { options: FIELD_OPTIONS }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:16px;max-width:360px;">
      <WkField label="Default" help-text="Helper text appears here">
        <WkInput placeholder="Default state" />
      </WkField>
      <WkField label="Required" :required="true">
        <WkInput placeholder="Required field" />
      </WkField>
      <WkField label="Error" error-text="This field is required">
        <WkInput placeholder="Error state" :error="true" />
      </WkField>
      <WkField label="Category">
        <WkSelect :options="options" />
      </WkField>
    </div>
  `
})
States.parameters = {
  docs: { description: { story: 'Default (with help text), required (asterisk on label), and error states.' } }
}

export const ExampleForm = () => ({
  components: { WkField, WkInput, WkSelect },
  data() {
    return {
      name: '',
      email: '',
      category: '',
      options: FIELD_OPTIONS
    }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:16px;width:342px;">
      <WkField label="Name" required error-text="This field is required">
        <WkInput v-model="name" placeholder="Enter your name..." :error="!name" />
      </WkField>
      <WkField label="E-mail address" help-text="We'll send the confirmation here">
        <WkInput v-model="email" placeholder="Enter your e-mail address..." />
      </WkField>
      <WkField label="Category">
        <WkSelect :value="category" :options="options" @change="category = $event" />
      </WkField>
    </div>
  `
})
ExampleForm.parameters = {
  docs: { description: { story: 'A typical form combining multiple field states.' } }
}

export const WithSlots = () => ({
  components: { WkField, WkInput },
  data() {
    return { text: '' }
  },
  template: `
    <WkField style="max-width:360px;">
      <template #label><b>Custom</b> label via slot</template>
      <WkInput v-model="text" placeholder="Control" />
      <template #message>
        <span style="color:#3b82f6;">Custom message via slot</span>
      </template>
    </WkField>
  `
})
WithSlots.parameters = {
  docs: { description: { story: '`label` and `message` named slots accept rich HTML content.' } }
}
