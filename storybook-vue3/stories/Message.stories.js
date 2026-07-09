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
