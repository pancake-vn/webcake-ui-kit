// Pure positioning function — no DOM mutation, no side effects.
// Inputs are DOMRect-shaped objects; output is { top, left, placement } in
// viewport coordinates suitable for `position: fixed`.

function parsePlacement(p) {
  const parts = String(p || 'bottom-start').split('-')
  const side = ['top', 'bottom', 'left', 'right'].indexOf(parts[0]) === -1 ? 'bottom' : parts[0]
  const align = ['start', 'end'].indexOf(parts[1]) === -1 ? 'center' : parts[1]
  return { side, align }
}

function alignCross(refRect, floatRect, align, axis) {
  if (axis === 'horizontal') {
    if (align === 'start') return refRect.left
    if (align === 'end') return refRect.right - floatRect.width
    return refRect.left + (refRect.width - floatRect.width) / 2
  }
  if (align === 'start') return refRect.top
  if (align === 'end') return refRect.bottom - floatRect.height
  return refRect.top + (refRect.height - floatRect.height) / 2
}

export function computePosition(refRect, floatRect, placement, options) {
  const opts = options || {}
  const offset = typeof opts.offset === 'number' ? opts.offset : 4
  const padding = typeof opts.padding === 'number' ? opts.padding : 8
  const vw = opts.viewportWidth || (typeof window !== 'undefined' ? window.innerWidth : 1024)
  const vh = opts.viewportHeight || (typeof window !== 'undefined' ? window.innerHeight : 768)

  let { side, align } = parsePlacement(placement)

  // Flip when the requested side has no room and the opposite does.
  const fitsTop = refRect.top - floatRect.height - offset >= padding
  const fitsBottom = refRect.bottom + floatRect.height + offset <= vh - padding
  const fitsLeft = refRect.left - floatRect.width - offset >= padding
  const fitsRight = refRect.right + floatRect.width + offset <= vw - padding

  if (side === 'top' && !fitsTop && fitsBottom) side = 'bottom'
  else if (side === 'bottom' && !fitsBottom && fitsTop) side = 'top'
  else if (side === 'left' && !fitsLeft && fitsRight) side = 'right'
  else if (side === 'right' && !fitsRight && fitsLeft) side = 'left'

  let top = 0
  let left = 0

  if (side === 'top') {
    top = refRect.top - floatRect.height - offset
    left = alignCross(refRect, floatRect, align, 'horizontal')
  } else if (side === 'bottom') {
    top = refRect.bottom + offset
    left = alignCross(refRect, floatRect, align, 'horizontal')
  } else if (side === 'left') {
    left = refRect.left - floatRect.width - offset
    top = alignCross(refRect, floatRect, align, 'vertical')
  } else {
    left = refRect.right + offset
    top = alignCross(refRect, floatRect, align, 'vertical')
  }

  left = Math.max(padding, Math.min(left, vw - floatRect.width - padding))
  top = Math.max(padding, Math.min(top, vh - floatRect.height - padding))

  return { top, left, placement: align === 'center' ? side : side + '-' + align }
}
