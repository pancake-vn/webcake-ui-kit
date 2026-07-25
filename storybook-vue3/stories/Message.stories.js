import { wkMessage } from '../../src/index.js'
import WkMessage from '../../src/components/message/Message.vue'

export default {
  title: 'Feedback/Message',
  parameters: {
    docs: {
      description: {
        component:
          'Global toast notification service. Call `wkMessage.success(content)`, ' +
          '`wkMessage.error(content)`, `wkMessage.info(content)`, `wkMessage.warning(content)`, ' +
          'or `wkMessage.loading(content)` to show a message mounted to `document.body`. ' +
          'Each call returns a `close()` function for early dismissal. ' +
          'Pass a config object as first arg for `description`, `key`, `duration`, `action`, `onClose`. ' +
          'Use `wkMessage.config({ placement, maxCount, duration, offset })` to change global defaults.'
      }
    }
  }
}

// ─── Service API demo (matches playground App.vue usage) ────────────────────

export const ServiceDemo = () => ({
  data() {
    return { log: [] }
  },
  methods: {
    msgSuccess() {
      wkMessage.success('Event has been created', {
        description: 'Sunday, December 03, 2023 at 9:00 AM',
        placement: 'top-right'
      })
      this.log.unshift('success — with description, top-right')
    },
    msgError() {
      wkMessage.error('Something went wrong')
      this.log.unshift('error')
    },
    msgInfo() {
      wkMessage.info('Heads up — this is an info message')
      this.log.unshift('info')
    },
    msgWarning() {
      wkMessage.warning('Please double-check your input')
      this.log.unshift('warning')
    },
    msgLoading() {
      wkMessage.loading('Loading...', 2500)
      this.log.unshift('loading (auto-closes after 2.5s)')
    },
    msgUpdate() {
      var key = 'update-demo'
      wkMessage.loading({ content: 'Uploading...', key: key, duration: 0 })
      var self = this
      setTimeout(function () {
        wkMessage.success({ content: 'Uploaded!', key: key, duration: 2000 })
        self.log.unshift('loading → success (key reuse)')
      }, 1500)
      this.log.unshift('update: loading → success in 1.5s')
    },
    msgBottom() {
      wkMessage.config({ placement: 'bottom-left' })
      wkMessage.info('Now anchored to the bottom-left')
      this.log.unshift('bottom-left placement')
    },
    msgTopRight() {
      wkMessage.config({ placement: 'top-right' })
      wkMessage.info('Top-right placement')
      setTimeout(function () {
        wkMessage.config({ placement: 'top' })
      }, 3500)
      this.log.unshift('top-right placement (resets after 3.5s)')
    },
    msgMaxCount() {
      wkMessage.config({ maxCount: 3 })
      for (var i = 1; i <= 6; i++) wkMessage.info('Message #' + i)
      this.log.unshift('spam 6× with maxCount=3 (oldest evicted)')
    },
    msgWithAction() {
      wkMessage.open({
        type: 'info',
        content: '3 files moved to Trash.',
        action: {
          label: 'Undo',
          onClick: function () {
            wkMessage.success('Undo successful')
          }
        }
      })
      this.log.unshift('info with action button')
    },
    msgDestroyAll() {
      wkMessage.destroy()
      this.log.unshift('destroy() — cleared all')
    }
  },
  template: `
    <div style="display:flex;gap:32px;align-items:flex-start;flex-wrap:wrap;">
      <div style="display:flex;flex-direction:column;gap:10px;min-width:220px;">
        <p style="margin:0 0 4px;font-size:12px;color:#6b7280;font-weight:500;">Type shortcuts</p>
        <button style="padding:6px 14px;border-radius:6px;border:1px solid #d1fae5;background:#ecfdf5;color:#065f46;cursor:pointer;font-size:13px;" @click="msgSuccess">Success + description</button>
        <button style="padding:6px 14px;border-radius:6px;border:1px solid #fee2e2;background:#fef2f2;color:#991b1b;cursor:pointer;font-size:13px;" @click="msgError">Error</button>
        <button style="padding:6px 14px;border-radius:6px;border:1px solid #dbeafe;background:#eff6ff;color:#1e40af;cursor:pointer;font-size:13px;" @click="msgInfo">Info</button>
        <button style="padding:6px 14px;border-radius:6px;border:1px solid #fef3c7;background:#fffbeb;color:#92400e;cursor:pointer;font-size:13px;" @click="msgWarning">Warning</button>
        <button style="padding:6px 14px;border-radius:6px;border:1px solid #e5e7eb;background:#f9fafb;color:#374151;cursor:pointer;font-size:13px;" @click="msgLoading">Loading (2.5s)</button>

        <p style="margin:12px 0 4px;font-size:12px;color:#6b7280;font-weight:500;">Advanced</p>
        <button style="padding:6px 14px;border-radius:6px;border:1px solid #e5e7eb;background:#f9fafb;color:#374151;cursor:pointer;font-size:13px;" @click="msgUpdate">Loading → Success (key reuse)</button>
        <button style="padding:6px 14px;border-radius:6px;border:1px solid #e5e7eb;background:#f9fafb;color:#374151;cursor:pointer;font-size:13px;" @click="msgWithAction">Info with action button</button>

        <p style="margin:12px 0 4px;font-size:12px;color:#6b7280;font-weight:500;">Placement</p>
        <button style="padding:6px 14px;border-radius:6px;border:1px solid #e5e7eb;background:#f9fafb;color:#374151;cursor:pointer;font-size:13px;" @click="msgBottom">Bottom-left placement</button>
        <button style="padding:6px 14px;border-radius:6px;border:1px solid #e5e7eb;background:#f9fafb;color:#374151;cursor:pointer;font-size:13px;" @click="msgTopRight">Top-right placement</button>

        <p style="margin:12px 0 4px;font-size:12px;color:#6b7280;font-weight:500;">Config / Control</p>
        <button style="padding:6px 14px;border-radius:6px;border:1px solid #e5e7eb;background:#f9fafb;color:#374151;cursor:pointer;font-size:13px;" @click="msgMaxCount">Spam 6× (maxCount=3)</button>
        <button style="padding:6px 14px;border-radius:6px;border:1px solid #fecaca;background:#fff1f2;color:#9f1239;cursor:pointer;font-size:13px;" @click="msgDestroyAll">Destroy all</button>
      </div>

      <div style="flex:1;min-width:220px;">
        <p style="margin:0 0 8px;font-size:12px;color:#6b7280;font-weight:500;">Call log</p>
        <div v-if="!log.length" style="font-size:12px;color:#9ca3af;">No calls yet — click a button.</div>
        <div v-for="(entry, i) in log" :key="i" style="font-size:12px;font-family:monospace;padding:4px 0;border-bottom:1px solid #f3f4f6;color:#374151;">{{ entry }}</div>
      </div>
    </div>
  `
})
ServiceDemo.storyName = 'Service API (interactive)'
ServiceDemo.parameters = {
  docs: {
    description: {
      story:
        'Live demo of the `wkMessage` service — matches the playground `App.vue` usage. ' +
        'Click any button to trigger the corresponding API call.'
    }
  }
}

// ─── Message.vue component visual reference ──────────────────────────────────

export const ComponentVariants = () => ({
  components: { WkMessage },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
      <WkMessage type="info" content="Info — something to know about." />
      <WkMessage type="success" content="Success — the operation completed." />
      <WkMessage type="error" content="Error — something went wrong." />
      <WkMessage type="warning" content="Warning — proceed with caution." />
      <WkMessage type="loading" content="Loading — please wait…" />
    </div>
  `
})
ComponentVariants.storyName = 'Component variants'
ComponentVariants.parameters = {
  docs: { description: { story: 'Static `<Message>` SFC — all five `type` values. Used internally by the service.' } }
}

export const WithDescription = () => ({
  components: { WkMessage },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
      <WkMessage type="success" content="Event has been created" description="Sunday, December 03, 2023 at 9:00 AM" />
      <WkMessage type="error" content="Upload failed." description="The file exceeds the 10 MB limit. Choose a smaller file and try again." />
    </div>
  `
})
WithDescription.parameters = {
  docs: {
    description: {
      story: '`description` adds a secondary line — matches `wkMessage.success({ content, description })` usage.'
    }
  }
}

export const WithAction = () => ({
  components: { WkMessage },
  data() {
    return {
      undoAction: {
        label: 'Undo',
        onClick: function () {
          wkMessage.success('Undo successful')
        }
      }
    }
  },
  template: `
    <WkMessage type="info" content="3 files moved to Trash." :action="undoAction" />
  `
})
WithAction.parameters = {
  docs: {
    description: {
      story: '`action: { label, onClick }` renders a button; clicking calls `onClick` then emits `close`.'
    }
  }
}

export const WithProgress = () => ({
  components: { WkMessage },
  data() {
    return {
      pauseAction: { label: 'Pause', onClick: function () {} }
    }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;min-width:360px;">
      <WkMessage type="loading" content="report-q4-2025.pdf" description="Uploading... 10%" :progress="10" :action="pauseAction" />
      <WkMessage type="loading" content="photo-album.zip" description="Uploading... 60%" :progress="60" :action="pauseAction" />
      <WkMessage type="success" content="presentation.pptx" description="Upload complete!" :progress="100" />
      <WkMessage type="error" content="large-video.mp4" description="File upload error." :progress="45" />
    </div>
  `
})
WithProgress.storyName = 'With progress bar'
WithProgress.parameters = {
  docs: {
    description: {
      story:
        'Pass `progress` (0–100) to render a `WkProgress` bar below the message content. ' +
        'Update via `wkMessage.open({ key, progress: n })` — the same-key update path re-renders the bar reactively.'
    }
  }
}

// ─── File-upload message ─────────────────────────────────────────────────────

export const FileUploadStatic = () => ({
  components: { WkMessage },
  data() {
    return {
      pauseAction: { label: 'Pause', onClick: function () {} },
      cancelAction: { label: 'Cancel', onClick: function () {} }
    }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;min-width:380px;">
      <WkMessage
        type="loading"
        content="report-q4-2025.pdf"
        description="Uploading... 30%"
        :progress="30"
        img-src="https://content.pancake.vn/web-media-262/s300x300/fwebp80/63/f3/da/9a/ac502d0e2d8b5ba2620f7775f13064a54b0bf90f3424f7225c1bc849-w:120-h:120-l:7705-t:image/png.png"
        :action="pauseAction"
      />
      <WkMessage
        type="loading"
        content="photo-album.zip"
        description="Uploading... 70%"
        :progress="70"
        :action="pauseAction"
      />
      <WkMessage
        type="success"
        content="presentation.pptx"
        description="Upload complete!"
        :progress="100"
        img-src="https://content.pancake.vn/web-media-262/s300x300/fwebp80/63/f3/da/9a/ac502d0e2d8b5ba2620f7775f13064a54b0bf90f3424f7225c1bc849-w:120-h:120-l:7705-t:image/png.png"
      />
      <WkMessage
        type="error"
        content="large-video.mp4"
        description="Upload failed — file exceeds the 50 MB limit."
        :progress="45"
        :action="cancelAction"
      />
    </div>
  `
})
FileUploadStatic.storyName = 'File upload — static states'
FileUploadStatic.parameters = {
  docs: {
    description: {
      story:
        'Visual reference for all four file-upload states: **uploading with thumbnail**, ' +
        '**uploading without thumbnail**, **complete**, and **error**. ' +
        'Pass `imgSrc` to display a thumbnail preview in place of the type icon — ' +
        'it stays visible at every progress value. ' +
        'Omit `imgSrc` and the standard spinner/icon appears instead.'
    }
  }
}

export const FileUploadDemo = () => ({
  data() {
    return {
      files: [
        {
          key: 'upload-pdf',
          name: 'report-q4-2025.pdf',
          imgSrc:
            'https://content.pancake.vn/web-media-262/s300x300/fwebp80/63/f3/da/9a/ac502d0e2d8b5ba2620f7775f13064a54b0bf90f3424f7225c1bc849-w:120-h:120-l:7705-t:image/png.png'
        },
        { key: 'upload-zip', name: 'photo-album.zip', imgSrc: '' },
        { key: 'upload-pptx', name: 'presentation.pptx', imgSrc: '' }
      ]
    }
  },
  beforeUnmount() {
    wkMessage.destroy()
  },
  beforeDestroy() {
    wkMessage.destroy()
  },
  methods: {
    startUpload: function (file) {
      var self = this
      var progress = 0
      // Cancel any previous upload for the same file
      if (file._iv) {
        clearInterval(file._iv)
        file._iv = null
      }

      function pushUpdate(p) {
        wkMessage.open({
          key: file.key,
          type: 'file-upload',
          content: file.name,
          description: 'Uploading... ' + p + '%',
          progress: p,
          duration: 0,
          placement: 'bottom-right',
          imgSrc: file.imgSrc,
          action: {
            label: 'Cancel',
            variant: 'ghost',
            onClick: function () {
              if (file._iv) {
                clearInterval(file._iv)
                file._iv = null
              }
              wkMessage.destroy(file.key)
            }
          }
        })
      }

      pushUpdate(0)

      file._iv = setInterval(function () {
        progress += 10
        if (progress >= 100) {
          clearInterval(file._iv)
          file._iv = null
          wkMessage.open({
            key: file.key,
            type: 'success',
            content: file.name,
            description: 'Upload complete!',
            progress: 100,
            duration: 3000
          })
        } else {
          pushUpdate(progress)
        }
      }, 400)
    }
  },
  template: `
    <div style="display:flex;flex-direction:column;gap:10px;min-width:240px;">
      <p style="margin:0 0 4px;font-size:12px;color:#6b7280;font-weight:500;">Click a file to simulate upload</p>
      <button
        v-for="f in files"
        :key="f.key"
        style="padding:8px 14px;border-radius:6px;border:1px solid #e5e7eb;background:#f9fafb;color:#374151;cursor:pointer;font-size:13px;text-align:left;"
        @click="startUpload(f)"
      >{{ f.name }}</button>
      <p style="margin:8px 0 0;font-size:11px;color:#9ca3af;">
        Messages appear bottom-right. Click the same file again to restart its upload.
      </p>
    </div>
  `
})
FileUploadDemo.storyName = 'File upload — interactive demo'
FileUploadDemo.parameters = {
  docs: {
    description: {
      story: `
Live simulation of the file-upload message flow. Click any filename to start a
mock upload — the toast appears in the bottom-right, progress increments every
400 ms, and the message resolves to a \`success\` state at 100%. The **Cancel**
button inside the toast dismisses it at any point.

---

### How to implement file-upload messages

The file-upload variant uses \`wkMessage.open()\` with a shared \`key\` so that
every progress tick **updates the same toast** instead of stacking new ones.

**1. Open the initial toast**

\`\`\`js
wkMessage.open({
  key: 'my-upload',           // unique per file — reuse to update
  type: 'file-upload',        // arbitrary string; drives ui-message--file-upload CSS class
  content: 'report.pdf',      // filename shown in bold
  description: 'Uploading… 0%',
  progress: 0,                // 0–100 — renders a WkProgress bar
  duration: 0,                // 0 = stays open until manually closed
  placement: 'bottom-right',
  imgSrc: 'https://…/thumb.png', // optional thumbnail; omit for plain icon
  action: {
    label: 'Cancel',
    onClick: () => wkMessage.destroy('my-upload')
  }
})
\`\`\`

**2. Update progress (same key, same type)**

\`\`\`js
wkMessage.open({
  key: 'my-upload',
  type: 'file-upload',
  content: 'report.pdf',
  description: 'Uploading… 60%',
  progress: 60,
  duration: 0,
  placement: 'bottom-right',
  imgSrc: 'https://…/thumb.png',
  action: { label: 'Cancel', onClick: () => wkMessage.destroy('my-upload') }
})
\`\`\`

**3. Resolve to success (or error)**

\`\`\`js
// success
wkMessage.open({
  key: 'my-upload',
  type: 'success',
  content: 'report.pdf',
  description: 'Upload complete!',
  progress: 100,
  duration: 3000   // auto-dismiss after 3 s
})

// error
wkMessage.open({
  key: 'my-upload',
  type: 'error',
  content: 'report.pdf',
  description: 'Upload failed — file too large.',
  progress: currentProgress,
  duration: 0,
  action: { label: 'Dismiss', onClick: () => wkMessage.destroy('my-upload') }
})
\`\`\`

**4. Cancel / dismiss early**

\`\`\`js
wkMessage.destroy('my-upload')
\`\`\`

---

### Props reference

| Prop | Type | Description |
|---|---|---|
| \`key\` | \`string\` | Unique ID — calling \`open()\` with the same key replaces the existing toast in-place |
| \`type\` | \`string\` | \`'file-upload'\` while uploading; switch to \`'success'\` / \`'error'\` on completion |
| \`content\` | \`string\` | Primary text — typically the filename |
| \`description\` | \`string\` | Secondary line — status text such as \`"Uploading… 60%"\` |
| \`progress\` | \`number\` | 0–100; renders a \`WkProgress\` bar below the row |
| \`imgSrc\` | \`string\` | URL of a thumbnail image; replaces the type icon with an \`<img>\` preview |
| \`action\` | \`{ label, onClick }\` | Inline action button (Pause / Cancel) |
| \`duration\` | \`number\` | \`0\` = sticky; pass a positive ms value to auto-dismiss |
| \`placement\` | \`string\` | Override global placement — \`'bottom-right'\` is conventional for upload toasts |
      `
    }
  }
}
