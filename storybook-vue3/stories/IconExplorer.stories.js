import IconExplorer from './IconExplorer.vue'
import manifest from '../../scripts/generated/icons/manifest.json'

export default {
  title: 'Foundations/Icons',
  component: IconExplorer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          `Searchable, category-grouped browser for all ${manifest.icons.length} icons in the kit. ` +
          'All data is derived from `scripts/generated/icons/manifest.json` — the filesystem is never ' +
          "re-scanned at render time. Search uses BM25 ranking over each icon's kebab-case name, " +
          'PascalCase name, tags, and categories, with prefix matching for an incremental feel as you ' +
          'type. Icons are mounted lazily via IntersectionObserver to keep the page responsive at the ' +
          "kit's full ~1.7k icon count.\n\nClick any icon for a popover with **Copy name** " +
          "(`WkiArrowDown`) and **Copy import** (`import { WkiArrowDown } from 'webcake-ui-kit/src/icons'`)."
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
  controls: { hideNoControlsWarning: true }
}
