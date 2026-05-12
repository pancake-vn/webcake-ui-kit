import { WkPagination } from '../src/index.js'
import { mount } from './_utils.js'

// ── selectors ──────────────────────────────────────────────────────────────
// The component renders all controls as native <button> elements via WkButton.
// First = Prev, last = Next, middle = page numbers + ellipsis.
function prevBtn(w) {
  return w.findAll('button')[0]
}
function nextBtn(w) {
  const btns = w.findAll('button')
  return btns[btns.length - 1]
}
function midBtns(w) {
  const btns = w.findAll('button')
  if (btns.length <= 2) return []
  return btns.slice(1, btns.length - 1)
}
function pageButtons(w) {
  return midBtns(w).filter(b => /^\d+$/.test(b.text().trim()))
}
function pageNumbers(w) {
  return pageButtons(w).map(b => b.text().trim())
}
function ellipsisBtns(w) {
  return midBtns(w).filter(b => !/^\d+$/.test(b.text().trim()))
}

// ── render & a11y ──────────────────────────────────────────────────────────
describe('WkPagination — render & a11y', () => {
  it('renders a nav element with role="navigation"', () => {
    const w = mount(WkPagination, { props: { current: 1, total: 5, pageSize: 1 } })
    expect(w.element.tagName.toLowerCase()).toBe('nav')
    expect(w.attributes('role')).toBe('navigation')
  })

  it('renders prev and next buttons with default labels', () => {
    const w = mount(WkPagination, { props: { current: 3, total: 5, pageSize: 1 } })
    expect(prevBtn(w).text()).toContain('Previous')
    expect(nextBtn(w).text()).toContain('Next')
  })

  it('marks the active page with ui-button--outline class', () => {
    const w = mount(WkPagination, { props: { current: 3, total: 5, pageSize: 1 } })
    const active = w.find('.ui-btn--outline')
    expect(active.exists()).toBe(true)
    expect(active.text().trim()).toBe('3')
  })

  it('adds chevron SVGs to prev/next when showIcon=true', () => {
    const w = mount(WkPagination, { props: { current: 3, total: 5, pageSize: 1, showIcon: true } })
    expect(prevBtn(w).find('svg').exists()).toBe(true)
    expect(nextBtn(w).find('svg').exists()).toBe(true)
  })
})

// ── smart ellipsis algorithm ───────────────────────────────────────────────
describe('WkPagination — smart ellipsis algorithm', () => {
  it('shows all pages when total fits without ellipsis (≤7 pages by default)', () => {
    const w = mount(WkPagination, { props: { current: 1, total: 7, pageSize: 1 } })
    expect(pageNumbers(w)).toEqual(['1', '2', '3', '4', '5', '6', '7'])
    expect(ellipsisBtns(w).length).toBe(0)
  })

  it('uses one right ellipsis when current is near the start', () => {
    const w = mount(WkPagination, { props: { current: 1, total: 10, pageSize: 1 } })
    expect(pageNumbers(w)).toEqual(['1', '2', '3', '4', '10'])
    expect(ellipsisBtns(w).length).toBe(1)
  })

  it('uses one left ellipsis when current is near the end', () => {
    const w = mount(WkPagination, { props: { current: 10, total: 10, pageSize: 1 } })
    expect(pageNumbers(w)).toEqual(['1', '7', '8', '9', '10'])
    expect(ellipsisBtns(w).length).toBe(1)
  })

  it('uses two ellipses when current is in the middle', () => {
    const w = mount(WkPagination, { props: { current: 5, total: 10, pageSize: 1 } })
    expect(pageNumbers(w)).toEqual(['1', '4', '5', '6', '10'])
    expect(ellipsisBtns(w).length).toBe(2)
  })

  it('does NOT insert an ellipsis when only ONE page would be hidden', () => {
    // [1, 2, 3, 4, …, 8] — left gap covers only page 2 so it is shown directly
    const w = mount(WkPagination, { props: { current: 4, total: 8, pageSize: 1 } })
    expect(pageNumbers(w)).toEqual(['1', '2', '3', '4', '8'])
    expect(ellipsisBtns(w).length).toBe(1)
  })

  it('respects `siblings` for the window around current', () => {
    const w = mount(WkPagination, { props: { current: 10, total: 20, pageSize: 1, siblings: 2 } })
    expect(pageNumbers(w)).toEqual(['1', '8', '9', '10', '11', '12', '20'])
    expect(ellipsisBtns(w).length).toBe(2)
  })

  it('respects `boundary` for anchor pages at each end', () => {
    const w = mount(WkPagination, { props: { current: 10, total: 20, pageSize: 1, boundary: 2 } })
    expect(pageNumbers(w)).toEqual(['1', '2', '9', '10', '11', '19', '20'])
    expect(ellipsisBtns(w).length).toBe(2)
  })

  it('supports boundary=0 (no fixed anchor at last page)', () => {
    const w = mount(WkPagination, { props: { current: 1, total: 50, pageSize: 1, boundary: 0 } })
    expect(pageNumbers(w)).toEqual(['1', '2', '3'])
    expect(ellipsisBtns(w).length).toBe(1)
  })

  it('renders a single page button when 1 page total', () => {
    const w = mount(WkPagination, { props: { current: 1, total: 1, pageSize: 1 } })
    expect(pageNumbers(w)).toEqual(['1'])
    expect(ellipsisBtns(w).length).toBe(0)
  })

  it('renders no page buttons when total=0', () => {
    const w = mount(WkPagination, { props: { current: 1, total: 0, pageSize: 1 } })
    expect(pageButtons(w).length).toBe(0)
  })

  it('derives totalPages from total ÷ pageSize (100 items / 10 per page = 10 pages)', () => {
    const w = mount(WkPagination, { props: { current: 1, total: 100, pageSize: 10 } })
    expect(pageNumbers(w)).toEqual(['1', '2', '3', '4', '10'])
    expect(ellipsisBtns(w).length).toBe(1)
  })
})

// ── interaction & events ───────────────────────────────────────────────────
describe('WkPagination — interaction & events', () => {
  it('emits change with the clicked page number', async () => {
    const w = mount(WkPagination, { props: { current: 1, total: 10, pageSize: 1 } })
    // buttons for current=1 are [1, 2, 3, 4, 10] — click index 3 → page 4
    await pageButtons(w)[3].trigger('click')
    expect(w.emitted('change')).toBeTruthy()
    expect(w.emitted('change')[0][0]).toBe(4)
  })

  it('emits update:modelValue alongside change (Vue 3 v-model bridge)', async () => {
    const w = mount(WkPagination, { props: { current: 1, total: 10, pageSize: 1 } })
    await pageButtons(w)[1].trigger('click') // page 2
    expect(w.emitted('update:modelValue')).toBeTruthy()
    expect(w.emitted('update:modelValue')[0][0]).toBe(2)
  })

  it('does not emit when clicking the already-active page', async () => {
    const w = mount(WkPagination, { props: { current: 3, total: 10, pageSize: 1 } })
    await w.find('.ui-btn--outline').trigger('click')
    expect(w.emitted('change')).toBeFalsy()
  })

  it('prev button emits change with current−1', async () => {
    const w = mount(WkPagination, { props: { current: 5, total: 10, pageSize: 1 } })
    await prevBtn(w).trigger('click')
    expect(w.emitted('change')[0][0]).toBe(4)
  })

  it('next button emits change with current+1', async () => {
    const w = mount(WkPagination, { props: { current: 5, total: 10, pageSize: 1 } })
    await nextBtn(w).trigger('click')
    expect(w.emitted('change')[0][0]).toBe(6)
  })

  it('prev button is disabled at page 1', () => {
    const w = mount(WkPagination, { props: { current: 1, total: 10, pageSize: 1 } })
    expect(prevBtn(w).attributes('disabled')).toBeDefined()
    expect(nextBtn(w).attributes('disabled')).toBeUndefined()
  })

  it('next button is disabled at the last page', () => {
    const w = mount(WkPagination, { props: { current: 10, total: 10, pageSize: 1 } })
    expect(nextBtn(w).attributes('disabled')).toBeDefined()
    expect(prevBtn(w).attributes('disabled')).toBeUndefined()
  })

  it('both nav buttons are disabled when there is only 1 page', () => {
    const w = mount(WkPagination, { props: { current: 1, total: 1, pageSize: 1 } })
    expect(prevBtn(w).attributes('disabled')).toBeDefined()
    expect(nextBtn(w).attributes('disabled')).toBeDefined()
  })

  it('does not emit when the whole component is disabled', async () => {
    const w = mount(WkPagination, { props: { current: 5, total: 10, pageSize: 1, disabled: true } })
    await pageButtons(w)[0].trigger('click')
    await prevBtn(w).trigger('click')
    await nextBtn(w).trigger('click')
    expect(w.emitted('change')).toBeFalsy()
  })
})

// ── jumpStep (ellipsis click to jump) ─────────────────────────────────────
describe('WkPagination — jumpStep', () => {
  it('jumps backward when the left ellipsis is clicked', async () => {
    // [1, …, 9, 10, 11, …, 20] — left ellipsis click with jumpStep=5 → 10−5=5
    const w = mount(WkPagination, { props: { current: 10, total: 20, pageSize: 1, jumpStep: 5 } })
    await ellipsisBtns(w)[0].trigger('click')
    expect(w.emitted('change')[0][0]).toBe(5)
  })

  it('jumps forward when the right ellipsis is clicked', async () => {
    // right ellipsis click → 10+5=15
    const w = mount(WkPagination, { props: { current: 10, total: 20, pageSize: 1, jumpStep: 5 } })
    const els = ellipsisBtns(w)
    await els[els.length - 1].trigger('click')
    expect(w.emitted('change')[0][0]).toBe(15)
  })

  it('clamps the jump target within the valid page range', async () => {
    // right ellipsis with current=3, total=20, jumpStep=20: 3+20=23 → clamped to 20
    const w = mount(WkPagination, { props: { current: 3, total: 20, pageSize: 1, jumpStep: 20 } })
    const els = ellipsisBtns(w)
    if (els.length > 0) {
      await els[els.length - 1].trigger('click')
      expect(w.emitted('change')[0][0]).toBe(20)
    }
  })

  it('does not emit when jumpStep=0 (static ellipsis)', async () => {
    const w = mount(WkPagination, { props: { current: 5, total: 20, pageSize: 1, jumpStep: 0 } })
    const els = ellipsisBtns(w)
    for (const el of els) {
      await el.trigger('click')
    }
    expect(w.emitted('change')).toBeFalsy()
  })
})
