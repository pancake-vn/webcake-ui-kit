import WkFileTypeIcon from '../../src/components/file-type-icon/FileTypeIcon.vue'

const VARIANTS = ['default', 'grey', 'solid']
const FILE_TYPES = [
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'txt',
  'zip',
  'mp4',
  'mp3',
  'ai',
  'psd',
  'aep',
  'indd'
]

export default {
  title: 'Display/FileTypeIcon',
  component: WkFileTypeIcon,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: VARIANTS
    },
    fileType: { control: 'text' },
    isFolder: { control: 'boolean' },
    isFolderEmpty: { control: 'boolean' },
    width: { control: { type: 'number', min: 16, max: 120, step: 4 } }
  },
  parameters: {
    docs: {
      description: {
        component:
          'Icon component displaying file types with color-coded variants or folder icons. ' +
          'Three `variant`s (default, grey, solid), each rendering the file extension badge. ' +
          'File icons auto-color by `fileType` (pdf=red, doc=blue, xlsx=green, etc.). ' +
          'Set `isFolder` to render folder icons, optionally with `isFolderEmpty`. ' +
          'The `width` prop scales the entire icon proportionally (default 40px).'
      }
    }
  }
}

const Template = args => ({
  components: { WkFileTypeIcon },
  setup() {
    return { args }
  },
  template: `<WkFileTypeIcon v-bind="args" />`
})

export const Primary = Template.bind({})
Primary.args = { fileType: 'pdf', variant: 'default', width: 40 }
Primary.parameters = {
  docs: { description: { story: 'Default PDF file icon with extension badge.' } }
}

export const AllVariants = () => ({
  components: { WkFileTypeIcon },
  setup() {
    return { variants: VARIANTS }
  },
  template: `
    <div style="display: flex; align-items: flex-end; gap: 16px;">
      <WkFileTypeIcon
        v-for="variant in variants"
        :key="variant"
        :variant="variant"
        fileType="pdf"
      />
    </div>
  `
})
AllVariants.parameters = {
  docs: { description: { story: 'All three variants (default, grey, solid) with PDF file type.' } }
}

export const FileTypes = () => ({
  components: { WkFileTypeIcon },
  setup() {
    return { fileTypes: FILE_TYPES }
  },
  template: `
    <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-end;">
      <WkFileTypeIcon
        v-for="type in fileTypes"
        :key="type"
        :fileType="type"
        variant="solid"
      />
    </div>
  `
})
FileTypes.parameters = {
  docs: { description: { story: 'Different file types with automatic color coding (solid variant).' } }
}

export const Folders = () => ({
  components: { WkFileTypeIcon },
  template: `
    <div style="display: flex; align-items: flex-end; gap: 24px;">
      <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
        <WkFileTypeIcon isFolder />
        <span style="font-size: 12px; color: #6b7280;">With files</span>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
        <WkFileTypeIcon isFolder isFolderEmpty />
        <span style="font-size: 12px; color: #6b7280;">Empty</span>
      </div>
    </div>
  `
})
Folders.parameters = {
  docs: { description: { story: 'Folder icons: default (with files) and empty state.' } }
}

export const Sizes = () => ({
  components: { WkFileTypeIcon },
  setup() {
    return { sizes: [24, 32, 40, 60, 80] }
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div v-for="size in sizes" :key="size" style="display: flex; align-items: flex-end; gap: 16px;">
        <span style="width: 60px; font-size: 12px; color: #6b7280;">{{ size }}px:</span>
        <WkFileTypeIcon :width="size" fileType="pdf" variant="default" />
        <WkFileTypeIcon :width="size" fileType="doc" variant="grey" />
        <WkFileTypeIcon :width="size" fileType="xlsx" variant="solid" />
        <WkFileTypeIcon :width="size" isFolder />
      </div>
    </div>
  `
})
Sizes.parameters = {
  docs: { description: { story: 'Icons scale proportionally with the `width` prop (24px to 80px).' } }
}

export const Matrix = () => ({
  components: { WkFileTypeIcon },
  setup() {
    return {
      variants: VARIANTS,
      sampleTypes: ['pdf', 'doc', 'xlsx', 'ppt', 'zip', 'mp3']
    }
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 32px;">
      <!-- File icons matrix -->
      <div>
        <h4 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #374151;">File Icons</h4>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div v-for="variant in variants" :key="variant" style="display: flex; gap: 12px; align-items: flex-end;">
            <span style="width: 60px; font-size: 12px; color: #6b7280; text-transform: capitalize;">{{ variant }}:</span>
            <WkFileTypeIcon
              v-for="type in sampleTypes"
              :key="type"
              :variant="variant"
              :fileType="type"
            />
          </div>
        </div>
      </div>

      <!-- Folders matrix -->
      <div>
        <h4 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #374151;">Folders</h4>
        <div style="display: flex; gap: 24px; align-items: flex-end;">
          <WkFileTypeIcon isFolder />
          <WkFileTypeIcon isFolder isFolderEmpty />
        </div>
      </div>

      <!-- Sizes comparison -->
      <div>
        <h4 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #374151;">Size Scaling</h4>
        <div style="display: flex; gap: 16px; align-items: flex-end;">
          <WkFileTypeIcon :width="24" fileType="pdf" variant="solid" />
          <WkFileTypeIcon :width="40" fileType="pdf" variant="solid" />
          <WkFileTypeIcon :width="60" fileType="pdf" variant="solid" />
        </div>
      </div>
    </div>
  `
})
Matrix.parameters = {
  docs: {
    description: {
      story: 'Comprehensive matrix: all variants across file types, folder states, and size scaling.'
    }
  }
}
