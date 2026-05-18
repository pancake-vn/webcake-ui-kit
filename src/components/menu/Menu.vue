<template>
  <div class="ui-menu-host">
    <slot name="trigger" v-bind="triggerSlotProps"></slot>
    <div ref="portal" class="ui-menu-portal">
      <transition name="ui-menu" @after-leave="onAfterLeave">
        <div
          v-if="isVisible"
          ref="floating"
          :id="menuUid"
          class="ui-menu"
          :class="floatingClasses"
          :style="floatingStyle"
          tabindex="-1"
          role="menu"
          @keydown="_kmOnKeydown"
        >
          <div class="ui-menu__content">
            <slot></slot>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { acquire, release } from '../../floating/portal-root.js'
import { nextZIndex } from '../../floating/layer-manager.js'
import positionMixin from '../../floating/position-mixin.js'
import clickOutsideMixin from '../../floating/click-outside-mixin.js'
import keyboardMixin from '../../floating/keyboard-mixin.js'
import focusMixin from '../../floating/focus-mixin.js'

let _uid = 0
const PLACEMENTS = [
  'top',
  'top-start',
  'top-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end',
  'right',
  'right-start',
  'right-end'
]

export default {
  name: 'Menu',
  mixins: [keyboardMixin, focusMixin, clickOutsideMixin, positionMixin],
  model: { prop: 'open', event: 'change' },
  provide() {
    return { menu: this }
  },
  props: {
    open: { type: Boolean, default: false },
    modelValue: { type: Boolean, default: undefined },
    placement: {
      type: String,
      default: 'bottom-start',
      validator: v => PLACEMENTS.indexOf(v) !== -1
    },
    offset: { type: Number, default: 4 },
    closeOnSelect: { type: Boolean, default: true },
    closeOnEsc: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    anchorWidth: { type: Boolean, default: false },
    width: { type: [String, Number], default: null }
  },
  emits: ['change', 'update:modelValue', 'open', 'close', 'select'],
  data() {
    return {
      menuUid: 'wk-menu-' + ++_uid,
      isVisible: false,
      zIndex: 0
    }
  },
  computed: {
    isOpen() {
      return this.modelValue !== undefined ? this.modelValue : this.open
    },
    triggerSlotProps() {
      return {
        toggle: this.toggle,
        open: this.openMenu,
        close: this.closeMenu,
        isOpen: this.isOpen,
        attrs: this.triggerAttrs,
        triggerRef: this._setTriggerEl
      }
    },
    triggerAttrs() {
      return {
        'aria-haspopup': 'menu',
        'aria-expanded': this.isOpen ? 'true' : 'false',
        'aria-controls': this.isOpen ? this.menuUid : null
      }
    },
    floatingClasses() {
      return [this.pmResolvedPlacement && 'ui-menu--' + this.pmResolvedPlacement]
    },
    floatingStyle() {
      const style = {
        top: this.pmTop + 'px',
        left: this.pmLeft + 'px',
        zIndex: this.zIndex || null
      }
      if (this.anchorWidth && this.pmAnchorWidth) {
        style.minWidth = this.pmAnchorWidth + 'px'
      } else if (this.width) {
        style.minWidth = typeof this.width === 'number' ? `${this.width}px` : this.width
      }
      return style
    }
  },
  watch: {
    isOpen(v) {
      if (v) this.handleOpen()
      else this.handleClose()
    }
  },
  mounted() {
    if (typeof document !== 'undefined' && this.$refs.portal) {
      const root = acquire()
      if (root) {
        root.appendChild(this.$refs.portal)
        this._portalAcquired = true
      }
    }
    if (typeof this.$on === 'function') {
      // eslint-disable-next-line vue/no-deprecated-events-api
      this.$on('hook:beforeDestroy', this._cleanupAll)
    }
    if (!this._triggerEl && this.$el) {
      const firstChild = this.$el.firstElementChild
      if (firstChild && !firstChild.classList.contains('ui-menu-portal')) {
        this._triggerEl = firstChild
      }
    }
    if (this.isOpen) this.handleOpen()
  },
  beforeUnmount() {
    this._cleanupAll()
  },
  methods: {
    setOpenState(v) {
      this.$emit('change', v)
      this.$emit('update:modelValue', v)
    },
    toggle() {
      if (this.disabled) return
      this.setOpenState(!this.isOpen)
    },
    openMenu() {
      if (this.disabled || this.isOpen) return
      this.setOpenState(true)
    },
    closeMenu() {
      if (!this.isOpen) return
      this.setOpenState(false)
    },
    selectItem(value) {
      this.$emit('select', value)
      if (this.closeOnSelect) this.closeMenu()
    },
    setActiveItem(el) {
      const items = this._kmListItems()
      const idx = items.indexOf(el)
      if (idx !== -1) this.kmActiveIndex = idx
    },
    _setTriggerEl(el) {
      this._triggerEl = el || null
    },
    handleOpen() {
      this.isVisible = true
      this.zIndex = nextZIndex()
      this._fmCapture()
      this._kmReset()
      this.$emit('open')
      this.$nextTick(() => {
        const float = this.$refs.floating
        if (!float) return
        this._coSetElements(this._triggerEl, float)
        this._kmSetFloatEl(float)
        this._pmAttach(this._triggerEl, float)
        this._coAttach()
        this._fmFocus(float)
      })
    },
    handleClose() {
      this._pmDetach()
      this._coDetach()
      this.isVisible = false
      this.$emit('close')
    },
    onAfterLeave() {
      this._fmRestore()
    },
    _kmOnEscape() {
      if (this.closeOnEsc) this.closeMenu()
    },
    _kmOnTab() {
      this.closeMenu()
    },
    _coOnOutside() {
      this.closeMenu()
    },
    _cleanupAll() {
      this._pmDetach()
      this._coDetach()
      const portal = this.$refs.portal
      if (portal && portal.parentNode) portal.parentNode.removeChild(portal)
      if (this._portalAcquired) {
        release()
        this._portalAcquired = false
      }
    }
  }
}
</script>

<style src="./menu.css" scoped></style>
