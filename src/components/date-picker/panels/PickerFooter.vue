<template>
  <div class="ui-dp-picker-footer">
    <div class="ui-dp-picker-footer__range">
      <Input v-model="inputStart" size="sm" :placeholder="isRange ? 'Start date' : 'Select date'" />
      <template v-if="isRange">
        <WkiArrowRight :size="16" />
        <Input v-model="inputEnd" size="sm" placeholder="End date" />
      </template>
    </div>

    <div class="ui-dp-picker-footer__actions">
      <Button size="sm" variant="outline" @click="onCancel">{{ resolvedCancelText }}</Button>
      <Button size="sm" variant="primary" @click="onApply">{{ resolvedApplyText }}</Button>
    </div>
  </div>
</template>

<script>
import { DATE_PICKER_CTX } from '../context.js'
import Button from '../../button/Button.vue'
import Input from '../../input/Input.vue'
import { WkiArrowRight } from '../../../icons'
import dayjs, { ISO } from '../generate/dayjs.js'

export default {
  name: 'PickerFooter',
  components: { Button, WkiArrowRight, Input },
  inject: { ctx: { from: DATE_PICKER_CTX, default: null } },
  props: {
    cancelText: { type: String, default: null },
    applyText: { type: String, default: null }
  },
  emits: ['cancel', 'apply'],
  data() {
    return {
      inputStart: '',
      inputEnd: ''
    }
  },
  computed: {
    isRange() {
      return this.ctx ? this.ctx.isRange : false
    },
    fmt() {
      return this.ctx ? this.ctx.format : 'YYYY-MM-DD'
    },
    resolvedCancelText() {
      return this.cancelText || (this.ctx && this.ctx.cancelText) || 'Cancel'
    },
    resolvedApplyText() {
      return this.applyText || (this.ctx && this.ctx.confirmText) || 'Apply'
    },
    ctxStartISO() {
      if (!this.ctx) return null
      return this.isRange ? this.ctx.rangeStart : this.ctx.selected[0] || null
    },
    ctxEndISO() {
      return this.ctx && this.isRange ? this.ctx.rangeEnd : null
    }
  },
  watch: {
    ctxStartISO(iso) {
      this.inputStart = iso ? dayjs(iso, ISO).format(this.fmt) : ''
    },
    ctxEndISO(iso) {
      this.inputEnd = iso ? dayjs(iso, ISO).format(this.fmt) : ''
    }
  },
  created() {
    if (this.ctxStartISO) this.inputStart = dayjs(this.ctxStartISO, ISO).format(this.fmt)
    if (this.ctxEndISO) this.inputEnd = dayjs(this.ctxEndISO, ISO).format(this.fmt)
  },
  methods: {
    parseToISO(str) {
      if (!str) return null
      const d = dayjs(str, this.fmt)
      return d.isValid() ? d.format(ISO) : null
    },
    onCancel() {
      if (this.ctx) this.ctx.cancel()
      this.$emit('cancel')
    },
    onApply() {
      if (!this.ctx) {
        this.$emit('apply')
        return
      }
      if (this.isRange) {
        const start = this.parseToISO(this.inputStart)
        const end = this.parseToISO(this.inputEnd)
        if (start && end) {
          this.ctx.selectPreset([dayjs(start, ISO), dayjs(end, ISO)])
          this.$emit('apply')
          return
        }
      } else {
        const iso = this.parseToISO(this.inputStart)
        if (iso) {
          this.ctx.selectDate(iso)
          this.$emit('apply')
          return
        }
      }
      this.ctx.confirm()
      this.$emit('apply')
    }
  }
}
</script>

<style src="./picker-panel.css" scoped></style>
