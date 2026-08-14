<template>
  <div v-if="hasItems || hasTrigger()" class="ui-upload-list" :class="`ui-upload-list--${listType}`">
    <template v-if="hasItems">
      <UploadItem
        v-for="file in items"
        :key="file.uid"
        :file="file"
        :list-type="listType"
        :show-preview-icon="showPreviewIcon"
        :show-remove-icon="showRemoveIcon"
        :show-download-icon="showDownloadIcon"
      />
    </template>
    <slot name="trigger" />
  </div>
</template>

<script>
import UploadItem from './UploadItem.vue'

export default {
  name: 'UploadList',

  components: { UploadItem },

  props: {
    items: { type: Array, default: () => [] },
    listType: { type: String, default: 'default' },
    showPreviewIcon: { type: Boolean, default: true },
    showRemoveIcon: { type: Boolean, default: true },
    showDownloadIcon: { type: Boolean, default: false },
    hideList: { type: Boolean, default: false }
  },

  emits: [],

  computed: {
    hasItems() {
      return !this.hideList && this.items.length > 0
    }
  },

  methods: {
    hasTrigger() {
      return !!((this.$scopedSlots && this.$scopedSlots.trigger) || this.$slots.trigger)
    }
  }
}
</script>

<style src="./upload-list.css" scoped></style>
