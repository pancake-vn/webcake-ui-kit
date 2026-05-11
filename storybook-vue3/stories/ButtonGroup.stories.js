import ButtonGroup from '../../src/components/button-group/ButtonGroup.vue'
import Button from '../../src/components/button/Button.vue'

export default {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  argTypes: {
    multiple: { control: 'boolean' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'A layout container that wraps `Button` children and connects them visually. ' +
          'First/last/middle border-radius is applied automatically via CSS `:first-child` / `:last-child` / `:not()` selectors. ' +
          'Outlined buttons (`Button variant="outline"`) get their shared borders collapsed automatically. ' +
          'Supports single and multiple toggle selection via `v-model` + `value` prop on each child Button.'
      }
    }
  }
}

export const Primary = () => ({
  components: { ButtonGroup, Button },
  template: `
    <div style="display:flex; flex-direction:column; gap:16px; align-items:flex-start;">
      <ButtonGroup>
        <Button variant="outline">Bold</Button>
        <Button variant="outline">Italic</Button>
        <Button variant="outline">Underline</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="ghost">Left</Button>
        <Button variant="ghost">Center</Button>
        <Button variant="ghost">Right</Button>
      </ButtonGroup>
    </div>
  `
})

export const AllVariants = () => ({
  components: { ButtonGroup, Button },
  template: `
    <div style="display:flex; flex-direction:column; gap:24px; align-items:flex-start;">
      <div style="display:flex; flex-direction:column; gap:8px;">
        <span style="color:var(--muted-fg); font-size:12px;">outline buttons</span>
        <div style="display:flex; gap:12px; flex-wrap:wrap; align-items:center;">
          <ButtonGroup>
            <Button variant="outline">Single</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="outline">Left</Button>
            <Button variant="outline">Right</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="outline">Left</Button>
            <Button variant="outline">Middle</Button>
            <Button variant="outline">Right</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="outline">One</Button>
            <Button variant="outline">Two</Button>
            <Button variant="outline">Three</Button>
            <Button variant="outline">Four</Button>
          </ButtonGroup>
        </div>
      </div>
      <div style="display:flex; flex-direction:column; gap:8px;">
        <span style="color:var(--muted-fg); font-size:12px;">ghost buttons</span>
        <div style="display:flex; gap:12px; flex-wrap:wrap; align-items:center;">
          <ButtonGroup>
            <Button variant="ghost">Single</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="ghost">Left</Button>
            <Button variant="ghost">Right</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="ghost">Left</Button>
            <Button variant="ghost">Middle</Button>
            <Button variant="ghost">Right</Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  `
})

export const FocusVisible = () => ({
  components: { ButtonGroup, Button },
  template: `
    <div style="display:flex; flex-direction:column; gap:16px; align-items:flex-start;">
      <ButtonGroup>
        <Button variant="outline">Left</Button>
        <Button variant="outline">Middle</Button>
        <Button variant="outline">Right</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="ghost">Left</Button>
        <Button variant="ghost">Middle</Button>
        <Button variant="ghost">Right</Button>
      </ButtonGroup>
    </div>
  `
})
FocusVisible.parameters = {
  docs: { description: { story: 'Tab through buttons to verify focus rings and z-index lift on outline buttons.' } }
}

export const ClickEvent = () => ({
  components: { ButtonGroup, Button },
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
      <ButtonGroup @click="onGroupClick">
        <Button variant="outline" value="bold">Bold</Button>
        <Button variant="outline" value="italic">Italic</Button>
        <Button variant="outline" value="underline">Underline</Button>
      </ButtonGroup>
      <pre style="margin:0; padding:8px 12px; background:var(--secondary-bg); border-radius:var(--rounded-lg); font-size:12px; color:var(--secondary-fg);">clicked = {{ lastClicked }}</pre>
    </div>
  `
})
ClickEvent.parameters = {
  docs: {
    // description: {
    //   story:
    //     'ButtonGroup emits a single `click` event with the child Button's `value` prop. ' +
    //     'Uses event delegation — no need to bind handlers to each Button individually.'
    // }
  }
}
