// Shared portal root for floating components (Menu, Dropdown, Select, and any
// future Popover/Tooltip/ContextMenu/Combobox). All access is lazy and inside
// functions — never at module top level — so SSR consumers don't blow up on
// import.

let _root = null
let _refCount = 0

export function ensureRoot() {
  if (typeof document === 'undefined') return null
  if (_root && document.body && document.body.contains(_root)) return _root
  _root = document.createElement('div')
  _root.id = 'wk-portal-root'
  _root.setAttribute('data-wk-portal-root', '')
  // The root itself takes no space; children position themselves via fixed.
  _root.style.position = 'absolute'
  _root.style.top = '0'
  _root.style.left = '0'
  _root.style.width = '0'
  _root.style.height = '0'
  document.body.appendChild(_root)
  return _root
}

export function acquire() {
  const root = ensureRoot()
  if (root) _refCount++
  return root
}

export function release() {
  if (_refCount > 0) _refCount--
  if (_refCount === 0 && _root && _root.parentNode) {
    _root.parentNode.removeChild(_root)
    _root = null
  }
}

// Test helper — reset module state between specs.
export function _reset() {
  if (_root && _root.parentNode) _root.parentNode.removeChild(_root)
  _root = null
  _refCount = 0
}
