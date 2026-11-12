import { WkGenerateImageDialog, WkSelect } from '../src/index.js'
import { mount } from './_utils.js'

const $ = sel => document.body.querySelector(sel)
const btn = text => Array.from(document.body.querySelectorAll('button')).find(b => b.textContent.trim() === text)
const tick = async w => {
  await w.vm.$nextTick()
  await w.vm.$nextTick()
}
const type = async (w, value) => {
  const el = $('.ui-ai-prompt-box__input')
  el.value = value
  el.dispatchEvent(new Event('input'))
  await tick(w)
}
// findAllComponents returns an Array (VTU2) or a WrapperArray (VTU1) — both have .at(i).
const selects = w => w.findAllComponents(WkSelect)
const open = (props = {}) => mount(WkGenerateImageDialog, { props: { open: true, ...props } })

describe('WkGenerateImageDialog', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('open / close', () => {
    it('does not render when closed', () => {
      const w = open({ open: false })
      expect($('.ui-gen-image')).toBeNull()
      w.unmount()
    })

    it('renders title, form and empty preview when open', async () => {
      const w = open()
      await tick(w)
      expect($('.ui-gen-image')).not.toBeNull()
      expect(document.body.textContent).toContain('Generate image')
      expect(document.body.textContent).toContain('Dimension')
      expect(document.body.textContent).toContain('Style')
      expect(document.body.textContent).toContain('Your generation will appear here')
      expect($('.ui-gen-image__glow')).toBeNull()
      w.unmount()
    })

    it('opens via modelValue (Vue 3 v-model) as well as open', async () => {
      const w = mount(WkGenerateImageDialog, { props: { modelValue: true } })
      await tick(w)
      expect($('.ui-gen-image')).not.toBeNull()
      w.unmount()
    })

    it('opens when open flips to true', async () => {
      const w = open({ open: false })
      await w.setProps({ open: true })
      await tick(w)
      expect($('.ui-gen-image')).not.toBeNull()
      w.unmount()
    })

    it('renders a custom title', async () => {
      const w = open({ title: 'Tạo ảnh với AI' })
      await tick(w)
      expect($('.ui-dialog-header__title').textContent.trim()).toBe('Tạo ảnh với AI')
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

  describe('prompt', () => {
    it('disables Generate until a prompt is typed, then emits generate with the payload', async () => {
      const w = open()
      await tick(w)
      expect(btn('Generate').disabled).toBe(true)
      await type(w, 'a red camera')
      expect(w.emitted('update:prompt').pop()[0]).toBe('a red camera')
      expect(btn('Generate').disabled).toBe(false)
      btn('Generate').click()
      await tick(w)
      expect(w.emitted('generate')[0][0]).toEqual({ prompt: 'a red camera', dimension: '1:1', style: 'Photo' })
      w.unmount()
    })

    it('treats a whitespace-only prompt as empty', async () => {
      const w = open()
      await tick(w)
      await type(w, '   ')
      expect(btn('Generate').disabled).toBe(true)
      expect($('[aria-label="Enhance prompt"]').disabled).toBe(true)
      w.unmount()
    })

    it('reflects prompt prop changes in the textarea (controlled usage)', async () => {
      const w = open({ prompt: 'first' })
      await tick(w)
      expect($('.ui-ai-prompt-box__input').value).toBe('first')
      await w.setProps({ prompt: 'enhanced by AI' })
      await tick(w)
      expect($('.ui-ai-prompt-box__input').value).toBe('enhanced by AI')
      w.unmount()
    })

    it('shows the placeholder', async () => {
      const w = open()
      await tick(w)
      expect($('.ui-ai-prompt-box__input').getAttribute('placeholder')).toBe('Describe your ideas')
      w.unmount()
    })

    it('emits add-reference and enhance-prompt (with the current prompt)', async () => {
      const w = open({ prompt: 'cat' })
      await tick(w)
      $('[aria-label="Add reference image"]').click()
      $('[aria-label="Enhance prompt"]').click()
      await tick(w)
      expect(w.emitted('add-reference')).toBeTruthy()
      expect(w.emitted('enhance-prompt')[0][0]).toBe('cat')
      w.unmount()
    })

    it('disables enhance-prompt while the prompt is empty', async () => {
      const w = open()
      await tick(w)
      expect($('[aria-label="Enhance prompt"]').disabled).toBe(true)
      w.unmount()
    })

    it('Enter keeps typing; Cmd/Ctrl+Enter generates; not while composing or loading', async () => {
      const key = init => {
        const e = new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true, cancelable: true, ...init })
        $('.ui-ai-prompt-box__input').dispatchEvent(e)
        return e
      }
      const w = open({ prompt: 'a cat' })
      await tick(w)
      expect(key({}).defaultPrevented).toBe(false)
      key({ ctrlKey: true, isComposing: true })
      expect(w.emitted('generate')).toBeFalsy()
      expect(key({ metaKey: true }).defaultPrevented).toBe(true)
      key({ ctrlKey: true })
      expect(w.emitted('generate').length).toBe(2)
      expect(w.emitted('generate')[0][0].prompt).toBe('a cat')
      await w.setProps({ loading: true })
      await tick(w)
      key({ ctrlKey: true })
      expect(w.emitted('generate').length).toBe(2)
      w.unmount()
    })
  })

  describe('enhancing', () => {
    it('animates the prompt box, keeps text readable and blocks Generate / enhance / submit', async () => {
      const w = open({ prompt: 'a cat', enhancing: true })
      await tick(w)
      expect($('.ui-ai-prompt-box').classList.contains('ui-ai-prompt-box--enhancing')).toBe(true)
      expect($('.ui-ai-prompt-box').getAttribute('aria-busy')).toBe('true')
      const input = $('.ui-ai-prompt-box__input')
      expect(input.readOnly).toBe(true)
      expect(input.disabled).toBe(false)
      expect(btn('Generate').disabled).toBe(true)
      expect($('[aria-label="Enhance prompt"]').disabled).toBe(true)
      expect($('[aria-label="Add reference image"]').disabled).toBe(true)
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, ctrlKey: true, cancelable: true }))
      expect(w.emitted('generate')).toBeFalsy()
      await w.setProps({ enhancing: false })
      await tick(w)
      expect($('.ui-ai-prompt-box').classList.contains('ui-ai-prompt-box--enhancing')).toBe(false)
      expect(btn('Generate').disabled).toBe(false)
      w.unmount()
    })
  })

  describe('dimension / style', () => {
    it('defaults to the first option of each list', async () => {
      const w = open({ prompt: 'p', dimensionOptions: ['16:9', '1:1'], styleOptions: [{ label: '3D', value: '3d' }] })
      await tick(w)
      btn('Generate').click()
      await tick(w)
      expect(w.emitted('generate')[0][0]).toEqual({ prompt: 'p', dimension: '16:9', style: '3d' })
      w.unmount()
    })

    it('uses provided dimension / imageStyle props', async () => {
      const w = open({ prompt: 'p', dimension: '16:9', imageStyle: 'Anime' })
      await tick(w)
      btn('Generate').click()
      await tick(w)
      expect(w.emitted('generate')[0][0]).toEqual({ prompt: 'p', dimension: '16:9', style: 'Anime' })
      w.unmount()
    })

    it('emits update:dimension / update:imageStyle and uses the picked values', async () => {
      const w = open({ prompt: 'p' })
      await tick(w)
      selects(w).at(0).vm.$emit('change', '9:16')
      selects(w).at(1).vm.$emit('change', 'Anime')
      await tick(w)
      expect(w.emitted('update:dimension')[0][0]).toBe('9:16')
      expect(w.emitted('update:imageStyle')[0][0]).toBe('Anime')
      btn('Generate').click()
      await tick(w)
      expect(w.emitted('generate')[0][0]).toEqual({ prompt: 'p', dimension: '9:16', style: 'Anime' })
      w.unmount()
    })

    it('follows later dimension prop changes', async () => {
      const w = open({ prompt: 'p', dimension: '1:1' })
      await w.setProps({ dimension: '4:3' })
      await tick(w)
      btn('Generate').click()
      await tick(w)
      expect(w.emitted('generate')[0][0].dimension).toBe('4:3')
      w.unmount()
    })
  })

  describe('loading / result', () => {
    it('shows the generating state while loading and locks the form', async () => {
      const w = open({ prompt: 'p', loading: true })
      await tick(w)
      expect(document.body.textContent).toContain('Generating...')
      expect($('.ui-gen-image__glow')).not.toBeNull()
      expect(btn('Generate').disabled).toBe(true)
      expect($('.ui-ai-prompt-box__input').disabled).toBe(true)
      w.unmount()
    })

    it('hides a previous result and Use image while loading', async () => {
      const w = open({ prompt: 'p', image: 'https://x/old.png', loading: true })
      await tick(w)
      expect($('.ui-gen-image__result')).toBeNull()
      expect(btn('Use image')).toBeUndefined()
      w.unmount()
    })

    it('goes empty → generating → result as the consumer updates props', async () => {
      const w = open({ prompt: 'p' })
      await tick(w)
      btn('Generate').click()
      await w.setProps({ loading: true })
      await tick(w)
      expect($('.ui-gen-image__glow')).not.toBeNull()
      await w.setProps({ loading: false, image: 'https://x/new.png' })
      await tick(w)
      expect($('.ui-gen-image__glow')).toBeNull()
      expect($('.ui-gen-image__result').getAttribute('src')).toBe('https://x/new.png')
      w.unmount()
    })

    it('shows the result image and emits use with it', async () => {
      const w = open({ prompt: 'p', image: 'https://x/y.png' })
      await tick(w)
      expect($('.ui-gen-image__result').getAttribute('src')).toBe('https://x/y.png')
      btn('Use image').click()
      await tick(w)
      expect(w.emitted('use')[0][0]).toEqual({
        prompt: 'p',
        dimension: '1:1',
        style: 'Photo',
        image: 'https://x/y.png'
      })
      w.unmount()
    })

    it('hides Use image without a result', async () => {
      const w = open()
      await tick(w)
      expect(btn('Use image')).toBeUndefined()
      w.unmount()
    })
  })

  describe('credits / labels / slots', () => {
    it('renders credits only when provided (0 counts)', async () => {
      const w = open({ credits: '1.443' })
      await tick(w)
      expect($('.ui-gen-image__credits').textContent).toContain('1.443')
      await w.setProps({ credits: 0 })
      await tick(w)
      expect($('.ui-gen-image__credits').textContent).toContain('0')
      await w.setProps({ credits: null })
      await tick(w)
      expect($('.ui-gen-image__credits')).toBeNull()
      w.unmount()
    })

    it('replaces the credit icon via the credit-icon slot', async () => {
      const w = mount(WkGenerateImageDialog, {
        props: { open: true, credits: 5 },
        slots: { 'credit-icon': '<i class="my-coin"></i>' }
      })
      await tick(w)
      expect($('.ui-gen-image__credits .my-coin')).not.toBeNull()
      w.unmount()
    })

    it('overrides every text via labels', async () => {
      const labels = {
        dimension: 'Kích thước',
        style: 'Phong cách',
        placeholder: 'Mô tả ý tưởng',
        generate: 'Tạo ảnh',
        useImage: 'Dùng ảnh',
        empty: 'Ảnh sẽ hiện ở đây',
        addReference: 'Thêm ảnh tham chiếu',
        enhancePrompt: 'Cải thiện prompt'
      }
      const w = open({ labels, image: 'https://x/y.png', prompt: 'p' })
      await tick(w)
      const text = document.body.textContent
      expect(text).toContain('Kích thước')
      expect(text).toContain('Phong cách')
      expect(btn('Tạo ảnh')).toBeTruthy()
      expect(btn('Dùng ảnh')).toBeTruthy()
      expect($('[aria-label="Thêm ảnh tham chiếu"]')).not.toBeNull()
      expect($('[aria-label="Cải thiện prompt"]')).not.toBeNull()
      await w.setProps({ image: '', prompt: '' })
      await tick(w)
      expect(document.body.textContent).toContain('Ảnh sẽ hiện ở đây')
      expect($('.ui-ai-prompt-box__input').getAttribute('placeholder')).toBe('Mô tả ý tưởng')
      w.unmount()
    })

    it('keeps the default texts for labels not overridden', async () => {
      const w = open({ labels: { generate: 'Tạo ảnh' } })
      await tick(w)
      expect(document.body.textContent).toContain('Dimension')
      w.unmount()
    })
  })
})
