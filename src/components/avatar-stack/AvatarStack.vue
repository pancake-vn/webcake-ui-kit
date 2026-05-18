<template>
  <span :class="['ui-avatar-stack', `ui-avatar-stack--${size}`]">
    <span
      v-for="(item, idx) in visibleItems"
      :key="`avatar-${idx}`"
      :class="itemClasses"
      :style="{ zIndex: totalCount - idx }"
    >
      <slot name="avatar" :avatar="item" :index="idx" :size="size">
        <Avatar :size="size" :src="item.src || ''" :alt="item.alt || ''" :name="item.name || ''" />
      </slot>
    </span>
    <span v-if="overflowCount > 0" :class="itemClasses" :style="{ zIndex: 0 }">
      <Avatar :size="size" class="ui-avatar-stack__overflow">
        <slot name="overflow" v-bind="{ count: overflowCount }">{{ formattedOverflow }}</slot>
      </Avatar>
    </span>
  </span>
</template>

<script>
import Avatar from '../avatar/Avatar.vue'

export default {
  name: 'AvatarStack',
  components: { Avatar },
  props: {
    size: {
      type: String,
      default: 'regular',
      validator: v => ['regular', 'small'].includes(v)
    },
    items: {
      type: Array,
      default: () => []
    },
    max: {
      type: Number,
      default: 0
    },
    overflowLabel: {
      type: Function,
      default: null
    },
    animation: {
      type: String,
      default: 'none',
      validator: v => ['none', 'pulse', 'bounce', 'ring'].includes(v)
    }
  },
  emits: [],
  computed: {
    visibleItems() {
      if (this.max > 0 && this.items.length > this.max) {
        return this.items.slice(0, this.max)
      }
      return this.items
    },
    overflowCount() {
      if (this.max > 0 && this.items.length > this.max) {
        return this.items.length - this.max
      }
      return 0
    },
    formattedOverflow() {
      if (typeof this.overflowLabel === 'function') {
        return this.overflowLabel(this.overflowCount)
      }
      return '+' + this.overflowCount
    },
    totalCount() {
      return this.visibleItems.length + (this.overflowCount > 0 ? 1 : 0)
    },
    itemClasses() {
      const classes = ['ui-avatar-stack__item']
      if (this.animation !== 'none') {
        classes.push(`ui-avatar-stack__item--animation-${this.animation}`)
      }
      return classes
    }
  }
}
</script>

<style src="./avatar-stack.css" scoped></style>
