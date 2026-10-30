import WkSelect from '../../src/components/select/Select.vue'
import WkSelectOption from '../../src/components/select/Option.js'
import WkSelectOptionGroup from '../../src/components/select/OptionGroup.js'

const SIZES = ['xs', 'sm', 'md', 'lg']
const OPTION_SIZES = ['sm', 'md', 'lg']
const MODES = ['single', 'multiple', 'tags']

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Durian', 'Elderberry', 'Fig', 'Grape']

const FRUIT_OBJS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'durian', label: 'Durian', disabled: true },
  { value: 'elderberry', label: 'Elderberry' }
]

const PEOPLE = [
  { value: 'jsmith', label: 'John Smith', role: 'Engineer' },
  { value: 'jdoe', label: 'Jane Doe', role: 'Designer' },
  { value: 'bwilson', label: 'Bob Wilson', role: 'Engineer' },
  { value: 'alee', label: 'Alice Lee', role: 'Manager' }
]

export default {
  title: 'Forms/Select',
  component: WkSelect,
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: SIZES },
    optionSize: { control: { type: 'inline-radio' }, options: OPTION_SIZES },
    mode: { control: { type: 'inline-radio' }, options: MODES },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    loading: { control: 'boolean' },
    showSearch: { control: 'boolean' },
    placeholder: { control: 'text' },
    value: { control: 'text' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Custom select dropdown. Supports `single`, `multiple`, and `tags` modes.\n\n' +
          '**`:options` formats:**\n' +
          '- String array: `["Apple", "Banana"]` — value and label are the same string.\n' +
          '- Object array: `[{ value, label, disabled? }]`\n' +
          '- Grouped: `[{ label, options: [{ value, label }] }]` — renders a non-interactive group header.\n' +
          '- Divider: `{ type: "divider" }` anywhere in the array.\n\n' +
          '**Slot API:** use `<WkSelectOption>` and `<WkSelectOptionGroup>` in the default slot instead of `:options`.\n\n' +
          'Controlled via `:value` + `@change`.'
      }
    }
  }
}

// ── Primary (controls) ────────────────────────────────────────────────────────

const Template = args => ({
  components: { WkSelect },
  setup() {
    return { args, fruits: FRUITS }
  },
  template: `<div style="width:240px;"><WkSelect v-bind="args" :options="fruits" /></div>`
})

export const Primary = Template.bind({})
Primary.args = { value: '', placeholder: 'Select a fruit', size: 'md' }
Primary.parameters = {
  docs: {
    description: {
      story: 'Default single-select with Storybook controls. Bind `:value` + `@change` for the controlled pattern.'
    }
  }
}

// ── Sizes & States ────────────────────────────────────────────────────────────

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

// ── Interactive ───────────────────────────────────────────────────────────────

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
  docs: {
    description: {
      story: 'Controlled pattern: `:value` + `@change`. `@change` emits the selected `value` (not the option object).'
    }
  }
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

// ── :options formats ──────────────────────────────────────────────────────────

export const OptionSchema = () => ({
  components: { WkSelect },
  data() {
    return {
      selected: '',
      options: [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana', disabled: true },
        { type: 'divider' },
        {
          label: 'Berries',
          options: [
            { value: 'cherry', label: 'Cherry' },
            { value: 'grape', label: 'Grape' }
          ]
        }
      ]
    }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
      <WkSelect :value="selected" :options="options" placeholder="Pick one" style="width:220px;" @change="selected = $event" />
      <code style="font-size:13px;">selected = "{{ selected }}"</code>
    </div>
  `
})
OptionSchema.parameters = {
  docs: {
    description: {
      story: `
Full option object schema:

\`\`\`js
// Regular item
{ value: 'apple', label: 'Apple', disabled: false }
//  value    — required; unique identifier, emitted by @change
//  label    — display text; falls back to String(value) if omitted
//  disabled — prevents selection + grays out the row

// Divider
{ type: 'divider' }

// Group header  (detected by presence of the options array key)
{
  label: 'Berries',          // group header text
  options: [                 // children — any regular item objects
    { value: 'cherry', label: 'Cherry' },
  ],
}
\`\`\`
      `.trim()
    }
  }
}

export const StringOptions = () => ({
  components: { WkSelect },
  data() {
    return { selected: '', fruits: FRUITS }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
      <WkSelect :value="selected" :options="fruits" placeholder="Pick a fruit" style="width:200px;" @change="selected = $event" />
      <code style="font-size:13px;">selected = "{{ selected }}"</code>
      <pre style="font-size:11px;color:#6b7280;margin:0;">options = ['Apple', 'Banana', ...]</pre>
    </div>
  `
})
StringOptions.parameters = {
  docs: { description: { story: 'String array — `value` and `label` are both the string itself.' } }
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
      <pre style="font-size:11px;color:#6b7280;margin:0;">{ value, label, disabled? }</pre>
    </div>
  `
})
ObjectOptions.parameters = {
  docs: {
    description: {
      story:
        'Object options: `{ value, label, disabled? }`. `@change` emits the `value` field. ' +
        '`disabled: true` grays the row and prevents selection.'
    }
  }
}

export const GroupedOptions = () => ({
  components: { WkSelect },
  data() {
    return {
      selected: '',
      options: [
        {
          label: 'Tropical',
          options: [
            { value: 'banana', label: 'Banana' },
            { value: 'durian', label: 'Durian' },
            { value: 'mango', label: 'Mango' }
          ]
        },
        {
          label: 'Berries',
          options: [
            { value: 'cherry', label: 'Cherry' },
            { value: 'elderberry', label: 'Elderberry' },
            { value: 'grape', label: 'Grape' }
          ]
        }
      ]
    }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
      <WkSelect :value="selected" :options="options" placeholder="Pick a fruit" style="width:220px;" @change="selected = $event" />
      <code style="font-size:13px;">selected = "{{ selected }}"</code>
      <pre style="font-size:11px;color:#6b7280;margin:0;">{ label, options: [{ value, label }] }</pre>
    </div>
  `
})
GroupedOptions.parameters = {
  docs: {
    description: {
      story:
        'Group object: `{ label: string, options: OptionObject[] }`. ' +
        'Detected by the presence of the `options` array key — renders a non-interactive group header above its children.'
    }
  }
}

export const WithDivider = () => ({
  components: { WkSelect },
  data() {
    return {
      selected: '',
      options: [
        { value: 'edit', label: 'Edit' },
        { value: 'duplicate', label: 'Duplicate' },
        { type: 'divider' },
        { value: 'archive', label: 'Archive' },
        { value: 'delete', label: 'Delete' }
      ]
    }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
      <WkSelect :value="selected" :options="options" placeholder="Choose action" style="width:200px;" @change="selected = $event" />
      <code style="font-size:13px;">selected = "{{ selected }}"</code>
      <pre style="font-size:11px;color:#6b7280;margin:0;">{ type: 'divider' }</pre>
    </div>
  `
})
WithDivider.parameters = {
  docs: {
    description: { story: '`{ type: "divider" }` anywhere in the `:options` array renders a horizontal divider.' }
  }
}

export const GroupsAndDividers = () => ({
  components: { WkSelect },
  data() {
    return {
      selected: '',
      options: [
        {
          label: 'Actions',
          options: [
            { value: 'edit', label: 'Edit' },
            { value: 'duplicate', label: 'Duplicate' }
          ]
        },
        { type: 'divider' },
        {
          label: 'Danger zone',
          options: [
            { value: 'archive', label: 'Archive' },
            { value: 'delete', label: 'Delete' }
          ]
        }
      ]
    }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
      <WkSelect :value="selected" :options="options" placeholder="Choose action" style="width:200px;" @change="selected = $event" />
      <code style="font-size:13px;">selected = "{{ selected }}"</code>
    </div>
  `
})
GroupsAndDividers.parameters = {
  docs: { description: { story: 'Groups and dividers mixed in the same `:options` array.' } }
}

// ── Multiple & Tags ───────────────────────────────────────────────────────────

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
        '`mode="multiple"` — `:value` is an array of values. Selected items render as inline tags. ' +
        'Click an active option again to deselect; click × on a tag to remove.'
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
        <WkSelect mode="multiple" :size="size" :value="selected" :options="fruits" style="width:260px;" />
      </div>
    </div>
  `
})
MultipleAllSizes.parameters = {
  docs: { description: { story: 'Multiple mode across all four trigger sizes.' } }
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
        '`mode="tags"` — like multiple, but typing + Enter creates a new custom option on the fly. ' +
        'Backspace on empty input removes the last tag.'
    }
  }
}

// ── Search ────────────────────────────────────────────────────────────────────

export const Searchable = () => ({
  components: { WkSelect },
  data() {
    return { selected: '', fruits: FRUIT_OBJS }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;width:280px;">
      <WkSelect :value="selected" :options="fruits" show-search placeholder="Type to filter…" style="width:100%;" @change="selected = $event" />
      <code style="font-size:13px;">selected = "{{ selected }}"</code>
    </div>
  `
})
Searchable.parameters = {
  docs: {
    description: {
      story: '`show-search` — the trigger becomes an input that filters options by label. Escape closes the dropdown.'
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
      <WkSelect mode="multiple" :value="selected" :options="fruits" show-search placeholder="Type to filter…" style="width:100%;" @change="selected = $event" />
      <code style="font-size:13px;">selected = {{ JSON.stringify(selected) }}</code>
    </div>
  `
})
SearchableMultiple.parameters = {
  docs: { description: { story: 'Combined `mode="multiple"` + `show-search`.' } }
}

export const CustomFilterOption = () => ({
  components: { WkSelect },
  data() {
    return { selected: '', people: PEOPLE }
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
      <p style="font-size:12px;color:#6b7280;margin:0;">Try typing "Engineer" or "Manager" to filter by role.</p>
    </div>
  `
})
CustomFilterOption.parameters = {
  docs: {
    description: {
      story:
        '`filterOption(input, option)` — custom filter predicate. ' +
        'Receives typed text and the normalized option object. Return `true` to include. Enables the search input automatically.'
    }
  }
}

// ── Slot API ──────────────────────────────────────────────────────────────────

export const SlotOptions = () => ({
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
        <WkSelectOption value="enterprise" label="Enterprise" :disabled="true">
          <span>Enterprise <span style="color:#6b7280;font-size:11px;">· Contact us</span></span>
        </WkSelectOption>
      </WkSelect>
      <code style="font-size:13px;">selected = "{{ selected }}"</code>
    </div>
  `
})
SlotOptions.parameters = {
  docs: {
    description: {
      story:
        'Default slot accepts `<WkSelectOption value label? disabled?>` elements for custom row content. ' +
        '`label` is what appears in the trigger after selection; when omitted, the text content of the default slot is used. ' +
        '`disabled` prevents selection.'
    }
  }
}

export const SlotOptionGroups = () => ({
  components: { WkSelect, WkSelectOption, WkSelectOptionGroup },
  data() {
    return { selected: '' }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;width:280px;">
      <WkSelect :value="selected" placeholder="Pick a fruit" style="width:100%;" @change="selected = $event">
        <WkSelectOptionGroup label="Tropical">
          <WkSelectOption value="banana" label="Banana" />
          <WkSelectOption value="durian" label="Durian" />
          <WkSelectOption value="mango" label="Mango" />
        </WkSelectOptionGroup>
        <WkSelectOptionGroup label="Berries">
          <WkSelectOption value="cherry" label="Cherry" />
          <WkSelectOption value="elderberry" label="Elderberry" />
          <WkSelectOption value="grape" label="Grape" />
        </WkSelectOptionGroup>
      </WkSelect>
      <code style="font-size:13px;">selected = "{{ selected }}"</code>
    </div>
  `
})
SlotOptionGroups.parameters = {
  docs: {
    description: {
      story:
        '`<WkSelectOptionGroup label>` wraps options under a non-interactive group header. ' +
        'Nest `<WkSelectOption>` elements directly inside.'
    }
  }
}

export const SlotMixed = () => ({
  components: { WkSelect, WkSelectOption, WkSelectOptionGroup },
  data() {
    return { selected: '' }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;width:280px;">
      <WkSelect :value="selected" placeholder="Choose" style="width:100%;" @change="selected = $event">
        <WkSelectOption value="dashboard" label="Dashboard" />
        <WkSelectOption value="analytics" label="Analytics" />
        <WkSelectOptionGroup label="Settings">
          <WkSelectOption value="profile" label="Profile" />
          <WkSelectOption value="billing" label="Billing" />
          <WkSelectOption value="team" label="Team" :disabled="true" />
        </WkSelectOptionGroup>
      </WkSelect>
      <code style="font-size:13px;">selected = "{{ selected }}"</code>
    </div>
  `
})
SlotMixed.parameters = {
  docs: {
    description: {
      story: 'Flat options and grouped options can coexist in the same default slot.'
    }
  }
}

// ── Misc ──────────────────────────────────────────────────────────────────────

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

export const OptionSizes = () => ({
  components: { WkSelect },
  data() {
    return { fruits: FRUITS, optionSizes: OPTION_SIZES }
  },
  template: `
    <div style="display:flex;gap:16px;align-items:flex-start;">
      <div v-for="os in optionSizes" :key="os" style="display:flex;flex-direction:column;gap:8px;align-items:flex-start;width:200px;">
        <span style="color:#6b7280;font-size:12px;">optionSize = {{ os }}</span>
        <WkSelect value="Apple" :option-size="os" :options="fruits" style="width:180px;" />
      </div>
    </div>
  `
})
OptionSizes.parameters = {
  docs: {
    description: {
      story:
        '`optionSize` (`sm` · `md` · `lg`) controls row density in the dropdown — ' +
        'independent of the trigger `size`. Open each to compare.'
    }
  }
}
