<template>
  <Dialog
    :open="isOpen"
    :title="title"
    header-size="sm"
    :footer="false"
    :width="width"
    :centered="true"
    :mask-closable="maskClosable"
    :z-index="zIndex"
    @change="setOpen"
    @cancel="$emit('cancel')"
    @after-close="$emit('after-close')"
  >
    <div class="ui-edit-image">
      <aside class="ui-edit-image__sidebar">
        <div class="ui-edit-image__tools">
          <Accordion v-for="t in tools" :key="t.key" bordered :value="activeTool" @change="setTool">
            <AccordionItem :value="t.key" :disabled="loading">
              <template #label>
                <span class="ui-edit-image__tool-label">
                  <component :is="t.icon" :size="20" />
                  {{ text[t.key] }}
                </span>
              </template>

              <div class="ui-edit-image__panel">
                <template v-if="t.key === 'upscale'">
                  <Field :label="text.scaleFactor">
                    <Select :value="scale" :options="scaleOptions" @change="scale = $event" />
                  </Field>
                  <Button class="ui-edit-image__btn" :disabled="loading || !image" @click="$emit('upscale', { scale })">
                    <template #icon-left><WkiSparkles :size="20" /></template>
                    {{ text.upscaleAction }}
                  </Button>
                </template>

                <template v-else-if="t.key === 'cropExtend'">
                  <Tabs :value="cropMode" :tabs="cropTabs" stretch-items @change="cropMode = $event" />
                  <Field :label="text.orientation">
                    <Select :value="orientation" :options="orientationOptions" @change="orientation = $event" />
                  </Field>
                  <Field :label="text.ratio">
                    <Select :value="ratio" :options="ratioOptions" @change="ratio = $event" />
                  </Field>
                  <Button class="ui-edit-image__btn" :disabled="loading || !image" @click="onCrop">
                    <template #icon-left><WkiSparkles :size="20" /></template>
                    {{ cropMode === 'crop' ? text.crop : text.extend }}
                  </Button>
                </template>

                <template v-else-if="t.key === 'background'">
                  <div class="ui-edit-image__swatches">
                    <button
                      v-for="c in backgroundColors"
                      :key="c"
                      type="button"
                      :class="['ui-edit-image__swatch', c === bgColor && 'ui-edit-image__swatch--active']"
                      :aria-label="c"
                      :aria-pressed="c === bgColor ? 'true' : 'false'"
                      @click="bgColor = c"
                    >
                      <span
                        :class="['ui-edit-image__swatch-fill', c === 'transparent' && 'ui-edit-image__checker']"
                        :style="c === 'transparent' ? null : { background: c }"
                      ></span>
                    </button>
                  </div>
                  <Button
                    class="ui-edit-image__btn"
                    :disabled="loading || !image || !bgColor"
                    @click="$emit('change-background', { color: bgColor })"
                  >
                    <template #icon-left><WkiSparkles :size="20" /></template>
                    {{ text.changeAction }}
                  </Button>
                </template>

                <template v-else-if="t.key === 'eraser'">
                  <Field :label="text.size">
                    <Slider :value="eraserSize" :min="1" :max="100" variant="primary" @change="eraserSize = $event" />
                  </Field>
                  <Button class="ui-edit-image__btn" :disabled="loading || !hasMask" @click="onErase">
                    <template #icon-left><WkiSparkles :size="20" /></template>
                    {{ text.eraseAction }}
                  </Button>
                </template>

                <template v-else>
                  <AiPromptBox
                    :value="localPrompt"
                    :enhancing="enhancing"
                    :placeholder="text.placeholder"
                    :reference-label="text.addReference"
                    :enhance-label="text.enhancePrompt"
                    @input="onPrompt"
                    @add-reference="$emit('add-reference')"
                    @enhance="$emit('enhance-prompt', $event)"
                    @submit="onRegenerate"
                  />
                  <Button
                    class="ui-edit-image__btn"
                    :disabled="loading || enhancing || !image || !localPrompt.trim()"
                    @click="onRegenerate"
                  >
                    {{ text.generate }}
                  </Button>
                </template>
              </div>
            </AccordionItem>
          </Accordion>
        </div>

        <div v-if="edited && !loading" class="ui-edit-image__actions">
          <Button class="ui-edit-image__btn" variant="neutral" @click="$emit('save', { image })">
            {{ text.save }}
          </Button>
          <Button class="ui-edit-image__btn" variant="outline" @click="$emit('save-copy', { image })">
            {{ text.saveCopy }}
          </Button>
        </div>
      </aside>

      <section class="ui-edit-image__preview">
        <div v-if="image" :class="frameCls" :style="frameStyle">
          <img class="ui-edit-image__img" :src="image" alt="" @load="onImgLoad" />
          <canvas
            v-if="activeTool === 'eraser' && !loading"
            ref="mask"
            class="ui-edit-image__mask"
            :width="natural.w"
            :height="natural.h"
            @pointerdown="startStroke"
            @pointermove="moveStroke"
            @pointerup="endStroke"
            @pointerleave="endStroke"
          ></canvas>
        </div>
        <div v-if="loading" class="ui-edit-image__glow" aria-hidden="true"></div>
      </section>
    </div>
  </Dialog>
</template>

<script>
import Dialog from '../dialog/Dialog.vue'
import Accordion from '../accordion/Accordion.vue'
import AccordionItem from '../accordion-item/AccordionItem.vue'
import Button from '../button/Button.vue'
import Field from '../field/Field.vue'
import Select from '../select/Select.vue'
import Slider from '../slider/Slider.vue'
import Tabs from '../tabs/Tabs.vue'
import AiPromptBox from '../ai-prompt-box/AiPromptBox.vue'
import WkiSparkles from '../../icons/Sparkles.vue'
import WkiImageUpscale from '../../icons/ImageUpscale.vue'
import WkiCrop from '../../icons/Crop.vue'
import WkiPaintBucket from '../../icons/PaintBucket.vue'
import WkiEraser from '../../icons/Eraser.vue'
import WkiRefreshCw from '../../icons/RefreshCw.vue'

const DEFAULT_LABELS = {
  upscale: 'Upscale image',
  scaleFactor: 'Scale factor',
  upscaleAction: 'Upscale',
  cropExtend: 'Crop & Extend',
  crop: 'Crop',
  extend: 'Extend',
  orientation: 'Orientation',
  ratio: 'Ratio',
  background: 'Change background',
  changeAction: 'Change',
  eraser: 'Object eraser',
  size: 'Size',
  eraseAction: 'Eraser',
  regenerate: 'Regenerate',
  placeholder: 'Describe the change you want',
  generate: 'Generate',
  save: 'Save image',
  saveCopy: 'Save as copy',
  addReference: 'Add reference image',
  enhancePrompt: 'Enhance prompt'
}

const TOOLS = [
  { key: 'upscale', icon: 'WkiImageUpscale' },
  { key: 'cropExtend', icon: 'WkiCrop' },
  { key: 'background', icon: 'WkiPaintBucket' },
  { key: 'eraser', icon: 'WkiEraser' },
  { key: 'regenerate', icon: 'WkiRefreshCw' }
]

const firstValue = list => {
  const o = list && list[0]
  return o !== null && typeof o === 'object' ? o.value : o
}

export default {
  name: 'EditImageDialog',
  components: {
    Dialog,
    Accordion,
    AccordionItem,
    Button,
    Field,
    Select,
    Slider,
    Tabs,
    AiPromptBox,
    WkiSparkles,
    WkiImageUpscale,
    WkiCrop,
    WkiPaintBucket,
    WkiEraser,
    WkiRefreshCw
  },
  model: { prop: 'open', event: 'change' },
  props: {
    open: { type: Boolean, default: false },
    modelValue: { type: Boolean, default: undefined },
    title: { type: String, default: 'Edit image' },
    // Current image URL. Replace it with each API result; "Save" buttons appear once it differs from the opening image.
    image: { type: String, default: '' },
    loading: { type: Boolean, default: false },
    // Set while your enhance-prompt request runs; Regenerate is blocked until it ends.
    enhancing: { type: Boolean, default: false },
    prompt: { type: String, default: '' },
    defaultTool: {
      type: String,
      default: '',
      validator: v => v === '' || TOOLS.some(t => t.key === v)
    },
    scaleOptions: {
      type: Array,
      default: () => [
        { label: '2x', value: 2 },
        { label: '4x', value: 4 }
      ]
    },
    orientationOptions: {
      type: Array,
      default: () => [
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Vertical', value: 'vertical' }
      ]
    },
    // Written as landscape W:H — "vertical" orientation flips it.
    ratioOptions: { type: Array, default: () => ['16:9', '4:3', '3:2', '1:1'] },
    backgroundColors: {
      type: Array,
      default: () => [
        'transparent',
        '#ffffff',
        '#f2f2f2',
        '#d0d0d0',
        '#1391c9',
        '#e7352b',
        '#ffd533',
        '#7aba3c',
        '#825d41',
        '#f36b26',
        '#f1728f',
        '#8e429f'
      ]
    },
    labels: { type: Object, default: () => ({}) },
    width: { type: [Number, String], default: 1280 },
    maskClosable: { type: Boolean, default: false },
    zIndex: { type: [Number, String], default: 1000 }
  },
  emits: [
    'change',
    'update:modelValue',
    'update:prompt',
    'upscale',
    'crop',
    'extend',
    'change-background',
    'erase',
    'regenerate',
    'add-reference',
    'enhance-prompt',
    'save',
    'save-copy',
    'cancel',
    'after-close'
  ],
  data() {
    return {
      tools: TOOLS,
      activeTool: this.defaultTool || null,
      initialImage: this.image,
      localPrompt: this.prompt,
      scale: firstValue(this.scaleOptions),
      cropMode: 'crop',
      orientation: firstValue(this.orientationOptions),
      ratio: firstValue(this.ratioOptions),
      bgColor: '',
      eraserSize: 50,
      hasMask: false,
      natural: { w: 0, h: 0 }
    }
  },
  computed: {
    isOpen() {
      return this.modelValue !== undefined ? this.modelValue : this.open
    },
    text() {
      return { ...DEFAULT_LABELS, ...this.labels }
    },
    cropTabs() {
      return [
        { label: this.text.crop, value: 'crop' },
        { label: this.text.extend, value: 'extend' }
      ]
    },
    edited() {
      return !!this.image && this.image !== this.initialImage
    },
    // [w, h] of the crop/extend target, orientation applied.
    targetRatio() {
      const parts = String(this.ratio).split(':').map(Number)
      const w = parts[0] || 1
      const h = parts[1] || 1
      return this.orientation === 'vertical' ? [Math.min(w, h), Math.max(w, h)] : [Math.max(w, h), Math.min(w, h)]
    },
    framed() {
      return this.activeTool === 'cropExtend'
    },
    frameCls() {
      const cls = ['ui-edit-image__frame']
      if (this.framed) {
        cls.push(`ui-edit-image__frame--${this.cropMode}`)
        cls.push(
          this.targetRatio[0] > this.targetRatio[1] ? 'ui-edit-image__frame--wide' : 'ui-edit-image__frame--tall'
        )
        if (this.cropMode === 'extend') cls.push('ui-edit-image__checker')
      } else if (this.activeTool === 'background' && this.bgColor === 'transparent') {
        cls.push('ui-edit-image__checker')
      }
      return cls
    },
    frameStyle() {
      if (this.framed) return { aspectRatio: `${this.targetRatio[0]} / ${this.targetRatio[1]}` }
      if (this.activeTool === 'background' && this.bgColor && this.bgColor !== 'transparent') {
        return { background: this.bgColor }
      }
      return null
    }
  },
  watch: {
    isOpen(v) {
      if (!v) return
      this.initialImage = this.image
      this.activeTool = this.defaultTool || null
      this.bgColor = ''
      this.clearMask()
    },
    image(v) {
      // Image loaded after opening counts as the original, not an edit.
      if (!this.initialImage) this.initialImage = v
      this.clearMask()
    },
    // The mask canvas is v-if'd on both: each remount is a fresh, empty canvas.
    activeTool() {
      this.hasMask = false
    },
    loading(v) {
      if (v) this.hasMask = false
    },
    prompt(v) {
      this.localPrompt = v
    }
  },
  methods: {
    setOpen(v) {
      this.$emit('change', v)
      this.$emit('update:modelValue', v)
    },
    setTool(key) {
      this.activeTool = key
    },
    onPrompt(v) {
      this.localPrompt = v
      this.$emit('update:prompt', v)
    },
    onCrop() {
      this.$emit(this.cropMode, { ratio: this.targetRatio.join(':'), orientation: this.orientation })
    },
    onImgLoad(e) {
      this.natural = { w: e.target.naturalWidth, h: e.target.naturalHeight }
    },

    // ── Object eraser: paint a mask over the image (canvas is at the image's natural size) ──
    point(e) {
      const c = this.$refs.mask
      const rect = c.getBoundingClientRect()
      const k = rect.width ? c.width / rect.width : 1
      return { x: (e.clientX - rect.left) * k, y: (e.clientY - rect.top) * k, k }
    },
    startStroke(e) {
      const c = this.$refs.mask
      const ctx = c && c.getContext('2d')
      if (!ctx) return
      if (c.setPointerCapture) c.setPointerCapture(e.pointerId)
      const p = this.point(e)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = this.eraserSize * p.k
      ctx.strokeStyle = getComputedStyle(c).color
      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
      this._drawing = ctx
      this.hasMask = true
    },
    moveStroke(e) {
      if (!this._drawing) return
      const p = this.point(e)
      this._drawing.lineTo(p.x, p.y)
      this._drawing.stroke()
    },
    endStroke() {
      this._drawing = null
    },
    clearMask() {
      const c = this.$refs.mask
      const ctx = c && c.getContext('2d')
      if (ctx) ctx.clearRect(0, 0, c.width, c.height)
      this.hasMask = false
    },
    // Inpainting mask: same size as the source image, pure white (255) = erase, pure black (0) = keep.
    // Thresholded so anti-aliased stroke edges don't leave grey pixels (some APIs reject them).
    exportMask() {
      const src = this.$refs.mask
      const out = document.createElement('canvas')
      out.width = src.width
      out.height = src.height
      const ctx = out.getContext('2d')
      ctx.drawImage(src, 0, 0)
      const img = ctx.getImageData(0, 0, out.width, out.height)
      const d = img.data
      for (let i = 0; i < d.length; i += 4) {
        const v = d[i + 3] > 127 ? 255 : 0
        d[i] = d[i + 1] = d[i + 2] = v
        d[i + 3] = 255
      }
      ctx.putImageData(img, 0, 0)
      return out.toDataURL('image/png')
    },
    onRegenerate() {
      if (this.loading || this.enhancing || !this.image || !this.localPrompt.trim()) return
      this.$emit('regenerate', { prompt: this.localPrompt })
    },
    onErase() {
      if (this.hasMask && this.$refs.mask && !this.loading)
        this.$emit('erase', { size: this.eraserSize, mask: this.exportMask() })
    }
  }
}
</script>

<style src="./edit-image-dialog.css" scoped></style>
