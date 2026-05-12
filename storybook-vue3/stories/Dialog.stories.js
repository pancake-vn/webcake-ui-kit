import WkDialog from '../../src/components/dialog/Dialog.vue'
import WkButton from '../../src/components/button/Button.vue'

const ALIGN = ['right', 'fill']

export default {
  title: 'Components/Overlays/Dialog',
  component: WkDialog,
  argTypes: {
    footerAlign: { control: { type: 'inline-radio' }, options: ALIGN },
    title: { control: 'text' },
    subText: { control: 'text' },
    okText: { control: 'text' },
    cancelText: { control: 'text' },
    centered: { control: 'boolean' },
    mask: { control: 'boolean' },
    maskClosable: { control: 'boolean' },
    keyboard: { control: 'boolean' },
    closable: { control: 'boolean' },
    footer: { control: 'boolean' },
    confirmLoading: { control: 'boolean' },
    onOk: { action: 'ok' },
    onCancel: { action: 'cancel' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Modal dialog with mask, keyboard (Esc), maskClosable, body scroll lock, focus management, ' +
          'and a default OK/Cancel footer. Header (title, subText, close button) ' +
          'and footer (align, divider) are built-in. ' +
          'Dual-compat v-model: Vue 2 uses `v-model` on the `open` prop; Vue 3 uses `v-model` on `modelValue`.'
      }
    }
  }
}

const Template = args => ({
  components: { WkDialog, WkButton },
  data() {
    return { open: false }
  },
  computed: {
    bound() {
      return args
    }
  },
  template: `
    <div>
      <WkButton variant="primary" @click="open = true">Open dialog</WkButton>
      <WkDialog v-model="open" v-bind="bound" @ok="open = false">
        <p>This is the dialog body.</p>
        <p>Click outside, press Esc, or use the footer buttons to close.</p>
      </WkDialog>
    </div>
  `
})

export const Primary = Template.bind({})
Primary.args = { title: 'Title', subText: 'Optional supporting text' }

export const Centered = Template.bind({})
Centered.args = { title: 'Centered dialog', centered: true }

export const Mobile = Template.bind({})
Mobile.args = { title: 'Mobile dialog', centered: true, footerAlign: 'fill' }

export const NoMask = Template.bind({})
NoMask.args = { title: 'No backdrop', mask: false }

export const NotMaskClosable = Template.bind({})
NotMaskClosable.args = { title: 'Click outside does nothing', maskClosable: false }

export const NoKeyboard = Template.bind({})
NoKeyboard.args = { title: 'Esc disabled', keyboard: false }

export const NoFooter = Template.bind({})
NoFooter.args = { title: 'No footer', footer: false }

export const AsyncLoading = () => ({
  components: { WkDialog, WkButton },
  data() {
    return { open: false, loading: false }
  },
  methods: {
    async onOk() {
      this.loading = true
      await new Promise(resolve => setTimeout(resolve, 2000))
      this.open = false
      this.loading = false
    }
  },
  template: `
    <div>
      <WkButton variant="primary" @click="open = true">Open async dialog</WkButton>
      <WkDialog v-model="open" :confirmLoading="loading" title="Save changes?" ok-text="Save" @ok="onOk">
        <p>OK button automatically shows a loading state because @ok returns a Promise.</p>
      </WkDialog>
    </div>
  `
})

export const LongContent = () => ({
  components: { WkDialog, WkButton },
  data() {
    return { open: false }
  },
  template: `
    <div>
      <WkButton variant="primary" @click="open = true">Open scrollable dialog</WkButton>
      <WkDialog v-model="open" title="Long content">
        <p v-for="n in 30" :key="n" style="margin: 0 0 12px 0;">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Paragraph #{{ n }}.
        </p>
      </WkDialog>
    </div>
  `
})

export const CustomFooter = () => ({
  components: { WkDialog, WkButton },
  data() {
    return { open: false }
  },
  template: `
    <div>
      <WkButton variant="primary" @click="open = true">Open custom footer</WkButton>
      <WkDialog v-model="open" title="Three actions" footer-align="fill">
        <p>Override the footer buttons via the <code>footer</code> slot.</p>
        <template #footer>
          <WkButton variant="ghost" @click="open = false">Discard</WkButton>
          <WkButton variant="outline" @click="open = false">Save draft</WkButton>
          <WkButton variant="primary" @click="open = false">Publish</WkButton>
        </template>
      </WkDialog>
    </div>
  `
})

export const FillFooter = Template.bind({})
FillFooter.args = { title: 'Fill footer', footerAlign: 'fill', centered: true }

export const Minimizable = () => ({
  components: { WkDialog, WkButton },
  data() {
    return { open: false }
  },
  template: `
    <div>
      <WkButton variant="primary" @click="open = true">Open minimizable dialog</WkButton>
      <WkDialog v-model="open" title="Minimizable" minimizable>
        <p>Click the dash icon (—) to collapse the body. Click the restore icon to expand again.</p>
        <p>Closing the dialog resets the minimized state.</p>
      </WkDialog>
    </div>
  `
})

export const Fullscreen = () => ({
  components: { WkDialog, WkButton },
  data() {
    return { open: false }
  },
  template: `
    <div>
      <WkButton variant="primary" @click="open = true">Open fullscreen dialog</WkButton>
      <WkDialog v-model="open" title="Minimizable + Fullscreen" minimizable fullscreen>
        <p>Click the expand icon to enter fullscreen — the dialog fills the viewport.</p>
        <p>Click the compress icon to exit. The minimize and fullscreen states are mutually exclusive.</p>
        <p>Closing resets both states.</p>
      </WkDialog>
    </div>
  `
})

export const StackedDialogs = () => ({
  components: { WkDialog, WkButton },
  data() {
    return { open1: false, open2: false }
  },
  template: `
    <div>
      <WkButton variant="primary" @click="open1 = true">Open WkDialog 1</WkButton>
      <WkDialog v-model="open1" title="First WkDialog" width="600">
        <p>This is the first dialog.</p>
        <br/>
        <WkButton variant="primary" @click="open2 = true">Open WkDialog 2</WkButton>
      </WkDialog>
      <WkDialog v-model="open2" title="Second WkDialog" width="400" :z-index="1050">
        <p>This is the second dialog stacked on top of the first one.</p>
      </WkDialog>
    </div>
  `
})

export const CustomWidth = () => ({
  components: { WkDialog, WkButton },
  data() {
    return { open: false }
  },
  template: `
    <div>
      <WkButton variant="primary" @click="open = true">Open 800px WkDialog</WkButton>
      <WkDialog v-model="open" title="Custom Width" width="800">
        <p>This dialog has a custom width of 800px instead of the default.</p>
        <p>You can pass a number (e.g. <code>width="800"</code>) or a string (e.g. <code>width="50vw"</code>).</p>
      </WkDialog>
    </div>
  `
})

export const WithBlur = () => ({
  components: { WkDialog, WkButton },
  data() {
    return { open: false }
  },
  template: `
    <div>
      <WkButton variant="primary" @click="open = true">Open Blurred WkDialog</WkButton>
      <WkDialog v-model="open" title="Blurred Backdrop" blur>
        <p>The backdrop mask behind this dialog is blurred.</p>
      </WkDialog>
    </div>
  `
})

export const AllVariants = () => ({
  components: { WkDialog, WkButton },
  data() {
    return {
      states: [
        { key: 'default', label: 'Default', open: false },
        { key: 'centered', label: 'Centered', open: false, centered: true },
        { key: 'fill', label: 'Fill footer', open: false, centered: true, footerAlign: 'fill' },
        { key: 'nofooter', label: 'No footer', open: false, footer: false }
      ]
    }
  },
  template: `
    <div style="display:flex; gap:12px; flex-wrap:wrap;">
      <WkButton
        v-for="s in states"
        :key="s.key"
        variant="secondary"
        @click="s.open = true"
      >{{ s.label }}</WkButton>
      <WkDialog
        v-for="s in states"
        :key="s.key + '-dialog'"
        v-model="s.open"
        :title="s.label"
        :centered="s.centered"
        :footer="s.footer !== false"
        :footer-align="s.footerAlign || 'right'"
      >
        <p>WkDialog variant: {{ s.label }}</p>
      </WkDialog>
    </div>
  `
})

export const FocusVisible = () => ({
  components: { WkDialog, WkButton },
  data() {
    return { open: false }
  },
  template: `
    <div>
      <WkButton variant="primary" @click="open = true">Open + tab through</WkButton>
      <WkDialog v-model="open" title="Tab through">
        <p>Tab through the close icon, body, and footer buttons.</p>
      </WkDialog>
    </div>
  `
})
FocusVisible.parameters = {
  docs: { description: { story: 'When the dialog opens, focus moves to the wrap; tab to verify focus rings.' } }
}
