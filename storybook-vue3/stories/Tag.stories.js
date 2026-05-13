import Tag from '../../src/components/tag/Tag.vue'

export default {
  title: 'Display/Tag',
  component: Tag,
  argTypes: {
    type: { control: { type: 'inline-radio' }, options: ['default', 'outline'] },
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
    counter: { control: 'number' },
    closable: { control: 'boolean' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Compact label chip. `type` toggles fill vs outline style. `counter` appends a numeric badge. ' +
          '`closable` shows an × button that emits `close`. Supports an `#icon` slot for a leading icon.'
      }
    }
  }
}

const Template = args => ({
  components: { Tag },
  setup() {
    return { args }
  },
  template: `<Tag v-bind="args" />`
})

export const Primary = Template.bind({})
Primary.args = { label: 'Label', type: 'outline', size: 'md' }

export const AllVariants = () => ({
  components: { Tag },
  template: `
    <div style="display:flex;flex-direction:column;gap:24px;align-items:flex-start;">
      <div v-for="type in ['default','outline']" :key="type" style="display:flex;flex-direction:column;gap:8px;">
        <span style="color:#6b7280;font-size:12px;">type: {{ type }}</span>
        <div style="display:flex;gap:8px;align-items:center;">
          <Tag v-for="size in ['sm','md','lg']" :key="size" :type="type" :size="size" :label="size" />
        </div>
      </div>
    </div>
  `
})
AllVariants.parameters = {
  docs: { description: { story: 'Both types across all sizes.' } }
}

export const Matrix = () => ({
  components: { Tag },
  template: `
    <table style="border-collapse:separate;border-spacing:12px;">
      <thead>
        <tr>
          <th></th>
          <th style="color:#6b7280;font-size:12px;font-weight:500;" v-for="s in ['sm','md','lg']" :key="s">{{ s }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="type in ['default','outline']" :key="type">
          <td style="color:#6b7280;font-size:12px;white-space:nowrap;">{{ type }}</td>
          <td v-for="size in ['sm','md','lg']" :key="size">
            <Tag :type="type" :size="size" label="Tag" />
          </td>
        </tr>
      </tbody>
    </table>
  `
})
Matrix.parameters = {
  docs: { description: { story: 'Full type × size grid.' } }
}

export const WithCounter = () => ({
  components: { Tag },
  template: `
    <div style="display:flex;gap:8px;align-items:center;">
      <Tag type="outline" label="Messages" :counter="3" />
      <Tag type="outline" label="Notifications" :counter="12" />
      <Tag type="default" label="Items" :counter="99" />
    </div>
  `
})
WithCounter.parameters = {
  docs: { description: { story: '`counter` appends a numeric badge inside the tag.' } }
}

export const Closable = () => ({
  components: { Tag },
  data() {
    return { tags: ['Vue', 'React', 'Svelte', 'Angular'], removed: [] }
  },
  methods: {
    remove(t) {
      this.tags = this.tags.filter(x => x !== t)
      this.removed.push(t)
    }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <Tag v-for="t in tags" :key="t" :label="t" type="outline" closable @close="remove(t)" />
      </div>
      <code style="font-size:13px;">removed = {{ removed }}</code>
    </div>
  `
})
Closable.parameters = {
  docs: { description: { story: 'Click × to dismiss. Emits `close` — remove the tag from your list.' } }
}

export const WithIcon = () => ({
  components: { Tag },
  template: `
    <div style="display:flex;gap:8px;align-items:center;">
      <Tag type="outline" label="Published">
        <template #icon>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <circle cx="5" cy="5" r="5" />
          </svg>
        </template>
      </Tag>
      <Tag type="default" label="Draft">
        <template #icon>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="5" cy="5" r="4" />
          </svg>
        </template>
      </Tag>
    </div>
  `
})
WithIcon.parameters = {
  docs: { description: { story: '`#icon` slot renders a leading icon inside the tag.' } }
}
