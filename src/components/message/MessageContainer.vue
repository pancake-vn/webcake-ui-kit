<template>
  <div
    class="ui-message-container"
    :class="`ui-message-container--${placement}`"
    :style="containerStyle"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div :class="['ui-message-list', { 'ui-message-list--expanded': hovered }]">
      <div v-for="(item, idx) in messages" :key="item.key" class="ui-message-item" :style="itemStyle(idx)">
        <Message
          :type="item.type"
          :content="item.content"
          :description="item.description"
          :action="item.action"
          :progress="item.progress"
          :img-src="item.imgSrc"
          @close="remove(item.key)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Message from './Message.vue'

let seed = 0

// Center placements ('top'/'bottom') flow messages as a spaced column; the four
// corner placements anchor to a corner and overlap messages (newest on top).
const PLACEMENTS = ['top', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right']

export default {
  name: 'MessageContainer',
  components: { Message },
  emits: [],
  data() {
    return {
      messages: [],
      placement: 'top',
      offset: 24,
      maxCount: 0,
      hovered: false,
      itemOffsets: []
    }
  },
  computed: {
    containerStyle() {
      const p = this.placement
      const o = this.offset + 'px'
      const isBottom = p === 'bottom' || p === 'bottom-left' || p === 'bottom-right'
      const style = {}
      style[isBottom ? 'bottom' : 'top'] = o
      // Corner placements pin a horizontal edge and drop the CSS center transform.
      if (p === 'top-left' || p === 'bottom-left') {
        style.left = o
        style.right = 'auto'
        style.transform = 'none'
      } else if (p === 'top-right' || p === 'bottom-right') {
        style.right = o
        style.left = 'auto'
        style.transform = 'none'
      }
      return style
    }
  },
  watch: {
    hovered(val) {
      if (val) {
        this.$nextTick(this.measureOffsets)
      } else {
        this.itemOffsets = []
      }
    },
    'messages.length'() {
      if (this.hovered) this.$nextTick(this.measureOffsets)
    }
  },
  // Timers live off the reactive data map so mutating them never triggers a render.
  created() {
    this._timers = {}
    this._hoverTimer = null
  },
  // Declare both teardown hooks: Vue 2.7 fires beforeDestroy, Vue 3.4 fires beforeUnmount.
  beforeUnmount() {
    this.clear()
    clearTimeout(this._hoverTimer)
  },
  // eslint-disable-next-line vue/no-deprecated-destroyed-lifecycle, vue/no-dupe-keys
  beforeDestroy() {
    this.clear()
    clearTimeout(this._hoverTimer)
  },
  methods: {
    onMouseEnter() {
      clearTimeout(this._hoverTimer)
      this.hovered = true
    },
    onMouseLeave() {
      this._hoverTimer = setTimeout(() => {
        this.hovered = false
      }, 200)
    },
    // Measure each item's real offsetHeight and compute cumulative Y offsets
    // for the expanded stack. Newest item (last in DOM) anchors at Y=0.
    measureOffsets() {
      if (!this.$el) return
      const items = Array.from(this.$el.querySelectorAll('.ui-message-item'))
      if (!items.length) {
        this.itemOffsets = []
        return
      }
      const GAP = 8
      const n = items.length
      const offsets = new Array(n)
      let cumulative = 0
      for (let reverseIdx = 0; reverseIdx < n; reverseIdx++) {
        offsets[reverseIdx] = cumulative
        cumulative += items[n - 1 - reverseIdx].offsetHeight + GAP
      }
      this.itemOffsets = offsets
    },
    // Returns inline style for item at v-for index idx (0 = oldest, last = newest).
    itemStyle(idx) {
      if (!this.hovered || !this.itemOffsets.length) return {}
      const reverseIdx = this.messages.length - 1 - idx
      const y = this.itemOffsets[reverseIdx]
      if (y === undefined) return {}
      const isBottom =
        this.placement === 'bottom' || this.placement === 'bottom-left' || this.placement === 'bottom-right'
      return { transform: 'translateY(' + (isBottom ? -y : y) + 'px) scaleX(1)', opacity: '1' }
    },
    // Merge global/service config into the container's own reactive state.
    configure(opts) {
      if (!opts) return
      if (opts.placement) this.placement = PLACEMENTS.includes(opts.placement) ? opts.placement : 'top'
      if (opts.offset != null) this.offset = opts.offset
      if (opts.maxCount != null) this.maxCount = opts.maxCount
    },
    // Add (or update, when the key already exists) a message. Returns its key.
    add(config) {
      const key = config.key != null ? config.key : `wk-msg-${++seed}`
      const existing = this.messages.find(m => m.key === key)
      if (existing) {
        existing.type = config.type || 'info'
        existing.content = config.content != null ? config.content : ''
        existing.description = config.description || null
        existing.action = config.action || null
        ;((existing.progress = config.progress != null ? config.progress : null),
          (existing.imgSrc = config.imgSrc),
          (existing.onClose = config.onClose || null))
        this.scheduleRemoval(key, config.duration)
        return key
      }
      this.messages.push({
        key,
        type: config.type || 'info',
        content: config.content != null ? config.content : '',
        description: config.description || null,
        action: config.action || null,
        progress: config.progress != null ? config.progress : null,
        imgSrc: config.imgSrc,
        onClose: config.onClose || null
      })
      // Enforce maxCount by evicting the oldest entries.
      if (this.maxCount > 0 && this.messages.length > this.maxCount) {
        const overflow = this.messages.slice(0, this.messages.length - this.maxCount)
        overflow.forEach(m => this.remove(m.key))
      }
      this.scheduleRemoval(key, config.duration)
      return key
    },
    scheduleRemoval(key, duration) {
      this.clearTimer(key)
      // duration <= 0 (or missing) => sticky; caller removes it manually.
      if (duration && duration > 0) {
        this._timers[key] = setTimeout(() => this.remove(key), duration)
      }
    },
    remove(key) {
      this.clearTimer(key)
      const idx = this.messages.findIndex(m => m.key === key)
      if (idx === -1) return
      const [removed] = this.messages.splice(idx, 1)
      if (removed && typeof removed.onClose === 'function') removed.onClose()
    },
    clear() {
      Object.keys(this._timers).forEach(k => this.clearTimer(k))
      const items = this.messages
      this.messages = []
      items.forEach(m => {
        if (typeof m.onClose === 'function') m.onClose()
      })
    },
    clearTimer(key) {
      if (this._timers[key]) {
        clearTimeout(this._timers[key])
        delete this._timers[key]
      }
    }
  }
}
</script>

<style src="./message-container.css" scoped></style>
