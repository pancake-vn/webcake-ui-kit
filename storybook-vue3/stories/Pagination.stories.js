import WkPagination from '../../src/components/pagination/Pagination.vue'

export default {
  title: 'Components/Layout/Pagination',
  component: WkPagination,
  argTypes: {
    current: { control: { type: 'number', min: 1 } },
    total: { control: { type: 'number', min: 0 } },
    pageSize: { control: { type: 'number', min: 1 } },
    siblings: { control: { type: 'number', min: 0, max: 4 } },
    boundary: { control: { type: 'number', min: 0, max: 4 } },
    showIcon: { control: 'boolean' },
    prevLabel: { control: 'text' },
    nextLabel: { control: 'text' },
    disabled: { control: 'boolean' },
    jumpStep: { control: { type: 'number', min: 0 } }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Page navigation built on `WkButton`. Bind `:current` + `@change` (Vue 2 / Vue 3 compatible). ' +
          '`total` is the total number of items; `pageSize` (default 10) sets items per page — the component derives ' +
          '`totalPages = ceil(total / pageSize)` internally. ' +
          'Ellipsis is clickable by default (`jumpStep` defaults to 4); set `:jump-step="0"` for a static ellipsis. ' +
          'An ellipsis only appears when the gap covers more than one page — single-page gaps are shown directly.'
      }
    }
  }
}

const Template = args => ({
  components: { WkPagination },
  setup() {
    return { args }
  },
  template: `<WkPagination v-bind="args" />`
})

export const Primary = Template.bind({})
Primary.args = { current: 1, total: 100, pageSize: 10, siblings: 1, boundary: 1, showIcon: false }

export const AllVariants = () => ({
  components: { WkPagination },
  template: `
    <div style="display:flex; flex-direction:column; gap:16px; align-items:flex-start;">
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="color:#6b7280; font-size:12px; width:160px;">current=1 / 10 pages</span>
        <WkPagination :current="1" :total="10" :page-size="1" />
      </div>
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="color:#6b7280; font-size:12px; width:160px;">current=5 / 10 pages</span>
        <WkPagination :current="5" :total="10" :page-size="1" />
      </div>
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="color:#6b7280; font-size:12px; width:160px;">current=10 / 10 pages</span>
        <WkPagination :current="10" :total="10" :page-size="1" />
      </div>
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="color:#6b7280; font-size:12px; width:160px;">1 page total (disabled)</span>
        <WkPagination :current="1" :total="1" :page-size="1" />
      </div>
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="color:#6b7280; font-size:12px; width:160px;">disabled</span>
        <WkPagination :current="5" :total="10" :page-size="1" disabled />
      </div>
    </div>
  `
})
AllVariants.parameters = {
  docs: { description: { story: 'Common configurations: start, middle, end, single page, fully disabled.' } }
}

export const WithIcons = () => ({
  components: { WkPagination },
  template: `
    <div style="display:flex; flex-direction:column; gap:16px; align-items:flex-start;">
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="color:#6b7280; font-size:12px; width:160px;">showIcon=true, current=3</span>
        <WkPagination :current="3" :total="100" :page-size="10" :showIcon="true" />
      </div>
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="color:#6b7280; font-size:12px; width:160px;">showIcon=true, current=1</span>
        <WkPagination :current="1" :total="100" :page-size="10" :showIcon="true" />
      </div>
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="color:#6b7280; font-size:12px; width:160px;">showIcon=true, current=10</span>
        <WkPagination :current="10" :total="100" :page-size="10" :showIcon="true" />
      </div>
    </div>
  `
})
WithIcons.parameters = {
  docs: { description: { story: '`showIcon` adds chevron SVGs inside the Prev/Next buttons.' } }
}

export const EllipsisPlacement = () => ({
  components: { WkPagination },
  data() {
    return {
      rows: [
        { label: 'current=1, 10 pages', current: 1, total: 10 },
        { label: 'current=2, 10 pages', current: 2, total: 10 },
        { label: 'current=3 — left gap=1, no ellipsis', current: 3, total: 10 },
        { label: 'current=4 — left gap=2, ellipsis', current: 4, total: 10 },
        { label: 'current=5, 10 pages', current: 5, total: 10 },
        { label: 'current=6, 10 pages', current: 6, total: 10 },
        { label: 'current=7 — right gap=2, ellipsis', current: 7, total: 10 },
        { label: 'current=8 — right gap=1, no ellipsis', current: 8, total: 10 },
        { label: 'current=9, 10 pages', current: 9, total: 10 },
        { label: 'current=10, 10 pages', current: 10, total: 10 }
      ]
    }
  },
  template: `
    <div style="display:flex; flex-direction:column; gap:8px; align-items:flex-start;">
      <div v-for="row in rows" :key="row.label" style="display:flex; align-items:center; gap:16px;">
        <span style="color:#6b7280; font-size:12px; width:260px;">{{ row.label }}</span>
        <WkPagination :current="row.current" :total="row.total" :page-size="1" :jump-step="0" />
      </div>
    </div>
  `
})
EllipsisPlacement.parameters = {
  docs: {
    description: {
      story:
        'Rows 3 and 8 show the key rule: when only ONE page would be hidden by an ellipsis, that page is shown ' +
        'directly instead. `jumpStep=0` here so ellipsis is static for clarity.'
    }
  }
}

export const SiblingsAndBoundary = () => ({
  components: { WkPagination },
  template: `
    <div style="display:flex; flex-direction:column; gap:16px; align-items:flex-start;">
      <div style="display:flex; align-items:center; gap:16px;">
        <span style="color:#6b7280; font-size:12px; width:220px;">siblings=0, boundary=1</span>
        <WkPagination :current="10" :total="20" :page-size="1" :siblings="0" :boundary="1" :jump-step="0" />
      </div>
      <div style="display:flex; align-items:center; gap:16px;">
        <span style="color:#6b7280; font-size:12px; width:220px;">siblings=1, boundary=1 (default)</span>
        <WkPagination :current="10" :total="20" :page-size="1" :siblings="1" :boundary="1" :jump-step="0" />
      </div>
      <div style="display:flex; align-items:center; gap:16px;">
        <span style="color:#6b7280; font-size:12px; width:220px;">siblings=2, boundary=1</span>
        <WkPagination :current="10" :total="20" :page-size="1" :siblings="2" :boundary="1" :jump-step="0" />
      </div>
      <div style="display:flex; align-items:center; gap:16px;">
        <span style="color:#6b7280; font-size:12px; width:220px;">siblings=1, boundary=2</span>
        <WkPagination :current="10" :total="20" :page-size="1" :siblings="1" :boundary="2" :jump-step="0" />
      </div>
      <div style="display:flex; align-items:center; gap:16px;">
        <span style="color:#6b7280; font-size:12px; width:220px;">boundary=0 (no anchors)</span>
        <WkPagination :current="10" :total="20" :page-size="1" :siblings="1" :boundary="0" :jump-step="0" />
      </div>
    </div>
  `
})
SiblingsAndBoundary.parameters = {
  docs: {
    description: {
      story:
        '`siblings` widens the window around current; `boundary` pins pages at each end. ' +
        '`boundary=0` is a "load more" style with no fixed last page.'
    }
  }
}

export const Interactive = () => ({
  components: { WkPagination },
  data() {
    return { page: 1 }
  },
  template: `
    <div style="display:flex; flex-direction:column; gap:12px; align-items:flex-start;">
      <WkPagination :current="page" :total="250" :page-size="10" @change="page = $event" />
      <code style="font-size:13px;">current page = {{ page }} / 25 &nbsp;(250 items ÷ 10 per page)</code>
    </div>
  `
})
Interactive.parameters = {
  docs: {
    description: {
      story:
        'Click any number or Prev/Next. `@change` emits the new page. ' +
        'Ellipsis buttons jump ±4 pages by default (the `jumpStep` default).'
    }
  }
}

export const JumpStep = () => ({
  components: { WkPagination },
  data() {
    return { page: 15 }
  },
  template: `
    <div style="display:flex; flex-direction:column; gap:12px; align-items:flex-start;">
      <WkPagination :current="page" :total="300" :page-size="10" :jump-step="5" @change="page = $event" />
      <code style="font-size:13px;">page = {{ page }} — click \`…\` to jump ±5</code>
    </div>
  `
})
JumpStep.parameters = {
  docs: {
    description: {
      story:
        '`jumpStep` controls how far the ellipsis jumps. Set `:jump-step="0"` to disable it. ' +
        'Hover the ellipsis button to see the direction indicator.'
    }
  }
}

export const StaticEllipsis = () => ({
  components: { WkPagination },
  template: `
    <WkPagination :current="5" :total="100" :page-size="10" :jump-step="0" />
  `
})
StaticEllipsis.parameters = {
  docs: { description: { story: '`:jump-step="0"` makes the ellipsis non-interactive (static display only).' } }
}

export const CustomLabels = () => ({
  components: { WkPagination },
  template: `
    <div style="display:flex; flex-direction:column; gap:16px; align-items:flex-start;">
      <WkPagination :current="3" :total="100" :page-size="10" prevLabel="← Prev" nextLabel="Next →" />
      <WkPagination :current="3" :total="100" :page-size="10" prevLabel="" nextLabel="" :showIcon="true" />
    </div>
  `
})
CustomLabels.parameters = {
  docs: {
    description: {
      story: 'Custom `prevLabel`/`nextLabel` text. Empty strings with `showIcon=true` give icon-only buttons.'
    }
  }
}

export const FocusVisible = () => ({
  components: { WkPagination },
  template: `
    <WkPagination :current="5" :total="100" :page-size="10" :showIcon="true" />
  `
})
FocusVisible.parameters = {
  docs: { description: { story: 'Tab through all buttons to verify `:focus-visible` rings on each.' } }
}
