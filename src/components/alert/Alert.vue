<template>
  <div class="ui-alert" :class="`ui-alert--${type}`" role="alert">
    <div class="ui-alert__body">
      <span class="ui-alert__icon">
        <slot name="icon"><component :is="iconComponent" :size="20" /></slot>
      </span>
      <div class="ui-alert__content">
        <div v-if="hasTitle" class="ui-alert__title">
          <slot>{{ title }}</slot>
        </div>
        <div v-if="hasDescription" class="ui-alert__description">
          <slot name="description">{{ description }}</slot>
        </div>
      </div>
    </div>
    <div v-if="hasAction" class="ui-alert__action">
      <slot name="action" />
    </div>
    <button v-if="closable" class="ui-alert__close" type="button" aria-label="Close" @click.stop="$emit('close')">
      <WkiX :size="16" class="ui-alert__close-icon" />
    </button>
  </div>
</template>

<script>
import { WkiCircleCheck, WkiCircleAlert, WkiTriangleAlert, WkiInfo, WkiX } from '../../icons'

const ICON_BY_TYPE = {
  neutral: 'WkiCircleCheck',
  error: 'WkiCircleAlert',
  warning: 'WkiTriangleAlert',
  info: 'WkiInfo',
  success: 'WkiCircleCheck'
}

export default {
  name: 'Alert',
  components: { WkiCircleCheck, WkiCircleAlert, WkiTriangleAlert, WkiInfo, WkiX },
  props: {
    type: {
      type: String,
      default: 'neutral',
      validator: function (v) {
        return ['neutral', 'error', 'warning', 'info', 'success'].includes(v)
      }
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    closable: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  computed: {
    iconComponent: function () {
      return ICON_BY_TYPE[this.type] || ICON_BY_TYPE.neutral
    },
    hasTitle: function () {
      return !!(this.title || this.$slots.default)
    },
    hasDescription: function () {
      return !!(this.description || this.$slots.description)
    },
    hasAction: function () {
      return !!this.$slots.action
    }
  }
}
</script>

<style src="./alert.css" scoped></style>
