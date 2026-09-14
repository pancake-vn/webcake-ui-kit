import { WkItem } from '../../src/index.js'

export default {
  title: 'Components/Item',
  component: WkItem,
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    variant: {
      control: 'select',
      options: ['default', 'muted', 'outline']
    },
    size: {
      control: 'select',
      options: ['md', 'sm']
    },
    layout: {
      control: 'select',
      options: ['horizontal', 'vertical']
    },
    active: { control: 'boolean' },
    asChild: { control: 'boolean' },
    width: { control: 'text' },
    showRadio: { control: 'boolean' },
    showCheckbox: { control: 'boolean' },
    showCheckboxSuffix: { control: 'boolean' },
    checked: { control: 'boolean' }
  }
}

const Template = args => ({
  components: { WkItem },
  setup() {
    return { args }
  },
  template: '<WkItem v-bind="args" />'
})

export const Primary = Template.bind({})
Primary.args = {
  label: 'Item Label',
  variant: 'default',
  size: 'md'
}

export const AllVariants = () => ({
  components: { WkItem },
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px">
      <div>
        <h4 style="margin-bottom: 8px">Variants</h4>
        <WkItem label="Default variant" variant="default" />
        <WkItem label="Muted variant" variant="muted" style="margin-top: 8px" />
        <WkItem label="Outline variant" variant="outline" style="margin-top: 8px" />
      </div>

      <div>
        <h4 style="margin-bottom: 8px">Sizes</h4>
        <WkItem label="Medium size" size="md" />
        <WkItem label="Small size" size="sm" style="margin-top: 8px" />
      </div>

      <div>
        <h4 style="margin-bottom: 8px">Active State</h4>
        <WkItem label="Normal item" />
        <WkItem label="Active item" active style="margin-top: 8px" />
      </div>

      <div>
        <h4 style="margin-bottom: 8px">Layouts</h4>
        <WkItem label="Horizontal layout" description="Description text" layout="horizontal" />
        <WkItem label="Vertical layout" description="Description text" layout="vertical" style="margin-top: 8px" />
      </div>
    </div>
  `
})

export const Matrix = () => ({
  components: { WkItem },
  template: `
    <div style="display: flex; flex-direction: column; gap: 24px">
      <div>
        <h4 style="margin-bottom: 12px">Variant × Size Matrix</h4>
        <table style="border-collapse: separate; border-spacing: 8px">
          <thead>
            <tr>
              <th></th>
              <th>Medium</th>
              <th>Small</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Default</strong></td>
              <td><WkItem label="Default MD" variant="default" size="md" /></td>
              <td><WkItem label="Default SM" variant="default" size="sm" /></td>
            </tr>
            <tr>
              <td><strong>Muted</strong></td>
              <td><WkItem label="Muted MD" variant="muted" size="md" /></td>
              <td><WkItem label="Muted SM" variant="muted" size="sm" /></td>
            </tr>
            <tr>
              <td><strong>Outline</strong></td>
              <td><WkItem label="Outline MD" variant="outline" size="md" /></td>
              <td><WkItem label="Outline SM" variant="outline" size="sm" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})

export const WithPrefixSuffix = () => ({
  components: { WkItem },
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px">
      <WkItem label="With prefix">
        <template #prefix>
          <span style="width: 20px; height: 20px; background: #3b82f6; border-radius: 50%"></span>
        </template>
      </WkItem>

      <WkItem label="With suffix">
        <template #suffix>
          <span style="padding: 2px 8px; background: #10b981; color: white; border-radius: 4px; font-size: 12px">New</span>
        </template>
      </WkItem>

      <WkItem label="With both">
        <template #prefix>
          <span style="width: 20px; height: 20px; background: #3b82f6; border-radius: 50%"></span>
        </template>
        <template #suffix>
          <span>→</span>
        </template>
      </WkItem>
    </div>
  `
})

export const WithCustomSlot = () => ({
  components: { WkItem },
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px">
      <WkItem>
        <div style="display: flex; flex-direction: column; gap: 4px">
          <div style="font-weight: 600">Custom Content</div>
          <div style="font-size: 14px; color: #6b7280">Completely custom slot content</div>
        </div>
      </WkItem>

      <WkItem variant="muted">
        <template #prefix>
          <span style="font-size: 24px">📧</span>
        </template>
        <div>
          <div style="font-weight: 600">Email Notification</div>
          <div style="font-size: 12px; color: #6b7280; margin-top: 2px">john@example.com</div>
        </div>
        <template #suffix>
          <span style="font-size: 12px; color: #6b7280">2m ago</span>
        </template>
      </WkItem>
    </div>
  `
})

export const WithWidth = () => ({
  components: { WkItem },
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start">
      <WkItem label="Width: 200px" width="200px" />
      <WkItem label="Width: 300" width={300} />
      <WkItem label="Width: 100%" width="100%" />
    </div>
  `
})

export const AsChild = () => ({
  components: { WkItem },
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px">
      <div>
        <h4 style="margin-bottom: 8px">Normal (clickable)</h4>
        <WkItem label="Interactive item" />
      </div>

      <div>
        <h4 style="margin-bottom: 8px">AsChild mode (non-interactive)</h4>
        <WkItem label="Non-interactive item" asChild variant="outline" />
        <WkItem label="Non-interactive muted" asChild variant="muted" style="margin-top: 8px" />
      </div>
    </div>
  `
})

export const FocusVisible = () => ({
  components: { WkItem },
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px">
      <p style="margin-bottom: 8px; color: #6b7280">Press Tab to see focus outline</p>
      <WkItem label="Focusable item 1" tabindex="0" />
      <WkItem label="Focusable item 2" tabindex="0" variant="muted" />
      <WkItem label="Focusable item 3" tabindex="0" variant="outline" />
    </div>
  `
})

export const WithRadio = () => ({
  components: { WkItem },
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px">
      <h4 style="margin-bottom: 8px">Items with Radio</h4>
      <WkItem label="Option 1" showRadio :checked="true" />
      <WkItem label="Option 2" showRadio :checked="false" />
      <WkItem label="Option 3" description="With description" showRadio :checked="false" />
    </div>
  `
})

export const WithCheckbox = () => ({
  components: { WkItem },
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px">
      <h4 style="margin-bottom: 8px">Items with Checkbox (prefix)</h4>
      <WkItem label="Task 1" showCheckbox :checked="true" />
      <WkItem label="Task 2" showCheckbox :checked="false" />
      <WkItem label="Task 3" description="Completed task" showCheckbox :checked="true" variant="muted" />

      <h4 style="margin-bottom: 8px; margin-top: 16px">Items with Checkbox (suffix)</h4>
      <WkItem label="Setting 1" showCheckboxSuffix :checked="false" />
      <WkItem label="Setting 2" showCheckboxSuffix :checked="true" />
      <WkItem label="Setting 3" description="With description" showCheckboxSuffix :checked="true" />
    </div>
  `
})

export const WithCheckboxAndContent = () => ({
  components: { WkItem },
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px">
      <WkItem label="With prefix slot" showCheckbox :checked="true">
        <template #prefix>
          <span style="font-size: 20px">📁</span>
        </template>
      </WkItem>

      <WkItem label="With suffix slot" showCheckbox :checked="false">
        <template #suffix>
          <span style="padding: 2px 8px; background: #10b981; color: white; border-radius: 4px; font-size: 12px">New</span>
        </template>
      </WkItem>

      <WkItem showRadio :checked="true">
        <template #prefix>
          <span style="width: 32px; height: 32px; background: #3b82f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white">A</span>
        </template>
        <div>
          <div style="font-weight: 600">Custom Content Item</div>
          <div style="font-size: 12px; color: #6b7280; margin-top: 2px">With custom slot content</div>
        </div>
        <template #suffix>
          <span style="font-size: 12px; color: #6b7280">→</span>
        </template>
      </WkItem>
    </div>
  `
})

export const VerticalLayoutWithCheckbox = () => ({
  components: { WkItem },
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px">
      <h4 style="margin-bottom: 8px">Vertical Layout</h4>
      <WkItem
        label="Vertical with checkbox"
        description="Description is always shown now regardless of layout"
        layout="vertical"
        showCheckbox
        :checked="true"
      />
      <WkItem
        label="Vertical with radio"
        description="Radio button in vertical layout"
        layout="vertical"
        showRadio
        :checked="false"
      />
    </div>
  `
})
