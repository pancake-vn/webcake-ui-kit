import WkSelectTree from '../../src/components/select-tree/SelectTree.vue'

const TREE_DATA = [
  {
    value: 'frontend',
    label: 'Frontend',
    children: [
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue' },
      { value: 'angular', label: 'Angular' }
    ]
  },
  {
    value: 'backend',
    label: 'Backend',
    children: [
      { value: 'node', label: 'Node.js' },
      { value: 'python', label: 'Python', disabled: true },
      { value: 'go', label: 'Go' }
    ]
  },
  {
    value: 'design',
    label: 'Design',
    children: [
      { value: 'ui', label: 'UI Design' },
      { value: 'ux', label: 'UX Design' }
    ]
  }
]

const CHECKED_STRATEGIES = ['SHOW_CHILD', 'SHOW_PARENT', 'SHOW_ALL']

export default {
  title: 'Forms/SelectTree',
  component: WkSelectTree,
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['xs', 'sm', 'md', 'lg'] },
    showCheckedStrategy: { control: { type: 'inline-radio' }, options: CHECKED_STRATEGIES },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    loading: { control: 'boolean' },
    showSearch: { control: 'boolean' },
    allowClear: { control: 'boolean' },
    multiple: { control: 'boolean' },
    treeCheckable: { control: 'boolean' },
    checkStrictly: { control: 'boolean' },
    treeNodeSelectable: { control: 'boolean' },
    defaultExpandAll: { control: 'boolean' },
    placeholder: { control: 'text' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Tree-shaped select dropdown. Supports single selection, multi-select (`multiple`), and checkbox mode (`treeCheckable`).\n\n' +
          '**Tree data shape:**\n' +
          '```js\n' +
          '[\n' +
          '  { value, label, disabled?, children: [...] }\n' +
          ']\n' +
          '```\n\n' +
          '**`showCheckedStrategy`** (only for `treeCheckable`):\n' +
          '- `SHOW_CHILD` — emit leaf keys only (default)\n' +
          '- `SHOW_PARENT` — emit the highest checked ancestor when all children are checked\n' +
          '- `SHOW_ALL` — emit every checked node (parents + leaves)\n\n' +
          'Controlled via `:value` + `@change`. Inherits `size`, `disabled`, `error`, `placeholder`, `showSearch`, `allowClear` from BaseSelect.'
      }
    }
  }
}

// ── Primary (controls) ────────────────────────────────────────────────────────

const Template = args => ({
  components: { WkSelectTree },
  setup() {
    return { args, treeData: TREE_DATA }
  },
  template: `<div style="width:260px;"><WkSelectTree v-bind="args" :tree-data="treeData" /></div>`
})

export const Primary = Template.bind({})
Primary.args = { value: '', placeholder: 'Select a skill', size: 'md' }
Primary.parameters = {
  docs: { description: { story: 'Default single-select tree with Storybook controls.' } }
}

// ── Single ────────────────────────────────────────────────────────────────────

export const Single = () => ({
  components: { WkSelectTree },
  data() {
    return { selected: null, treeData: TREE_DATA }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;width:260px;">
      <WkSelectTree :value="selected" :tree-data="treeData" placeholder="Select a skill" allow-clear style="width:100%;" @change="selected = $event" />
      <code style="font-size:13px;">value = {{ JSON.stringify(selected) }}</code>
    </div>
  `
})
Single.parameters = {
  docs: {
    description: {
      story: 'Single-select — clicking a leaf closes the dropdown and emits the value. Parent nodes are expandable.'
    }
  }
}

// ── Multiple ──────────────────────────────────────────────────────────────────

export const Multiple = () => ({
  components: { WkSelectTree },
  data() {
    return { selected: ['react', 'go'], treeData: TREE_DATA }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;width:300px;">
      <WkSelectTree :multiple="true" :value="selected" :tree-data="treeData" placeholder="Select skills" allow-clear style="width:100%;" @change="selected = $event" />
      <code style="font-size:13px;">value = {{ JSON.stringify(selected) }}</code>
    </div>
  `
})
Multiple.parameters = {
  docs: {
    description: {
      story:
        '`multiple` — `:value` is an array. Selected items render as tags in the trigger. Click a selected node again to deselect.'
    }
  }
}

// ── Checkable ─────────────────────────────────────────────────────────────────

export const Checkable = () => ({
  components: { WkSelectTree },
  data() {
    return { selected: ['react', 'vue'], treeData: TREE_DATA }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;width:320px;">
      <WkSelectTree
        :tree-checkable="true"
        :value="selected"
        :tree-data="treeData"
        placeholder="Select skills"
        allow-clear
        style="width:100%;"
        @change="selected = $event"
      />
      <code style="font-size:13px;">value = {{ JSON.stringify(selected) }}</code>
      <p style="font-size:12px;color:#6b7280;margin:0;">
        Checking a parent selects all its children. <code>showCheckedStrategy</code> defaults to <code>SHOW_CHILD</code>.
      </p>
    </div>
  `
})
Checkable.parameters = {
  docs: {
    description: {
      story:
        '`treeCheckable` — renders checkboxes. Checking a parent node propagates down; all children checked → parent becomes checked. ' +
        'Half-checked state appears when only some children are selected.'
    }
  }
}

// ── ShowCheckedStrategy ───────────────────────────────────────────────────────

export const ShowCheckedStrategy = () => ({
  components: { WkSelectTree },
  data() {
    return {
      strategies: ['SHOW_CHILD', 'SHOW_PARENT', 'SHOW_ALL'],
      treeData: TREE_DATA,
      values: {
        SHOW_CHILD: ['react', 'vue', 'angular'],
        SHOW_PARENT: ['react', 'vue', 'angular'],
        SHOW_ALL: ['react', 'vue', 'angular']
      }
    }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:20px;align-items:flex-start;width:340px;">
      <div v-for="s in strategies" :key="s" style="width:100%;">
        <p style="font-size:12px;color:#6b7280;margin:0 0 6px;">showCheckedStrategy = <strong>{{ s }}</strong></p>
        <WkSelectTree
          :tree-checkable="true"
          :show-checked-strategy="s"
          :value="values[s]"
          :tree-data="treeData"
          style="width:100%;"
          @change="values[s] = $event"
        />
        <code style="font-size:11px;display:block;margin-top:4px;">{{ JSON.stringify(values[s]) }}</code>
      </div>
    </div>
  `
})
ShowCheckedStrategy.parameters = {
  docs: {
    description: {
      story:
        'All three strategies side-by-side. Check all children of **Frontend** to see the difference:\n\n' +
        '- `SHOW_CHILD` — emits `["react","vue","angular"]`\n' +
        '- `SHOW_PARENT` — emits `["frontend"]`\n' +
        '- `SHOW_ALL` — emits `["frontend","react","vue","angular"]`'
    }
  }
}

// ── CheckStrictly ─────────────────────────────────────────────────────────────

export const CheckStrictly = () => ({
  components: { WkSelectTree },
  data() {
    return { selected: ['frontend'], treeData: TREE_DATA }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;width:300px;">
      <WkSelectTree
        :tree-checkable="true"
        :check-strictly="true"
        :value="selected"
        :tree-data="treeData"
        placeholder="Select"
        allow-clear
        style="width:100%;"
        @change="selected = $event"
      />
      <code style="font-size:13px;">value = {{ JSON.stringify(selected) }}</code>
      <p style="font-size:12px;color:#6b7280;margin:0;">
        <code>checkStrictly</code>: parent and children check/uncheck independently.
      </p>
    </div>
  `
})
CheckStrictly.parameters = {
  docs: {
    description: {
      story:
        '`checkStrictly` — disables the cascade logic. Checking a parent does NOT check its children, and vice versa. ' +
        'Values are stored exactly as clicked.'
    }
  }
}

// ── NonSelectableParents ──────────────────────────────────────────────────────

export const NonSelectableParents = () => ({
  components: { WkSelectTree },
  data() {
    return { selected: null, treeData: TREE_DATA }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;width:280px;">
      <WkSelectTree
        :tree-node-selectable="false"
        :value="selected"
        :tree-data="treeData"
        placeholder="Select a leaf skill"
        allow-clear
        style="width:100%;"
        @change="selected = $event"
      />
      <code style="font-size:13px;">value = {{ JSON.stringify(selected) }}</code>
      <p style="font-size:12px;color:#6b7280;margin:0;">Clicking a parent label expands/collapses without selecting it.</p>
    </div>
  `
})
NonSelectableParents.parameters = {
  docs: {
    description: {
      story: '`treeNodeSelectable=false` — parent nodes act as expand toggles only. Only leaf nodes can be selected.'
    }
  }
}

// ── DefaultExpandAll ──────────────────────────────────────────────────────────

export const DefaultExpandAll = () => ({
  components: { WkSelectTree },
  data() {
    return { selected: null, treeData: TREE_DATA }
  },
  template: `
    <div style="width:280px;">
      <WkSelectTree
        :default-expand-all="true"
        :value="selected"
        :tree-data="treeData"
        placeholder="All branches open"
        style="width:100%;"
        @change="selected = $event"
      />
    </div>
  `
})
DefaultExpandAll.parameters = {
  docs: { description: { story: '`defaultExpandAll` — all parent nodes are expanded when the dropdown first opens.' } }
}

// ── Searchable ────────────────────────────────────────────────────────────────

export const Searchable = () => ({
  components: { WkSelectTree },
  data() {
    return { selected: null, treeData: TREE_DATA }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;width:300px;">
      <WkSelectTree
        :show-search="true"
        :value="selected"
        :tree-data="treeData"
        placeholder="Type to filter…"
        allow-clear
        style="width:100%;"
        @change="selected = $event"
      />
      <code style="font-size:13px;">value = {{ JSON.stringify(selected) }}</code>
      <p style="font-size:12px;color:#6b7280;margin:0;">
        Ancestors of matching nodes are kept visible to preserve tree context.
      </p>
    </div>
  `
})
Searchable.parameters = {
  docs: {
    description: {
      story:
        '`showSearch` — typing filters nodes by label. Matching nodes and their ancestors remain visible. ' +
        'The expanded state auto-follows search results.'
    }
  }
}

export const SearchableCheckable = () => ({
  components: { WkSelectTree },
  data() {
    return { selected: [], treeData: TREE_DATA }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;width:320px;">
      <WkSelectTree
        :tree-checkable="true"
        :show-search="true"
        :value="selected"
        :tree-data="treeData"
        placeholder="Type to filter…"
        allow-clear
        style="width:100%;"
        @change="selected = $event"
      />
      <code style="font-size:13px;">value = {{ JSON.stringify(selected) }}</code>
    </div>
  `
})
SearchableCheckable.parameters = {
  docs: {
    description: { story: 'Combined `treeCheckable` + `showSearch`. Search clears after a checkbox is toggled.' }
  }
}

// ── States ────────────────────────────────────────────────────────────────────

export const States = () => ({
  components: { WkSelectTree },
  data() {
    return { treeData: TREE_DATA }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;width:280px;">
      <div style="display:flex;align-items:center;gap:12px;width:100%;">
        <span style="color:#6b7280;font-size:12px;width:64px;">default</span>
        <WkSelectTree value="vue" :tree-data="treeData" style="flex:1;" />
      </div>
      <div style="display:flex;align-items:center;gap:12px;width:100%;">
        <span style="color:#6b7280;font-size:12px;width:64px;">error</span>
        <WkSelectTree :error="true" placeholder="Required" :tree-data="treeData" style="flex:1;" />
      </div>
      <div style="display:flex;align-items:center;gap:12px;width:100%;">
        <span style="color:#6b7280;font-size:12px;width:64px;">disabled</span>
        <WkSelectTree :disabled="true" value="vue" :tree-data="treeData" style="flex:1;" />
      </div>
      <div style="display:flex;align-items:center;gap:12px;width:100%;">
        <span style="color:#6b7280;font-size:12px;width:64px;">loading</span>
        <WkSelectTree :loading="true" placeholder="Loading…" :tree-data="treeData" style="flex:1;" />
      </div>
    </div>
  `
})
States.parameters = {
  docs: { description: { story: 'Default, error, disabled, and loading states.' } }
}

// ── AllSizes ──────────────────────────────────────────────────────────────────

export const AllSizes = () => ({
  components: { WkSelectTree },
  data() {
    return { treeData: TREE_DATA }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
      <div v-for="size in ['xs','sm','md','lg']" :key="size" style="display:flex;align-items:center;gap:12px;">
        <span style="color:#6b7280;font-size:12px;width:48px;">{{ size }}</span>
        <WkSelectTree :size="size" value="vue" :tree-data="treeData" style="width:220px;" />
      </div>
    </div>
  `
})
AllSizes.parameters = {
  docs: { description: { story: 'All four trigger sizes with a pre-selected leaf value.' } }
}

// ── CustomFieldNames ──────────────────────────────────────────────────────────

export const CustomFieldNames = () => ({
  components: { WkSelectTree },
  data() {
    return {
      selected: null,
      fieldNames: { label: 'name', value: 'id', children: 'items' },
      treeData: [
        {
          id: 'eng',
          name: 'Engineering',
          items: [
            { id: 'fe', name: 'Frontend', items: [] },
            { id: 'be', name: 'Backend', items: [] }
          ]
        },
        {
          id: 'ops',
          name: 'Operations',
          items: [
            { id: 'infra', name: 'Infrastructure', items: [] },
            { id: 'sec', name: 'Security', items: [] }
          ]
        }
      ]
    }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;width:300px;">
      <WkSelectTree
        :value="selected"
        :tree-data="treeData"
        :field-names="fieldNames"
        placeholder="Select a team"
        allow-clear
        style="width:100%;"
        @change="selected = $event"
      />
      <code style="font-size:13px;">value = {{ JSON.stringify(selected) }}</code>
      <pre style="font-size:11px;color:#6b7280;margin:0;">fieldNames = { label: 'name', value: 'id', children: 'items' }</pre>
    </div>
  `
})
CustomFieldNames.parameters = {
  docs: {
    description: {
      story:
        '`fieldNames` maps your data shape to the expected keys. ' +
        'Default: `{ label: "label", value: "value", children: "children" }`. Override any key to match your API response.'
    }
  }
}

// ── WithIcon ──────────────────────────────────────────────────────────────────

export const WithIcon = () => ({
  components: { WkSelectTree },
  data() {
    return { treeData: TREE_DATA }
  },
  template: `
    <div style="width:280px;">
      <WkSelectTree value="vue" :tree-data="treeData" style="width:100%;">
        <template #icon>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M7 1l6 11H1L7 1z" />
          </svg>
        </template>
      </WkSelectTree>
    </div>
  `
})
WithIcon.parameters = {
  docs: { description: { story: '`#icon` slot adds a leading icon inside the trigger — same API as `WkSelect`.' } }
}

// ── FocusVisible ──────────────────────────────────────────────────────────────

export const FocusVisible = () => ({
  components: { WkSelectTree },
  data() {
    return { treeData: TREE_DATA }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;width:280px;">
      <p style="font-size:12px;color:#6b7280;margin:0;">Tab to the select, then press Space or Enter to open.</p>
      <WkSelectTree value="vue" :tree-data="treeData" style="width:100%;" tabindex="0" />
    </div>
  `
})
FocusVisible.parameters = {
  docs: { description: { story: 'Keyboard-accessible: Tab to focus, Space/Enter to open.' } }
}
