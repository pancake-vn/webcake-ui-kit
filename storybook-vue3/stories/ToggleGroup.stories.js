import WkToggleGroup from '../../src/components/toggle-group/ToggleGroup.vue'
import WkToggle from '../../src/components/toggle/Toggle.vue'

const alignLeftIcon =
  '<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true"><path d="M4 6h12M4 10h8M4 14h10" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>'
const alignCenterIcon =
  '<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true"><path d="M4 6h12M6 10h8M5 14h10" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>'
const alignRightIcon =
  '<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true"><path d="M4 6h12M8 10h8M6 14h10" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>'

export default {
  title: 'Forms/ToggleGroup',
  component: WkToggleGroup,
  argTypes: {
    multiple: { control: 'boolean' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Layout container for `WkToggle` components. Connects toggles visually — first/last/middle border-radius is ' +
          'auto-applied via CSS `:first-child` / `:last-child` selectors. ' +
          'Outlined toggles (`WkToggle variant="outlined"`) get their shared borders collapsed automatically. ' +
          'Single-select by default; pass `:multiple="true"` for multi-select. ' +
          'Each child WkToggle should have a `value` prop.'
      }
    }
  }
}

export const Primary = () => ({
  components: { WkToggleGroup, WkToggle },
  data() {
    return { selected: 'left' }
  },
  template: `
    <div style="display:flex; flex-direction:column; gap:16px; align-items:flex-start;">
      <WkToggleGroup v-model="selected">
        <WkToggle value="left">Left</WkToggle>
        <WkToggle value="center">Center</WkToggle>
        <WkToggle value="right">Right</WkToggle>
      </WkToggleGroup>
      <code style="font-size:13px;">selected = "{{ selected || 'null' }}"</code>
    </div>
  `
})

export const AllVariants = () => ({
  components: { WkToggleGroup, WkToggle },
  data() {
    return { sel1: 'a', sel2: 'b', sel3: 'b', sel4: 'a', sel5: 'b' }
  },
  template: `
    <div style="display:flex; flex-direction:column; gap:24px; align-items:flex-start;">
      <div style="display:flex; flex-direction:column; gap:8px;">
        <span style="color:var(--muted-fg); font-size:12px;">outlined</span>
        <div style="display:flex; gap:12px; flex-wrap:wrap; align-items:center;">
          <WkToggleGroup v-model="sel1">
            <WkToggle value="a">Single</WkToggle>
          </WkToggleGroup>
          <WkToggleGroup v-model="sel2">
            <WkToggle value="a">Left</WkToggle>
            <WkToggle value="b">Right</WkToggle>
          </WkToggleGroup>
          <WkToggleGroup v-model="sel3">
            <WkToggle value="a">Left</WkToggle>
            <WkToggle value="b">Middle</WkToggle>
            <WkToggle value="c">Right</WkToggle>
          </WkToggleGroup>
        </div>
      </div>
      <div style="display:flex; flex-direction:column; gap:8px;">
        <span style="color:var(--muted-fg); font-size:12px;">ghost</span>
        <div style="display:flex; gap:12px; flex-wrap:wrap; align-items:center;">
          <WkToggleGroup v-model="sel4">
            <WkToggle variant="ghost" value="a">Single</WkToggle>
          </WkToggleGroup>
          <WkToggleGroup v-model="sel5">
            <WkToggle variant="ghost" value="a">Left</WkToggle>
            <WkToggle variant="ghost" value="b">Middle</WkToggle>
            <WkToggle variant="ghost" value="c">Right</WkToggle>
          </WkToggleGroup>
        </div>
      </div>
    </div>
  `
})

export const SingleSelect = () => ({
  components: { WkToggleGroup, WkToggle },
  data() {
    return { selected: 'week' }
  },
  template: `
    <div style="display:flex; flex-direction:column; gap:12px; align-items:flex-start;">
      <WkToggleGroup v-model="selected">
        <WkToggle value="day">Day</WkToggle>
        <WkToggle value="week">Week</WkToggle>
        <WkToggle value="month">Month</WkToggle>
        <WkToggle value="year">Year</WkToggle>
      </WkToggleGroup>
      <code style="font-size:13px;">selected = "{{ selected || 'null' }}"</code>
      <p style="font-size:13px; color:var(--muted-fg); margin:0;">Click the active toggle again to deselect.</p>
    </div>
  `
})
SingleSelect.parameters = {
  docs: { description: { story: 'Default mode — only one WkToggle active at a time.' } }
}

export const MultipleSelect = () => ({
  components: { WkToggleGroup, WkToggle },
  data() {
    return { active: ['bold'] }
  },
  template: `
    <div style="display:flex; flex-direction:column; gap:12px; align-items:flex-start;">
      <WkToggleGroup v-model="active" :multiple="true">
        <WkToggle value="bold">B</WkToggle>
        <WkToggle value="italic">I</WkToggle>
        <WkToggle value="underline">U</WkToggle>
        <WkToggle value="strike">S</WkToggle>
      </WkToggleGroup>
      <code style="font-size:13px;">active = {{ JSON.stringify(active) }}</code>
    </div>
  `
})
MultipleSelect.parameters = {
  docs: { description: { story: 'Pass `:multiple="true"` to allow multiple toggles to be active simultaneously.' } }
}

export const IconOnly = () => ({
  components: { WkToggleGroup, WkToggle },
  data() {
    return { align: 'left', alignLeftIcon, alignCenterIcon, alignRightIcon }
  },
  template: `
    <div style="display:flex; flex-direction:column; gap:12px; align-items:flex-start;">
      <WkToggleGroup v-model="align">
        <WkToggle value="left" aria-label="Align left">
          <template #icon>
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true"><path d="M2.5 4h11M2.5 8h7M2.5 12h11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </template>
        </WkToggle>
        <WkToggle value="center" aria-label="Align center">
          <template #icon>
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true"><path d="M2.5 4h11M4.5 8h7M2.5 12h11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </template>
        </WkToggle>
        <WkToggle value="right" aria-label="Align right">
          <template #icon>
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" aria-hidden="true"><path d="M2.5 4h11M4.5 8h9M2.5 12h11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </template>
        </WkToggle>
      </WkToggleGroup>
      <code style="font-size:13px;">align = "{{ align }}"</code>
    </div>
  `
})

export const GhostVariant = () => ({
  components: { WkToggleGroup, WkToggle },
  data() {
    return { selected: 'a' }
  },
  template: `
    <div style="display:flex; flex-direction:column; gap:12px; align-items:flex-start;">
      <WkToggleGroup v-model="selected">
        <WkToggle variant="ghost" value="a">Option A</WkToggle>
        <WkToggle variant="ghost" value="b">Option B</WkToggle>
        <WkToggle variant="ghost" value="c">Option C</WkToggle>
      </WkToggleGroup>
      <code style="font-size:13px;">selected = "{{ selected || 'null' }}"</code>
    </div>
  `
})

export const FocusVisible = () => ({
  components: { WkToggleGroup, WkToggle },
  template: `
    <div style="display:flex; flex-direction:column; gap:12px; align-items:flex-start;">
      <WkToggleGroup>
        <WkToggle value="a">Left</WkToggle>
        <WkToggle value="b">Middle</WkToggle>
        <WkToggle value="c">Right</WkToggle>
      </WkToggleGroup>
    </div>
  `
})
FocusVisible.parameters = {
  docs: { description: { story: 'Tab through the toggles to verify focus rings and z-index lift.' } }
}
