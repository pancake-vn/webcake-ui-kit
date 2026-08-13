<template>
  <div class="ui-table__loading-wrap" :class="{ 'ui-table__loading-wrap--loading': isLoading }">
    <slot />
    <div v-if="isLoading" class="ui-table__loading-overlay">
      <Spinner size="md" />
    </div>
  </div>
</template>

<script>
import Spinner from '../spinner/Spinner.vue'

export default {
  name: 'TableV2Loading',
  components: { Spinner },
  inject: ['tableContext'],
  computed: {
    isLoading: function () {
      return this.tableContext.data.loading
    }
  }
}
</script>

<style src="./style/table-loading.css" scoped></style>
