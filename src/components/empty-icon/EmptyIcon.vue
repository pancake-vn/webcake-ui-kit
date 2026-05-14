<template>
  <span class="ui-empty-icon">
    <span class="ui-empty-icon__frame">
      <slot></slot>
    </span>
  </span>
</template>

<script>
export default {
  name: 'EmptyIcon',
  emits: []
}
</script>

<style src="./empty-icon.css" scoped></style>
