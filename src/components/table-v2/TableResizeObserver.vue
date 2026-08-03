<script>
import { getCurrentInstance } from 'vue'
import { findDOMNode } from '../../utils/common'

export default {
  name: 'TableResizeObserver',
  emits: ['resize'],

  data() {
    return {
      state: {
        width: 0,
        height: 0,
        offsetHeight: 0,
        offsetWidth: 0
      },
      instance: getCurrentInstance(),
      currentElement: null,
      resizeObserver: null
    }
  },

  render() {
    // eslint-disable-next-line vue/require-slots-as-functions
    const slot = this.$slots.default
    if (typeof slot === 'function') {
      return slot()
    }
    return (slot && slot[0]) || null
  },

  methods: {
    registerObserver() {
      const element = findDOMNode(this)
      const elementChanged = element !== this.currentElement
      if (elementChanged) {
        this.destroyObserver()
        this.currentElement = element
      }
      if (!element) return
      this.resizeObserver = new ResizeObserver(entries => {
        this.handleEmitResize(entries)
      })
      this.resizeObserver.observe(this.currentElement)
    },
    handleEmitResize(entries) {
      const target = entries[0].target

      const { width, height } = target.getBoundingClientRect()
      const { offsetWidth, offsetHeight } = target

      const fixedWidth = Math.floor(width)
      const fixedHeight = Math.floor(height)

      if (
        this.state.width !== fixedWidth ||
        this.state.height !== fixedHeight ||
        this.state.offsetWidth !== offsetWidth ||
        this.state.offsetHeight !== offsetHeight
      ) {
        const size = { width: fixedWidth, height: fixedHeight, offsetWidth, offsetHeight }

        Object.assign(this.state, size)
        Promise.resolve().then(() => {
          this.$emit('resize', {
            ...size,
            offsetWidth,
            offsetHeight
          })
        })
      }
    },
    destroyObserver() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect()
        this.resizeObserver = null
      }
    }
  },

  mounted() {
    this.registerObserver()
  },

  beforeUnmount() {
    this.destroyObserver()
  },
  // eslint-disable-next-line vue/no-deprecated-destroyed-lifecycle, vue/no-dupe-keys
  beforeDestroy() {
    this.destroyObserver()
  }
}
</script>
