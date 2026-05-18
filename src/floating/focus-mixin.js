// Save the currently focused element on open, restore it on close.
// This is RESTORE only — there is no focus trap. Menus and dropdowns should
// not trap focus (closing on Tab is the expected behavior). Dialogs trap;
// menus don't. Don't add a trap "for consistency" — they are different
// patterns by design.

export default {
  data() {
    return { fmRestoreTarget: null }
  },
  methods: {
    _fmCapture() {
      if (typeof document === 'undefined') return
      this.fmRestoreTarget = document.activeElement
    },
    _fmFocus(el) {
      if (el && typeof el.focus === 'function') {
        el.focus()
      }
    },
    _fmRestore() {
      const t = this.fmRestoreTarget
      this.fmRestoreTarget = null
      if (
        t &&
        typeof t.focus === 'function' &&
        typeof document !== 'undefined' &&
        document.contains &&
        document.contains(t)
      ) {
        t.focus()
      }
    }
  }
}
