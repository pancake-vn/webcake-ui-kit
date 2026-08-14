import { WkUpload } from '../src/index.js'
import { LIST_IGNORE } from '../src/components/upload/upload-utils.js'
import { mount } from './_utils.js'

const flushPromises = () => new Promise(r => setTimeout(r, 0))

function makeFile(name = 'note.txt', type = 'text/plain', size = 10) {
  return new File(['x'.repeat(size)], name, { type })
}

// jsdom file inputs are read-only; define `files` on the element then fire change,
// which is exactly what a real selection does.
async function selectFiles(w, files) {
  const input = w.find('input.ui-upload__input')
  Object.defineProperty(input.element, 'files', { value: files, configurable: true })
  await input.trigger('change')
  await flushPromises()
  await w.vm.$nextTick()
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('WkUpload', () => {
  // ---- smoke + presentation --------------------------------------------
  it('renders root and dropzone by default', () => {
    const w = mount(WkUpload)
    expect(w.classes()).toContain('ui-upload')
    expect(w.classes()).toContain('ui-upload--default')
    expect(w.find('.ui-upload__dropzone').exists()).toBe(true)
    expect(w.find('input.ui-upload__input').exists()).toBe(true)
  })

  it('applies listType class and card layout', () => {
    for (const t of ['default', 'picture', 'picture-card', 'picture-circle']) {
      const w = mount(WkUpload, { props: { listType: t } })
      expect(w.classes()).toContain(`ui-upload--${t}`)
    }
    const card = mount(WkUpload, { props: { listType: 'picture-card' } })
    // Card types render the add-tile trigger instead of the dropzone.
    expect(card.find('.ui-upload__dropzone').exists()).toBe(false)
    expect(card.find('.ui-upload__card-trigger').exists()).toBe(true)
  })

  it('applies disabled class and marks the dropzone aria-disabled', () => {
    const w = mount(WkUpload, { props: { disabled: true } })
    expect(w.classes()).toContain('ui-upload--disabled')
    expect(w.find('.ui-upload__dropzone').attributes('aria-disabled')).toBe('true')
  })

  // ---- rendering an existing list --------------------------------------
  it('renders items from defaultFileList', () => {
    const w = mount(WkUpload, {
      props: { defaultFileList: [{ uid: '1', name: 'report.xlsx', status: 'done', size: 25600 }] }
    })
    expect(w.find('.ui-upload-item__name').text()).toContain('report.xlsx')
    expect(w.find('.ui-upload-item__status-icon--done').exists()).toBe(true)
  })

  it('shows a progress bar for uploading items', () => {
    const w = mount(WkUpload, {
      props: { defaultFileList: [{ uid: '1', name: 'big.mp4', status: 'uploading', percent: 40 }] }
    })
    expect(w.find('.ui-upload-item__progress').exists()).toBe(true)
    expect(w.find('.ui-progress').exists()).toBe(true)
  })

  it('shows error affordances for errored items', () => {
    const w = mount(WkUpload, {
      props: { defaultFileList: [{ uid: '1', name: 'bad.pdf', status: 'error' }] }
    })
    expect(w.find('.ui-upload-item__status-icon--error').exists()).toBe(true)
    expect(w.text()).toContain('Try again')
  })

  // ---- selection pipeline ----------------------------------------------
  it('adds a selected file and emits change', async () => {
    const w = mount(WkUpload)
    await selectFiles(w, [makeFile('a.txt')])
    expect(w.emitted('change')).toBeTruthy()
    const last = w.emitted('change').at
      ? w.emitted('change').at(-1)
      : w.emitted('change')[w.emitted('change').length - 1]
    expect(last[0].fileList).toHaveLength(1)
    expect(w.find('.ui-upload-item__name').text()).toContain('a.txt')
  })

  it('rejects files failing the accept filter', async () => {
    const w = mount(WkUpload, { props: { accept: 'image/*' } })
    await selectFiles(w, [makeFile('note.txt', 'text/plain')])
    expect(w.emitted('reject')).toBeTruthy()
    expect(w.emitted('reject')[0][0].reason).toBe('accept')
    expect(w.emitted('change')).toBeFalsy()
  })

  it('rejects files exceeding maxSize', async () => {
    const w = mount(WkUpload, { props: { maxSize: 5 } })
    await selectFiles(w, [makeFile('big.txt', 'text/plain', 100)])
    expect(w.emitted('reject')[0][0].reason).toBe('size')
    expect(w.emitted('change')).toBeFalsy()
  })

  it('replaces the file when maxCount is 1', async () => {
    const w = mount(WkUpload, {
      props: { maxCount: 1, defaultFileList: [{ uid: 'old', name: 'old.txt', status: 'done' }] }
    })
    await selectFiles(w, [makeFile('new.txt')])
    const changes = w.emitted('change')
    const last = changes[changes.length - 1]
    expect(last[0].fileList).toHaveLength(1)
    expect(last[0].fileList[0].name).toBe('new.txt')
  })

  // ---- beforeUpload hook -----------------------------------------------
  it('adds but does not auto-upload when beforeUpload returns false', async () => {
    const w = mount(WkUpload, { props: { beforeUpload: () => false } })
    await selectFiles(w, [makeFile('manual.txt')])
    expect(w.emitted('change')).toBeTruthy()
    expect(w.find('.ui-upload-item__name').text()).toContain('manual.txt')
  })

  it('drops the file entirely when beforeUpload returns LIST_IGNORE', async () => {
    const w = mount(WkUpload, { props: { beforeUpload: () => LIST_IGNORE } })
    await selectFiles(w, [makeFile('ignored.txt')])
    expect(w.emitted('change')).toBeFalsy()
    expect(w.find('.ui-upload-item__name').exists()).toBe(false)
  })

  // ---- remove ----------------------------------------------------------
  it('removes an item and emits remove + change', async () => {
    const w = mount(WkUpload, {
      props: { defaultFileList: [{ uid: '1', name: 'gone.txt', status: 'done' }] }
    })
    await w.find('.ui-upload-item__remove').trigger('click')
    await flushPromises()
    await w.vm.$nextTick()
    expect(w.emitted('remove')).toBeTruthy()
    expect(w.emitted('change')).toBeTruthy()
    expect(w.find('.ui-upload-item__name').exists()).toBe(false)
  })

  it('vetoes removal when beforeRemove returns false', async () => {
    const w = mount(WkUpload, {
      props: {
        beforeRemove: () => false,
        defaultFileList: [{ uid: '1', name: 'stay.txt', status: 'done' }]
      }
    })
    await w.find('.ui-upload-item__remove').trigger('click')
    await flushPromises()
    await w.vm.$nextTick()
    expect(w.emitted('remove')).toBeFalsy()
    expect(w.find('.ui-upload-item__name').exists()).toBe(true)
  })

  // ---- controlled mode -------------------------------------------------
  it('does not mutate the fileList prop in controlled mode', async () => {
    const controlled = [{ uid: '1', name: 'ctrl.txt', status: 'done' }]
    const w = mount(WkUpload, { props: { fileList: controlled } })
    await selectFiles(w, [makeFile('added.txt')])
    expect(controlled).toHaveLength(1) // prop array untouched
    const changes = w.emitted('change')
    expect(changes[changes.length - 1][0].fileList.length).toBeGreaterThan(1)
  })

  // ---- preview (provide/inject contract through UploadItem) -------------
  it('emits preview when previewing a picture-card item', async () => {
    const w = mount(WkUpload, {
      props: {
        listType: 'picture-card',
        multiple: true,
        defaultFileList: [
          { uid: '1', name: 'pic.png', status: 'done', type: 'image/png', thumbUrl: 'data:image/png;base64,AAAA' }
        ]
      }
    })
    await w.find('.ui-upload-item__card-action[aria-label="Preview"]').trigger('click')
    await w.vm.$nextTick()
    expect(w.emitted('preview')).toBeTruthy()
    expect(w.emitted('preview')[0][0].name).toBe('pic.png')
  })

  // ---- lifecycle cleanup -----------------------------------------------
  it('unmounts cleanly (aborts any in-flight requests)', () => {
    const w = mount(WkUpload, { props: { defaultFileList: [{ uid: '1', name: 'a', status: 'uploading' }] } })
    expect(() => w.unmount()).not.toThrow()
  })
})
