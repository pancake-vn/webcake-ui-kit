<template>
  <div :class="['ui-ai-prompt-box', enhancing && 'ui-ai-prompt-box--enhancing']" :aria-busy="enhancing ? 'true' : null">
    <div class="ui-ai-prompt-box__field">
      <textarea
        ref="input"
        class="ui-ai-prompt-box__input"
        :value="value"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="enhancing"
        rows="1"
        @input="onInput"
        @keydown.enter="onEnter"
      ></textarea>
      <div class="ui-ai-prompt-box__actions">
        <Button
          size="sm"
          variant="ghost"
          :disabled="disabled || enhancing"
          :aria-label="referenceLabel"
          :title="referenceLabel"
          @click="$emit('add-reference')"
        >
          <template #icon><WkiImagePlus :size="20" /></template>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          :disabled="disabled || enhancing || !value.trim()"
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
    // The prompt is being rewritten by AI: animate the box, lock editing (text stays readable).
    enhancing: { type: Boolean, default: false },
    referenceLabel: { type: String, default: 'Add reference image' },
    enhanceLabel: { type: String, default: 'Enhance prompt' }
  },
  emits: ['input', 'add-reference', 'enhance', 'submit'],
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
    // Enter = newline (textarea default); Cmd/Ctrl+Enter = submit. Skip while an IME (e.g. Telex) is composing.
    onEnter(e) {
      if (!(e.metaKey || e.ctrlKey) || e.isComposing || e.keyCode === 229) return
      e.preventDefault()
      if (!this.disabled && !this.enhancing && this.value.trim()) this.$emit('submit', this.value)
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
