import WkUpload from '../../src/components/upload/Upload.vue'

const LIST_TYPES = ['default', 'picture', 'picture-card', 'picture-circle']
const IMG =
  'https://content.pancake.vn/web-media-262/2e/2a/0c/96/c2b58ae9f06c4dc2a3b83016e56d5b4132ff40637862ba23435e43a0-w:224-h:224-l:3927-t:image/png.png'

const ROW_LIST = [
  { uid: 'r1', name: 'annual-report-2024.xlsx', status: 'done', size: 25600 },
  { uid: 'r2', name: 'dashboard-prototype.mp4', status: 'uploading', percent: 40, size: 12582912 },
  { uid: 'r3', name: 'broken-upload.pdf', status: 'error', size: 900000 }
]

const PIC_LIST = [
  { uid: 'p1', name: 'cover.png', status: 'done', type: 'image/png', thumbUrl: IMG },
  { uid: 'p2', name: 'poster.png', status: 'done', type: 'image/png', thumbUrl: IMG },
  { uid: 'p3', name: 'failed.png', status: 'error', type: 'image/png' }
]

export default {
  title: 'Data Entry/Upload',
  component: WkUpload,
  argTypes: {
    listType: { control: { type: 'inline-radio' }, options: LIST_TYPES },
    multiple: { control: 'boolean' },
    disabled: { control: 'boolean' },
    directory: { control: 'boolean' },
    pastable: { control: 'boolean' },
    accept: { control: 'text' },
    maxCount: { control: 'number' },
    title: { control: 'text' },
    browseText: { control: 'text' },
    hint: { control: 'text' }
  },
  parameters: {
    docs: {
      description: {
        component:
          'File upload inspired by Ant Design Upload. Supports single/multiple, drag & drop, paste, ' +
          'picture-card / picture-circle, controlled `:file-list` + `@change` (or uncontrolled `default-file-list`), ' +
          'progress / success / error states, preview (via WkDialog), remove, download, and ' +
          '`beforeUpload` / `transformFile` / `customRequest` hooks. Reuses WkProgress, WkSpinner, WkButton, WkDialog.'
      }
    }
  }
}

const Template = args => ({
  components: { WkUpload },
  setup() {
    return { args }
  },
  template: `<div style="max-width:560px;"><WkUpload v-bind="args" /></div>`
})

export const Primary = Template.bind({})
Primary.args = { listType: 'default', defaultFileList: ROW_LIST }

export const ListTypes = () => ({
  components: { WkUpload },
  data() {
    return { rows: ROW_LIST, pics: PIC_LIST }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:32px;max-width:560px;">
      <div>
        <p style="color:#6b7280;font-size:12px;margin:0 0 8px;">default</p>
        <WkUpload list-type="default" :default-file-list="rows" />
      </div>
      <div>
        <p style="color:#6b7280;font-size:12px;margin:0 0 8px;">picture</p>
        <WkUpload list-type="picture" :default-file-list="pics" />
      </div>
      <div>
        <p style="color:#6b7280;font-size:12px;margin:0 0 8px;">picture-card</p>
        <WkUpload list-type="picture-card" multiple :default-file-list="pics" />
      </div>
      <div>
        <p style="color:#6b7280;font-size:12px;margin:0 0 8px;">picture-circle</p>
        <WkUpload list-type="picture-circle" multiple :default-file-list="pics" />
      </div>
    </div>
  `
})

export const RowStates = () => ({
  components: { WkUpload },
  data() {
    return {
      states: [
        [{ uid: 'a', name: 'uploading-file.zip', status: 'uploading', percent: 66, size: 26300, loaded: 8700 }],
        [{ uid: 'b', name: 'done-file.pdf', status: 'done', size: 25600 }],
        [{ uid: 'c', name: 'error-file.mp4', status: 'error', size: 900000 }]
      ]
    }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:16px;max-width:560px;">
      <WkUpload v-for="(list, i) in states" :key="i" list-type="default" :default-file-list="list" />
    </div>
  `
})

export const PictureCard = Template.bind({})
PictureCard.args = { listType: 'picture-card', multiple: true, accept: 'image/*', defaultFileList: PIC_LIST }

export const PictureCircle = Template.bind({})
PictureCircle.args = { listType: 'picture-circle', defaultFileList: [PIC_LIST[0]] }

export const CustomTrigger = () => ({
  components: { WkUpload },
  template: `
    <WkUpload style="max-width:560px;">
      <template #trigger>
        <div style="padding:12px 16px;border:1px solid var(--border-primary);border-radius:var(--rounded-lg);display:inline-flex;gap:8px;align-items:center;cursor:pointer;">
          <span>⬆</span> Click to upload a custom trigger
        </div>
      </template>
    </WkUpload>
  `
})

export const Disabled = Template.bind({})
Disabled.args = { disabled: true, defaultFileList: [ROW_LIST[0]] }

export const FocusVisible = () => ({
  components: { WkUpload },
  template: `
    <div style="max-width:560px;">
      <p style="color:#6b7280;font-size:12px;margin:0 0 8px;">Tab to focus the dropzone — it shows a focus ring.</p>
      <WkUpload />
    </div>
  `
})
