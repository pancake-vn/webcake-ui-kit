<template>
  <BaseIcon v-bind="$attrs" v-on="listeners">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-1.5 -1.6 24 24" fill="none">
      <path
        d="M14 5.25H7C6.475 5.25 6.125 4.9 6.125 4.375C6.125 3.85 6.475 3.5 7 3.5H14C14.525 3.5 14.875 3.85 14.875 4.375C14.875 4.9 14.525 5.25 14 5.25Z"
        fill="currentColor"
      />
      <path
        d="M14 17.5H7C6.475 17.5 6.125 17.15 6.125 16.625C6.125 16.1 6.475 15.75 7 15.75H14C14.525 15.75 14.875 16.1 14.875 16.625C14.875 17.15 14.525 17.5 14 17.5Z"
        fill="currentColor"
      />
      <path
        d="M16.625 14.875C16.1 14.875 15.75 14.525 15.75 14V7C15.75 6.475 16.1 6.125 16.625 6.125C17.15 6.125 17.5 6.475 17.5 7V14C17.5 14.525 17.15 14.875 16.625 14.875Z"
        fill="currentColor"
      />
      <path
        d="M4.375 14.875C3.85 14.875 3.5 14.525 3.5 14V7C3.5 6.475 3.85 6.125 4.375 6.125C4.9 6.125 5.25 6.475 5.25 7V14C5.25 14.525 4.9 14.875 4.375 14.875Z"
        fill="currentColor"
      />
      <path
        d="M20.125 21H0.875C0.35 21 0 20.65 0 20.125V0.875C0 0.35 0.35 0 0.875 0H20.125C20.65 0 21 0.35 21 0.875V20.125C21 20.65 20.65 21 20.125 21ZM1.75 19.25H19.25V1.75H1.75V19.25Z"
        fill="currentColor"
      />
    </svg>
  </BaseIcon>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'Padding',
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
