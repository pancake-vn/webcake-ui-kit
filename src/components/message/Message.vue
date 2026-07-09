<template>
  <div class="ui-message" :class="`ui-message--${type}`" role="status" aria-live="polite">
    <span class="ui-message__icon">
      <WkSpinner v-if="type === 'loading'" size="sm" />
      <component :is="iconComponent" v-else :size="18" />
    </span>
    <div class="ui-message__wrapper">
      <span class="ui-message__content">
        <slot>{{ content }}</slot>
      </span>
      <span v-if="description" class="ui-message__description">{{ description }}</span>
    </div>
    <WkButton v-if="action" size="mini" :variant="action.variant || 'primary'" @click="handleAction">{{
      action.label
    }}</WkButton>
  </div>
</template>

<script>
import WkSpinner from '../spinner/Spinner.vue'
import WkButton from '../button/Button.vue'
import { WkiCircleCheck, WkiCircleX, WkiTriangleAlert, WkiInfo } from '../../icons'

const ICON_BY_TYPE = {
  success: 'WkiCircleCheck',
  error: 'WkiCircleX',
  warning: 'WkiTriangleAlert',
  info: 'WkiInfo'
}

export default {
  name: 'Message',
  components: { WkSpinner, WkButton, WkiCircleCheck, WkiCircleX, WkiTriangleAlert, WkiInfo },
  props: {
    type: {
      type: String,
      default: 'info',
      validator: function (v) {
        return ['info', 'success', 'error', 'warning', 'loading'].includes(v)
      }
    },
    content: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: null
    },
    action: {
      type: Object,
      default: null
    }
  },
  emits: ['close'],
  computed: {
    iconComponent: function () {
      return ICON_BY_TYPE[this.type] || ICON_BY_TYPE.info
    }
  },
  methods: {
    handleAction: function () {
      if (typeof this.action.onClick === 'function') {
        this.action.onClick()
      }
      this.$emit('close')
    }
  }
}
</script>

<style src="./message.css" scoped></style>
