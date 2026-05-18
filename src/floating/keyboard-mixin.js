// Keyboard navigation for menu-like floating layers. Items are discovered by
// querying the floating element's DOM for [data-wk-menu-item]:not([data-disabled])
// at the moment a key is pressed — this avoids registration-array bugs when
// items are added/removed via v-if. kmActiveIndex is clamped before every use.

const KEYS = {
  ArrowDown: 'down',
  Down: 'down',
  ArrowUp: 'up',
  Up: 'up',
  Home: 'home',
  End: 'end',
  Escape: 'escape',
  Esc: 'escape',
  Enter: 'enter',
  ' ': 'space',
  Spacebar: 'space',
  Tab: 'tab'
}

export default {
  data() {
    return { kmActiveIndex: -1 }
  },
  methods: {
    _kmSetFloatEl(el) {
      this._kmFloatEl = el
    },
    _kmListItems() {
      const float = this._kmFloatEl
      if (!float || typeof float.querySelectorAll !== 'function') return []
      const nodes = float.querySelectorAll('[data-wk-menu-item]:not([data-disabled])')
      const arr = []
      for (let i = 0; i < nodes.length; i++) arr.push(nodes[i])
      return arr
    },
    _kmReset() {
      this.kmActiveIndex = -1
    },
    _kmOnKeydown(e) {
      const k = KEYS[e.key]
      if (!k) return
      if (k === 'escape') {
        e.preventDefault()
        this._kmOnEscape(e)
        return
      }
      if (k === 'tab') {
        this._kmOnTab(e)
        return
      }
      const items = this._kmListItems()
      if (!items.length) return
      let idx = this.kmActiveIndex
      if (k === 'down') {
        idx = idx < 0 ? 0 : (idx + 1) % items.length
        e.preventDefault()
      } else if (k === 'up') {
        idx = idx < 0 ? items.length - 1 : (idx - 1 + items.length) % items.length
        e.preventDefault()
      } else if (k === 'home') {
        idx = 0
        e.preventDefault()
      } else if (k === 'end') {
        idx = items.length - 1
        e.preventDefault()
      } else if (k === 'enter' || k === 'space') {
        if (idx >= 0 && idx < items.length) {
          e.preventDefault()
          items[idx].click()
        }
        return
      }
      idx = Math.max(0, Math.min(idx, items.length - 1))
      this.kmActiveIndex = idx
      this._kmFocusActive()
    },
    _kmFocusActive() {
      const items = this._kmListItems()
      const idx = this.kmActiveIndex
      if (idx >= 0 && idx < items.length && items[idx] && typeof items[idx].focus === 'function') {
        items[idx].focus()
      }
    },
    _kmOnEscape() {
      // Override in component.
    },
    _kmOnTab() {
      // Override in component.
    }
  }
}
