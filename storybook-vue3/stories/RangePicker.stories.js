import WkRangePicker from '../../src/components/date-picker/RangePicker.vue'
import dayjs from '../../src/components/date-picker/generate/dayjs.js'

export default {
  title: 'Forms/RangePicker',
  component: WkRangePicker,
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['xs', 'sm', 'md', 'lg'] },
    picker: { control: { type: 'inline-radio' }, options: ['date', 'month', 'year'] },
    disabled: { control: 'boolean' },
    clearable: { control: 'boolean' },
    showYearJump: { control: 'boolean' },
    showFooter: { control: 'boolean' },
    placement: { control: 'text' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Date range picker backed by dayjs. One shared header spans two month panels; ' +
          'first click sets the start date, second click sets the end date. ' +
          'Pass `:value="[start, end]"` (Date, ISO string, or timestamp). ' +
          '`valueFormat` controls the emitted format (default: Date objects). ' +
          '`presets` renders quick-pick range buttons; `showFooter` adds editable inputs + Apply/Cancel.'
      }
    }
  }
}

const Template = args => ({
  components: { WkRangePicker },
  data() {
    return { args, range: null }
  },
  template:
    '<div style="min-height:360px;"><WkRangePicker v-bind="args" :value="range" @change="range = $event" /></div>'
})

export const Primary = Template.bind({})
Primary.args = { size: 'md', clearable: true, placeholder: ['Start date', 'End date'] }

export const AllSizes = () => ({
  components: { WkRangePicker },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
      <div v-for="size in ['xs','sm','md','lg']" :key="size" style="display:flex;align-items:center;gap:12px;width:420px;">
        <span style="color:#6b7280;font-size:12px;width:32px;">{{ size }}</span>
        <WkRangePicker :size="size" :value="['2024-06-01','2024-06-15']" />
      </div>
    </div>
  `
})
AllSizes.parameters = {
  docs: { description: { story: 'All four trigger sizes: `xs`, `sm`, `md`, `lg`.' } }
}

export const States = () => ({
  components: { WkRangePicker },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;width:420px;">
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="color:#6b7280;font-size:12px;width:80px;">default</span>
        <WkRangePicker :value="['2024-06-01','2024-06-15']" />
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="color:#6b7280;font-size:12px;width:80px;">placeholder</span>
        <WkRangePicker :placeholder="['Check in','Check out']" />
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="color:#6b7280;font-size:12px;width:80px;">disabled</span>
        <WkRangePicker :value="['2024-06-01','2024-06-15']" disabled />
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="color:#6b7280;font-size:12px;width:80px;">clearable</span>
        <WkRangePicker :value="['2024-06-01','2024-06-15']" clearable />
      </div>
    </div>
  `
})
States.parameters = {
  docs: { description: { story: 'Default, placeholder, disabled, and clearable states.' } }
}

export const Interactive = () => ({
  components: { WkRangePicker },
  data() {
    return { range: null }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;min-height:360px;">
      <WkRangePicker :value="range" clearable value-format="YYYY-MM-DD" @change="range = $event" />
      <code style="font-size:13px;">range = {{ range ? JSON.stringify(range) : 'null' }}</code>
      <p style="font-size:12px;color:#6b7280;margin:0;">Click to set start, click again to set end.</p>
    </div>
  `
})
Interactive.parameters = {
  docs: {
    description: {
      story: 'First click sets the start date, the second sets the end date; `@change` fires with the ordered pair.'
    }
  }
}

export const WithPresets = () => ({
  components: { WkRangePicker },
  data() {
    return {
      range: null,
      presets: [
        { label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()] },
        { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()] },
        { label: 'This Month', value: [dayjs().startOf('month'), dayjs().endOf('month')] }
      ]
    }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;min-height:360px;">
      <WkRangePicker :value="range" :presets="presets" clearable value-format="YYYY-MM-DD" @change="range = $event" />
      <code style="font-size:13px;">range = {{ range ? JSON.stringify(range) : 'null' }}</code>
    </div>
  `
})
WithPresets.parameters = {
  docs: { description: { story: '`presets` renders quick-pick range buttons down the left rail.' } }
}

export const WithFooter = () => ({
  components: { WkRangePicker },
  data() {
    return { range: null }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;min-height:400px;">
      <WkRangePicker :value="range" show-footer clearable value-format="YYYY-MM-DD" @change="range = $event" />
      <code style="font-size:13px;">range = {{ range ? JSON.stringify(range) : 'null' }}</code>
    </div>
  `
})
WithFooter.parameters = {
  docs: { description: { story: '`showFooter` adds editable start/end inputs plus Apply / Cancel actions.' } }
}

export const FocusVisible = () => ({
  components: { WkRangePicker },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
      <p style="font-size:12px;color:#6b7280;margin:0;">Tab to the trigger, then press Space or Enter to open.</p>
      <WkRangePicker :value="['2024-06-01','2024-06-15']" tabindex="0" clearable />
    </div>
  `
})
FocusVisible.parameters = {
  docs: { description: { story: 'Keyboard focus shows a visible focus ring via `:focus-visible`.' } }
}
