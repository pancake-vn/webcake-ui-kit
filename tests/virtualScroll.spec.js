import { computeVirtualWindow } from '../src/utils/virtualScroll.js'

describe('computeVirtualWindow', () => {
  const base = { rowHeight: 40, containerHeight: 400, total: 1000, overscan: 8 }

  it('at the top, starts at 0 and includes viewport + bottom overscan', () => {
    const w = computeVirtualWindow({ ...base, scrollTop: 0 })
    expect(w.startIndex).toBe(0)
    // visibleCount = ceil(400/40) = 10; end = 0 + 10 + 8*2 = 26
    expect(w.visibleCount).toBe(10)
    expect(w.endIndex).toBe(26)
    expect(w.offsetY).toBe(0)
    expect(w.totalHeight).toBe(40000)
  })

  it('mid-scroll subtracts overscan from the first visible row', () => {
    const w = computeVirtualWindow({ ...base, scrollTop: 4000 }) // row 100 at top
    expect(w.startIndex).toBe(92) // 100 - 8
    expect(w.endIndex).toBe(118) // 92 + 10 + 16
    expect(w.offsetY).toBe(3680) // 92 * 40
  })

  it('clamps startIndex at 0 and endIndex at total', () => {
    const top = computeVirtualWindow({ ...base, scrollTop: 100 }) // floor(100/40)=2, 2-8 < 0
    expect(top.startIndex).toBe(0)

    const bottom = computeVirtualWindow({ ...base, scrollTop: 40000 })
    expect(bottom.endIndex).toBe(1000)
    expect(bottom.endIndex).toBeLessThanOrEqual(base.total)
  })

  it('does not produce NaN when rowHeight or containerHeight is 0', () => {
    const zeroRh = computeVirtualWindow({ ...base, rowHeight: 0, scrollTop: 0 })
    expect(Number.isNaN(zeroRh.offsetY)).toBe(false)
    expect(Number.isNaN(zeroRh.totalHeight)).toBe(false)

    const zeroCh = computeVirtualWindow({ ...base, containerHeight: 0, scrollTop: 0 })
    expect(zeroCh.visibleCount).toBe(1)
  })

  it('handles an empty dataset', () => {
    const w = computeVirtualWindow({ ...base, total: 0, scrollTop: 0 })
    expect(w.startIndex).toBe(0)
    expect(w.endIndex).toBe(0)
    expect(w.totalHeight).toBe(0)
  })
})
