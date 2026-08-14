// Pure, framework-agnostic helpers for WkUpload.
// No Vue, no component state, no DOM component refs — everything here is unit-testable
// in isolation. The SFC (Upload.vue) wires these into Options-API lifecycle.

// Sentinel returned from `beforeUpload` to drop a file entirely (not added to the list).
// Mirrors Ant Design's `Upload.LIST_IGNORE` but as a plain string so it survives being
// passed through props/Promises without identity issues across Vue 2 / Vue 3.
export const LIST_IGNORE = 'WK_UPLOAD_LIST_IGNORE'

export const STATUS_UPLOADING = 'uploading'
export const STATUS_DONE = 'done'
export const STATUS_ERROR = 'error'
export const STATUS_REMOVED = 'removed'

let uidSeed = 0

// Stable-ish unique id for a file entry. Not cryptographic — only needs to be unique
// within a single Upload instance's lifetime so we can track/replace items by uid.
export function genUid() {
  uidSeed += 1
  return `wk-upload-${Date.now().toString(36)}-${uidSeed}`
}

// Does `file` satisfy the `accept` attribute? `accept` is a comma list of extensions
// (`.png`), exact MIME (`image/png`), or wildcard MIME (`image/*`). Empty accept = allow all.
export function attrAccept(file, accept) {
  if (!accept || !file) return true
  const accepts = String(accept)
    .split(',')
    .map(t => t.trim())
    .filter(Boolean)
  if (!accepts.length) return true
  const name = file.name || ''
  const mime = file.type || ''
  const baseMime = mime.replace(/\/.*$/, '')
  return accepts.some(type => {
    if (type.charAt(0) === '.') {
      return name.toLowerCase().slice(-type.length) === type.toLowerCase()
    }
    if (/\/\*$/.test(type)) {
      return baseMime === type.replace(/\/.*$/, '')
    }
    if (/^[^/]+\/[^/]+$/.test(type)) {
      return mime === type
    }
    return false
  })
}

export function isImageFileType(type) {
  return typeof type === 'string' && type.indexOf('image/') === 0
}

const IMAGE_EXT = /\.(webp|svg|png|gif|jpe?g|jfif|bmp|ico|heic|heif|avif)$/i

// Heuristic: should this file be rendered as an image thumbnail?
export function isImageUrl(file) {
  if (!file) return false
  if (isImageFileType(file.type)) return true
  const url = file.thumbUrl || file.url || ''
  if (!url) return false
  if (/^data:image\//.test(url)) return true
  if (/^data:/.test(url)) return false
  if (IMAGE_EXT.test(url.split('?')[0])) return true
  // Unknown remote URL with no extension — don't assume it's an image.
  return false
}

// Read a File into a data URL for thumbnail preview. Resolves '' when not previewable
// or when running outside a browser (jsdom without FileReader).
export function previewImage(file) {
  return new Promise(resolve => {
    const raw = file && file.originFileObj ? file.originFileObj : file
    if (!raw || !isImageFileType(raw.type) || typeof FileReader === 'undefined') {
      resolve('')
      return
    }
    const reader = new FileReader()
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
    reader.onerror = () => resolve('')
    reader.readAsDataURL(raw)
  })
}

// Human-readable byte size, e.g. 25600 -> "25 KB", 1234567 -> "1.2 MB".
export function formatSize(bytes) {
  if (bytes == null || isNaN(bytes)) return ''
  if (bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const val = bytes / Math.pow(1024, i)
  const rounded = val >= 10 || i === 0 ? Math.round(val) : Math.round(val * 10) / 10
  return `${rounded} ${units[i]}`
}

// Wrap a raw File in the normalized upload-item shape used throughout the component.
export function file2Obj(file, uid) {
  return {
    uid: uid || file.uid || genUid(),
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    percent: 0,
    status: STATUS_UPLOADING,
    originFileObj: file,
    url: undefined,
    thumbUrl: undefined,
    response: undefined,
    error: undefined
  }
}

// Immutable "replace item with matching uid, else append". Never mutates `fileList`.
export function updateFileList(file, fileList) {
  const next = (fileList || []).slice()
  const idx = next.findIndex(item => item.uid === file.uid)
  if (idx === -1) next.push(file)
  else next[idx] = file
  return next
}

export function getFileItem(file, fileList) {
  const uid = file && file.uid
  return (fileList || []).filter(item => item.uid === uid)[0]
}

// Immutable removal by uid. Returns null when nothing was removed (caller can no-op).
export function removeFileItem(file, fileList) {
  const uid = file && file.uid
  const next = (fileList || []).filter(item => item.uid !== uid)
  return next.length === (fileList || []).length ? null : next
}

function getBody(xhr) {
  const text = xhr.responseText || xhr.response
  if (!text) return text
  try {
    return JSON.parse(text)
  } catch (e) {
    return text
  }
}

function getError(option, xhr) {
  const msg = `cannot ${option.method} ${option.action} ${xhr.status}`
  const err = new Error(msg)
  err.status = xhr.status
  err.method = option.method
  err.url = option.action
  return err
}

// Default XHR-based uploader. Returns a handle with `.abort()` so the caller can cancel
// on remove/unmount. Fires onProgress/onSuccess/onError. Never throws synchronously.
export function defaultRequest(option) {
  const {
    action,
    method = 'post',
    filename,
    file,
    data,
    headers = {},
    withCredentials = false,
    name = 'file',
    onProgress,
    onSuccess,
    onError
  } = option

  const xhr = new XMLHttpRequest()

  if (onProgress && xhr.upload) {
    xhr.upload.onprogress = e => {
      let percent = 0
      if (e.total > 0) percent = (e.loaded / e.total) * 100
      onProgress({ percent, loaded: e.loaded, total: e.total })
    }
  }

  const formData = new FormData()
  if (data) {
    Object.keys(data).forEach(key => {
      const val = data[key]
      if (Array.isArray(val)) val.forEach(v => formData.append(`${key}[]`, v))
      else formData.append(key, val)
    })
  }
  const raw = file && file.originFileObj ? file.originFileObj : file
  formData.append(name, raw, (raw && raw.name) || filename)

  xhr.onerror = e => {
    if (onError) onError(e)
  }
  xhr.onload = () => {
    if (xhr.status < 200 || xhr.status >= 300) {
      if (onError) onError(getError(option, xhr), getBody(xhr))
      return
    }
    if (onSuccess) onSuccess(getBody(xhr), xhr)
  }

  xhr.open(method, action, true)
  if (withCredentials && 'withCredentials' in xhr) xhr.withCredentials = true
  Object.keys(headers).forEach(h => {
    if (headers[h] !== null && headers[h] !== undefined) xhr.setRequestHeader(h, headers[h])
  })

  xhr.send(formData)

  return {
    abort() {
      xhr.abort()
    }
  }
}
