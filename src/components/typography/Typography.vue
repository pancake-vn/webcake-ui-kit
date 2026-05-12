<template>
  <component
    :is="resolvedTag"
    :class="[
      'ui-typography',
      `wk-${variant}`,
      weight ? `wk-weight-${weight}` : null,
      align !== 'inherit' ? `wk-text-${align}` : null
    ]"
    :style="rootStyle"
  >
    <slot>{{ text }}</slot>
  </component>
</template>

<script>
const VARIANTS = [
  'heading-1',
  'heading-2',
  'heading-3',
  'heading-4',
  'paragraph-large',
  'paragraph-regular',
  'paragraph-small',
  'paragraph-mini',
  'caption',
  'caption-mini',
  'monospaced'
]

const DEFAULT_TAGS = {
  'heading-1': 'h1',
  'heading-2': 'h2',
  'heading-3': 'h3',
  'heading-4': 'h4',
  'paragraph-large': 'p',
  'paragraph-regular': 'p',
  'paragraph-small': 'p',
  'paragraph-mini': 'p',
  caption: 'span',
  'caption-mini': 'span',
  monospaced: 'span'
}

const COLORS = [
  '',
  'primary-fg',
  'secondary-fg',
  'muted-fg',
  'accent-fg',
  'inverse-fg',
  'destructive',
  'destructive-text'
]

const WEIGHTS = ['', 'regular', 'medium', 'bold']
const ALIGNS = ['inherit', 'left', 'center', 'right']

export default {
  name: 'Typography',
  props: {
    variant: {
      type: String,
      default: 'paragraph-regular',
      validator: v => VARIANTS.indexOf(v) !== -1
    },
    as: {
      type: String,
      default: ''
    },
    weight: {
      type: String,
      default: '',
      validator: v => WEIGHTS.indexOf(v) !== -1
    },
    color: {
      type: String,
      default: '',
      validator: v => COLORS.indexOf(v) !== -1
    },
    align: {
      type: String,
      default: 'inherit',
      validator: v => ALIGNS.indexOf(v) !== -1
    },
    text: {
      type: String,
      default: ''
    }
  },
  emits: [],
  computed: {
    resolvedTag() {
      return this.as || DEFAULT_TAGS[this.variant] || 'span'
    },
    rootStyle() {
      if (!this.color) return null
      return { '--ui-typography-color': 'var(--' + this.color + ')' }
    }
  }
}
</script>

<style src="./typography.css" scoped></style>
