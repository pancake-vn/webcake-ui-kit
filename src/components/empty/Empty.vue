<template>
  <div :class="['ui-empty', `ui-empty--${variant}`]">
    <div class="ui-empty__content">
      <div v-if="hasMedia" class="ui-empty__media">
        <slot name="media"></slot>
      </div>
      <div v-if="hasTextBlock" class="ui-empty__text">
        <p v-if="hasTitle" class="ui-empty__title">
          <slot name="title">{{ title }}</slot>
        </p>
        <p v-if="hasDescription" class="ui-empty__description">
          <slot name="description">{{ description }}</slot>
        </p>
      </div>
      <div v-if="hasFooter" class="ui-empty__footer">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Empty',
  props: {
    variant: {
      type: String,
      default: 'default',
      validator: v => ['default', 'outline', 'background', 'outline-dashed'].includes(v)
    },
    title: { type: String, default: '' },
    description: { type: String, default: '' }
  },
  emits: [],
  computed: {
    hasMedia() {
      return !!((this.$scopedSlots && this.$scopedSlots.media) || this.$slots.media)
    },
    hasTitle() {
      return !!this.title || !!((this.$scopedSlots && this.$scopedSlots.title) || this.$slots.title)
    },
    hasDescription() {
      return !!this.description || !!((this.$scopedSlots && this.$scopedSlots.description) || this.$slots.description)
    },
    hasTextBlock() {
      return this.hasTitle || this.hasDescription
    },
    hasFooter() {
      return !!((this.$scopedSlots && this.$scopedSlots.default) || this.$slots.default)
    }
  }
}
</script>

<style src="./empty.css" scoped></style>
