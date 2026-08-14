<template>
  <div
    class="ui-upload"
    :class="[
      `ui-upload--${listType}`,
      {
        'ui-upload--disabled': disabled,
        'ui-upload--drag-over': dragOver
      }
    ]"
  >
    <!-- Dropzone trigger (default / picture list types) -->
    <div
      v-if="!isCard"
      class="ui-upload__dropzone"
      :class="{ 'ui-upload__dropzone--over': dragOver, 'ui-upload__dropzone--disabled': disabled }"
      role="button"
      :tabindex="disabled ? -1 : 0"
      :aria-disabled="disabled ? 'true' : null"
      @click="openFileDialog"
      @keydown.enter.prevent="openFileDialog"
      @keydown.space.prevent="openFileDialog"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      @paste="onPaste"
    >
      <slot name="trigger">
        <div class="ui-upload__dropzone-inner">
          <span class="ui-upload__feature-icon">
            <WkiUpload :size="20" />
          </span>
          <div class="ui-upload__dropzone-text">
            <p class="ui-upload__dropzone-title">
              {{ title }} <span class="ui-upload__link">{{ browseText }}</span>
            </p>
            <p class="ui-upload__dropzone-hint">{{ hint }}</p>
          </div>
        </div>
      </slot>
    </div>

    <!-- File list (rows for default/picture, grid of tiles for picture-card/circle) -->
    <UploadList
      :items="visibleFileList"
      :list-type="listType"
      :show-preview-icon="showFlags.showPreviewIcon"
      :show-remove-icon="showFlags.showRemoveIcon"
      :show-download-icon="showFlags.showDownloadIcon"
      :hide-list="showUploadList === false"
    >
      <template v-if="isCard" #trigger>
        <div
          v-if="showCardTrigger"
          class="ui-upload__card-trigger"
          :class="{ 'ui-upload__card-trigger--over': dragOver, 'ui-upload__card-trigger--disabled': disabled }"
          role="button"
          :tabindex="disabled ? -1 : 0"
          :aria-disabled="disabled ? 'true' : null"
          @click="openFileDialog"
          @keydown.enter.prevent="openFileDialog"
          @keydown.space.prevent="openFileDialog"
          @dragover.prevent="onDragOver"
          @dragleave.prevent="onDragLeave"
          @drop.prevent="onDrop"
          @paste="onPaste"
        >
          <slot name="trigger">
            <WkiPlus :size="20" />
            <span v-if="browseText" class="ui-upload__card-trigger-text">{{ browseText }}</span>
          </slot>
        </div>
      </template>
    </UploadList>

    <input
      ref="input"
      type="file"
      class="ui-upload__input"
      :accept="accept"
      :multiple="multiple"
      :webkitdirectory="directory ? '' : null"
      :directory="directory ? '' : null"
      @change="onInputChange"
    />

    <Dialog
      v-if="previewVisible"
      :open="previewVisible"
      centered
      :title="previewTitle"
      :footer="false"
      :width="520"
      @change="onPreviewChange"
    >
      <div class="ui-upload__preview">
        <img :src="previewImageSrc" :alt="previewTitle" class="ui-upload__preview-img" />
      </div>
    </Dialog>
  </div>
</template>

<script>
import Dialog from '../dialog/Dialog.vue'
import UploadList from './UploadList.vue'
import WkiUpload from '../../icons/Upload.vue'
import WkiPlus from '../../icons/Plus.vue'
import {
  LIST_IGNORE,
  attrAccept,
  defaultRequest,
  file2Obj,
  genUid,
  getFileItem,
  isImageFileType,
  isImageUrl,
  previewImage,
  removeFileItem,
  updateFileList
} from './upload-utils.js'

export default {
  name: 'Upload',

  components: { Dialog, UploadList, WkiUpload, WkiPlus },

  provide() {
    return { wkUpload: this }
  },

  props: {
    // --- request config ---
    action: { type: [String, Function], default: '' },
    method: { type: String, default: 'post' },
    headers: { type: Object, default: () => ({}) },
    data: { type: [Object, Function], default: () => ({}) },
    name: { type: String, default: 'file' },
    withCredentials: { type: Boolean, default: false },

    // --- data (controlled + uncontrolled) ---
    fileList: { type: Array, default: null },
    defaultFileList: { type: Array, default: () => [] },

    // --- selection behavior ---
    multiple: { type: Boolean, default: false },
    maxCount: { type: Number, default: 0 },
    maxSize: { type: Number, default: 0 },
    accept: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    directory: { type: Boolean, default: false },
    pastable: { type: Boolean, default: false },

    // --- presentation ---
    listType: {
      type: String,
      default: 'default',
      validator: v => ['default', 'picture', 'picture-card', 'picture-circle'].includes(v)
    },
    showUploadList: { type: [Boolean, Object], default: true },

    // --- trigger copy (dropzone / add-tile) ---
    title: { type: String, default: 'Drop files here or' },
    browseText: { type: String, default: 'browse files' },
    hint: { type: String, default: 'SVG, PNG, JPG or GIF' },

    // --- logic hooks (function props) ---
    beforeUpload: { type: Function, default: null },
    transformFile: { type: Function, default: null },
    customRequest: { type: Function, default: null },
    beforeRemove: { type: Function, default: null },
    previewFile: { type: Function, default: null },
    isImageUrl: { type: Function, default: null }
  },

  emits: ['change', 'preview', 'remove', 'download', 'progress', 'drop', 'reject', 'update:fileList'],

  data() {
    // NB: stateFileList is populated in created(), not here — Vue 3 does not guarantee
    // methods (normalize/ensureUid) are bound during data(), unlike Vue 2.
    return {
      stateFileList: [],
      dragOver: false,
      previewVisible: false,
      previewImageSrc: '',
      previewTitle: ''
    }
  },

  computed: {
    isCard() {
      return this.listType === 'picture-card' || this.listType === 'picture-circle'
    },
    visibleFileList() {
      return this.stateFileList.filter(f => f.status !== 'removed')
    },
    showCardTrigger() {
      if (this.disabled) return false
      if (this.maxCount && this.visibleFileList.length >= this.maxCount) return false
      // Single-file card (maxCount 1 or !multiple) hides the add-tile once a file exists —
      // the existing tile itself is the replace surface.
      if (!this.multiple && this.visibleFileList.length >= 1) return false
      return true
    },
    showFlags() {
      const s = this.showUploadList
      if (s && typeof s === 'object') {
        return {
          showPreviewIcon: s.showPreviewIcon !== false,
          showRemoveIcon: s.showRemoveIcon !== false,
          showDownloadIcon: s.showDownloadIcon === true
        }
      }
      return { showPreviewIcon: true, showRemoveIcon: true, showDownloadIcon: false }
    }
  },

  watch: {
    fileList(val) {
      // Controlled mode: parent is the source of truth — re-sync our working copy.
      if (val != null) this.stateFileList = this.normalize(val)
    }
  },

  created() {
    this.reqs = {}
    this._uidCache = typeof WeakMap !== 'undefined' ? new WeakMap() : null
    this.stateFileList = this.normalize(this.fileList != null ? this.fileList : this.defaultFileList)
  },

  // Declare both teardown hooks: Vue 2.7 fires beforeDestroy, Vue 3.4 fires beforeUnmount.
  beforeUnmount() {
    this.abortAll()
  },
  // eslint-disable-next-line vue/no-deprecated-destroyed-lifecycle, vue/no-dupe-keys
  beforeDestroy() {
    this.abortAll()
  },

  methods: {
    // ---- normalization -------------------------------------------------
    ensureUid(item) {
      if (!this._uidCache) return genUid()
      if (this._uidCache.has(item)) return this._uidCache.get(item)
      const id = genUid()
      this._uidCache.set(item, id)
      return id
    },
    normalize(list) {
      const self = this
      return (list || []).map(item => ({
        uid: item.uid != null ? item.uid : self.ensureUid(item),
        name: item.name,
        size: item.size,
        type: item.type,
        percent: item.percent != null ? item.percent : item.status === 'uploading' ? 0 : 100,
        status: item.status || 'done',
        url: item.url,
        thumbUrl: item.thumbUrl,
        originFileObj: item.originFileObj,
        response: item.response,
        error: item.error,
        loaded: item.loaded,
        total: item.total
      }))
    },

    // ---- file dialog / drop / paste -----------------------------------
    openFileDialog() {
      if (this.disabled) return
      if (this.$refs.input) this.$refs.input.click()
    },
    onInputChange(e) {
      const files = e.target && e.target.files ? Array.prototype.slice.call(e.target.files) : []
      this.uploadFiles(files)
      // Reset so selecting the same file again re-triggers change.
      if (e.target) e.target.value = ''
    },
    onDragOver() {
      if (this.disabled) return
      this.dragOver = true
    },
    onDragLeave() {
      this.dragOver = false
    },
    onDrop(e) {
      this.dragOver = false
      if (this.disabled) return
      this.$emit('drop', e)
      const dt = e.dataTransfer
      if (!dt) return
      const files = dt.files ? Array.prototype.slice.call(dt.files) : []
      if (files.length) this.uploadFiles(files)
    },
    onPaste(e) {
      if (!this.pastable || this.disabled) return
      const cd = e.clipboardData
      if (!cd) return
      const files = []
      if (cd.items) {
        Array.prototype.slice.call(cd.items).forEach(it => {
          if (it.kind === 'file') {
            const f = it.getAsFile()
            if (f) files.push(f)
          }
        })
      }
      if (files.length) {
        e.preventDefault()
        this.uploadFiles(files)
      }
    },

    // ---- pipeline ------------------------------------------------------
    uploadFiles(rawFiles) {
      let files = rawFiles.slice()
      // maxCount === 1 → replace with the last selected.
      if (this.maxCount === 1) {
        files = files.slice(-1)
      } else if (this.maxCount) {
        const remaining = this.maxCount - this.visibleFileList.length
        if (remaining <= 0) {
          files.forEach(f => this.$emit('reject', { file: f, reason: 'maxCount' }))
          return
        }
        if (files.length > remaining) {
          files.slice(remaining).forEach(f => this.$emit('reject', { file: f, reason: 'maxCount' }))
          files = files.slice(0, remaining)
        }
      }
      const batch = files
      files.forEach(raw => this.processFile(raw, batch))
    },

    async processFile(raw, batch) {
      // Static validation first — fail fast without touching the list.
      if (!attrAccept(raw, this.accept)) {
        this.$emit('reject', { file: raw, reason: 'accept' })
        return
      }
      if (this.maxSize && raw.size > this.maxSize) {
        this.$emit('reject', { file: raw, reason: 'size' })
        return
      }

      const uid = genUid()
      try {
        raw.uid = uid
      } catch (err) {
        // Some environments expose File as non-extensible — tracking still works via file2Obj.
      }

      let file = raw
      let before = true
      if (this.beforeUpload) {
        try {
          before = this.beforeUpload(raw, batch)
          if (before && typeof before.then === 'function') before = await before
        } catch (err) {
          before = false
        }
      }

      if (before === LIST_IGNORE) return

      // beforeUpload may return a replacement File/Blob to upload.
      if (before && before !== true && typeof before === 'object' && (before instanceof Blob || before.name)) {
        file = before
      }

      if (before === false) {
        // Added to the list but not auto-uploaded (consumer will upload manually).
        this.addFile(file2Obj(file, uid), { autoUpload: false })
        return
      }

      if (this.transformFile) {
        try {
          let t = this.transformFile(file)
          if (t && typeof t.then === 'function') t = await t
          if (t) file = t
        } catch (err) {
          // keep original file on transform failure
        }
      }

      const item = file2Obj(file, uid)
      this.addFile(item, { autoUpload: true, rawFile: file })
    },

    addFile(item, opts) {
      const options = opts || {}
      let nextList
      if (this.maxCount === 1) nextList = [item]
      else nextList = updateFileList(item, this.stateFileList)
      this.commit(item, nextList)

      // Generate a local thumbnail for image files (picture list types).
      if (isImageFileType(item.type)) {
        previewImage(item).then(url => {
          if (!url) return
          const current = getFileItem(item, this.stateFileList)
          if (current) this.setFile({ ...current, thumbUrl: url })
        })
      }

      if (options.autoUpload) this.post(item, options.rawFile || item.originFileObj)
      else this.setFile({ ...item, status: 'done', percent: 100 })
    },

    post(item, rawFile) {
      const actionVal = typeof this.action === 'function' ? this.action(rawFile) : this.action
      const dataVal = typeof this.data === 'function' ? this.data(rawFile) : this.data
      const uid = item.uid

      // No endpoint and no custom uploader → treat as a manual/selected entry.
      if (!this.customRequest && !actionVal) {
        this.setFile({ ...item, status: 'done', percent: 100 })
        return
      }

      const request = this.customRequest || defaultRequest
      const handle = request({
        action: actionVal,
        method: this.method,
        headers: this.headers,
        data: dataVal,
        name: this.name,
        filename: this.name,
        withCredentials: this.withCredentials,
        file: rawFile,
        onProgress: e => this.onFileProgress(uid, e),
        onSuccess: (res, xhr) => this.onFileSuccess(uid, res, xhr),
        onError: (err, res) => this.onFileError(uid, err, res)
      })

      if (handle && typeof handle.abort === 'function') this.reqs[uid] = handle
    },

    onFileProgress(uid, e) {
      const item = getFileItem({ uid }, this.stateFileList)
      if (!item || item.status !== 'uploading') return
      const percent = Math.round(e.percent || 0)
      const updated = { ...item, percent, status: 'uploading', loaded: e.loaded, total: e.total }
      this.setFile(updated)
      this.$emit('progress', { percent, loaded: e.loaded, total: e.total }, updated)
    },
    onFileSuccess(uid, res) {
      this.clearReq(uid)
      const item = getFileItem({ uid }, this.stateFileList)
      if (!item) return
      this.setFile({ ...item, status: 'done', percent: 100, response: res })
    },
    onFileError(uid, err, res) {
      this.clearReq(uid)
      const item = getFileItem({ uid }, this.stateFileList)
      if (!item) return
      this.setFile({ ...item, status: 'error', error: err, response: res })
    },

    // ---- list mutation (immutable + emit) ------------------------------
    setFile(file) {
      const nextList = updateFileList(file, this.stateFileList)
      this.commit(file, nextList)
    },
    commit(file, nextList) {
      this.stateFileList = nextList
      this.$emit('change', { file, fileList: nextList })
      this.$emit('update:fileList', nextList)
    },

    // ---- item actions (called by UploadItem via inject) ----------------
    async handleRemove(file) {
      if (this.beforeRemove) {
        try {
          let r = this.beforeRemove(file, this.stateFileList)
          if (r && typeof r.then === 'function') r = await r
          if (r === false) return
        } catch (err) {
          return
        }
      }
      this.abortReq(file.uid)
      const removedList = removeFileItem(file, this.stateFileList)
      if (removedList === null) return
      const removedFile = { ...file, status: 'removed' }
      this.stateFileList = removedList
      this.$emit('remove', removedFile)
      this.$emit('change', { file: removedFile, fileList: removedList })
      this.$emit('update:fileList', removedList)
    },
    handleRetry(file) {
      if (!file.originFileObj) return
      const item = { ...file, status: 'uploading', percent: 0, error: undefined }
      this.setFile(item)
      this.post(item, file.originFileObj)
    },
    handlePreview(file) {
      this.$emit('preview', file)
      const src = file.url || file.thumbUrl
      if (src && this.resolveIsImage(file)) {
        this.previewImageSrc = src
        this.previewTitle = file.name || 'Preview'
        this.previewVisible = true
      }
    },
    handleDownload(file) {
      this.$emit('download', file)
      if (file.url && typeof window !== 'undefined') window.open(file.url, '_blank')
    },

    // ---- helpers -------------------------------------------------------
    resolveIsImage(file) {
      if (typeof this.isImageUrl === 'function') return this.isImageUrl(file)
      return isImageUrl(file)
    },
    abortReq(uid) {
      const req = this.reqs[uid]
      if (req && typeof req.abort === 'function') req.abort()
      this.clearReq(uid)
    },
    clearReq(uid) {
      if (this.reqs[uid]) delete this.reqs[uid]
    },
    abortAll() {
      Object.keys(this.reqs || {}).forEach(uid => this.abortReq(uid))
    },
    onPreviewChange(v) {
      this.previewVisible = v
    }
  }
}
</script>

<style src="./upload.css" scoped></style>
