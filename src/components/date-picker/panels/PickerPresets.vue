<template>
  <div class="ui-dp-picker-presets">
    <Toggle
      v-for="preset in presets"
      :key="preset.label"
      variant="ghost"
      size="sm"
      :active="isActive(preset)"
      @click="onPreset(preset)"
      >{{ preset.label }}</Toggle
    >
  </div>
</template>

<script>
import Toggle from '../../toggle/Toggle.vue'
import { DATE_PICKER_CTX } from '../context.js'
import dayjs, { ISO } from '../generate/dayjs.js'

export default {
  name: 'PickerPresets',
  components: { Toggle },
  inject: { ctx: { from: DATE_PICKER_CTX, default: null } },
  props: {},
  emits: [],
  computed: {
    presets() {
      return this.ctx ? this.ctx.presets : []
    }
  },
  methods: {
    toISO(val) {
      const d = dayjs.isDayjs(val) ? val : dayjs(val)
      return d.isValid() ? d.format(ISO) : null
    },
    isActive(preset) {
      if (!this.ctx) return false
      const { value } = preset
      if (Array.isArray(value)) {
        const start = this.toISO(value[0])
        const end = this.toISO(value[1])
        return !!start && !!end && this.ctx.rangeStart === start && this.ctx.rangeEnd === end
      }
      const iso = this.toISO(value)
      return !!iso && Array.isArray(this.ctx.selected) && this.ctx.selected.includes(iso)
    },
    onPreset(preset) {
      if (this.ctx) this.ctx.selectPreset(preset.value)
    }
  }
}
</script>

<style src="./picker-panel.css" scoped></style>
