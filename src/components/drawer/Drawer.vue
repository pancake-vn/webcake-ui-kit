<template>
  <div v-if="hasOpened" v-show="isVisible" class="ui-drawer-root" :style="rootStyle">
    <transition name="ui-drawer-fade">
      <div v-if="isOpen && mask" class="ui-drawer-mask" :style="maskStyle" @click="onMaskClick"></div>
    </transition>
    <transition :name="transitionName" appear @after-leave="onAfterLeave">
      <div
        v-if="isOpen"
        ref="panel"
        :class="['ui-drawer', `ui-drawer--${placement}`]"
        :style="panelStyle"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
        @keydown.esc="onEscape"
      >
        <div
          v-if="showHandle"
          class="ui-drawer__handle"
          aria-hidden="true"
          @mousedown="onHandlePointerDown"
          @touchstart="onHandlePointerDown"
          style="cursor: grab"
        >
          <span class="ui-drawer__handle-bar"></span>
        </div>
        <div class="ui-drawer__body">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { acquire, release } from '../../floating/portal-root.js'
import { bumpTo, nextZIndex } from '../../floating/layer-manager.js'

const PLACEMENTS = ['bottom', 'top', 'left', 'right']

export default {
  name: 'Drawer',
  model: { prop: 'open', event: 'change' },
  props: {
    open: { type: Boolean, default: false },
    modelValue: { type: Boolean, default: undefined },
    placement: {
      type: String,
      default: 'bottom',
      validator: v => PLACEMENTS.includes(v)
    },
    // Cross-axis size: height for top/bottom, width for left/right.
    size: { type: [Number, String], default: '' },
    showHandle: { type: Boolean, default: true },
    mask: { type: Boolean, default: true },
    maskClosable: { type: Boolean, default: true },
    keyboard: { type: Boolean, default: true },
    blur: { type: [Boolean, Number, String], default: false },
    zIndex: { type: [Number, String], default: 1000 }
  },
  emits: ['change', 'update:modelValue', 'open', 'close', 'after-close'],
  data() {
    return {
      hasOpened: false,
      isVisible: false,
      activeZIndex: 0,
      isDragging: false,
      dragSize: null
    }
  },
  computed: {
    isOpen() {
      return this.modelValue !== undefined ? this.modelValue : this.open
    },
    isHorizontal() {
      return this.placement === 'left' || this.placement === 'right'
    },
    transitionName() {
      return `ui-drawer-slide-${this.placement}`
    },
    rootStyle() {
      return { zIndex: this.activeZIndex || this.zIndex }
    },
    maskStyle() {
      if (!this.blur) return {}
      const val =
        this.blur === true
          ? '8px'
          : typeof this.blur === 'number' || !isNaN(Number(this.blur))
            ? `${this.blur}px`
            : this.blur
      return { backdropFilter: `blur(${val})`, WebkitBackdropFilter: `blur(${val})` }
    },
    panelStyle() {
      if (this.dragSize !== null) {
        const v = `${this.dragSize}px`
        return Object.assign({}, this.isHorizontal ? { width: v } : { height: v }, { transition: 'none' })
      }
      if (this.size === '' || this.size === null) return {}
      const v = typeof this.size === 'number' || !isNaN(Number(this.size)) ? `${this.size}px` : this.size
      return this.isHorizontal ? { width: v } : { height: v }
    }
  },
  watch: {
    isOpen: {
      handler(v) {
        if (v) {
          this.isVisible = true
          this.onOpen()
        } else {
          this.onClose()
        }
      }
    }
  },
  mounted() {
    this._prevFocus = null
    this._prevOverflow = ''
    this._prevPadding = ''
    if (typeof document !== 'undefined' && this.$el) {
      this._drawerPortalRoot = acquire()
      if (this._drawerPortalRoot) this._drawerPortalRoot.appendChild(this.$el)
    }
    if (typeof this.$on === 'function') {
      // eslint-disable-next-line vue/no-deprecated-events-api
      this.$on('hook:beforeDestroy', this.cleanup)
    }
    if (this.isOpen) {
      this.isVisible = true
      this.onOpen()
    }
  },
  beforeUnmount() {
    this.cleanup()
  },
  // eslint-disable-next-line vue/no-deprecated-destroyed-lifecycle, vue/no-dupe-keys
  beforeDestroy() {
    this.cleanup()
  },
  methods: {
    setOpen(v) {
      this.$emit('change', v)
      this.$emit('update:modelValue', v)
    },
    close() {
      this.setOpen(false)
    },
    onMaskClick(e) {
      if (this.maskClosable) this.close(e)
    },
    onHandlePointerDown(e) {
      if (!this.$refs.panel) return
      this.isDragging = true
      const rect = this.$refs.panel.getBoundingClientRect()
      this._initialSize = this.isHorizontal ? rect.width : rect.height
      this._startClientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX
      this._startClientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY
      this.dragSize = this._initialSize

      document.addEventListener('mousemove', this.onPointerMove)
      document.addEventListener('touchmove', this.onPointerMove, { passive: false })
      document.addEventListener('mouseup', this.onPointerUp)
      document.addEventListener('touchend', this.onPointerUp)
    },
    onPointerMove(e) {
      if (!this.isDragging) return
      e.preventDefault()

      const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX
      const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY

      let delta = 0
      if (this.placement === 'bottom') {
        delta = this._startClientY - clientY
      } else if (this.placement === 'top') {
        delta = clientY - this._startClientY
      } else if (this.placement === 'right') {
        delta = this._startClientX - clientX
      } else if (this.placement === 'left') {
        delta = clientX - this._startClientX
      }

      this.dragSize = Math.max(0, Math.min(this._initialSize, this._initialSize + delta))
    },
    onPointerUp() {
      if (!this.isDragging) return
      this.isDragging = false

      document.removeEventListener('mousemove', this.onPointerMove)
      document.removeEventListener('touchmove', this.onPointerMove)
      document.removeEventListener('mouseup', this.onPointerUp)
      document.removeEventListener('touchend', this.onPointerUp)

      if (this.dragSize < this._initialSize * (2 / 3)) {
        this.close()
      }

      this.dragSize = null
    },
    onEscape(e) {
      if (this.keyboard) this.close(e)
    },
    onOpen() {
      this.hasOpened = true
      bumpTo(this.zIndex)
      this.activeZIndex = nextZIndex()
      this.lockBody()
      if (typeof document !== 'undefined') {
        this._prevFocus = document.activeElement
      }
      this.$emit('open')
      this.$nextTick(() => {
        if (this.$refs.panel && this.$refs.panel.focus) {
          this.$refs.panel.focus()
        }
      })
    },
    onClose() {
      this.unlockBody()
      if (this._prevFocus && typeof this._prevFocus.focus === 'function') {
        this._prevFocus.focus()
      }
      this._prevFocus = null
      this.$emit('close')
    },
    onAfterLeave() {
      if (!this.isOpen) {
        this.isVisible = false
      }
      this.$emit('after-close')
    },
    lockBody() {
      if (typeof document === 'undefined' || typeof window === 'undefined') return
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      this._prevOverflow = document.body.style.overflow
      this._prevPadding = document.body.style.paddingRight
      document.body.style.overflow = 'hidden'
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`
      }
    },
    unlockBody() {
      if (typeof document === 'undefined') return
      document.body.style.overflow = this._prevOverflow || ''
      document.body.style.paddingRight = this._prevPadding || ''
    },
    cleanup() {
      this.unlockBody()
      if (this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el)
      }
      if (this._drawerPortalRoot) {
        release()
        this._drawerPortalRoot = null
      }
    }
  }
}
</script>

<style src="./drawer.css" scoped></style>
