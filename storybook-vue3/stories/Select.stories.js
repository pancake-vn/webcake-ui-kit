import WkSelect from '../../src/components/select/Select.vue'
import WkSelectOption from '../../src/components/select-option/SelectOption.vue'

const SIZES = ['xs', 'sm', 'md', 'lg']
const MODES = ['single', 'multiple', 'tags']
const FRUITS = ['Apple', 'Banana', 'Cherry', 'Durian', 'Elderberry', 'Fig', 'Grape']
const FRUIT_OBJS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'durian', label: 'Durian', disabled: true },
  { value: 'elderberry', label: 'Elderberry' }
]

export default {
  title: 'Forms/Select',
  component: WkSelect,
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: SIZES },
    mode: { control: { type: 'inline-radio' }, options: MODES },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    loading: { control: 'boolean' },
    searchable: { control: 'boolean' },
    placeholder: { control: 'text' },
    prepend: { control: 'text' },
    value: { control: 'text' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Custom select dropdown. Supports single, multiple, and tags modes. ' +
          'Pass options as strings or `{ value, label, disabled }` objects. ' +
          'Controlled via `:value` / `v-model` + `@change`. ' +
          '`searchable` or `filterOption` prop enables inline filtering. ' +
          '`mode="tags"` allows creating new options on the fly via Enter.'
      }
    }
  }
}

const Template = args => ({
  components: { WkSelect },
  setup() {
    return { args, fruits: FRUITS }
  },
  template: `<div style="width:240px;"><WkSelect v-bind="args" :options="fruits" /></div>`
})

export const Primary = Template.bind({})
Primary.args = { value: '', placeholder: 'Select a fruit', size: 'md' }

export const AllSizes = () => ({
  components: { WkSelect },
  data() {
    return { fruits: FRUITS }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
      <div v-for="size in ['xs','sm','md','lg']" :key="size" style="display:flex;align-items:center;gap:12px;">
        <span style="color:#6b7280;font-size:12px;width:48px;">{{ size }}</span>
        <WkSelect :size="size" value="Apple" :options="fruits" style="width:200px;" />
      </div>
    </div>
  `
})
AllSizes.parameters = {
  docs: { description: { story: 'All four sizes with a pre-selected value.' } }
}

export const States = () => ({
  components: { WkSelect },
  data() {
    return { fruits: FRUITS }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="color:#6b7280;font-size:12px;width:64px;">default</span>
        <WkSelect value="Apple" :options="fruits" style="width:200px;" />
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="color:#6b7280;font-size:12px;width:64px;">error</span>
        <WkSelect value="" error placeholder="Required" :options="fruits" style="width:200px;" />
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="color:#6b7280;font-size:12px;width:64px;">disabled</span>
        <WkSelect value="Apple" disabled :options="fruits" style="width:200px;" />
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="color:#6b7280;font-size:12px;width:64px;">loading</span>
        <WkSelect value="" loading placeholder="Loading…" :options="fruits" style="width:200px;" />
      </div>
    </div>
  `
})
States.parameters = {
  docs: { description: { story: 'Default, error, disabled, and loading states.' } }
}

export const Interactive = () => ({
  components: { WkSelect },
  data() {
    return { selected: '', fruits: FRUITS }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
      <WkSelect :value="selected" :options="fruits" placeholder="Pick a fruit" style="width:240px;" @change="selected = $event" />
      <code style="font-size:13px;">selected = "{{ selected }}"</code>
    </div>
  `
})
Interactive.parameters = {
  docs: { description: { story: 'Click to open, select an option. `@change` updates the value.' } }
}

export const WithPrepend = () => ({
  components: { WkSelect },
  data() {
    return { selected: 'USD', currencies: ['USD', 'EUR', 'GBP', 'JPY', 'AUD'] }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
      <WkSelect :value="selected" :options="currencies" prepend="Currency:" style="width:220px;" @change="selected = $event" />
      <code style="font-size:13px;">selected = "{{ selected }}"</code>
    </div>
  `
})
WithPrepend.parameters = {
  docs: { description: { story: '`prepend` shows a fixed label before the selected value.' } }
}

export const WithIcon = () => ({
  components: { WkSelect },
  data() {
    return { fruits: FRUITS }
  },
  template: `
    <WkSelect value="Apple" :options="fruits" style="width:240px;">
      <template #icon>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="7" cy="7" r="5" />
        </svg>
      </template>
    </WkSelect>
  `
})
WithIcon.parameters = {
  docs: { description: { story: '`#icon` slot adds a leading icon inside the trigger.' } }
}

export const ObjectOptions = () => ({
  components: { WkSelect },
  data() {
    return {
      selected: 'pro',
      plans: [
        { value: 'free', label: 'Free' },
        { value: 'pro', label: 'Pro' },
        { value: 'enterprise', label: 'Enterprise', disabled: true }
      ]
    }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
      <WkSelect :value="selected" :options="plans" style="width:200px;" @change="selected = $event" />
      <code style="font-size:13px;">selected = "{{ selected }}"</code>
    </div>
  `
})
ObjectOptions.parameters = {
  docs: { description: { story: 'Object options support custom labels and per-option `disabled` state.' } }
}

export const Multiple = () => ({
  components: { WkSelect },
  data() {
    return { selected: ['apple', 'cherry'], fruits: FRUIT_OBJS }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;width:300px;">
      <WkSelect mode="multiple" :value="selected" :options="fruits" placeholder="Pick fruits" style="width:100%;" @change="selected = $event" />
      <code style="font-size:13px;">selected = {{ JSON.stringify(selected) }}</code>
    </div>
  `
})
Multiple.parameters = {
  docs: {
    description: {
      story:
        '`mode="multiple"` — selected values are shown as tags. ' +
        'Click a selected option again to deselect. Click × on a tag to remove it.'
    }
  }
}

export const MultipleAllSizes = () => ({
  components: { WkSelect },
  data() {
    return { fruits: FRUIT_OBJS, selected: ['apple', 'cherry'] }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
      <div v-for="size in ['xs','sm','md','lg']" :key="size" style="display:flex;align-items:center;gap:12px;">
        <span style="color:#6b7280;font-size:12px;width:48px;">{{ size }}</span>
        <WkSelect mode="multiple" :size="size" :value="selected" :options="fruits" style="width:260px;" @change="selected = $event" />
      </div>
    </div>
  `
})
MultipleAllSizes.parameters = {
  docs: { description: { story: 'Multiple mode across all four sizes.' } }
}

export const Searchable = () => ({
  components: { WkSelect },
  data() {
    return { selected: '', fruits: FRUIT_OBJS }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;width:280px;">
      <WkSelect :value="selected" :options="fruits" searchable placeholder="Type to filter…" style="width:100%;" @change="selected = $event" />
      <code style="font-size:13px;">selected = "{{ selected }}"</code>
    </div>
  `
})
Searchable.parameters = {
  docs: {
    description: {
      story:
        '`searchable` — clicking or typing in the trigger filters the options list. ' +
        'Escape closes the dropdown. Input focus does not toggle the dropdown closed.'
    }
  }
}

export const SearchableMultiple = () => ({
  components: { WkSelect },
  data() {
    return { selected: [], fruits: FRUIT_OBJS }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;width:300px;">
      <WkSelect mode="multiple" :value="selected" :options="fruits" searchable placeholder="Type to filter…" style="width:100%;" @change="selected = $event" />
      <code style="font-size:13px;">selected = {{ JSON.stringify(selected) }}</code>
    </div>
  `
})
SearchableMultiple.parameters = {
  docs: { description: { story: 'Combined `mode="multiple"` + `searchable` — filter and pick multiple items.' } }
}

export const Tags = () => ({
  components: { WkSelect },
  data() {
    return { selected: ['Apple'], fruits: FRUITS }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;width:320px;">
      <WkSelect mode="tags" :value="selected" :options="fruits" placeholder="Type and press Enter…" style="width:100%;" @change="selected = $event" />
      <code style="font-size:13px;">selected = {{ JSON.stringify(selected) }}</code>
      <p style="font-size:12px;color:#6b7280;margin:0;">
        Type to filter existing options, or press <kbd>Enter</kbd> to create a new tag.
        Press <kbd>Backspace</kbd> on empty input to remove the last tag.
      </p>
    </div>
  `
})
Tags.parameters = {
  docs: {
    description: {
      story:
        '`mode="tags"` — like multiple, but typing and pressing Enter creates a new custom option. ' +
        'Backspace on an empty input removes the last tag. Custom tags are cleaned up when removed.'
    }
  }
}

export const CustomFilterOption = () => ({
  components: { WkSelect },
  data() {
    return {
      selected: '',
      people: [
        { value: 'jsmith', label: 'John Smith', role: 'Engineer' },
        { value: 'jdoe', label: 'Jane Doe', role: 'Designer' },
        { value: 'bwilson', label: 'Bob Wilson', role: 'Engineer' },
        { value: 'alee', label: 'Alice Lee', role: 'Manager' }
      ]
    }
  },
  methods: {
    filterByLabelOrRole(input, opt) {
      var q = input.toLowerCase()
      var person = this.people.find(function (p) {
        return p.value === opt.value
      })
      return opt.label.toLowerCase().indexOf(q) !== -1 || (person && person.role.toLowerCase().indexOf(q) !== -1)
    }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;width:300px;">
      <WkSelect
        :value="selected"
        :options="people"
        :filter-option="filterByLabelOrRole"
        placeholder="Filter by name or role…"
        style="width:100%;"
        @change="selected = $event"
      />
      <code style="font-size:13px;">selected = "{{ selected }}"</code>
      <p style="font-size:12px;color:#6b7280;margin:0;">
        Try typing "Engineer" or "Manager" to filter by role.
      </p>
    </div>
  `
})
CustomFilterOption.parameters = {
  docs: {
    description: {
      story:
        '`filterOption(input, option)` — custom filter predicate. ' +
        'Receives the typed text and the normalized option object. ' +
        'Return `true` to include the option. Enables the search input automatically.'
    }
  }
}

export const CustomSlot = () => ({
  components: { WkSelect, WkSelectOption },
  data() {
    return { selected: '' }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;width:280px;">
      <WkSelect :value="selected" placeholder="Pick a plan" style="width:100%;" @change="selected = $event">
        <WkSelectOption value="free" label="Free">
          <span>Free <span style="color:#6b7280;font-size:11px;">· $0/mo</span></span>
        </WkSelectOption>
        <WkSelectOption value="pro" label="Pro">
          <span>Pro <span style="color:#6b7280;font-size:11px;">· $12/mo</span></span>
        </WkSelectOption>
        <WkSelectOption value="enterprise" label="Enterprise">
          <span>Enterprise <span style="color:#6b7280;font-size:11px;">· Contact us</span></span>
        </WkSelectOption>
      </WkSelect>
      <code style="font-size:13px;">selected = "{{ selected }}"</code>
    </div>
  `
})
CustomSlot.parameters = {
  docs: {
    description: {
      story: 'Default slot accepts `<WkSelectOption>` elements directly for custom option content.'
    }
  }
}

export const FocusVisible = () => ({
  components: { WkSelect },
  data() {
    return { fruits: FRUITS }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
      <p style="font-size:12px;color:#6b7280;margin:0;">Tab to the select, then press Space or Enter to open.</p>
      <WkSelect value="Apple" :options="fruits" style="width:240px;" tabindex="0" />
    </div>
  `
})
FocusVisible.parameters = {
  docs: { description: { story: 'Keyboard-accessible: Tab to focus, Space/Enter to open.' } }
}
