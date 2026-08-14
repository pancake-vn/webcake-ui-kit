<template>
  <!-- Card tile (picture-card / picture-circle) -->
  <div
    v-if="isCard"
    class="ui-upload-item ui-upload-item--card"
    :class="[`ui-upload-item--${listType}`, `ui-upload-item--${file.status}`, { 'ui-upload-item--has-thumb': !!thumb }]"
  >
    <div class="ui-upload-item__card-inner">
      <img v-if="thumb" :src="thumb" :alt="file.name" class="ui-upload-item__card-img" />
      <span v-else class="ui-upload-item__card-file">
        <component :is="fileIcon" :size="24" />
      </span>

      <Button
        v-if="showRemoveIcon && file.status !== 'uploading'"
        type="button"
        class="ui-upload-item__remove"
        aria-label="Remove"
        @click="onRemove"
        size="mini"
        variant="secondary"
      >
        <template #icon>
          <WkiX :size="16" />
        </template>
      </Button>

      <div v-if="file.status === 'uploading'" class="ui-upload-item__card-mask ui-upload-item__card-mask--loading">
        <Spinner size="sm" type="mirrored" />
        <span class="ui-upload-item__card-percent">{{ percentLabel }}</span>
      </div>
      <div v-else-if="file.status === 'error'" class="ui-upload-item__card-mask ui-upload-item__card-mask--error">
        <WkiCircleAlert :size="18" />
      </div>

      <div v-if="file.status !== 'uploading'" class="ui-upload-item__card-actions">
        <button
          v-if="showPreviewIcon && canPreview"
          type="button"
          class="ui-upload-item__card-action"
          aria-label="Preview"
          @click="onPreview"
        >
          <WkiEye :size="16" />
        </button>
        <button
          v-if="!multiple"
          type="button"
          class="ui-upload-item__card-action"
          aria-label="Replace"
          @click="onReplace"
        >
          <WkiPencil :size="16" />
        </button>
        <button
          v-if="showDownloadIcon && file.url"
          type="button"
          class="ui-upload-item__card-action"
          aria-label="Download"
          @click="onDownload"
        >
          <WkiDownload :size="16" />
        </button>
      </div>
    </div>
  </div>

  <!-- Row (default / picture) -->
  <div
    v-else
    class="ui-upload-item ui-upload-item--row"
    :class="[`ui-upload-item--${listType}`, `ui-upload-item--${file.status}`]"
  >
    <div class="ui-upload-item__row">
      <span class="ui-upload-item__media" :class="{ 'ui-upload-item__media--thumb': !!thumb }">
        <img v-if="thumb" :src="thumb" :alt="file.name" class="ui-upload-item__thumb" />
        <component :is="fileIcon" v-else :size="24" class="ui-upload-item__file-icon" />
      </span>

      <div class="ui-upload-item__info">
        <p class="ui-upload-item__name" :title="file.name">{{ file.name }}</p>
        <p class="ui-upload-item__desc" :class="`ui-upload-item__desc--${file.status}`">{{ descText }}</p>
      </div>

      <div class="ui-upload-item__actions">
        <template v-if="file.status === 'uploading'">
          <Button variant="ghost" size="xs" @click="onCancel">
            <template #icon-left><WkiX :size="14" /></template>
            Cancel
          </Button>
          <Spinner size="sm" type="mirrored" />
        </template>
        <template v-else-if="file.status === 'error'">
          <Button variant="ghost" size="xs" @click="onRetry">
            <template #icon-left><WkiRotateCw :size="14" /></template>
            Try again
          </Button>
          <span class="ui-upload-item__status-icon ui-upload-item__status-icon--error">
            <WkiCircleAlert :size="16" />
          </span>
          <button
            v-if="showRemoveIcon"
            type="button"
            class="ui-upload-item__icon-btn ui-upload-item__remove"
            aria-label="Remove"
            @click="onRemove"
          >
            <WkiX :size="16" />
          </button>
        </template>
        <template v-else>
          <button
            v-if="showDownloadIcon && file.url"
            type="button"
            class="ui-upload-item__icon-btn"
            aria-label="Download"
            @click="onDownload"
          >
            <WkiDownload :size="16" />
          </button>
          <span class="ui-upload-item__status-icon ui-upload-item__status-icon--done">
            <WkiCheck :size="12" />
          </span>
          <button
            v-if="showRemoveIcon"
            type="button"
            class="ui-upload-item__icon-btn ui-upload-item__remove"
            aria-label="Remove"
            @click="onRemove"
          >
            <WkiX :size="16" />
          </button>
        </template>
      </div>
    </div>

    <div v-if="file.status === 'uploading'" class="ui-upload-item__progress">
      <Progress :value="file.percent || 0" />
      <div class="ui-upload-item__progress-text">
        <span>{{ progressLeft }}</span>
        <span>{{ percentLabel }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Progress from '../progress/Progress.vue'
import Spinner from '../spinner/Spinner.vue'
import Button from '../button/Button.vue'
import WkiFileText from '../../icons/FileText.vue'
import WkiFileImage from '../../icons/FileImage.vue'
import WkiX from '../../icons/X.vue'
import WkiCheck from '../../icons/Check.vue'
import WkiCircleAlert from '../../icons/CircleAlert.vue'
import WkiRotateCw from '../../icons/RotateCw.vue'
import WkiDownload from '../../icons/Download.vue'
import WkiEye from '../../icons/Eye.vue'
import WkiPencil from '../../icons/Pencil.vue'
import { formatSize, isImageFileType, isImageUrl } from './upload-utils.js'

export default {
  name: 'UploadItem',

  components: {
    Progress,
    Spinner,
    Button,
    WkiFileText,
    WkiFileImage,
    WkiX,
    WkiCheck,
    WkiCircleAlert,
    WkiRotateCw,
    WkiDownload,
    WkiEye,
    WkiPencil
  },

  inject: {
    wkUpload: { default: null }
  },

  props: {
    file: { type: Object, required: true },
    listType: { type: String, default: 'default' },
    showPreviewIcon: { type: Boolean, default: true },
    showRemoveIcon: { type: Boolean, default: true },
    showDownloadIcon: { type: Boolean, default: false }
  },

  emits: [],

  computed: {
    isCard() {
      return this.listType === 'picture-card' || this.listType === 'picture-circle'
    },
    multiple() {
      return this.wkUpload ? this.wkUpload.multiple : true
    },
    isImage() {
      return isImageFileType(this.file.type) || this.canPreview
    },
    canPreview() {
      if (this.wkUpload && typeof this.wkUpload.resolveIsImage === 'function') {
        return this.wkUpload.resolveIsImage(this.file)
      }
      return isImageUrl(this.file)
    },
    thumb() {
      return this.file.thumbUrl || (this.canPreview ? this.file.url : '') || ''
    },
    fileIcon() {
      return this.isImage ? 'WkiFileImage' : 'WkiFileText'
    },
    percentLabel() {
      return `${Math.round(this.file.percent || 0)}%`
    },
    progressLeft() {
      if (this.file.total) {
        return `${formatSize(this.file.loaded || 0)} of ${formatSize(this.file.total)}`
      }
      if (this.file.size) return formatSize(this.file.size)
      return ''
    },
    descText() {
      const s = this.file.status
      if (s === 'error') {
        return (this.file.error && this.file.error.message) || 'Upload failed, please try again'
      }
      if (s === 'uploading') {
        const size = this.file.size ? `${formatSize(this.file.size)} · ` : ''
        return `${size}${this.percentLabel} uploaded`
      }
      return 'File uploaded successfully'
    }
  },

  methods: {
    onPreview() {
      if (this.wkUpload) this.wkUpload.handlePreview(this.file)
    },
    onRemove() {
      if (this.wkUpload) this.wkUpload.handleRemove(this.file)
    },
    onCancel() {
      if (this.wkUpload) this.wkUpload.handleRemove(this.file)
    },
    onRetry() {
      if (this.wkUpload) this.wkUpload.handleRetry(this.file)
    },
    onDownload() {
      if (this.wkUpload) this.wkUpload.handleDownload(this.file)
    },
    onReplace() {
      if (this.wkUpload) this.wkUpload.openFileDialog()
    }
  }
}
</script>

<style src="./upload-item.css" scoped></style>
