import WkBreadcrumb from '../../src/components/breadcrumb/Breadcrumb.vue'

const SEPARATORS = ['chevron', 'slash']

const houseIcon = `
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true">
    <path
      d="m1.5 8 6.5-5.5L14.5 8M3 7v6.5h10V7"
      stroke="currentColor"
      stroke-width="1.4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
`

const ellipsisIcon = `
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true">
    <circle cx="3" cy="8" r="1.25" fill="currentColor" />
    <circle cx="8" cy="8" r="1.25" fill="currentColor" />
    <circle cx="13" cy="8" r="1.25" fill="currentColor" />
  </svg>
`

export default {
  title: 'Components/Layout/Breadcrumb',
  component: WkBreadcrumb,
  argTypes: {
    separator: { control: { type: 'inline-radio' }, options: SEPARATORS }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Displays the path to the current resource using a hierarchy of links. The last item is rendered as ' +
          'the current page (no link, `aria-current="page"`). Items with `href` render as clickable links; ' +
          'items without `href` render as plain text. Hover and focus states are CSS-driven.'
      }
    }
  }
}

const Template = args => ({
  components: { WkBreadcrumb },
  setup() {
    return { args }
  },
  template: `<WkBreadcrumb v-bind="args" />`
})

export const Primary = Template.bind({})
Primary.args = {
  items: [{ label: 'Home', href: '/' }, { label: 'Components', href: '/components' }, { label: 'WkBreadcrumb' }]
}

export const SingleItem = Template.bind({})
SingleItem.args = {
  items: [{ label: 'Level 1' }]
}

export const TwoItems = Template.bind({})
TwoItems.args = {
  items: [{ label: 'Level 1', href: '#' }, { label: 'Level 2' }]
}

export const ManyItems = Template.bind({})
ManyItems.args = {
  items: [
    { label: 'Level 1', href: '#' },
    { label: 'Level 2', href: '#' },
    { label: 'Level 3', href: '#' },
    { label: 'Level 4', href: '#' },
    { label: 'Level 5', href: '#' },
    { label: 'Level 6' }
  ]
}

export const WithIcon = Template.bind({})
WithIcon.args = {
  items: [{ icon: houseIcon, href: '/' }, { label: 'Components', href: '/components' }, { label: 'WkBreadcrumb' }]
}

export const SlashSeparator = Template.bind({})
SlashSeparator.args = {
  separator: 'slash',
  items: [
    { label: 'Breadcrumbs', href: '#' },
    { label: 'With', href: '#' },
    { label: 'Custom', href: '#' },
    { label: 'Separator' }
  ]
}

export const CollapsedWithEllipsis = Template.bind({})
CollapsedWithEllipsis.args = {
  items: [
    { label: 'Home', href: '/' },
    { icon: ellipsisIcon, href: '#' },
    { label: 'Level x-2', href: '#' },
    { label: 'Level x-1', href: '#' },
    { label: 'Level x' }
  ]
}

export const AllVariants = () => ({
  components: { WkBreadcrumb },
  data() {
    return {
      counts: [1, 2, 3, 4, 5, 6]
    }
  },
  methods: {
    itemsFor(n) {
      const arr = []
      for (let i = 1; i <= n; i++) {
        arr.push({ label: `Level ${i}`, href: i === n ? undefined : '#' })
      }
      return arr
    }
  },
  template: `
    <div style="display:flex; flex-direction:column; gap:16px; align-items:flex-start;">
      <div v-for="n in counts" :key="n" style="display:flex; align-items:center; gap:16px;">
        <span style="color:var(--muted-fg); font-size:12px; min-width:60px;">Items: {{ n }}</span>
        <WkBreadcrumb :items="itemsFor(n)" />
      </div>
    </div>
  `
})
AllVariants.parameters = {
  docs: { description: { story: 'Items count from 1 to 6 — matches the Figma `Items=N` variant matrix.' } }
}

export const CustomSlot = () => ({
  components: { WkBreadcrumb },
  template: `
    <WkBreadcrumb>
      <li class="ui-breadcrumb__row" style="display:inline-flex; align-items:center; gap:4px;">
        <a href="#" class="ui-breadcrumb__link">Home</a>
      </li>
      <li class="ui-breadcrumb__row" style="display:inline-flex; align-items:center; gap:4px;">
        <span class="ui-breadcrumb__separator" aria-hidden="true">›</span>
        <a href="#" class="ui-breadcrumb__link">Page with siblings ▾</a>
      </li>
      <li class="ui-breadcrumb__row" style="display:inline-flex; align-items:center; gap:4px;">
        <span class="ui-breadcrumb__separator" aria-hidden="true">›</span>
        <span class="ui-breadcrumb__current" aria-current="page">Active page</span>
      </li>
    </WkBreadcrumb>
  `
})
CustomSlot.parameters = {
  docs: { description: { story: 'Default slot lets the consumer render every item + separator manually.' } }
}

export const FocusVisible = () => ({
  components: { WkBreadcrumb },
  data() {
    return {
      items: [{ label: 'Home', href: '#' }, { label: 'Components', href: '#' }, { label: 'WkBreadcrumb' }]
    }
  },
  template: `<WkBreadcrumb :items="items" />`
})
FocusVisible.parameters = {
  docs: { description: { story: 'Tab through the links to verify focus rings.' } }
}

export const ClickEvent = () => ({
  components: { WkBreadcrumb },
  data() {
    return {
      items: [{ label: 'Home' }, { label: 'Components' }, { label: 'WkBreadcrumb' }],
      lastClicked: '(none)'
    }
  },
  methods: {
    onItemClick(item, index) {
      this.lastClicked = `${item.label} (index: ${index})`
    }
  },
  template: `
    <div style="display:flex; flex-direction:column; gap:16px; align-items:flex-start;">
      <WkBreadcrumb :items="items" @click="onItemClick" />
      <pre style="margin:0; padding:8px 12px; background:var(--secondary-bg); border-radius:var(--rounded-lg); font-size:12px; color:var(--secondary-fg);">clicked = {{ lastClicked }}</pre>
    </div>
  `
})
ClickEvent.parameters = {
  docs: {
    description: {
      story:
        'Items without `href` render as `<span>` (via `getTag`). ' +
        'The `@click` event emits `(item, index, event)` — use it for programmatic navigation instead of native links.'
    }
  }
}
