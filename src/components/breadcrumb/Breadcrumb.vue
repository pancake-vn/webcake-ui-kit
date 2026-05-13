<template>
  <nav class="ui-breadcrumb" aria-label="breadcrumb">
    <ol class="ui-breadcrumb__list">
      <slot>
        <li v-for="(item, index) in items" :key="index" class="ui-breadcrumb__row">
          <span v-if="index > 0" class="ui-breadcrumb__separator" aria-hidden="true">
            <slot name="separator" :type="separator">
              <SlashIcon v-if="separator === 'slash'" :size="16" />
              <ChevronRightIcon v-else :size="16" />
            </slot>
          </span>
          <component
            :is="getTag(item)"
            v-if="!isActive(item, index)"
            :href="item.href"
            class="ui-breadcrumb__link"
            @click="onItemClick(item, index, $event)"
          >
            <span v-if="item.icon" class="ui-breadcrumb__icon" v-html="item.icon"></span>
            <span v-if="item.label" class="ui-breadcrumb__label">{{ item.label }}</span>
          </component>
          <span v-else class="ui-breadcrumb__current" aria-current="page">
            <span v-if="item.icon" class="ui-breadcrumb__icon" v-html="item.icon"></span>
            <span v-if="item.label" class="ui-breadcrumb__label">{{ item.label }}</span>
          </span>
        </li>
      </slot>
    </ol>
  </nav>
</template>

<script>
import SlashIcon from '../../icons/SlashIcon.vue'
import ChevronRightIcon from '../../icons/ChevronRightIcon.vue'

export default {
  name: 'Breadcrumb',
  components: {
    SlashIcon,
    ChevronRightIcon
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    separator: {
      type: String,
      default: 'chevron',
      validator: v => ['chevron', 'slash'].includes(v)
    }
  },
  emits: ['click'],
  methods: {
    isActive(item, index) {
      return index === this.items.length - 1
    },
    onItemClick(item, index, e) {
      this.$emit('click', item, index, e)
    },
    getTag(item) {
      return item.href ? 'a' : 'span'
    }
  }
}
</script>

<style src="./breadcrumb.css" scoped></style>
