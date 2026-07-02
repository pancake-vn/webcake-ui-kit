import WkAlert from '../../src/components/alert/Alert.vue'
import WkButton from '../../src/components/button/Button.vue'
import { WkiRocket } from '../../src/icons'

const TYPES = ['neutral', 'error', 'warning', 'info']

export default {
  title: 'Feedback/Alert',
  component: WkAlert,
  argTypes: {
    type: {
      control: { type: 'select' },
      options: TYPES
    },
    title: { control: 'text' },
    description: { control: 'text' },
    closable: { control: 'boolean' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Callout that draws user attention. Four semantic `type`s (neutral, error, warning, info), ' +
          'each with a default leading icon. `title` (default slot) and `description` set the two text ' +
          'lines; the `icon` slot overrides the default icon, the `action` slot holds a trailing button, ' +
          'and `closable` renders a dismiss button that emits `close`.'
      }
    }
  }
}

const Template = args => ({
  components: { WkAlert },
  setup() {
    return { args }
  },
  template: `<WkAlert v-bind="args" style="width: 400px" />`
})

export const Primary = Template.bind({})
Primary.args = { type: 'neutral', title: 'Item added successfully', description: 'Line 2', closable: false }
Primary.parameters = {
  docs: { description: { story: 'Default `neutral` type with title and description.' } }
}

export const AllVariants = () => ({
  components: { WkAlert },
  setup() {
    return { types: TYPES }
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px; width: 400px;">
      <WkAlert
        v-for="t in types"
        :key="t"
        :type="t"
        :title="'Item added successfully'"
        description="This is an alert with icon, title and description."
      />
    </div>
  `
})
AllVariants.parameters = {
  docs: { description: { story: 'All four semantic types with their default icons.' } }
}

export const Matrix = () => ({
  components: { WkAlert },
  setup() {
    return { types: TYPES }
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 24px; width: 420px;">
      <div v-for="t in types" :key="t" style="display: flex; flex-direction: column; gap: 8px;">
        <span style="font-weight: 500; color: #6b7280; text-transform: capitalize;">{{ t }}</span>
        <WkAlert :type="t" title="Title only" />
        <WkAlert :type="t" title="Title" description="With description" />
        <WkAlert :type="t" title="Dismissible" description="With close button" closable />
      </div>
    </div>
  `
})
Matrix.parameters = {
  docs: { description: { story: 'Each type across title-only, title+description, and closable states.' } }
}

export const WithAction = () => ({
  components: { WkAlert, WkButton },
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px; width: 420px;">
      <WkAlert type="error" title="Error! API call failed" description="This is an alert with icon, title and description." closable>
        <template #action>
          <WkButton variant="ghost" size="xs">Support</WkButton>
        </template>
      </WkAlert>
      <WkAlert type="neutral" title="Item added successfully">
        <template #action>
          <WkButton variant="ghost" size="xs">Label</WkButton>
        </template>
      </WkAlert>
    </div>
  `
})
WithAction.parameters = {
  docs: { description: { story: 'The `action` slot holds a trailing button; pairs with `closable`.' } }
}

export const WithCustomIcon = () => ({
  components: { WkAlert, WkiRocket },
  template: `
    <WkAlert type="info" title="Custom icon" description="Override the default icon via the icon slot." style="width: 400px">
      <template #icon>
        <WkiRocket :size="20" />
      </template>
    </WkAlert>
  `
})
WithCustomIcon.parameters = {
  docs: { description: { story: 'The `icon` slot replaces the default per-type icon.' } }
}

export const FocusVisible = () => ({
  components: { WkAlert },
  template: `
    <WkAlert type="neutral" title="Dismissible alert" description="Tab to the close button to see its focus ring." closable style="width: 400px" />
  `
})
FocusVisible.parameters = {
  docs: {
    description: {
      story: 'Tab to the close button to verify its `:focus-visible` ring.'
    }
  }
}
