<template>
  <div class="ui-dp-time-panel">
    <div class="ui-dp-time-panel__col">
      <button
        v-for="h in hourList"
        :key="h.value"
        :disabled="h.disabled"
        :class="['ui-dp-time-panel__item', h.value === value.hour && 'is-selected', h.disabled && 'is-disabled']"
        @click="!h.disabled && onChange('hour', h.value)"
      >
        {{ pad(h.value) }}
      </button>
    </div>

    <div class="ui-dp-time-panel__col">
      <button
        v-for="m in minuteList"
        :key="m.value"
        :disabled="m.disabled"
        :class="['ui-dp-time-panel__item', m.value === value.minute && 'is-selected', m.disabled && 'is-disabled']"
        @click="!m.disabled && onChange('minute', m.value)"
      >
        {{ pad(m.value) }}
      </button>
    </div>

    <div v-if="showSeconds" class="ui-dp-time-panel__col">
      <button
        v-for="s in secondList"
        :key="s.value"
        :disabled="s.disabled"
        :class="['ui-dp-time-panel__item', s.value === value.second && 'is-selected', s.disabled && 'is-disabled']"
        @click="!s.disabled && onChange('second', s.value)"
      >
        {{ pad(s.value) }}
      </button>
    </div>
  </div>
</template>

<script>
import { DATE_PICKER_CTX } from '../../context.js'

export default {
  name: 'TimePanel',
  inject: { ctx: { from: DATE_PICKER_CTX, default: null } },
  emits: [],
  computed: {
    value() {
      return this.ctx ? this.ctx.timeValue : { hour: 0, minute: 0, second: 0 }
    },
    showSeconds() {
      return this.ctx ? this.ctx.showSeconds : false
    },
    hourStep() {
      return this.ctx ? this.ctx.hourStep : 1
    },
    minuteStep() {
      return this.ctx ? this.ctx.minuteStep : 1
    },
    secondStep() {
      return this.ctx ? this.ctx.secondStep : 1
    },
    disabledTime() {
      return this.ctx ? this.ctx.disabledTime : null
    },
    timeConstraints() {
      return this.disabledTime ? this.disabledTime() : {}
    },
    hourList() {
      return this.buildList(24, this.hourStep, this.timeConstraints.disabledHours)
    },
    minuteList() {
      return this.buildList(60, this.minuteStep, this.timeConstraints.disabledMinutes)
    },
    secondList() {
      return this.buildList(60, this.secondStep, this.timeConstraints.disabledSeconds)
    }
  },
  methods: {
    buildList(max, step, disabledFn) {
      const out = []
      for (let i = 0; i < max; i += step) {
        out.push({ value: i, disabled: typeof disabledFn === 'function' && disabledFn().includes(i) })
      }
      return out
    },
    pad(n) {
      return String(n).padStart(2, '0')
    },
    onChange(unit, val) {
      if (this.ctx) this.ctx.changeTime({ ...this.value, [unit]: val })
    }
  }
}
</script>

<style src="./time-panel.css" scoped></style>
