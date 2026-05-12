import WkAlertDialog from '../../src/components/alert-dialog/AlertDialog.vue'
import WkButton from '../../src/components/button/Button.vue'

const OK_VARIANTS = ['primary', 'destructive', 'secondary', 'neutral', 'outline', 'ghost']

export default {
  title: 'Components/AlertDialog',
  component: WkAlertDialog,
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    okText: { control: 'text' },
    cancelText: { control: 'text' },
    okVariant: { control: { type: 'select' }, options: OK_VARIANTS },
    cancelVariant: { control: { type: 'select' }, options: OK_VARIANTS },
    confirmLoading: { control: 'boolean' },
    mask: { control: 'boolean' },
    maskClosable: { control: 'boolean' },
    keyboard: { control: 'boolean' },
    onOk: { action: 'ok' },
    onCancel: { action: 'cancel' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'A modal dialog that interrupts the user with important content and expects a response. ' +
          'Built on top of `Modal` — inherits all overlay infrastructure (body-lock, focus management, ' +
          'mask, transitions). Esc and mask-click are disabled by default per the WkAlertDialog pattern: ' +
          'the user must explicitly choose. Responsive: 480px wide on desktop with right-aligned buttons; ' +
          'below 480px the text centers and buttons go full-width (no size prop needed — resize the viewport).'
      }
    }
  }
}

const Template = args => ({
  components: { WkAlertDialog, WkButton },
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
      <WkButton variant="primary" @click="open = true">Open alert dialog</WkButton>
      <WkAlertDialog v-model="open" v-bind="bound" @ok="open = false" />
    </div>
  `
})

export const Primary = Template.bind({})
Primary.args = {
  title: 'Delete this?',
  description: 'Are you sure you want to delete this item?',
  okText: 'Delete',
  okVariant: 'destructive'
}

export const LeaveThisPage = Template.bind({})
LeaveThisPage.args = {
  title: 'Are you sure you want to leave this page?',
  description: 'Your changes might not be saved.',
  okText: 'Cancel',
  cancelText: 'Leave this page'
}

export const AllVariants = () => ({
  components: { WkAlertDialog, WkButton },
  data() {
    return { open: '' }
  },
  template: `
    <div style="display: flex; flex-wrap: wrap; gap: 12px;">
      <WkButton variant="destructive" @click="open = 'delete'">Delete</WkButton>
      <WkButton variant="primary" @click="open = 'leave'">Leave page</WkButton>
      <WkButton variant="secondary" @click="open = 'confirm'">Confirm</WkButton>

      <WkAlertDialog
        :open="open === 'delete'"
        title="Delete this?"
        description="Are you sure you want to delete this item?"
        ok-text="Delete"
        ok-variant="destructive"
        @ok="open = ''"
        @cancel="open = ''"
      />
      <WkAlertDialog
        :open="open === 'leave'"
        title="Are you sure you want to leave this page?"
        description="Your changes might not be saved."
        ok-text="Cancel"
        cancel-text="Leave this page"
        @ok="open = ''"
        @cancel="open = ''"
      />
      <WkAlertDialog
        :open="open === 'confirm'"
        title="Confirm action"
        description="This action cannot be undone."
        ok-text="Confirm"
        @ok="open = ''"
        @cancel="open = ''"
      />
    </div>
  `
})

export const OkVariantMatrix = () => ({
  components: { WkAlertDialog, WkButton },
  data() {
    return {
      okVariants: ['primary', 'destructive', 'secondary', 'outline'],
      activeKey: ''
    }
  },
  template: `
    <div>
      <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 16px;">
        <WkButton
          v-for="v in okVariants"
          :key="v"
          :variant="v"
          @click="activeKey = v"
        >{{ v }}</WkButton>
      </div>
      <WkAlertDialog
        v-for="v in okVariants"
        :key="v"
        :open="activeKey === v"
        title="Confirm action"
        description="This action cannot be undone."
        ok-text="Confirm"
        :ok-variant="v"
        @ok="activeKey = ''"
        @cancel="activeKey = ''"
      />
    </div>
  `
})

export const ConfirmLoading = () => ({
  components: { WkAlertDialog, WkButton },
  data() {
    return { open: false, loading: false }
  },
  methods: {
    onOk() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.open = false
      }, 1500)
    }
  },
  template: `
    <div>
      <WkButton variant="primary" @click="open = true">Open async alert</WkButton>
      <WkAlertDialog
        v-model="open"
        title="Confirm purchase"
        description="Charge your card for the selected plan?"
        ok-text="Confirm"
        :confirm-loading="loading"
        @ok="onOk"
      />
    </div>
  `
})

export const CustomFooter = () => ({
  components: { WkAlertDialog, WkButton },
  data() {
    return { open: false }
  },
  template: `
    <div>
      <WkButton variant="primary" @click="open = true">Open custom footer</WkButton>
      <WkAlertDialog v-model="open" title="Save changes?" description="You have unsaved changes.">
        <template #footer>
          <WkButton variant="ghost" @click="open = false">Discard</WkButton>
          <WkButton variant="outline" @click="open = false">Save draft</WkButton>
          <WkButton variant="primary" @click="open = false">Publish</WkButton>
        </template>
      </WkAlertDialog>
    </div>
  `
})

export const KeyboardClosable = () => ({
  components: { WkAlertDialog, WkButton },
  data() {
    return { open: false }
  },
  template: `
    <div>
      <WkButton variant="primary" @click="open = true">Open (Esc + click-outside enabled)</WkButton>
      <WkAlertDialog
        v-model="open"
        :keyboard="true"
        :mask-closable="true"
        title="Esc / click-outside enabled"
        description="Press Esc or click outside to dismiss. Defaults are off for WkAlertDialog — opt in here."
      />
    </div>
  `
})

export const FocusVisible = () => ({
  components: { WkAlertDialog, WkButton },
  data() {
    return { open: false }
  },
  template: `
    <div>
      <WkButton variant="primary" tabindex="0" @click="open = true">Open + tab through</WkButton>
      <WkAlertDialog
        v-model="open"
        title="Tab through me"
        description="When this opens, focus moves to the wrap. Tab to verify the focus rings on Cancel and Continue."
        ok-text="Continue"
      />
    </div>
  `
})
FocusVisible.parameters = {
  docs: {
    description: {
      story:
        'When the alert dialog opens, focus moves to the wrap; tab through the Cancel and Continue buttons to verify focus rings.'
    }
  }
}
