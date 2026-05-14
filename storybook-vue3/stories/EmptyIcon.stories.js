import WkEmptyIcon from '../../src/components/empty-icon/EmptyIcon.vue'

export default {
  title: 'Display/EmptyIcon',
  component: WkEmptyIcon,
  parameters: {
    docs: {
      description: {
        component:
          'Wraps a 24×24 icon in a 40×40 rounded container with a neutral background. ' +
          'Designed for use inside the `media` slot of `WkEmpty`.'
      }
    }
  }
}

export const Primary = () => ({
  components: { WkEmptyIcon },
  template: `
    <WkEmptyIcon>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    </WkEmptyIcon>
  `
})
Primary.parameters = {
  docs: { description: { story: 'Default 40×40 container with a home icon.' } }
}

export const WithMultipleIcons = () => ({
  components: { WkEmptyIcon },
  template: `
    <div style="display:flex;gap:12px;align-items:center;">
      <WkEmptyIcon>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      </WkEmptyIcon>
      <WkEmptyIcon>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </WkEmptyIcon>
      <WkEmptyIcon>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </WkEmptyIcon>
    </div>
  `
})
WithMultipleIcons.parameters = {
  docs: { description: { story: 'The slot accepts any inline SVG — the container always renders at 40×40.' } }
}
