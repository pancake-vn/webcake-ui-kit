// Listens for pointerdown anywhere in the document and calls the component's
// _coOnOutside() if the event target is not inside either the trigger or the
// floating element. Uses pointerdown (not mousedown) so it covers touch + pen
// + mouse and fires before focus moves.

export default {
  data() {
    return { coAttached: false }
  },
  methods: {
    _coSetElements(trigger, floating) {
      this._coTriggerEl = trigger
      this._coFloatEl = floating
    },
    // Returns true if `target` is inside a portal-hosted floating panel whose
    // trigger element lives inside `myFloat`. This covers the case where a nested
    // component (e.g. WkSelect inside a WkDropdown overlay) portals its own menu
    // to #wk-portal-root — the nested panel is a sibling in the DOM, not a
    // descendant of myFloat, so a plain `contains()` check misses it.
    _coIsInsideDescendantPortal(target, myFloat) {
      if (!myFloat || typeof document === 'undefined') return false
      const portalRoot = document.querySelector('[data-wk-portal-root]')
      if (!portalRoot || !portalRoot.contains(target)) return false
      const floatingEls = portalRoot.querySelectorAll('[id^="wk-menu-"]')
      for (let i = 0; i < floatingEls.length; i++) {
        const fp = floatingEls[i]
        if (!fp.contains(target)) continue
        const trig = fp._wkTrigger
        if (trig && myFloat.contains(trig)) return true
      }
      return false
    },
    _coAttach() {
      if (typeof document === 'undefined' || this.coAttached) return
      this._coHandler = e => {
        const trigger = this._coTriggerEl
        const floating = this._coFloatEl
        const path = typeof e.composedPath === 'function' ? e.composedPath() : []
        const target = e.target
        const insideTrigger =
          trigger && (path.indexOf(trigger) !== -1 || (trigger.contains && trigger.contains(target)))
        const insideFloat =
          floating && (path.indexOf(floating) !== -1 || (floating.contains && floating.contains(target)))
        if (!insideTrigger && !insideFloat && !this._coIsInsideDescendantPortal(target, floating)) {
          this._coOnOutside(e)
        }
      }
      document.addEventListener('pointerdown', this._coHandler, true)
      this.coAttached = true
    },
    _coDetach() {
      if (typeof document === 'undefined' || !this.coAttached) return
      document.removeEventListener('pointerdown', this._coHandler, true)
      this._coHandler = null
      this.coAttached = false
    },
    _coOnOutside() {
      // Override in component.
    }
  },
  beforeDestroy() {
    this._coDetach()
  },
  beforeUnmount() {
    this._coDetach()
  }
}
