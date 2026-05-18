// Moves an element into the shared portal root on demand. Refcounts acquire/
// release so the portal root is cleaned up when nothing is using it. Used by
// Menu; reusable by future Popover/Tooltip/ContextMenu migrations.
//
// Non-reactive instance refs use leading underscore so they don't enter Vue's
// reactivity system. Reactive data is namespaced with the `pmHost` prefix to
// avoid collisions with other mixins.

import { acquire, release } from './portal-root.js'

export default {
  data() {
    return { pmHostMounted: false }
  },
  methods: {
    _pmHostMount(el) {
      if (!el || typeof document === 'undefined') return
      const root = acquire()
      if (!root) return
      if (el.parentNode !== root) root.appendChild(el)
      this._pmHostAcquired = true
      this.pmHostMounted = true
    },
    _pmHostUnmount(el) {
      if (el && el.parentNode) el.parentNode.removeChild(el)
      if (this._pmHostAcquired) {
        release()
        this._pmHostAcquired = false
      }
      this.pmHostMounted = false
    }
  },
  beforeDestroy() {
    if (this._pmHostAcquired) {
      release()
      this._pmHostAcquired = false
    }
  },
  beforeUnmount() {
    if (this._pmHostAcquired) {
      release()
      this._pmHostAcquired = false
    }
  }
}
