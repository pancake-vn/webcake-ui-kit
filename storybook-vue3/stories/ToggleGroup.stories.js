import ToggleGroup from '../../src/components/toggle-group/ToggleGroup.vue'
import Toggle from '../../src/components/toggle/Toggle.vue'

const alignLeftIcon =
  '<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true"><path d="M4 6h12M4 10h8M4 14h10" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>'
const alignCenterIcon =
  '<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true"><path d="M4 6h12M6 10h8M5 14h10" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>'
const alignRightIcon =
  '<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true"><path d="M4 6h12M8 10h8M6 14h10" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>'

export default {
  title: 'Components/ToggleGroup',
  component: ToggleGroup,
  argTypes: {
    multiple: { control: 'boolean' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Layout container for `Toggle` components. Connects toggles visually — first/last/middle border-radius is ' +
          'auto-applied via CSS `:first-child` / `:last-child` selectors. ' +
          'Outlined toggles (`Toggle variant="outlined"`) get their shared borders collapsed automatically. ' +
          'Single-select by default; pass `:multiple="true"` for multi-select. ' +
          'Each child Toggle should have a `value` prop.'
      }
    }
  }
}

export const Primary = () => ({
  components: { ToggleGroup, Toggle },
  data() {
    return { selected: 'left' }
  },
  template: `
    <div style="display:flex; flex-direction:column; gap:16px; align-items:flex-start;">
      <ToggleGroup v-model="selected">
        <Toggle value="left">Left</Toggle>
        <Toggle value="center">Center</Toggle>
        <Toggle value="right">Right</Toggle>
      </ToggleGroup>
      <code style="font-size:13px;">selected = "{{ selected || 'null' }}"</code>
    </div>
  `
})

export const AllVariants = () => ({
  components: { ToggleGroup, Toggle },
  data() {
    return { sel1: 'a', sel2: 'b', sel3: 'b', sel4: 'a', sel5: 'b' }
  },
  template: `
    <div style="display:flex; flex-direction:column; gap:24px; align-items:flex-start;">
      <div style="display:flex; flex-direction:column; gap:8px;">
        <span style="color:var(--muted-fg); font-size:12px;">outlined</span>
        <div style="display:flex; gap:12px; flex-wrap:wrap; align-items:center;">
          <ToggleGroup v-model="sel1">
            <Toggle value="a">Single</Toggle>
          </ToggleGroup>
          <ToggleGroup v-model="sel2">
            <Toggle value="a">Left</Toggle>
            <Toggle value="b">Right</Toggle>
          </ToggleGroup>
          <ToggleGroup v-model="sel3">
            <Toggle value="a">Left</Toggle>
            <Toggle value="b">Middle</Toggle>
            <Toggle value="c">Right</Toggle>
          </ToggleGroup>
        </div>
      </div>
      <div style="display:flex; flex-direction:column; gap:8px;">
        <span style="color:var(--muted-fg); font-size:12px;">ghost</span>
        <div style="display:flex; gap:12px; flex-wrap:wrap; align-items:center;">
          <ToggleGroup v-model="sel4">
            <Toggle variant="ghost" value="a">Single</Toggle>
          </ToggleGroup>
          <ToggleGroup v-model="sel5">
            <Toggle variant="ghost" value="a">Left</Toggle>
            <Toggle variant="ghost" value="b">Middle</Toggle>
            <Toggle variant="ghost" value="c">Right</Toggle>
          </ToggleGroup>
        </div>
      </div>
    </div>
  `
})

export const SingleSelect = () => ({
  components: { ToggleGroup, Toggle },
  data() {
    return { selected: 'week' }
  },
  template: `
    <div style="display:flex; flex-direction:column; gap:12px; align-items:flex-start;">
      <ToggleGroup v-model="selected">
        <Toggle value="day">Day</Toggle>
        <Toggle value="week">Week</Toggle>
        <Toggle value="month">Month</Toggle>
        <Toggle value="year">Year</Toggle>
      </ToggleGroup>
      <code style="font-size:13px;">selected = "{{ selected || 'null' }}"</code>
      <p style="font-size:13px; color:var(--muted-fg); margin:0;">Click the active toggle again to deselect.</p>
    </div>
  `
})
SingleSelect.parameters = {
  docs: { description: { story: 'Default mode — only one Toggle active at a time.' } }
}

export const MultipleSelect = () => ({
  components: { ToggleGroup, Toggle },
  data() {
    return { active: ['bold'] }
  },
  template: `
    <div style="display:flex; flex-direction:column; gap:12px; align-items:flex-start;">
      <ToggleGroup v-model="active" :multiple="true">
        <Toggle value="bold">B</Toggle>
        <Toggle value="italic">I</Toggle>
        <Toggle value="underline">U</Toggle>
        <Toggle value="strike">S</Toggle>
      </ToggleGroup>
      <code style="font-size:13px;">active = {{ JSON.stringify(active) }}</code>
    </div>
  `
})
MultipleSelect.parameters = {
  docs: { description: { story: 'Pass `:multiple="true"` to allow multiple toggles to be active simultaneously.' } }
}

export const IconOnly = () => ({
  components: { ToggleGroup, Toggle },
  data() {
    return { align: 'left', alignLeftIcon, alignCenterIcon, alignRightIcon }
  },
  template: `
    <div style="display:flex; flex-direction:column; gap:12px; align-items:flex-start;">
      <ToggleGroup v-model="align">
        <Toggle value="left" aria-label="Align left">
          <template #icon>
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true"><path d="M2.5 4h11M2.5 8h7M2.5 12h11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </template>
        </Toggle>
        <Toggle value="center" aria-label="Align center">
          <template #icon>
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true"><path d="M2.5 4h11M4.5 8h7M2.5 12h11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </template>
        </Toggle>
        <Toggle value="right" aria-label="Align right">
          <template #icon>
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true"><path d="M2.5 4h11M4.5 8h9M2.5 12h11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </template>
        </Toggle>
      </ToggleGroup>
      <code style="font-size:13px;">align = "{{ align }}"</code>
    </div>
  `
})

export const GhostVariant = () => ({
  components: { ToggleGroup, Toggle },
  data() {
    return { selected: 'a' }
  },
  template: `
    <div style="display:flex; flex-direction:column; gap:12px; align-items:flex-start;">
      <ToggleGroup v-model="selected">
        <Toggle variant="ghost" value="a">Option A</Toggle>
        <Toggle variant="ghost" value="b">Option B</Toggle>
        <Toggle variant="ghost" value="c">Option C</Toggle>
      </ToggleGroup>
      <code style="font-size:13px;">selected = "{{ selected || 'null' }}"</code>
    </div>
  `
})

export const FocusVisible = () => ({
  components: { ToggleGroup, Toggle },
  template: `
    <div style="display:flex; flex-direction:column; gap:12px; align-items:flex-start;">
      <ToggleGroup>
        <Toggle value="a">Left</Toggle>
        <Toggle value="b">Middle</Toggle>
        <Toggle value="c">Right</Toggle>
      </ToggleGroup>
    </div>
  `
})
FocusVisible.parameters = {
  docs: { description: { story: 'Tab through the toggles to verify focus rings and z-index lift.' } }
}
