import WkDatePicker from '../../src/components/date-picker/DatePicker.vue'

export default {
  title: 'Forms/DatePicker',
  component: WkDatePicker,
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    mode: { control: { type: 'inline-radio' }, options: ['single', 'range', 'multiple'] },
    placement: { control: 'text' },
    disabled: { control: 'boolean' },
    clearable: { control: 'boolean' },
    showTime: { control: 'boolean' },
    showFooter: { control: 'boolean' },
    showToday: { control: 'boolean' },
    placeholder: { control: 'text' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Date picker backed by dayjs. Supports `single`, `range`, and `multiple` selection modes. ' +
          'Pass a `Date`, ISO string, or timestamp as `:value` / `v-model`. ' +
          '`showTime` appends a time column and gates the emit behind a Confirm button. ' +
          '`valueFormat` controls the output format (default: Date objects).'
      }
    }
  }
}

const Template = args => ({
  components: { WkDatePicker },
  data() {
    return { args }
  },
  template: '<div style=""><WkDatePicker v-bind="args" /></div>'
})

export const Primary = Template.bind({})
Primary.args = { size: 'md', placeholder: 'Select date', clearable: true }

export const AllSizes = () => ({
  components: { WkDatePicker },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
      <div v-for="size in ['sm','md','lg']" :key="size" style="display:flex;align-items:center;gap:12px;">
        <span style="color:#6b7280;font-size:12px;width:32px;">{{ size }}</span>
        <WkDatePicker :size="size" value="2024-06-15" />
      </div>
    </div>
  `
})
AllSizes.parameters = {
  docs: { description: { story: 'All three trigger sizes: `sm`, `md`, `lg`.' } }
}

export const States = () => ({
  components: { WkDatePicker },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;min-height:100px;">
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="color:#6b7280;font-size:12px;width:80px;">default</span>
        <WkDatePicker value="2024-06-15" />
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="color:#6b7280;font-size:12px;width:80px;">placeholder</span>
        <WkDatePicker placeholder="Select a date" />
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="color:#6b7280;font-size:12px;width:80px;">disabled</span>
        <WkDatePicker value="2024-06-15" disabled />
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="color:#6b7280;font-size:12px;width:80px;">clearable</span>
        <WkDatePicker value="2024-06-15" clearable />
      </div>
    </div>
  `
})
States.parameters = {
  docs: { description: { story: 'Default, placeholder, disabled, and clearable states.' } }
}

export const Interactive = () => ({
  components: { WkDatePicker },
  data() {
    return { selected: null }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
      <WkDatePicker :value="selected" clearable placeholder="Select date" @change="selected = $event" />
      <code style="font-size:13px;">value = {{ selected ? JSON.stringify(selected) : 'null' }}</code>
    </div>
  `
})
Interactive.parameters = {
  docs: {
    description: { story: 'Click the trigger to open the calendar, pick a date. `@change` fires with a Date object.' }
  }
}

export const RangeMode = () => ({
  components: { WkDatePicker },
  data() {
    return { range: null }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
      <WkDatePicker mode="range" :value="range" clearable value-format="YYYY-MM-DD" @change="range = $event" />
      <code style="font-size:13px;">range = {{ range ? JSON.stringify(range) : 'null' }}</code>
      <p style="font-size:12px;color:#6b7280;margin:0;">Click to set start, click again to set end.</p>
    </div>
  `
})
RangeMode.parameters = {
  docs: { description: { story: '`mode="range"` — first click sets the start date, second click sets the end date.' } }
}

export const MultipleMode = () => ({
  components: { WkDatePicker },
  data() {
    return { dates: [] }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
      <WkDatePicker mode="multiple" :value="dates" clearable value-format="YYYY-MM-DD" @change="dates = $event" />
      <code style="font-size:13px;">dates = {{ JSON.stringify(dates) }}</code>
      <p style="font-size:12px;color:#6b7280;margin:0;">Click dates to toggle selection. Click again to deselect.</p>
    </div>
  `
})
MultipleMode.parameters = {
  docs: { description: { story: '`mode="multiple"` — each click toggles a date in or out of the selection.' } }
}

export const WithTimePicker = () => ({
  components: { WkDatePicker },
  data() {
    return { selected: null }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;min-height:420px;">
      <WkDatePicker :value="selected" show-time value-format="YYYY-MM-DD HH:mm" clearable @change="selected = $event" />
      <code style="font-size:13px;">value = {{ selected || 'null' }}</code>
      <p style="font-size:12px;color:#6b7280;margin:0;">Pick a date, then adjust the time. Click OK to confirm.</p>
    </div>
  `
})
WithTimePicker.parameters = {
  docs: {
    description: { story: '`showTime` appends a time column. The emit is gated behind the Confirm (OK) button.' }
  }
}

export const TwoMonths = () => ({
  components: { WkDatePicker },
  data() {
    return { range: null }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
      <WkDatePicker mode="range" :months="2" :value="range" value-format="YYYY-MM-DD" clearable @change="range = $event" />
      <code style="font-size:13px;">range = {{ range ? JSON.stringify(range) : 'null' }}</code>
    </div>
  `
})
TwoMonths.parameters = {
  docs: { description: { story: '`:months="2"` shows two side-by-side month panels — handy for range picking.' } }
}

export const FocusVisible = () => ({
  components: { WkDatePicker },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
      <p style="font-size:12px;color:#6b7280;margin:0;">Tab to the trigger, then press Space or Enter to open.</p>
      <WkDatePicker value="2024-06-15" clearable />
    </div>
  `
})
FocusVisible.parameters = {
  docs: {
    description: { story: 'Keyboard-accessible: Tab to focus the trigger, Space/Enter to open, Escape to close.' }
  }
}
