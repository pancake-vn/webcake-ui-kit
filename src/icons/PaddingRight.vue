<template>
  <BaseIcon v-bind="$attrs" v-on="listeners">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M17.8333 18.1667C17.3333 18.1667 17 17.8333 17 17.3333V6.66667C17 6.16667 17.3333 5.83333 17.8333 5.83333C18.3333 5.83333 18.6667 6.16667 18.6667 6.66667V17.3333C18.6667 17.8333 18.3333 18.1667 17.8333 18.1667Z"
        fill="currentColor"
      />
      <path
        d="M21.1667 22H2.83333C2.33333 22 2 21.6667 2 21.1667V2.83333C2 2.33333 2.33333 2 2.83333 2H21.1667C21.6667 2 22 2.33333 22 2.83333V21.1667C22 21.6667 21.6667 22 21.1667 22ZM3.66667 20.3333H20.3333V3.66667H3.66667V20.3333Z"
        fill="currentColor"
      />
    </svg>
  </BaseIcon>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'PaddingRight',
  components: { BaseIcon },
  inheritAttrs: false,
  emits: [],
  computed: {
    listeners() {
      return this.$listeners || {}
    }
  }
}
</script>
