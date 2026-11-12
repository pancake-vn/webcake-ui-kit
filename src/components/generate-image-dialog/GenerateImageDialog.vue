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
    <div class="ui-gen-image">
      <aside class="ui-gen-image__sidebar">
        <div class="ui-gen-image__form">
          <Field :label="text.dimension">
            <Select
              :value="currentDimension"
              :options="dimensionOptions"
              :disabled="loading"
              @change="setValue('dimension', $event)"
            />
          </Field>
          <Field :label="text.style">
            <Select
              :value="currentStyle"
              :options="styleOptions"
              :disabled="loading"
              @change="setValue('imageStyle', $event)"
            />
          </Field>
          <AiPromptBox
            class="ui-gen-image__prompt"
            :value="localPrompt"
            :placeholder="text.placeholder"
            :disabled="loading"
            :enhancing="enhancing"
            :reference-label="text.addReference"
            :enhance-label="text.enhancePrompt"
            @input="setValue('prompt', $event)"
            @add-reference="$emit('add-reference')"
            @enhance="$emit('enhance-prompt', $event)"
            @submit="onGenerate"
          />
        </div>

        <div v-if="hasCredits" class="ui-gen-image__credits">
          <span class="ui-gen-image__credits-icon">
            <slot name="credit-icon"><WkiSquarePlus :size="20" /></slot>
          </span>
          <span>{{ credits }}</span>
        </div>

        <div class="ui-gen-image__actions">
          <Button class="ui-gen-image__btn" :disabled="!canGenerate" @click="onGenerate">{{ text.generate }}</Button>
          <Button v-if="image && !loading" class="ui-gen-image__btn" variant="outline" @click="onUse">
            {{ text.useImage }}
          </Button>
        </div>
      </aside>

      <section :class="['ui-gen-image__preview', loading && 'ui-gen-image__preview--loading']">
        <img v-if="image && !loading" class="ui-gen-image__result" :src="image" alt="" />
        <div v-else class="ui-gen-image__placeholder">
          <WkiSparkles :size="48" />
          <span>{{ loading ? text.generating : text.empty }}</span>
        </div>
        <div v-if="loading" class="ui-gen-image__glow" aria-hidden="true"></div>
      </section>
    </div>
  </Dialog>
</template>

<script>
import Dialog from '../dialog/Dialog.vue'
import Button from '../button/Button.vue'
import Field from '../field/Field.vue'
import Select from '../select/Select.vue'
import AiPromptBox from '../ai-prompt-box/AiPromptBox.vue'
import WkiSparkles from '../../icons/Sparkles.vue'
import WkiSquarePlus from '../../icons/SquarePlus.vue'

const DEFAULT_LABELS = {
  dimension: 'Dimension',
  style: 'Style',
  placeholder: 'Describe your ideas',
  generate: 'Generate',
  useImage: 'Use image',
  empty: 'Your generation will appear here',
  generating: 'Generating...',
  addReference: 'Add reference image',
  enhancePrompt: 'Enhance prompt'
}

const firstValue = list => {
  const o = list && list[0]
  return o !== null && typeof o === 'object' ? o.value : o
}

export default {
  name: 'GenerateImageDialog',
  components: { Dialog, Button, Field, Select, AiPromptBox, WkiSparkles, WkiSquarePlus },
  model: { prop: 'open', event: 'change' },
  props: {
    open: { type: Boolean, default: false },
    modelValue: { type: Boolean, default: undefined },
    title: { type: String, default: 'Generate image' },
    prompt: { type: String, default: '' },
    dimension: { type: [String, Number], default: undefined },
    imageStyle: { type: [String, Number], default: undefined },
    dimensionOptions: { type: Array, default: () => ['1:1', '4:3', '3:4', '16:9', '9:16'] },
    styleOptions: { type: Array, default: () => ['Photo', 'Illustration', '3D', 'Anime'] },
    // Result image URL. Set it when your API returns; clear it to go back to the empty state.
    image: { type: String, default: '' },
    loading: { type: Boolean, default: false },
    // Set while your enhance-prompt request runs; Generate is blocked until it ends.
    enhancing: { type: Boolean, default: false },
    credits: { type: [Number, String], default: null },
    labels: { type: Object, default: () => ({}) },
    width: { type: [Number, String], default: 1280 },
    maskClosable: { type: Boolean, default: false },
    zIndex: { type: [Number, String], default: 1000 }
  },
  emits: [
    'change',
    'update:modelValue',
    'update:prompt',
    'update:dimension',
    'update:imageStyle',
    'generate',
    'use',
    'add-reference',
    'enhance-prompt',
    'cancel',
    'after-close'
  ],
  data() {
    return {
      localPrompt: this.prompt,
      localDimension: this.dimension,
      localImageStyle: this.imageStyle
    }
  },
  computed: {
    isOpen() {
      return this.modelValue !== undefined ? this.modelValue : this.open
    },
    text() {
      return { ...DEFAULT_LABELS, ...this.labels }
    },
    currentDimension() {
      return this.localDimension !== undefined ? this.localDimension : firstValue(this.dimensionOptions)
    },
    currentStyle() {
      return this.localImageStyle !== undefined ? this.localImageStyle : firstValue(this.styleOptions)
    },
    hasCredits() {
      return this.credits !== null && this.credits !== ''
    },
    canGenerate() {
      return !this.loading && !this.enhancing && !!this.localPrompt.trim()
    },
    payload() {
      return { prompt: this.localPrompt, dimension: this.currentDimension, style: this.currentStyle }
    }
  },
  watch: {
    prompt(v) {
      this.localPrompt = v
    },
    dimension(v) {
      this.localDimension = v
    },
    imageStyle(v) {
      this.localImageStyle = v
    }
  },
  methods: {
    setOpen(v) {
      this.$emit('change', v)
      this.$emit('update:modelValue', v)
    },
    setValue(key, v) {
      this['local' + key.charAt(0).toUpperCase() + key.slice(1)] = v
      this.$emit('update:' + key, v)
    },
    onGenerate() {
      if (this.canGenerate) this.$emit('generate', this.payload)
    },
    onUse() {
      this.$emit('use', { ...this.payload, image: this.image })
    }
  }
}
</script>

<style src="./generate-image-dialog.css" scoped></style>
