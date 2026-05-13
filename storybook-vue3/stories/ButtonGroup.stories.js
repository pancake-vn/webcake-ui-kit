import WkButtonGroup from '../../src/components/button-group/ButtonGroup.vue'
import WkButton from '../../src/components/button/Button.vue'

export default {
  title: 'Forms/ButtonGroup',
  component: WkButtonGroup,
  argTypes: {
    multiple: { control: 'boolean' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'A layout container that wraps `WkButton` children and connects them visually. ' +
          'First/last/middle border-radius is applied automatically via CSS `:first-child` / `:last-child` / `:not()` selectors. ' +
          'Outlined buttons (`WkButton variant="outline"`) get their shared borders collapsed automatically. ' +
          'Supports single and multiple toggle selection via `v-model` + `value` prop on each child WkButton.'
      }
    }
  }
}

export const Primary = () => ({
  components: { WkButtonGroup, WkButton },
  template: `
    <div style="display:flex; flex-direction:column; gap:16px; align-items:flex-start;">
      <WkButtonGroup>
        <WkButton variant="outline">Bold</WkButton>
        <WkButton variant="outline">Italic</WkButton>
        <WkButton variant="outline">Underline</WkButton>
      </WkButtonGroup>
      <WkButtonGroup>
        <WkButton variant="ghost">Left</WkButton>
        <WkButton variant="ghost">Center</WkButton>
        <WkButton variant="ghost">Right</WkButton>
      </WkButtonGroup>
    </div>
  `
})

export const AllVariants = () => ({
  components: { WkButtonGroup, WkButton },
  template: `
    <div style="display:flex; flex-direction:column; gap:24px; align-items:flex-start;">
      <div style="display:flex; flex-direction:column; gap:8px;">
        <span style="color:var(--muted-fg); font-size:12px;">outline buttons</span>
        <div style="display:flex; gap:12px; flex-wrap:wrap; align-items:center;">
          <WkButtonGroup>
            <WkButton variant="outline">Single</WkButton>
          </WkButtonGroup>
          <WkButtonGroup>
            <WkButton variant="outline">Left</WkButton>
            <WkButton variant="outline">Right</WkButton>
          </WkButtonGroup>
          <WkButtonGroup>
            <WkButton variant="outline">Left</WkButton>
            <WkButton variant="outline">Middle</WkButton>
            <WkButton variant="outline">Right</WkButton>
          </WkButtonGroup>
          <WkButtonGroup>
            <WkButton variant="outline">One</WkButton>
            <WkButton variant="outline">Two</WkButton>
            <WkButton variant="outline">Three</WkButton>
            <WkButton variant="outline">Four</WkButton>
          </WkButtonGroup>
        </div>
      </div>
      <div style="display:flex; flex-direction:column; gap:8px;">
        <span style="color:var(--muted-fg); font-size:12px;">ghost buttons</span>
        <div style="display:flex; gap:12px; flex-wrap:wrap; align-items:center;">
          <WkButtonGroup>
            <WkButton variant="ghost">Single</WkButton>
          </WkButtonGroup>
          <WkButtonGroup>
            <WkButton variant="ghost">Left</WkButton>
            <WkButton variant="ghost">Right</WkButton>
          </WkButtonGroup>
          <WkButtonGroup>
            <WkButton variant="ghost">Left</WkButton>
            <WkButton variant="ghost">Middle</WkButton>
            <WkButton variant="ghost">Right</WkButton>
          </WkButtonGroup>
        </div>
      </div>
    </div>
  `
})

export const FocusVisible = () => ({
  components: { WkButtonGroup, WkButton },
  template: `
    <div style="display:flex; flex-direction:column; gap:16px; align-items:flex-start;">
      <WkButtonGroup>
        <WkButton variant="outline">Left</WkButton>
        <WkButton variant="outline">Middle</WkButton>
        <WkButton variant="outline">Right</WkButton>
      </WkButtonGroup>
      <WkButtonGroup>
        <WkButton variant="ghost">Left</WkButton>
        <WkButton variant="ghost">Middle</WkButton>
        <WkButton variant="ghost">Right</WkButton>
      </WkButtonGroup>
    </div>
  `
})
FocusVisible.parameters = {
  docs: { description: { story: 'Tab through buttons to verify focus rings and z-index lift on outline buttons.' } }
}

export const ClickEvent = () => ({
  components: { WkButtonGroup, WkButton },
  data() {
    return { lastClicked: '(none)' }
  },
  methods: {
    onGroupClick(value) {
      this.lastClicked = value
    }
  },
  template: `
    <div style="display:flex; flex-direction:column; gap:16px; align-items:flex-start;">
      <WkButtonGroup @click="onGroupClick">
        <WkButton variant="outline" value="bold">Bold</WkButton>
        <WkButton variant="outline" value="italic">Italic</WkButton>
        <WkButton variant="outline" value="underline">Underline</WkButton>
      </WkButtonGroup>
      <pre style="margin:0; padding:8px 12px; background:var(--secondary-bg); border-radius:var(--rounded-lg); font-size:12px; color:var(--secondary-fg);">clicked = {{ lastClicked }}</pre>
    </div>
  `
})
ClickEvent.parameters = {
  docs: {
    // description: {
    //   story:
    //     'WkButtonGroup emits a single `click` event with the child WkButton's `value` prop. ' +
    //     'Uses event delegation — no need to bind handlers to each WkButton individually.'
    // }
  }
}
