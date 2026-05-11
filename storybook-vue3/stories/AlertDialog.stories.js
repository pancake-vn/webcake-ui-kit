import AlertDialog from '../../src/components/alert-dialog/AlertDialog.vue'
import Button from '../../src/components/button/Button.vue'

const OK_VARIANTS = ['primary', 'destructive', 'secondary', 'neutral', 'outline', 'ghost']

export default {
  title: 'Components/AlertDialog',
  component: AlertDialog,
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
          'mask, transitions). Esc and mask-click are disabled by default per the AlertDialog pattern: ' +
          'the user must explicitly choose. Responsive: 480px wide on desktop with right-aligned buttons; ' +
          'below 480px the text centers and buttons go full-width (no size prop needed — resize the viewport).'
      }
    }
  }
}

const Template = args => ({
  components: { AlertDialog, Button },
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
      <Button variant="primary" @click="open = true">Open alert dialog</Button>
      <AlertDialog v-model="open" v-bind="bound" @ok="open = false" />
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
  components: { AlertDialog, Button },
  data() {
    return { open: '' }
  },
  template: `
    <div style="display: flex; flex-wrap: wrap; gap: 12px;">
      <Button variant="destructive" @click="open = 'delete'">Delete</Button>
      <Button variant="primary" @click="open = 'leave'">Leave page</Button>
      <Button variant="secondary" @click="open = 'confirm'">Confirm</Button>

      <AlertDialog
        :open="open === 'delete'"
        title="Delete this?"
        description="Are you sure you want to delete this item?"
        ok-text="Delete"
        ok-variant="destructive"
        @ok="open = ''"
        @cancel="open = ''"
      />
      <AlertDialog
        :open="open === 'leave'"
        title="Are you sure you want to leave this page?"
        description="Your changes might not be saved."
        ok-text="Cancel"
        cancel-text="Leave this page"
        @ok="open = ''"
        @cancel="open = ''"
      />
      <AlertDialog
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
  components: { AlertDialog, Button },
  data() {
    return {
      okVariants: ['primary', 'destructive', 'secondary', 'outline'],
      activeKey: ''
    }
  },
  template: `
    <div>
      <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 16px;">
        <Button
          v-for="v in okVariants"
          :key="v"
          :variant="v"
          @click="activeKey = v"
        >{{ v }}</Button>
      </div>
      <AlertDialog
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
  components: { AlertDialog, Button },
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
      <Button variant="primary" @click="open = true">Open async alert</Button>
      <AlertDialog
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
  components: { AlertDialog, Button },
  data() {
    return { open: false }
  },
  template: `
    <div>
      <Button variant="primary" @click="open = true">Open custom footer</Button>
      <AlertDialog v-model="open" title="Save changes?" description="You have unsaved changes.">
        <template #footer>
          <Button variant="ghost" @click="open = false">Discard</Button>
          <Button variant="outline" @click="open = false">Save draft</Button>
          <Button variant="primary" @click="open = false">Publish</Button>
        </template>
      </AlertDialog>
    </div>
  `
})

export const KeyboardClosable = () => ({
  components: { AlertDialog, Button },
  data() {
    return { open: false }
  },
  template: `
    <div>
      <Button variant="primary" @click="open = true">Open (Esc + click-outside enabled)</Button>
      <AlertDialog
        v-model="open"
        :keyboard="true"
        :mask-closable="true"
        title="Esc / click-outside enabled"
        description="Press Esc or click outside to dismiss. Defaults are off for AlertDialog — opt in here."
      />
    </div>
  `
})

export const FocusVisible = () => ({
  components: { AlertDialog, Button },
  data() {
    return { open: false }
  },
  template: `
    <div>
      <Button variant="primary" tabindex="0" @click="open = true">Open + tab through</Button>
      <AlertDialog
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
