<template>
  <div v-if="hasOpened" v-show="isVisible" class="ui-dialog-root" :style="rootStyle">
    <transition name="ui-dialog-fade">
      <div v-if="isOpen && mask" class="ui-dialog-mask" :style="maskStyle"></div>
    </transition>
    <transition name="ui-dialog-zoom" appear @after-leave="onAfterLeave">
      <div
        v-if="isOpen"
        ref="wrap"
        class="ui-dialog-wrap"
        :class="wrapCls"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
        @mousedown.self="onWrapMousedown"
        @mouseup.self="onWrapMouseup"
        @keydown.esc="onEscape"
      >
        <div class="ui-dialog-content" :style="contentStyle">
          <div :class="['ui-dialog', isFullscreen && 'ui-dialog--fullscreen']">
            <div v-if="showHeader" :class="['ui-dialog-header', headerDivider && 'ui-dialog-header--divided']">
              <div class="ui-dialog-header__row">
                <slot name="header">
                  <div v-if="hasTitle" class="ui-dialog-header__content">
                    <div class="ui-dialog-header__title">
                      <slot name="title">{{ title }}</slot>
                    </div>
                    <div v-if="hasSubText" class="ui-dialog-header__sub-text">
                      <slot name="sub-text">{{ subText }}</slot>
                    </div>
                  </div>
                  <div v-else class="ui-dialog-header__content ui-dialog-header__content--empty"></div>
                </slot>

                <div class="ui-dialog-header__actions">
                  <button
                    v-if="minimizable"
                    type="button"
                    class="ui-dialog-header__icon-btn"
                    :aria-label="minimized ? 'Restore' : 'Minimize'"
                    @click="toggleMinimize"
                  >
                    <MinusIcon v-if="!minimized" />
                    <UnfoldVerticalIcon v-else />
                  </button>
                  <button
                    v-if="fullscreen"
                    type="button"
                    class="ui-dialog-header__icon-btn"
                    :aria-label="isFullscreen ? 'Exit fullscreen' : 'Fullscreen'"
                    @click="toggleFullscreen"
                  >
                    <ExpandIcon v-if="!isFullscreen" />
                    <ShrinkIcon v-else />
                  </button>
                  <button
                    v-if="closable"
                    type="button"
                    class="ui-dialog-header__icon-btn"
                    aria-label="Close"
                    @click="handleCancel"
                  >
                    <XIcon />
                  </button>
                </div>
              </div>
            </div>

            <div v-show="!minimized" class="ui-dialog-body">
              <slot />
            </div>

            <div
              v-if="footer && !minimized"
              :class="[
                'ui-dialog-footer',
                `ui-dialog-footer--align-${footerAlign}`,
                footerDivider && 'ui-dialog-footer--divided'
              ]"
            >
              <div class="ui-dialog-footer__inner">
                <slot name="footer">
                  <Button :variant="cancelVariant" @click="handleCancel">{{ cancelText }}</Button>
                  <Button :variant="okVariant" :loading="confirmLoading" @click="handleOk">{{ okText }}</Button>
                </slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { acquire, release } from '../../floating/portal-root.js'
import Button from '../button/Button.vue'
import MinusIcon from '../../icons/MinusIcon.vue'
import UnfoldVerticalIcon from '../../icons/UnfoldVerticalIcon.vue'
import ExpandIcon from '../../icons/ExpandIcon.vue'
import ShrinkIcon from '../../icons/ShrinkIcon.vue'
import XIcon from '../../icons/XIcon.vue'

export default {
  name: 'Dialog',
  components: { Button, MinusIcon, UnfoldVerticalIcon, ExpandIcon, ShrinkIcon, XIcon },
  model: { prop: 'open', event: 'change' },
  props: {
    open: { type: Boolean, default: false },
    modelValue: { type: Boolean, default: undefined },
    title: { type: String, default: '' },
    subText: { type: String, default: '' },
    closable: { type: Boolean, default: true },
    showHeader: { type: Boolean, default: true },
    headerDivider: { type: Boolean, default: true },
    footer: { type: Boolean, default: true },
    footerAlign: {
      type: String,
      default: 'right',
      validator: v => ['right', 'fill'].includes(v)
    },
    footerDivider: { type: Boolean, default: true },
    okText: { type: String, default: 'OK' },
    cancelText: { type: String, default: 'Cancel' },
    okVariant: { type: String, default: 'primary' },
    cancelVariant: { type: String, default: 'outline' },
    confirmLoading: { type: Boolean, default: false },
    width: { type: [Number, String], default: '' },
    centered: { type: Boolean, default: false },
    mask: { type: Boolean, default: true },
    maskClosable: { type: Boolean, default: true },
    keyboard: { type: Boolean, default: true },
    zIndex: { type: [Number, String], default: 1000 },
    minimizable: { type: Boolean, default: false },
    fullscreen: { type: Boolean, default: false },
    blur: { type: [Boolean, Number, String], default: false }
  },
  emits: ['change', 'update:modelValue', 'ok', 'cancel', 'after-close'],
  data() {
    return {
      hasOpened: false,
      isVisible: false,
      minimized: false,
      isFullscreen: false
    }
  },
  computed: {
    isOpen() {
      return this.modelValue !== undefined ? this.modelValue : this.open
    },
    rootStyle() {
      return { zIndex: this.zIndex }
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
    contentStyle() {
      if (this.isFullscreen) return {}
      if (!this.width) return {}
      const w = typeof this.width === 'number' || !isNaN(Number(this.width)) ? `${this.width}px` : this.width
      return { width: w }
    },
    wrapCls() {
      return [
        this.centered && !this.isFullscreen ? 'ui-dialog-wrap--centered' : null,
        this.isFullscreen ? 'ui-dialog-wrap--fullscreen' : null
      ].filter(Boolean)
    },
    hasTitleSlot() {
      return !!this.$slots['title']
    },
    hasTitle() {
      return !!this.title || this.hasTitleSlot
    },
    hasSubTextSlot() {
      return !!this.$slots['sub-text']
    },
    hasSubText() {
      return !!this.subText || this.hasSubTextSlot
    },
    hasHeaderActions() {
      return this.minimizable || this.fullscreen || !!this.$slots['header-actions']
    }
  },
  watch: {
    isOpen: {
      handler(v) {
        if (v) {
          this.isVisible = true
          this.onOpen()
        } else {
          this.minimized = false
          this.isFullscreen = false
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
      this._dialogPortalRoot = acquire()
      if (this._dialogPortalRoot) this._dialogPortalRoot.appendChild(this.$el)
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
  methods: {
    setOpen(v) {
      this.$emit('change', v)
      this.$emit('update:modelValue', v)
    },
    handleOk(e) {
      this.$emit('ok', e)
    },
    handleCancel(e) {
      this.$emit('cancel', e)
      this.setOpen(false)
    },
    onWrapMousedown() {
      this._mousedownOnWrap = true
    },
    onWrapMouseup(e) {
      if (this.maskClosable && this._mousedownOnWrap) {
        this.handleCancel(e)
      }
      this._mousedownOnWrap = false
    },
    onEscape(e) {
      if (this.keyboard) this.handleCancel(e)
    },
    toggleMinimize() {
      this.minimized = !this.minimized
      if (this.minimized) this.isFullscreen = false
    },
    toggleFullscreen() {
      this.isFullscreen = !this.isFullscreen
      if (this.isFullscreen) this.minimized = false
    },
    onOpen() {
      this.hasOpened = true
      this.lockBody()
      if (typeof document !== 'undefined') {
        this._prevFocus = document.activeElement
      }
      this.$nextTick(() => {
        if (this.$refs.wrap && this.$refs.wrap.focus) {
          this.$refs.wrap.focus()
        }
      })
    },
    onClose() {
      this.unlockBody()
      if (this._prevFocus && typeof this._prevFocus.focus === 'function') {
        this._prevFocus.focus()
      }
      this._prevFocus = null
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
      if (this._dialogPortalRoot) {
        release()
        this._dialogPortalRoot = null
      }
    }
  }
}
</script>

<style src="./dialog.css" scoped></style>
