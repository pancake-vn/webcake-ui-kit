<template>
  <div class="ui-time-panel">
    <div v-for="col in columns" :key="col.key" class="ui-time-panel__col" role="listbox" :aria-label="col.key">
      <button
        v-for="opt in col.options"
        :key="opt"
        type="button"
        class="ui-time-panel__opt"
        :class="{ 'is-active': opt === col.value, 'is-disabled': col.disabled.indexOf(opt) !== -1 }"
        :disabled="col.disabled.indexOf(opt) !== -1"
        :aria-selected="opt === col.value ? 'true' : 'false'"
        @click="onPick(col.key, opt)"
      >
        {{ pad(opt) }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimePanel',
  props: {
    // { hour, minute, second } — 24-hour numeric parts.
    value: {
      type: Object,
      default: () => ({ hour: 0, minute: 0, second: 0 })
    },
    showSeconds: { type: Boolean, default: false },
    hourStep: { type: Number, default: 1 },
    minuteStep: { type: Number, default: 1 },
    secondStep: { type: Number, default: 1 },
    // () => { disabledHours?, disabledMinutes?(h), disabledSeconds?(h,m) }
    disabledTime: { type: Function, default: null }
  },
  emits: ['change'],
  computed: {
    rules() {
      return (typeof this.disabledTime === 'function' && this.disabledTime()) || {}
    },
    columns() {
      const v = this.value || {}
      const h = v.hour || 0
      const m = v.minute || 0
      const cols = [
        {
          key: 'hour',
          value: h,
          options: this.range(24, this.hourStep),
          disabled: this.callRule(this.rules.disabledHours)
        },
        {
          key: 'minute',
          value: m,
          options: this.range(60, this.minuteStep),
          disabled: this.callRule(this.rules.disabledMinutes, h)
        }
      ]
      if (this.showSeconds) {
        cols.push({
          key: 'second',
          value: v.second || 0,
          options: this.range(60, this.secondStep),
          disabled: this.callRule(this.rules.disabledSeconds, h, m)
        })
      }
      return cols
    }
  },
  methods: {
    range(count, step) {
      const out = []
      const s = step > 0 ? step : 1
      for (let i = 0; i < count; i += s) out.push(i)
      return out
    },
    callRule(fn, a, b) {
      if (typeof fn !== 'function') return []
      const r = fn(a, b)
      return Array.isArray(r) ? r : []
    },
    pad(n) {
      return n < 10 ? '0' + n : '' + n
    },
    onPick(key, opt) {
      const next = {
        hour: this.value.hour || 0,
        minute: this.value.minute || 0,
        second: this.value.second || 0
      }
      next[key] = opt
      this.$emit('change', next)
    }
  }
}
</script>

<style src="./time-panel.css" scoped></style>
