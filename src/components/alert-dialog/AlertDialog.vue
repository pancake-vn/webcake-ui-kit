<template>
  <Dialog
    :open="isOpen"
    :show-header="false"
    :footer="true"
    :footer-align="'right'"
    :footer-divider="true"
    :centered="true"
    :mask="mask"
    :mask-closable="maskClosable"
    :keyboard="keyboard"
    :append-to-body="appendToBody"
    :z-index="zIndex"
    @change="setOpen"
    @after-close="$emit('after-close')"
  >
    <div class="ui-alert-dialog-body">
      <div class="ui-alert-dialog-title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div class="ui-alert-dialog-description">
        <slot>{{ description }}</slot>
      </div>
    </div>
    <template #footer>
      <slot name="footer">
        <Button :variant="cancelVariant" class="ui-alert-dialog-btn" @click="handleCancel">{{ cancelText }}</Button>
        <Button :variant="okVariant" :loading="confirmLoading" class="ui-alert-dialog-btn" @click="handleOk">{{
          okText
        }}</Button>
      </slot>
    </template>
  </Dialog>
</template>

<script>
import Dialog from '../dialog/Dialog.vue'
import Button from '../button/Button.vue'

export default {
  name: 'AlertDialog',
  components: { Dialog, Button },
  model: { prop: 'open', event: 'change' },
  props: {
    open: { type: Boolean, default: false },
    modelValue: { type: Boolean, default: undefined },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    okText: { type: String, default: 'Continue' },
    cancelText: { type: String, default: 'Cancel' },
    okVariant: { type: String, default: 'primary' },
    cancelVariant: { type: String, default: 'outline' },
    confirmLoading: { type: Boolean, default: false },
    mask: { type: Boolean, default: true },
    maskClosable: { type: Boolean, default: false },
    keyboard: { type: Boolean, default: false },
    appendToBody: { type: Boolean, default: true },
    zIndex: { type: [Number, String], default: 1000 }
  },
  emits: ['change', 'update:modelValue', 'ok', 'cancel', 'after-close'],
  computed: {
    isOpen() {
      return this.modelValue !== undefined ? this.modelValue : this.open
    }
  },
  methods: {
    setOpen(v) {
      this.$emit('change', v)
      this.$emit('update:modelValue', v)
    },
    handleOk(e) {
      this.$emit('ok', e)
    },
    handleCancel(e) {
      this.$emit('cancel', e)
      this.setOpen(false)
    }
  }
}
</script>

<style src="./alert-dialog.css" scoped></style>
