import WkGenerateImageDialog from '../../src/components/generate-image-dialog/GenerateImageDialog.vue'
import WkButton from '../../src/components/button/Button.vue'
import WkiCoins from '../../src/icons/Coins.vue'

const SAMPLE = 'https://picsum.photos/seed/leica/800/800'

export default {
  title: 'Overlays/GenerateImageDialog',
  component: WkGenerateImageDialog,
  argTypes: {
    title: { control: 'text' },
    prompt: { control: 'text' },
    image: { control: 'text' },
    loading: { control: 'boolean' },
    credits: { control: 'text' },
    maskClosable: { control: 'boolean' },
    onGenerate: { action: 'generate' },
    onUse: { action: 'use' },
    onAddReference: { action: 'add-reference' },
    onEnhancePrompt: { action: 'enhance-prompt' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'AI "Generate image" modal. Pure UI — it never calls an API. Listen to `generate` ({ prompt, dimension, style }), ' +
          'set `loading` while your request runs, then pass the result URL as `image`. `use` fires with the chosen image. ' +
          'All texts can be translated through `labels`.'
      }
    }
  }
}

const Template = args => ({
  components: { WkGenerateImageDialog, WkButton },
  data() {
    return { open: false }
  },
  computed: {
    bound() {
      return args
    }
  },
  template: `
    <div>
      <WkButton @click="open = true">Open generate dialog</WkButton>
      <WkGenerateImageDialog v-model="open" v-bind="bound" />
    </div>
  `
})

export const Primary = () => ({
  components: { WkGenerateImageDialog, WkButton },
  data() {
    return { open: false, prompt: '', loading: false, image: '' }
  },
  methods: {
    generate(p) {
      this.loading = true
      this.image = ''
      setTimeout(() => {
        this.loading = false
        this.image = 'https://picsum.photos/seed/' + encodeURIComponent(p.prompt) + '/800/800'
      }, 1500)
    }
  },
  template: `
    <div>
      <WkButton @click="open = true">Open generate dialog</WkButton>
      <WkGenerateImageDialog
        v-model="open"
        :prompt="prompt"
        :loading="loading"
        :image="image"
        credits="1.443"
        @update:prompt="prompt = $event"
        @generate="generate"
        @use="open = false"
      />
    </div>
  `
})

// Every visual state from the Figma frame: empty → generating → result.
export const AllVariants = () => ({
  components: { WkGenerateImageDialog, WkButton },
  data() {
    return {
      current: null,
      states: {
        empty: { credits: '1.443' },
        generating: { credits: '1.443', prompt: 'An aged Leica M3 rangefinder camera', loading: true },
        result: { credits: '1.443', prompt: 'An aged Leica M3 rangefinder camera', image: SAMPLE }
      }
    }
  },
  template: `
    <div style="display: flex; gap: 8px">
      <WkButton v-for="(s, name) in states" :key="name" variant="outline" @click="current = name">{{ name }}</WkButton>
      <WkGenerateImageDialog
        :open="!!current"
        v-bind="current ? states[current] : {}"
        @change="v => { if (!v) current = null }"
      />
    </div>
  `
})

export const Localized = Template.bind({})
Localized.args = {
  title: 'Tạo ảnh với AI',
  credits: 120,
  labels: {
    dimension: 'Kích thước',
    style: 'Phong cách',
    placeholder: 'Mô tả ý tưởng của bạn',
    generate: 'Tạo ảnh',
    useImage: 'Dùng ảnh này',
    empty: 'Ảnh tạo ra sẽ hiển thị ở đây',
    generating: 'Đang tạo...'
  }
}

export const CustomCreditIcon = () => ({
  components: { WkGenerateImageDialog, WkButton, WkiCoins },
  data() {
    return { open: false }
  },
  template: `
    <div>
      <WkButton @click="open = true">Open</WkButton>
      <WkGenerateImageDialog v-model="open" credits="42">
        <template #credit-icon><WkiCoins :size="20" /></template>
      </WkGenerateImageDialog>
    </div>
  `
})
