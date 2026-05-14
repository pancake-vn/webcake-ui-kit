<template>
  <div
    class="ui-sidebar-group-label"
    :class="{
      'ui-sidebar-group-label--collapsible': collapsible,
      'ui-sidebar-group-label--collapsed': collapsible && !expanded
    }"
  >
    <button
      v-if="collapsible"
      class="ui-sidebar-group-label__trigger"
      :aria-expanded="String(expanded)"
      @click="$emit('toggle')"
    >
      <span class="ui-sidebar-group-label__text"
        ><slot>{{ label }}</slot></span
      >
      <span class="ui-sidebar-group-label__chevron" aria-hidden="true">
        <ChevronDownIcon :size="16" />
      </span>
    </button>
    <span v-else class="ui-sidebar-group-label__text"
      ><slot>{{ label }}</slot></span
    >
    <span v-if="hasActionSlot" class="ui-sidebar-group-label__action">
      <slot name="action" />
    </span>
  </div>
</template>

<script>
import ChevronDownIcon from '../../icons/ChevronDownIcon.vue'
export default {
  name: 'SidebarGroupLabel',
  components: {
    ChevronDownIcon
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    collapsible: {
      type: Boolean,
      default: false
    },
    expanded: {
      type: Boolean,
      default: true
    }
  },

  emits: ['toggle'],

  computed: {
    hasActionSlot() {
      return !!((this.$scopedSlots && this.$scopedSlots['action']) || this.$slots['action'])
    }
  }
}
</script>

<style src="./sidebar_group_label.css" scoped></style>
