<template>
  <div
    :class="['ui-dp-trigger', `ui-dp-trigger--${size}`, disabled && 'is-disabled', focused && 'is-focus']"
    :tabindex="disabled ? -1 : 0"
    role="combobox"
    :aria-expanded="focused ? 'true' : 'false'"
    :aria-haspopup="true"
    @click="$emit('click', $event)"
    @keydown="$emit('keydown', $event)"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
  >
    <span class="ui-dp-trigger__icon">
      <slot name="icon" />
    </span>

    <span class="ui-dp-trigger__text" :class="{ 'is-placeholder': !hasValue }">
      {{ hasValue ? displayText : placeholder }}
    </span>

    <span
      v-if="clearable && hasValue && !disabled"
      role="button"
      tabindex="0"
      class="ui-dp-trigger__clear"
      aria-label="Clear"
      @click.stop="$emit('clear')"
      @keydown.enter.stop.prevent="$emit('clear')"
      @keydown.space.stop.prevent="$emit('clear')"
    >
      <WkiX :size="14" />
    </span>
  </div>
</template>

<script>
import { WkiX } from '../../icons'
export default {
  name: 'PickerTrigger',
  components: { WkiX },
  props: {
    displayText: { type: String, default: '' },
    placeholder: { type: String, default: 'Select date' },
    hasValue: { type: Boolean, default: false },
    clearable: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    focused: { type: Boolean, default: false },
    size: {
      type: String,
      default: 'md',
      validator: v => ['xs', 'sm', 'md', 'lg'].includes(v)
    }
  },
  emits: ['click', 'keydown', 'focus', 'blur', 'clear']
}
</script>

<style src="./picker-trigger.css" scoped></style>
