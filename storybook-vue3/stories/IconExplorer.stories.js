import IconExplorer from './IconExplorer.vue'
import manifest from '../../scripts/generated/icons/manifest.json'

export default {
  title: 'Foundations/Icons',
  component: IconExplorer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Searchable, category-grouped browser for all ${manifest.icons.length} icons in the kit. `
      }
    }
  }
}

export const Explorer = () => ({
  components: { IconExplorer },
  template: '<IconExplorer />'
})

Explorer.parameters = {
  // No controls / args — this is a docs-style explorer, not a parameterized story.
  docs: { source: { code: '' } }
}
