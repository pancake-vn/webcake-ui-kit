import { vi } from 'vitest'
import { WkEditImageDialog, WkSelect, WkSlider } from '../src/index.js'
import { mount } from './_utils.js'

const IMG = 'https://x/shoe.png'
const $ = sel => document.body.querySelector(sel)
const $$ = sel => Array.from(document.body.querySelectorAll(sel))
const btn = text => $$('button').find(b => b.textContent.trim() === text)
// Sidebar action buttons only — "Crop"/"Extend" also label the Tabs.
const action = text => $$('.ui-edit-image__btn').find(b => b.textContent.trim() === text)
const tick = async w => {
  await w.vm.$nextTick()
  await w.vm.$nextTick()
}
const openTool = async (w, label) => {
  $$('.ui-accordion-item__trigger')
    .find(b => b.textContent.includes(label))
    .click()
  await tick(w)
}
const expanded = () => $$('.ui-accordion-item__trigger[aria-expanded="true"]').map(t => t.textContent.trim())
const open = (props = {}) => mount(WkEditImageDialog, { props: { open: true, image: IMG, ...props } })
// All panels are rendered (v-show), so Select order is: scale, orientation, ratio.
const selects = w => w.findAllComponents(WkSelect)

describe('WkEditImageDialog', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  describe('open / close / tools', () => {
    it('does not render when closed', () => {
      const w = open({ open: false })
      expect($('.ui-edit-image')).toBeNull()
      w.unmount()
    })

    it('renders the five tools, collapsed, and the image', async () => {
      const w = open()
      await tick(w)
      expect($$('.ui-accordion-item__trigger').map(t => t.textContent.trim())).toEqual([
        'Upscale image',
        'Crop & Extend',
        'Change background',
        'Object eraser',
        'Regenerate'
      ])
      expect(expanded()).toEqual([])
      expect($('.ui-edit-image__img').getAttribute('src')).toBe(IMG)
      w.unmount()
    })

    it('renders nothing in the preview without an image', async () => {
      const w = open({ image: '' })
      await tick(w)
      expect($('.ui-edit-image__frame')).toBeNull()
      w.unmount()
    })

    it('keeps only one tool open at a time, and toggles it closed', async () => {
      const w = open()
      await tick(w)
      await openTool(w, 'Upscale image')
      await openTool(w, 'Regenerate')
      expect(expanded()).toEqual(['Regenerate'])
      await openTool(w, 'Regenerate')
      expect(expanded()).toEqual([])
      w.unmount()
    })

    it('opens defaultTool on open', async () => {
      const w = open({ defaultTool: 'eraser' })
      await tick(w)
      expect(expanded()).toEqual(['Object eraser'])
      w.unmount()
    })

    it('resets tool and background choice when reopened', async () => {
      const w = open({ defaultTool: 'background' })
      await tick(w)
      $('[aria-label="#e7352b"]').click()
      await openTool(w, 'Regenerate')
      await w.setProps({ open: false })
      await tick(w)
      await w.setProps({ open: true })
      await tick(w)
      expect(expanded()).toEqual(['Change background'])
      expect($('[aria-label="#e7352b"]').getAttribute('aria-pressed')).toBe('false')
      w.unmount()
    })

    it('emits change(false) + update:modelValue(false) + cancel on close', async () => {
      const w = open()
      await tick(w)
      $('[aria-label="Close"]').click()
      await tick(w)
      expect(w.emitted('change').pop()[0]).toBe(false)
      expect(w.emitted('update:modelValue').pop()[0]).toBe(false)
      expect(w.emitted('cancel')).toBeTruthy()
      w.unmount()
    })
  })

  describe('upscale', () => {
    it('emits upscale with the default scale', async () => {
      const w = open({ defaultTool: 'upscale' })
      await tick(w)
      action('Upscale').click()
      await tick(w)
      expect(w.emitted('upscale')[0][0]).toEqual({ scale: 2 })
      w.unmount()
    })

    it('emits the picked scale', async () => {
      const w = open({ defaultTool: 'upscale' })
      await tick(w)
      selects(w).at(0).vm.$emit('change', 4)
      await tick(w)
      action('Upscale').click()
      await tick(w)
      expect(w.emitted('upscale')[0][0]).toEqual({ scale: 4 })
      w.unmount()
    })

    it('is disabled without an image', async () => {
      const w = open({ image: '', defaultTool: 'upscale' })
      await tick(w)
      expect(action('Upscale').disabled).toBe(true)
      w.unmount()
    })
  })

  describe('crop & extend', () => {
    it('emits crop, then extend after switching tab, and frames the preview at the target ratio', async () => {
      const w = open({ defaultTool: 'cropExtend' })
      await tick(w)
      const frame = $('.ui-edit-image__frame')
      expect(frame.classList.contains('ui-edit-image__frame--crop')).toBe(true)
      expect(frame.classList.contains('ui-edit-image__frame--wide')).toBe(true)
      expect(frame.style.aspectRatio).toBe('16 / 9')
      action('Crop').click()
      await tick(w)
      expect(w.emitted('crop')[0][0]).toEqual({ ratio: '16:9', orientation: 'horizontal' })

      $$('.ui-tabs__item')
        .find(b => b.textContent.includes('Extend'))
        .click()
      await tick(w)
      expect($('.ui-edit-image__frame').classList.contains('ui-edit-image__frame--extend')).toBe(true)
      expect($('.ui-edit-image__frame').classList.contains('ui-edit-image__checker')).toBe(true)
      action('Extend').click()
      await tick(w)
      expect(w.emitted('extend')[0][0]).toEqual({ ratio: '16:9', orientation: 'horizontal' })
      w.unmount()
    })

    it('flips the ratio for vertical orientation', async () => {
      const w = open({ defaultTool: 'cropExtend' })
      await tick(w)
      selects(w).at(1).vm.$emit('change', 'vertical')
      selects(w).at(2).vm.$emit('change', '4:3')
      await tick(w)
      const frame = $('.ui-edit-image__frame')
      expect(frame.classList.contains('ui-edit-image__frame--tall')).toBe(true)
      expect(frame.style.aspectRatio).toBe('3 / 4')
      action('Crop').click()
      await tick(w)
      expect(w.emitted('crop')[0][0]).toEqual({ ratio: '3:4', orientation: 'vertical' })
      w.unmount()
    })

    it('treats 1:1 as a tall (height-bound) frame', async () => {
      const w = open({ defaultTool: 'cropExtend' })
      await tick(w)
      selects(w).at(2).vm.$emit('change', '1:1')
      await tick(w)
      expect($('.ui-edit-image__frame').classList.contains('ui-edit-image__frame--tall')).toBe(true)
      w.unmount()
    })

    it('drops the ratio frame when another tool is opened', async () => {
      const w = open({ defaultTool: 'cropExtend' })
      await tick(w)
      await openTool(w, 'Upscale image')
      const frame = $('.ui-edit-image__frame')
      expect(frame.classList.contains('ui-edit-image__frame--crop')).toBe(false)
      expect(frame.style.aspectRatio).toBe('')
      w.unmount()
    })

    it('uses translated tab labels', async () => {
      const w = open({ defaultTool: 'cropExtend', labels: { crop: 'Cắt', extend: 'Mở rộng' } })
      await tick(w)
      expect($$('.ui-tabs__item').map(b => b.textContent.trim())).toEqual(['Cắt', 'Mở rộng'])
      expect(action('Cắt')).toBeTruthy()
      w.unmount()
    })
  })

  describe('change background', () => {
    it('renders one swatch per color (12 by default)', async () => {
      const w = open({ defaultTool: 'background' })
      await tick(w)
      expect($$('.ui-edit-image__swatch').length).toBe(12)
      w.unmount()
    })

    it('requires a swatch before emitting change-background', async () => {
      const w = open({ defaultTool: 'background' })
      await tick(w)
      expect(action('Change').disabled).toBe(true)
      $('[aria-label="#1391c9"]').click()
      await tick(w)
      expect($('[aria-label="#1391c9"]').getAttribute('aria-pressed')).toBe('true')
      expect($('[aria-label="#1391c9"]').classList.contains('ui-edit-image__swatch--active')).toBe(true)
      action('Change').click()
      await tick(w)
      expect(w.emitted('change-background')[0][0]).toEqual({ color: '#1391c9' })
      w.unmount()
    })

    it('previews the picked color behind the image', async () => {
      const w = open({ defaultTool: 'background' })
      await tick(w)
      $('[aria-label="#1391c9"]').click()
      await tick(w)
      expect($('.ui-edit-image__frame').style.background).toContain('rgb(19, 145, 201)')
      w.unmount()
    })

    it('previews transparent as a checkerboard and emits it', async () => {
      const w = open({ defaultTool: 'background' })
      await tick(w)
      $('[aria-label="transparent"]').click()
      await tick(w)
      expect($('.ui-edit-image__frame').classList.contains('ui-edit-image__checker')).toBe(true)
      action('Change').click()
      await tick(w)
      expect(w.emitted('change-background')[0][0]).toEqual({ color: 'transparent' })
      w.unmount()
    })

    it('accepts a custom color list', async () => {
      const w = open({ defaultTool: 'background', backgroundColors: ['#000000', '#ffffff'] })
      await tick(w)
      expect($$('.ui-edit-image__swatch').map(s => s.getAttribute('aria-label'))).toEqual(['#000000', '#ffffff'])
      w.unmount()
    })
  })

  describe('object eraser', () => {
    // jsdom has no canvas — record what the component draws instead.
    let ctx
    // 4 pixels of the brush layer, alpha = 255 (stroke), 0 (empty), 100 / 200 (anti-aliased edge)
    let pixels
    const mockCanvas = () => {
      pixels = new Uint8ClampedArray([9, 9, 9, 255, 0, 0, 0, 0, 9, 9, 9, 100, 9, 9, 9, 200])
      ctx = {
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        stroke: vi.fn(),
        clearRect: vi.fn(),
        drawImage: vi.fn(),
        getImageData: vi.fn(() => ({ data: pixels })),
        putImageData: vi.fn()
      }
      vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx)
      vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/png;base64,MASK')
      // Canvas shown at 400px while the image is 800px wide → 2x scale.
      vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue({
        left: 10,
        top: 20,
        width: 400,
        height: 400
      })
    }
    const loadImage = async (w, size = 800) => {
      const img = $('.ui-edit-image__img')
      Object.defineProperty(img, 'naturalWidth', { value: size, configurable: true })
      Object.defineProperty(img, 'naturalHeight', { value: size, configurable: true })
      img.dispatchEvent(new Event('load'))
      await tick(w)
    }
    const pointer = (type, x, y) =>
      $('.ui-edit-image__mask').dispatchEvent(new MouseEvent(type, { clientX: x, clientY: y, bubbles: true }))

    it('shows the brush layer only while the eraser tool is open', async () => {
      const w = open()
      await tick(w)
      expect($('.ui-edit-image__mask')).toBeNull()
      await openTool(w, 'Object eraser')
      expect($('.ui-edit-image__mask')).not.toBeNull()
      await openTool(w, 'Object eraser')
      expect($('.ui-edit-image__mask')).toBeNull()
      w.unmount()
    })

    it('sizes the brush canvas to the image natural size', async () => {
      mockCanvas()
      const w = open({ defaultTool: 'eraser' })
      await tick(w)
      await loadImage(w, 800)
      expect($('.ui-edit-image__mask').width).toBe(800)
      expect($('.ui-edit-image__mask').height).toBe(800)
      w.unmount()
    })

    it('blocks Eraser until something is painted', async () => {
      mockCanvas()
      const w = open({ defaultTool: 'eraser' })
      await tick(w)
      expect(action('Eraser').disabled).toBe(true)
      action('Eraser').click()
      await tick(w)
      expect(w.emitted('erase')).toBeFalsy()
      w.unmount()
    })

    it('paints in image pixels: maps pointer position and brush size through the display scale', async () => {
      mockCanvas()
      const w = open({ defaultTool: 'eraser' })
      await tick(w)
      await loadImage(w, 800)
      pointer('pointerdown', 110, 70) // (100, 50) inside the canvas → (200, 100) in image pixels
      pointer('pointermove', 210, 120) // → (400, 200)
      pointer('pointerup', 210, 120)
      await tick(w)
      expect(ctx.lineWidth).toBe(100) // default size 50 × 2
      expect(ctx.lineCap).toBe('round')
      expect(ctx.moveTo).toHaveBeenCalledWith(200, 100)
      expect(ctx.lineTo).toHaveBeenCalledWith(400, 200)
      expect(action('Eraser').disabled).toBe(false)
      w.unmount()
    })

    it('ignores pointer moves when the button is not pressed', async () => {
      mockCanvas()
      const w = open({ defaultTool: 'eraser' })
      await tick(w)
      await loadImage(w)
      pointer('pointermove', 50, 50)
      await tick(w)
      expect(ctx.lineTo).not.toHaveBeenCalled()
      expect(action('Eraser').disabled).toBe(true)
      w.unmount()
    })

    it('stops drawing after pointerup / pointerleave', async () => {
      mockCanvas()
      const w = open({ defaultTool: 'eraser' })
      await tick(w)
      await loadImage(w)
      pointer('pointerdown', 20, 30)
      pointer('pointerleave', 20, 30)
      const calls = ctx.lineTo.mock.calls.length
      pointer('pointermove', 100, 100)
      expect(ctx.lineTo.mock.calls.length).toBe(calls)
      w.unmount()
    })

    it('uses the Size slider for the brush width', async () => {
      mockCanvas()
      const w = open({ defaultTool: 'eraser' })
      await tick(w)
      await loadImage(w, 800)
      w.findComponent(WkSlider).vm.$emit('change', 20)
      await tick(w)
      pointer('pointerdown', 50, 50)
      expect(ctx.lineWidth).toBe(40) // 20 × 2
      w.unmount()
    })

    it('emits erase with the size and a pure white-on-black PNG mask (no grey edge pixels)', async () => {
      mockCanvas()
      const w = open({ defaultTool: 'eraser' })
      await tick(w)
      await loadImage(w, 800)
      pointer('pointerdown', 110, 70)
      pointer('pointerup', 110, 70)
      await tick(w)
      action('Eraser').click()
      await tick(w)
      expect(w.emitted('erase')[0][0]).toEqual({ size: 50, mask: 'data:image/png;base64,MASK' })
      expect(ctx.drawImage).toHaveBeenCalled()
      expect(ctx.getImageData).toHaveBeenCalledWith(0, 0, 800, 800)
      expect(Array.from(pixels)).toEqual([
        255,
        255,
        255,
        255, // stroke → white
        0,
        0,
        0,
        255, // empty → black
        0,
        0,
        0,
        255, // faint edge (alpha 100) → black
        255,
        255,
        255,
        255 // strong edge (alpha 200) → white
      ])
      expect(ctx.putImageData).toHaveBeenCalled()
      w.unmount()
    })

    it('clears the mask when the image is replaced by the API result', async () => {
      mockCanvas()
      const w = open({ defaultTool: 'eraser' })
      await tick(w)
      await loadImage(w)
      pointer('pointerdown', 50, 50)
      pointer('pointerup', 50, 50)
      await tick(w)
      expect(action('Eraser').disabled).toBe(false)
      await w.setProps({ image: 'https://x/erased.png' })
      await tick(w)
      expect(ctx.clearRect).toHaveBeenCalled()
      expect(action('Eraser').disabled).toBe(true)
      w.unmount()
    })

    it('removes the brush layer while loading', async () => {
      mockCanvas()
      const w = open({ defaultTool: 'eraser', loading: true })
      await tick(w)
      expect($('.ui-edit-image__mask')).toBeNull()
      w.unmount()
    })
  })

  describe('regenerate', () => {
    it('emits regenerate with the typed prompt', async () => {
      const w = open({ defaultTool: 'regenerate' })
      await tick(w)
      expect(action('Generate').disabled).toBe(true)
      const el = $('.ui-ai-prompt-box__input')
      el.value = 'white background'
      el.dispatchEvent(new Event('input'))
      await tick(w)
      expect(w.emitted('update:prompt').pop()[0]).toBe('white background')
      action('Generate').click()
      await tick(w)
      expect(w.emitted('regenerate')[0][0]).toEqual({ prompt: 'white background' })
      w.unmount()
    })

    it('follows the prompt prop', async () => {
      const w = open({ defaultTool: 'regenerate', prompt: 'a' })
      await w.setProps({ prompt: 'b' })
      await tick(w)
      expect($('.ui-ai-prompt-box__input').value).toBe('b')
      w.unmount()
    })

    it('forwards add-reference and enhance-prompt', async () => {
      const w = open({ defaultTool: 'regenerate', prompt: 'shoe' })
      await tick(w)
      $('[aria-label="Add reference image"]').click()
      $('[aria-label="Enhance prompt"]').click()
      await tick(w)
      expect(w.emitted('add-reference')).toBeTruthy()
      expect(w.emitted('enhance-prompt')[0][0]).toBe('shoe')
      w.unmount()
    })

    it('blocks Generate without an image', async () => {
      const w = open({ image: '', defaultTool: 'regenerate', prompt: 'x' })
      await tick(w)
      expect(action('Generate').disabled).toBe(true)
      w.unmount()
    })
  })

  describe('save / loading / labels', () => {
    it('shows Save buttons only after the image changed, and emits save / save-copy', async () => {
      const w = open()
      await tick(w)
      expect(btn('Save image')).toBeUndefined()
      await w.setProps({ image: 'https://x/shoe-2x.png' })
      await tick(w)
      btn('Save image').click()
      btn('Save as copy').click()
      await tick(w)
      expect(w.emitted('save')[0][0]).toEqual({ image: 'https://x/shoe-2x.png' })
      expect(w.emitted('save-copy')[0][0]).toEqual({ image: 'https://x/shoe-2x.png' })
      w.unmount()
    })

    it('hides Save again if the image goes back to the original', async () => {
      const w = open()
      await w.setProps({ image: 'https://x/2.png' })
      await w.setProps({ image: IMG })
      await tick(w)
      expect(btn('Save image')).toBeUndefined()
      w.unmount()
    })

    it('treats an image arriving after open as the original', async () => {
      const w = open({ image: '' })
      await tick(w)
      await w.setProps({ image: IMG })
      await tick(w)
      expect(btn('Save image')).toBeUndefined()
      w.unmount()
    })

    it('takes the image at reopen as the new original', async () => {
      const w = open()
      await w.setProps({ image: 'https://x/2.png' })
      await w.setProps({ open: false })
      await tick(w)
      await w.setProps({ open: true })
      await tick(w)
      expect(btn('Save image')).toBeUndefined()
      w.unmount()
    })

    it('shows the glow, hides Save and disables the tools while loading', async () => {
      const w = open()
      await tick(w)
      await w.setProps({ image: 'https://x/2.png', loading: true })
      await tick(w)
      expect($('.ui-edit-image__glow')).not.toBeNull()
      expect(btn('Save image')).toBeUndefined()
      expect($$('.ui-accordion-item__trigger').every(t => t.disabled)).toBe(true)
      w.unmount()
    })

    it('overrides texts via labels', async () => {
      const w = open({ title: 'Chỉnh sửa ảnh', labels: { upscale: 'Phóng to ảnh', save: 'Lưu ảnh' } })
      await w.setProps({ image: 'https://x/2.png' })
      await tick(w)
      expect($('.ui-dialog-header__title').textContent.trim()).toBe('Chỉnh sửa ảnh')
      expect($$('.ui-accordion-item__trigger')[0].textContent.trim()).toBe('Phóng to ảnh')
      expect(btn('Lưu ảnh')).toBeTruthy()
      expect(btn('Save as copy')).toBeTruthy()
      w.unmount()
    })
  })
})
