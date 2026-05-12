import WkSpinner from '../../src/components/spinner/Spinner.vue'

export default {
  title: 'Components/Spinner',
  component: WkSpinner,
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    type: { control: { type: 'inline-radio' }, options: ['default', 'mirrored'] },
    label: { control: 'text' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Animated loading indicator. `size` controls dimensions; `type="mirrored"` reverses the arc direction. ' +
          '`label` is the accessible `aria-label` (screen-reader only).'
      }
    }
  }
}

const Template = args => ({
  components: { WkSpinner },
  setup() {
    return { args }
  },
  template: `<WkSpinner v-bind="args" />`
})

export const Primary = Template.bind({})
Primary.args = { size: 'md', type: 'default', label: 'Loading' }

export const AllVariants = () => ({
  components: { WkSpinner },
  template: `
    <div style="display:flex;flex-direction:column;gap:24px;align-items:flex-start;">
      <div style="display:flex;flex-direction:column;gap:8px;">
        <span style="color:#6b7280;font-size:12px;">size</span>
        <div style="display:flex;gap:24px;align-items:center;">
          <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
            <WkSpinner size="sm" />
            <span style="color:#6b7280;font-size:11px;">sm</span>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
            <WkSpinner size="md" />
            <span style="color:#6b7280;font-size:11px;">md</span>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
            <WkSpinner size="lg" />
            <span style="color:#6b7280;font-size:11px;">lg</span>
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <span style="color:#6b7280;font-size:12px;">type</span>
        <div style="display:flex;gap:24px;align-items:center;">
          <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
            <WkSpinner type="default" size="md" />
            <span style="color:#6b7280;font-size:11px;">default</span>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
            <WkSpinner type="mirrored" size="md" />
            <span style="color:#6b7280;font-size:11px;">mirrored</span>
          </div>
        </div>
      </div>
    </div>
  `
})
AllVariants.parameters = {
  docs: { description: { story: 'All size and type combinations.' } }
}

export const Matrix = () => ({
  components: { WkSpinner },
  template: `
    <table style="border-collapse:separate;border-spacing:20px;">
      <thead>
        <tr>
          <th></th>
          <th style="color:#6b7280;font-size:12px;font-weight:500;">sm</th>
          <th style="color:#6b7280;font-size:12px;font-weight:500;">md</th>
          <th style="color:#6b7280;font-size:12px;font-weight:500;">lg</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="type in ['default','mirrored']" :key="type">
          <td style="color:#6b7280;font-size:12px;white-space:nowrap;">{{ type }}</td>
          <td v-for="size in ['sm','md','lg']" :key="size"><WkSpinner :size="size" :type="type" /></td>
        </tr>
      </tbody>
    </table>
  `
})
Matrix.parameters = {
  docs: { description: { story: 'Full size × type matrix.' } }
}
