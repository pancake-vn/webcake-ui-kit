export const toCssSize = v => {
  if (v == null) return undefined
  return typeof v === 'number' ? `${v}px` : v
}

export function getTargetScrollBarSize(target) {
  if (typeof document === 'undefined' || !target || !(target instanceof Element)) {
    return { width: 0, height: 0 }
  }

  const width = target.offsetWidth - target.clientWidth
  const height = target.offsetHeight - target.clientHeight
  return {
    width: width ? `${width}px` : '0px',
    height: height ? `${height}px` : '0px'
  }
}

export const findDOMNode = instance => {
  let node = (instance && instance.vnode && instance.vnode.el) || (instance && (instance.$el || instance))
  while (node && !node.tagName) {
    node = node.nextSibling
  }
  return node
}

export function splitProps(obj) {
  var attrs = {}
  var listeners = {}
  Object.keys(obj || {}).forEach(function (key) {
    if (key.indexOf('on') === 0 && key.length > 2 && typeof obj[key] === 'function') {
      listeners[key.charAt(2).toLowerCase() + key.slice(3)] = obj[key]
    } else {
      attrs[key] = obj[key]
    }
  })
  return { attrs: attrs, listeners: listeners }
}
