<template>
  <BaseIcon v-bind="$attrs" v-on="listeners">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      class="ui-icon_status"
    >
      <g filter="url(#filter0_d_8443_1018)">
        <circle cx="6" cy="6" r="3" fill="#22C55E" />
      </g>
      <defs>
        <filter
          id="filter0_d_8443_1018"
          x="0"
          y="0"
          width="12"
          height="12"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology radius="3" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_8443_1018" />
          <feOffset />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.941176 0 0 0 0 0.992157 0 0 0 0 0.956863 0 0 0 1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_8443_1018" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_8443_1018" result="shape" />
        </filter>
      </defs>
    </svg>
  </BaseIcon>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'StatusSuccess',
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

<style src="../styles/icon_status.css" scoped />
