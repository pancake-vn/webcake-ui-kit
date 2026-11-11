import WkEditImageDialog from '../../src/components/edit-image-dialog/EditImageDialog.vue'
import WkButton from '../../src/components/button/Button.vue'

const SAMPLE = 'https://picsum.photos/seed/webcake-shoe/800/800'
const TOOLS = ['upscale', 'cropExtend', 'background', 'eraser', 'regenerate']

export default {
  title: 'Overlays/EditImageDialog',
  component: WkEditImageDialog,
  argTypes: {
    title: { control: 'text' },
    image: { control: 'text' },
    loading: { control: 'boolean' },
    defaultTool: { control: { type: 'select' }, options: [''].concat(TOOLS) },
    maskClosable: { control: 'boolean' },
    onUpscale: { action: 'upscale' },
    onCrop: { action: 'crop' },
    onExtend: { action: 'extend' },
    onChangeBackground: { action: 'change-background' },
    onErase: { action: 'erase' },
    onRegenerate: { action: 'regenerate' },
    onSave: { action: 'save' },
    onSaveCopy: { action: 'save-copy' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'AI "Edit image" modal with five tools (upscale, crop/extend, change background, object eraser, regenerate). ' +
          'Pure UI: each tool emits its own event with a payload; set `loading` while your API runs and replace `image` ' +
          'with the result. "Save image" / "Save as copy" appear once `image` differs from the one the dialog opened with. ' +
          'The eraser emits `{ size, mask }` where `mask` is a PNG data URL (white = erase) at the image’s natural size.'
      }
    }
  }
}

const Template = args => ({
  components: { WkEditImageDialog, WkButton },
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
      <WkButton @click="open = true">Open edit dialog</WkButton>
      <WkEditImageDialog v-model="open" v-bind="bound" />
    </div>
  `
})

export const Primary = () => ({
  components: { WkEditImageDialog, WkButton },
  data() {
    return { open: false, image: SAMPLE, loading: false }
  },
  methods: {
    run(action) {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.image = 'https://picsum.photos/seed/' + action + Date.now() + '/800/800'
      }, 1200)
    }
  },
  template: `
    <div>
      <WkButton @click="open = true">Open edit dialog</WkButton>
      <WkEditImageDialog
        v-model="open"
        :image="image"
        :loading="loading"
        @upscale="run('upscale')"
        @crop="run('crop')"
        @extend="run('extend')"
        @change-background="run('bg')"
        @erase="run('erase')"
        @regenerate="run('regen')"
        @save="open = false"
        @save-copy="open = false"
      />
    </div>
  `
})

// One button per tool, opening the dialog with that panel expanded.
export const AllVariants = () => ({
  components: { WkEditImageDialog, WkButton },
  data() {
    return { tools: TOOLS, current: '' }
  },
  template: `
    <div style="display: flex; gap: 8px">
      <WkButton v-for="t in tools" :key="t" variant="outline" @click="current = t">{{ t }}</WkButton>
      <WkEditImageDialog
        :open="!!current"
        :image="'${SAMPLE}'"
        :default-tool="current"
        @change="v => { if (!v) current = '' }"
      />
    </div>
  `
})

export const Processing = Template.bind({})
Processing.args = { image: SAMPLE, loading: true }

// Tab through the background swatches to check the focus ring.
export const FocusVisible = Template.bind({})
FocusVisible.args = { image: SAMPLE, defaultTool: 'background' }
