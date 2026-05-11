<template>
  <div
    :class="[
      'ui-accordion-item',
      bordered && 'ui-accordion-item--bordered',
      isOpen && 'ui-accordion-item--open',
      disabled && 'ui-accordion-item--disabled'
    ]"
  >
    <button
      :id="triggerId"
      type="button"
      class="ui-accordion-item__trigger"
      :disabled="disabled"
      :aria-expanded="isOpen ? 'true' : 'false'"
      :aria-controls="contentId"
      @click="onClick"
    >
      <span class="ui-accordion-item__label-row">
        <span class="ui-accordion-item__label">
          <slot name="label">{{ label }}</slot>
        </span>
        <span v-if="hasAppend" class="ui-accordion-item__append">
          <slot name="append">{{ append }}</slot>
        </span>
      </span>
      <span :class="['ui-accordion-item__icon', isOpen && 'ui-accordion-item__icon--open']">
        <slot name="icon">
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path
              d="m4 6 4 4 4-4"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </slot>
      </span>
    </button>
    <div v-show="isOpen" :id="contentId" class="ui-accordion-item__content" role="region" :aria-labelledby="triggerId">
      <slot />
    </div>
  </div>
</template>

<script>
let uidCounter = 0

export default {
  name: 'AccordionItem',
  inject: {
    accordion: { default: null }
  },
  props: {
    label: { type: String, default: '' },
    value: { type: [String, Number], default: undefined },
    append: { type: String, default: '' },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      uid: `accordion-item-${++uidCounter}`
    }
  },
  computed: {
    itemKey() {
      return this.value !== undefined ? this.value : this.uid
    },
    triggerId() {
      return `${this.uid}-trigger`
    },
    contentId() {
      return `${this.uid}-content`
    },
    isOpen() {
      return this.accordion ? this.accordion.isOpen(this.itemKey) : false
    },
    bordered() {
      return this.accordion ? this.accordion.bordered : false
    },
    hasAppend() {
      const slots = this.$slots
      return !!this.append || !!(slots && slots['append'])
    }
  },
  methods: {
    onClick() {
      if (this.disabled) return
      if (this.accordion && typeof this.accordion.toggle === 'function') {
        this.accordion.toggle(this.itemKey)
      }
    }
  }
}
</script>

<style src="./accordion-item.css" scoped></style>
