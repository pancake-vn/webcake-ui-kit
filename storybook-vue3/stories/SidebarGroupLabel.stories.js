import SidebarGroupLabel from '../../src/components/sidebar-group-label/SidebarGroupLabel.vue'
import { WkiPlus } from '../../src/icons'

export default {
  title: 'Layout/SidebarGroupLabel',
  component: SidebarGroupLabel,
  argTypes: {
    label: { control: 'text' },
    collapsible: { control: 'boolean' },
    expanded: { control: 'boolean' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Section header for sidebar groups. When `collapsible` is true, renders a `<button>` with a chevron ' +
          'that emits `toggle` on click — the parent controls the `expanded` state. ' +
          'The `#action` slot adds trailing controls (e.g. an add button).'
      }
    }
  }
}

const Template = args => ({
  components: { SidebarGroupLabel },
  setup() {
    return { args }
  },
  template: `<div style="width:240px;"><SidebarGroupLabel v-bind="args" /></div>`
})

export const Primary = Template.bind({})
Primary.args = { label: 'Projects', collapsible: false }

export const AllVariants = () => ({
  components: { SidebarGroupLabel },
  template: `
    <div style="display:flex;flex-direction:column;gap:8px;width:240px;">
      <div style="display:flex;flex-direction:column;gap:4px;">
        <span style="color:#6b7280;font-size:11px;">static</span>
        <SidebarGroupLabel label="Favorites" />
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;">
        <span style="color:#6b7280;font-size:11px;">collapsible + expanded</span>
        <SidebarGroupLabel label="Projects" collapsible :expanded="true" />
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;">
        <span style="color:#6b7280;font-size:11px;">collapsible + collapsed</span>
        <SidebarGroupLabel label="Projects" collapsible :expanded="false" />
      </div>
    </div>
  `
})
AllVariants.parameters = {
  docs: { description: { story: 'Static, collapsible-expanded, and collapsible-collapsed states.' } }
}

export const Interactive = () => ({
  components: { SidebarGroupLabel },
  data() {
    return { open: true }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:8px;width:240px;">
      <SidebarGroupLabel label="Projects" collapsible :expanded="open" @toggle="open = !open" />
      <code style="font-size:13px;">expanded = {{ open }}</code>
    </div>
  `
})
Interactive.parameters = {
  docs: { description: { story: 'Click the label to toggle collapsed state via `@toggle`.' } }
}

export const WithActionSlot = () => ({
  components: { SidebarGroupLabel, WkiPlus },
  template: `
    <div style="width:240px;">
      <SidebarGroupLabel label="Projects">
        <template #action>
          <button style="background:none;border:none;cursor:pointer;padding:2px;color:inherit;line-height:1;">
            <PlusIcon :size="14" />
          </button>
        </template>
      </SidebarGroupLabel>
    </div>
  `
})
WithActionSlot.parameters = {
  docs: { description: { story: '`#action` slot appends trailing controls to the right of the label.' } }
}

export const FocusVisible = () => ({
  components: { SidebarGroupLabel },
  template: `
    <div style="display:flex;flex-direction:column;gap:8px;width:240px;">
      <SidebarGroupLabel label="Click me" collapsible :expanded="true" />
      <SidebarGroupLabel label="And me" collapsible :expanded="false" />
    </div>
  `
})
FocusVisible.parameters = {
  docs: { description: { story: 'Tab to the collapsible triggers to verify `:focus-visible` ring.' } }
}
