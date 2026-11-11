<template>
  <div class="ui-ai-prompt-box">
    <div class="ui-ai-prompt-box__field">
      <textarea
        ref="input"
        class="ui-ai-prompt-box__input"
        :value="value"
        :placeholder="placeholder"
        :disabled="disabled"
        rows="1"
        @input="onInput"
      ></textarea>
      <div class="ui-ai-prompt-box__actions">
        <Button
          size="sm"
          variant="ghost"
          :disabled="disabled"
          :aria-label="referenceLabel"
          :title="referenceLabel"
          @click="$emit('add-reference')"
        >
          <template #icon><WkiImagePlus :size="20" /></template>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          :disabled="disabled || !value.trim()"
          :aria-label="enhanceLabel"
          :title="enhanceLabel"
          @click="$emit('enhance', value)"
        >
          <template #icon><WkiSparkles :size="20" /></template>
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '../button/Button.vue'
import WkiImagePlus from '../../icons/ImagePlus.vue'
import WkiSparkles from '../../icons/Sparkles.vue'

// Internal building block shared by GenerateImageDialog and EditImageDialog — not exported.
export default {
  name: 'AiPromptBox',
  components: { Button, WkiImagePlus, WkiSparkles },
  props: {
    value: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    referenceLabel: { type: String, default: 'Add reference image' },
    enhanceLabel: { type: String, default: 'Enhance prompt' }
  },
  emits: ['input', 'add-reference', 'enhance'],
  watch: {
    value() {
      this.$nextTick(this.resize)
    }
  },
  mounted() {
    this.resize()
  },
  methods: {
    onInput(e) {
      this.$emit('input', e.target.value)
      this.resize()
    },
    // Grow with content between the CSS min/max heights.
    resize() {
      const el = this.$refs.input
      if (!el) return
      el.style.height = 'auto'
      el.style.height = el.scrollHeight + 'px'
    }
  }
}
</script>

<style src="./ai-prompt-box.css" scoped></style>
