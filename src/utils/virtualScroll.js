/**
 * Framework-agnostic virtual-scroll window calculator.
 *
 * Given the current scroll position and a fixed row height, returns the slice of
 * rows that should be rendered (plus an overscan buffer) and the vertical offset
 * needed to position them. Kept as a pure function — no Vue, no DOM — so it works
 * under both Vue 2.7 and Vue 3.4 Options API (the library bans the Composition API)
 * and can be unit-tested in isolation.
 *
 * @param {Object}  o
 * @param {number}  o.scrollTop        Current scrollTop of the scroll container (px).
 * @param {number}  o.rowHeight        Fixed height of a single row (px).
 * @param {number}  o.containerHeight  Visible height of the scroll viewport (px).
 * @param {number}  o.total            Total number of rows in the dataset.
 * @param {number}  o.overscan         Extra rows rendered above/below the viewport.
 * @returns {{ startIndex: number, endIndex: number, offsetY: number,
 *            totalHeight: number, visibleCount: number }}
 */
export function computeVirtualWindow({ scrollTop, rowHeight, containerHeight, total, overscan }) {
  const rh = rowHeight > 0 ? rowHeight : 0
  const over = overscan > 0 ? overscan : 0
  const count = total > 0 ? total : 0

  // Rows that fit in the viewport. Guard rowHeight=0 to avoid Infinity/NaN.
  const visibleCount = rh > 0 ? Math.max(1, Math.ceil(containerHeight / rh)) : count

  const startIndex = rh > 0 ? Math.max(0, Math.floor(scrollTop / rh) - over) : 0
  const endIndex = Math.min(count, startIndex + visibleCount + over * 2)

  return {
    startIndex,
    endIndex,
    offsetY: startIndex * rh,
    totalHeight: count * rh,
    visibleCount
  }
}
