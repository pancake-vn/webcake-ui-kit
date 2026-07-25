// Global message service — an Ant-Design-style singleton.
//
// Usage:
//   import { wkMessage } from 'webcake-ui-kit'
//   wkMessage.success('Saved')
//   const hide = wkMessage.loading('Uploading...')  // sticky; call hide() to dismiss
//   wkMessage.config({ placement: 'bottom', maxCount: 3, duration: 5000 })
//
// A single MessageContainer is lazily mounted to document.body the first time a
// message is shown; consumers never render it themselves.
//
// Dual-compat note: the library ships raw SFCs consumed by both Vue 2.7 and
// Vue 3.4. We namespace-import `vue` (which never errors on a missing member)
// and branch at runtime to avoid static import errors in Vue 2.
// eslint-disable-next-line no-restricted-imports
import * as VueRuntime from 'vue'
import MessageContainer from './MessageContainer.vue'

const DEFAULTS = { duration: 3000, placement: 'top', offset: 24, maxCount: 0 }

let globalConfig = { ...DEFAULTS }
let app = null // Vue 3 application instance (needed for unmount)
let containerVm = null // MessageContainer instance we drive imperatively
let hostEl = null

function ensureContainer() {
  if (containerVm) return containerVm
  if (typeof document === 'undefined') return null

  hostEl = document.createElement('div')
  hostEl.setAttribute('data-wk-message-host', '')
  document.body.appendChild(hostEl)

  // Bypass strict static analysis in bundlers (e.g. Webpack 5)
  const createAppKey = 'createApp'
  const defaultKey = 'default'

  if (typeof VueRuntime[createAppKey] === 'function') {
    app = VueRuntime[createAppKey](MessageContainer)
    containerVm = app.mount(hostEl)
  } else {
    const Vue = VueRuntime[defaultKey] || VueRuntime
    const vm = new Vue({
      render: h => h(MessageContainer)
    }).$mount(hostEl)
    containerVm = vm.$children[0]
  }

  containerVm.configure(globalConfig)
  return containerVm
}

// Accept either a config object, (content, optsObj), or (content, duration?, onClose?).
function toConfig(content, durationOrOpts, onClose) {
  const cfg = content && typeof content === 'object' ? { ...content } : { content }
  if (durationOrOpts && typeof durationOrOpts === 'object') {
    Object.assign(cfg, durationOrOpts)
  } else if (typeof durationOrOpts === 'function') {
    cfg.onClose = durationOrOpts
  } else {
    if (durationOrOpts !== undefined) cfg.duration = durationOrOpts
    if (onClose !== undefined) cfg.onClose = onClose
  }
  return cfg
}

// Show a message. Returns a function that dismisses it early.
function open(config) {
  const vm = ensureContainer()
  if (!vm) return function () {}

  // Per-call placement/offset override (applied before add so the container
  // is positioned correctly when the message enters).
  if (config.placement != null || config.offset != null) {
    vm.configure({
      placement: config.placement,
      offset: config.offset
    })
  }

  const type = config.type || 'info'
  const duration = config.duration !== undefined ? config.duration : type === 'loading' ? 0 : globalConfig.duration

  const key = vm.add({
    key: config.key,
    type,
    content: config.content,
    description: config.description,
    action: config.action,
    progress: config.progress != null ? config.progress : null,
    imgSrc: config.imgSrc,
    duration,
    onClose: config.onClose
  })

  return function close() {
    vm.remove(key)
  }
}

function makeOpener(type) {
  return function (content, duration, onClose) {
    const cfg = toConfig(content, duration, onClose)
    cfg.type = type
    return open(cfg)
  }
}

export const wkMessage = {
  open,
  success: makeOpener('success'),
  error: makeOpener('error'),
  info: makeOpener('info'),
  warning: makeOpener('warning'),
  loading: makeOpener('loading'),
  // destroy(key) removes one message; destroy() with no key removes all.
  destroy(key) {
    if (!containerVm) return
    if (key === undefined) {
      containerVm.clear()
      return
    }
    containerVm.remove(key)
  },
  destroyAll() {
    if (containerVm) containerVm.clear()
  },
  // Update global defaults (placement/offset/maxCount/duration). Applies live.
  config(options) {
    globalConfig = { ...globalConfig, ...options }
    if (containerVm) containerVm.configure(globalConfig)
  }
}

export default wkMessage
