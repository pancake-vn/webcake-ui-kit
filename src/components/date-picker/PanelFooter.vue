<template>
  <div class="ui-cal-footer">
    <div class="ui-cal-footer__left">
      <button
        v-if="showToday"
        type="button"
        class="ui-cal-footer__link"
        :disabled="todayDisabled"
        @click="$emit('today')"
      >
        {{ todayText }}
      </button>
    </div>
    <div class="ui-cal-footer__right">
      <WkButton v-if="showClear" size="mini" variant="ghost" @click="$emit('clear')">
        {{ clearText }}
      </WkButton>
      <WkButton v-if="showConfirm" size="mini" variant="primary" :disabled="confirmDisabled" @click="$emit('confirm')">
        {{ confirmText }}
      </WkButton>
    </div>
  </div>
</template>

<script>
import WkButton from '../button/Button.vue'

export default {
  name: 'PanelFooter',
  components: { WkButton },
  props: {
    showToday: { type: Boolean, default: true },
    showClear: { type: Boolean, default: true },
    showConfirm: { type: Boolean, default: false },
    todayDisabled: { type: Boolean, default: false },
    confirmDisabled: { type: Boolean, default: false },
    todayText: { type: String, default: 'Today' },
    clearText: { type: String, default: 'Clear' },
    confirmText: { type: String, default: 'OK' }
  },
  emits: ['today', 'clear', 'confirm']
}
</script>

<style src="./panel-footer.css" scoped></style>
