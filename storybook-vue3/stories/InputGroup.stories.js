import WkInputGroup from '../../src/components/input-group/InputGroup.vue'
import WkInputGroupAddon from '../../src/components/input-group-addon/InputGroupAddon.vue'
import WkInput from '../../src/components/input/Input.vue'
import WkButton from '../../src/components/button/Button.vue'
import WkSelect from '../../src/components/select/Select.vue'

const SIZES = ['tiny', 'xs', 'sm', 'md', 'lg']
const components = { WkInputGroup, WkInputGroupAddon, WkInput, WkButton, WkSelect }

const PROTOCOLS = ['http://', 'https://', 'ftp://']
const CURRENCIES = ['VND', 'USD', 'EUR']
const SELECT_SIZES = ['xs', 'sm', 'md', 'lg']

export default {
  title: 'Forms/InputGroup',
  component: WkInputGroup,
  parameters: {
    docs: {
      description: {
        component:
          'Layout container that visually joins `WkInput`, `WkButton`, `WkSelect` and `WkInputGroupAddon` children. ' +
          'Radius on inner corners is removed and shared borders collapse via CSS. ' +
          'Set `size` / `error` / `disabled` on each child — the group does not propagate them.'
      }
    }
  }
}

export const Primary = () => ({
  components,
  template: `
    <div style="max-width:420px">
      <WkInputGroup>
        <WkInputGroupAddon>https://</WkInputGroupAddon>
        <WkInput placeholder="example.com" />
      </WkInputGroup>
    </div>
  `
})

export const AllVariants = () => ({
  components,
  template: `
    <div style="display:flex; flex-direction:column; gap:16px; max-width:420px">
      <WkInputGroup><WkInputGroupAddon>https://</WkInputGroupAddon><WkInput placeholder="domain" /></WkInputGroup>
      <WkInputGroup><WkInput placeholder="Search..." /><WkButton variant="outline">Search</WkButton></WkInputGroup>
      <WkInputGroup>
        <WkInputGroupAddon>https://</WkInputGroupAddon><WkInput placeholder="domain" /><WkInputGroupAddon>.com</WkInputGroupAddon>
      </WkInputGroup>
      <WkInputGroup><WkInput placeholder="Error" error /><WkButton variant="outline">Go</WkButton></WkInputGroup>
      <WkInputGroup><WkInput placeholder="Disabled" disabled /><WkButton variant="outline" disabled>Go</WkButton></WkInputGroup>
    </div>
  `
})

export const Matrix = () => ({
  components,
  data: () => ({ SIZES }),
  template: `
    <div style="display:flex; flex-direction:column; gap:12px; max-width:420px">
      <WkInputGroup v-for="s in SIZES" :key="s">
        <WkInputGroupAddon :size="s">{{ s }}</WkInputGroupAddon>
        <WkInput :size="s" placeholder="Input" />
        <WkButton :size="s === 'tiny' ? 'mini' : s" variant="outline">Go</WkButton>
      </WkInputGroup>
    </div>
  `
})

export const AddonSlot = () => ({
  components,
  template: `
    <div style="max-width:420px">
      <WkInputGroup label="price">
        <WkInputGroupAddon>₫</WkInputGroupAddon>
        <WkInput placeholder="0" />
        <WkInputGroupAddon>VND</WkInputGroupAddon>
      </WkInputGroup>
    </div>
  `
})

export const FocusVisible = () => ({
  components,
  template: `
    <div style="max-width:420px">
      <WkInputGroup>
        <WkInput placeholder="Tab into me" />
        <WkButton variant="outline" tabindex="0">Go</WkButton>
      </WkInputGroup>
    </div>
  `
})

export const WithSelect = () => ({
  components,
  data: () => ({ PROTOCOLS, CURRENCIES }),
  template: `
    <div style="display:flex; flex-direction:column; gap:16px; max-width:420px">
      <WkInputGroup>
        <WkSelect value="https://" :options="PROTOCOLS" style="flex:0 0 120px" />
        <WkInput placeholder="example.com" />
      </WkInputGroup>
      <WkInputGroup>
        <WkInput placeholder="0.00" />
        <WkSelect value="VND" :options="CURRENCIES" style="flex:0 0 100px" />
      </WkInputGroup>
      <WkInputGroup>
        <WkSelect value="https://" :options="PROTOCOLS" style="flex:0 0 120px" />
        <WkInput placeholder="example.com" />
        <WkButton variant="outline">Go</WkButton>
      </WkInputGroup>
      <WkInputGroup>
        <WkSelect value="https://" :options="PROTOCOLS" error style="flex:0 0 120px" />
        <WkInput placeholder="Error" error />
      </WkInputGroup>
      <WkInputGroup>
        <WkSelect value="https://" :options="PROTOCOLS" disabled style="flex:0 0 120px" />
        <WkInput placeholder="Disabled" disabled />
      </WkInputGroup>
    </div>
  `
})

export const SelectMatrix = () => ({
  components,
  data: () => ({ PROTOCOLS, SELECT_SIZES }),
  template: `
    <div style="display:flex; flex-direction:column; gap:12px; max-width:420px">
      <WkInputGroup v-for="s in SELECT_SIZES" :key="s">
        <WkSelect :size="s" value="https://" :options="PROTOCOLS" style="flex:0 0 120px" />
        <WkInput :size="s" placeholder="Input" />
      </WkInputGroup>
    </div>
  `
})
