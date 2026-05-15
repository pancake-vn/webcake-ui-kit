<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="11.25" width="4.45312" height="1.5" :fill="color" />
    <rect x="9.79688" y="11.25" width="4.45312" height="1.5" :fill="color" />
    <rect x="16.5938" y="11.25" width="4.45312" height="1.5" :fill="color" />
  </svg>
</template>
<script>
export default {
  props: {
    size: {
      type: Number,
      default: 16
    },
    color: {
      type: String,
      default: 'currentColor'
    }
  }
}
</script>
