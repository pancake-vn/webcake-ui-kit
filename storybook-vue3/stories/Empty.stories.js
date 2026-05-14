import WkEmpty from '../../src/components/empty/Empty.vue'
import WkEmptyIcon from '../../src/components/empty-icon/EmptyIcon.vue'

const VARIANTS = ['default', 'outline', 'background', 'outline-dashed']

export default {
  title: 'Display/Empty',
  component: WkEmpty,
  argTypes: {
    variant: { control: { type: 'select' }, options: VARIANTS },
    title: { control: 'text' },
    description: { control: 'text' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Empty state placeholder with four visual `variant`s. ' +
          'Slots: `media` (icon/illustration above text), `title`, `description`, and default (footer actions). ' +
          'Props `title` and `description` are shorthand when slot customisation is not needed.'
      }
    }
  }
}

const Template = args => ({
  components: { WkEmpty },
  data() {
    return { args }
  },
  template: `<WkEmpty v-bind="args" style="max-width:400px;" />`
})

export const Primary = Template.bind({})
Primary.args = { variant: 'default', title: 'Nothing here yet', description: 'Add your first item to get started.' }
Primary.parameters = {
  docs: { description: { story: 'Simple empty state using `title` and `description` props.' } }
}

export const AllVariants = () => ({
  components: { WkEmpty },
  data() {
    return { variants: VARIANTS }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:16px;max-width:400px;">
      <WkEmpty
        v-for="v in variants"
        :key="v"
        :variant="v"
        :title="v"
        description="Supporting description text goes here."
      />
    </div>
  `
})
AllVariants.parameters = {
  docs: {
    description: { story: 'All four variant styles: default (no border), outline, background fill, outline-dashed.' }
  }
}

export const WithIcon = () => ({
  components: { WkEmpty, WkEmptyIcon },
  template: `
    <WkEmpty title="No files found" description="Upload a file to get started." style="max-width:400px;">
      <template #media>
        <WkEmptyIcon>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </WkEmptyIcon>
      </template>
    </WkEmpty>
  `
})
WithIcon.parameters = {
  docs: { description: { story: '`media` slot with `WkEmptyIcon` wrapper for a standard 40×40 icon container.' } }
}

export const WithFooter = () => ({
  components: { WkEmpty },
  template: `
    <WkEmpty variant="outline" title="No results" description="Try adjusting your search or filters." style="max-width:400px;">
      <button style="padding:8px 16px;border:1px solid #e5e7eb;border-radius:8px;cursor:pointer;font-size:14px;">
        Clear filters
      </button>
    </WkEmpty>
  `
})
WithFooter.parameters = {
  docs: { description: { story: 'Default slot renders as the footer action area below the text block.' } }
}

export const Full = () => ({
  components: { WkEmpty, WkEmptyIcon },
  template: `
    <WkEmpty variant="background" style="max-width:400px;">
      <template #media>
        <WkEmptyIcon>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </WkEmptyIcon>
      </template>
      <template #title>Custom <strong>rich</strong> title</template>
      <template #description>Supporting text with a <a href="#" style="color:inherit;">link</a>.</template>
      <button style="padding:8px 16px;border:1px solid #e5e7eb;border-radius:8px;cursor:pointer;font-size:14px;">
        Take action
      </button>
    </WkEmpty>
  `
})
Full.parameters = {
  docs: { description: { story: 'All four slots in use: media, title (rich HTML), description, and footer action.' } }
}
