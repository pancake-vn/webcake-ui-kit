<template>
  <span :class="['ui-avatar', `ui-avatar--${size}`, `ui-avatar--${roundness}`]">
    <img v-if="showImage" class="ui-avatar__image" :src="src" :alt="alt" @error="onImageError" />
    <span v-else class="ui-avatar__fallback">
      <slot>{{ name }}</slot>
    </span>
    <span v-if="online" class="ui-avatar__indicator" aria-hidden="true"></span>
  </span>
</template>

<script>
export default {
  name: 'Avatar',
  props: {
    size: {
      type: String,
      default: 'regular',
      validator: v => ['regular', 'small', 'tiny', 'extra-tiny'].includes(v)
    },
    roundness: {
      type: String,
      default: 'round',
      validator: v => ['round', 'roundrect'].includes(v)
    },
    src: { type: String, default: '' },
    alt: { type: String, default: '' },
    name: { type: String, default: '' },
    online: { type: Boolean, default: false }
  },
  emits: [],
  data() {
    return {
      imageError: false
    }
  },
  computed: {
    showImage() {
      return !!this.src && !this.imageError
    }
  },
  watch: {
    src() {
      this.imageError = false
    }
  },
  methods: {
    onImageError() {
      this.imageError = true
    }
  }
}
</script>

<style src="./avatar.css" scoped></style>
