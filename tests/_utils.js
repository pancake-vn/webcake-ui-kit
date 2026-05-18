import * as vtu from '@vue/test-utils'

// Shim so the same spec works under @vue/test-utils v1 (Vue 2) and v2 (Vue 3).
// v1 reads `propsData`; v2 reads `props`. createLocalVue only exists in v1.
const isV1 = typeof vtu.createLocalVue === 'function'

// v1's findAll() returns a WrapperArray (no indexing, has .at() and .wrappers).
// v2's findAll() returns a real array. Patch the wrapper so `findAll(...)[i]`
// works the same way under both runtimes — including for nested wrappers.
function patchWrapper(w) {
  if (!w || w.__patched) return w
  w.__patched = true
  if (isV1) {
    const origFindAll = w.findAll.bind(w)
    w.findAll = sel => {
      const r = origFindAll(sel)
      return (r.wrappers || []).map(patchWrapper)
    }
    const origFind = w.find.bind(w)
    w.find = sel => patchWrapper(origFind(sel))
    if (!w.unmount && typeof w.destroy === 'function') {
      w.unmount = w.destroy.bind(w)
    }
  }
  return w
}

export function mount(Component, options = {}) {
  const opts = { ...options }
  if (isV1 && opts.props) {
    opts.propsData = opts.props
    delete opts.props
  }
  return patchWrapper(vtu.mount(Component, opts))
}
