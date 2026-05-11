<template>
  <nav class="ui-breadcrumb" aria-label="breadcrumb">
    <ol class="ui-breadcrumb__list">
      <slot>
        <li v-for="(item, index) in items" :key="index" class="ui-breadcrumb__row">
          <span v-if="index > 0" class="ui-breadcrumb__separator" aria-hidden="true">
            <slot name="separator" :type="separator">
              <svg
                v-if="separator === 'slash'"
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <g clip-path="url(#clip0_3182_3913)">
                  <path
                    d="M12.524 0.857389C12.6948 0.686535 12.9718 0.686535 13.1426 0.857389C13.3135 1.02824 13.3135 1.30519 13.1426 1.47604L1.47598 13.1427C1.30513 13.3136 1.02818 13.3136 0.857328 13.1427C0.686473 12.9719 0.686473 12.6949 0.857328 12.5241L12.524 0.857389Z"
                    fill="#5C5C5C"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_3182_3913">
                    <rect width="14" height="14" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M4.88882 3.13888C5.08815 2.93955 5.41182 2.93955 5.61115 3.13888L9.11115 6.63888C9.31048 6.83821 9.31048 7.16188 9.11115 7.36121L5.61115 10.8612C5.41182 11.0605 5.08815 11.0605 4.88882 10.8612C4.68949 10.6619 4.68949 10.3382 4.88882 10.1389L8.02765 7.00004L4.88882 3.86121C4.68949 3.66188 4.68949 3.33821 4.88882 3.13888Z"
                  fill="#5C5C5C"
                />
              </svg>
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
export default {
  name: 'Breadcrumb',
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
