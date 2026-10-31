<template>
  <BaseSelect
    ref="baseSelect"
    v-bind="$attrs"
    :optionList="OptionList"
    :displayValues="displayValues"
    :searchValue="searchValue"
    :mode="mode"
    :is-empty="flattenOptions.length === 0"
    @search="onSearch"
    @deselect="handleDeselect"
    @enterSearch="handleEnterSearch"
    @clear="handleClear"
  >
    <template #icon v-if="hasIconSlot()">
      <slot name="icon" />
    </template>
    <template #contentHeader>
      <slot name="contentHeader" />
    </template>
    <template #default>
      <slot />
    </template>
    <template #contentFooter>
      <slot name="contentFooter" />
    </template>
  </BaseSelect>
</template>

<script>
import BaseSelect from '../base-select/BaseSelect.vue'
import OptionList from './OptionList.vue'
import { createSelectContext } from './context/createSelectContext.js'

export default {
  name: 'Select',

  inheritAttrs: false,

  components: {
    BaseSelect
  },

  props: {
    value: [String, Number, Array],
    options: {
      type: Array,
      default: () => []
    },
    mode: {
      type: String,
      default: 'single',
      validator: value => ['single', 'multiple', 'tags'].includes(value)
    }
  },

  data() {
    return {
      selectCtx: createSelectContext(),
      searchValue: undefined,
      tagOptions: []
    }
  },

  provide() {
    return {
      selectCtx: this.selectCtx
    }
  },

  computed: {
    OptionList() {
      return OptionList
    },

    normalizedOptions() {
      const raw = this.options || []
      if (!raw.length) return this._parseSlotOptions()
      var result = []
      for (var i = 0; i < raw.length; i++) {
        var n = this.normalizeOption(raw[i], i)
        if (Array.isArray(n)) {
          for (var j = 0; j < n.length; j++) result.push(n[j])
        } else {
          result.push(n)
        }
      }
      return result
    },

    valueOptions() {
      const map = new Map()
      this.normalizedOptions.forEach(opt => {
        if (opt.type !== 'group-header' && opt.type !== 'divider') map.set(opt.value, opt)
      })
      return map
    },

    rawValues() {
      const currentValue = this.value

      const values = Array.isArray(currentValue) ? currentValue : !currentValue ? [] : [currentValue]

      return new Map(values.map(item => [item, true]))
    },

    flattenOptions() {
      const tagNormalized = this.mode == 'tags' ? this.tagOptions.map(this.normalizeOption) : []
      const base = this.normalizedOptions.concat(tagNormalized)
      if (!this.searchValue) return base
      const query = this.searchValue.trim().toLowerCase()
      return base.filter(opt => {
        if (opt.type === 'divider' || opt.type === 'group-header') return false
        return String(opt.label).toLowerCase().includes(query)
      })
    },

    displayValues() {
      return Array.from(this.rawValues.keys()).map(value => {
        const option = this.valueOptions.get(value)

        return {
          value,
          label: option ? option.label : value
        }
      })
    }
  },

  watch: {
    // Lưu vào context để OptionList.vue render ra.
    flattenOptions: {
      immediate: true,
      handler(v) {
        this.selectCtx.options = v
      }
    },
    valueOptions: {
      immediate: true,
      handler(v) {
        this.selectCtx.valueOptions = v
      }
    },
    rawValues: {
      immediate: true,
      handler(v) {
        this.selectCtx.rawValues = v
      }
    },
    displayValues: {
      immediate: true,
      handler(v) {
        this.selectCtx.displayValues = v
      }
    }
  },

  created() {
    this.selectCtx.actions.onSelect = this.onSelect
  },

  methods: {
    hasIconSlot() {
      return !!((this.$scopedSlots && this.$scopedSlots['icon']) || this.$slots['icon'])
    },

    onSelect(val) {
      let nextValue
      if (this.mode === 'multiple' || this.mode === 'tags') {
        const current = [...this.rawValues.keys()]
        const idx = current.indexOf(val)
        if (idx === -1) {
          current.push(val)
        } else {
          current.splice(idx, 1)
          this.tagOptions = this.tagOptions.filter(o => o.value !== val)
        }
        nextValue = current
      } else {
        nextValue = val
        // Đóng dropdown khi chọn xong ở single mode
        this.setOpen(false)
      }
      this.searchValue = ''
      this.$emit('update:value', nextValue) // hoặc update:modelValue tuỳ Vue 2/3
      this.$emit('change', nextValue, this.valueOptions.get(val))
    },
    setOpen(open) {
      if (this.$refs.baseSelect) {
        this.$refs.baseSelect.setOpen(open)
      }
    },

    handleDeselect(value) {
      this.onSelect(value)
    },

    handleEnterSearch(value) {
      if (this.mode !== 'tags') return
      const text = String(value).trim()
      if (!text) return
      const existing = this.normalizedOptions.find(
        o => String(o.label).toLowerCase() === text.toLowerCase() || o.value === text
      )
      const val = existing ? existing.value : text
      if (!this.tagOptions.find(o => o.value === val)) {
        this.tagOptions = this.tagOptions.concat([{ label: text, value: text, disabled: false }])
      }
      const current = [...this.rawValues.keys()]
      if (current.indexOf(val) === -1) {
        current.push(val)
        this.$emit('update:value', current)
        this.$emit('change', current, null)
      }
      this.searchValue = ''
    },

    handleClear() {
      const next = this.mode === 'multiple' || this.mode === 'tags' ? [] : null
      this.$emit('update:value', next)
      this.$emit('change', next, null)
      this.searchValue = ''
      if (this.mode === 'tags') this.tagOptions = []
    },

    onSearch(value) {
      this.searchValue = value
    },

    //Helper
    _parseSlotOptions() {
      var slotDefault = this.$slots.default
      var rawVnodes = typeof slotDefault === 'function' ? slotDefault() : slotDefault || []

      // Vue 3 wraps slot content in a fragment vnode — flatten one level
      var vnodes = []
      for (var i = 0; i < rawVnodes.length; i++) {
        var v = rawVnodes[i]
        if (Array.isArray(v.children)) {
          for (var j = 0; j < v.children.length; j++) vnodes.push(v.children[j])
        } else {
          vnodes.push(v)
        }
      }

      var result = []
      for (var k = 0; k < vnodes.length; k++) {
        var vnode = vnodes[k]
        var isOption = false
        var isDivider = false
        var isGroup = false
        var props = {}
        if (vnode.componentOptions && vnode.componentOptions.Ctor) {
          // Vue 2
          var ctorOpts = vnode.componentOptions.Ctor.options || {}
          isOption = ctorOpts.name === 'SelectOption'
          isDivider = ctorOpts.name === 'Divider'
          isGroup = ctorOpts.name === 'SelectOptionGroup'
          props = vnode.componentOptions.propsData || {}
        } else if (vnode.type && typeof vnode.type === 'object') {
          // Vue 3
          isOption = vnode.type.name === 'SelectOption'
          isDivider = vnode.type.name === 'Divider'
          isGroup = vnode.type.name === 'SelectOptionGroup'
          props = vnode.props || {}
        }

        if (isDivider) {
          result.push({ type: 'divider', value: '__divider_' + k + '__', disabled: true })
          continue
        }

        if (isGroup) {
          var groupLabel = props.label
          var groupIcon = this._normalizeIcon(props.icon)
          if (groupLabel === undefined) {
            var labelVnodes = null
            // Vue 2: #label scoped slot
            if (vnode.data && vnode.data.scopedSlots && vnode.data.scopedSlots['label']) {
              try {
                labelVnodes = vnode.data.scopedSlots['label']({})
              } catch (_e) {
                /* noop */
              }
            }
            // Vue 3: children.label()
            if (!labelVnodes) {
              var lc3 = vnode.children
              if (lc3 && typeof lc3 === 'object' && !Array.isArray(lc3) && typeof lc3.label === 'function') {
                try {
                  labelVnodes = lc3.label()
                } catch (_e) {
                  /* noop */
                }
              }
            }
            if (labelVnodes) {
              var parsed = this._parseGroupLabel(labelVnodes)
              groupLabel = parsed.label
              groupIcon = parsed.icon
            }
          }
          result.push({
            type: 'group-header',
            label: groupLabel || '',
            icon: groupIcon,
            value: '__group_' + k + '__',
            disabled: true
          })

          // Collect child vnodes of the group
          var groupChildren = []
          if (vnode.componentOptions && vnode.componentOptions.children) {
            groupChildren = vnode.componentOptions.children
          }
          var gc3 = vnode.children
          if (gc3 && typeof gc3 === 'object' && !Array.isArray(gc3) && typeof gc3.default === 'function') {
            try {
              groupChildren = gc3.default() || []
            } catch (_e) {
              /* noop */
            }
          }

          for (var gi = 0; gi < groupChildren.length; gi++) {
            var gvnode = groupChildren[gi]
            var gIsOption = false
            var gProps = {}
            if (gvnode.componentOptions && gvnode.componentOptions.Ctor) {
              gIsOption = (gvnode.componentOptions.Ctor.options || {}).name === 'SelectOption'
              gProps = gvnode.componentOptions.propsData || {}
            } else if (gvnode.type && typeof gvnode.type === 'object') {
              gIsOption = gvnode.type.name === 'SelectOption'
              gProps = gvnode.props || {}
            }
            if (gIsOption) result.push(this._parseOptionVnode(gvnode, gProps))
          }
          continue
        }

        if (!isOption) continue
        result.push(this._parseOptionVnode(vnode, props))
      }
      return result
    },

    _parseOptionVnode(vnode, props) {
      var label = props.label
      if (label === undefined) {
        var slotChildren = []
        if (vnode.componentOptions && vnode.componentOptions.children) {
          slotChildren = vnode.componentOptions.children
        }
        var c3 = vnode.children
        if (c3 && typeof c3 === 'object' && !Array.isArray(c3) && typeof c3.default === 'function') {
          slotChildren = c3.default() || []
        } else if (Array.isArray(c3)) {
          slotChildren = c3
        }
        var slotText = ''
        for (var si = 0; si < slotChildren.length; si++) {
          var sn = slotChildren[si]
          if (typeof sn.text === 'string') slotText += sn.text
          if (typeof sn.children === 'string') slotText += sn.children
        }
        label = slotText.trim() || String(props.value)
      }

      var prefixFn = null
      // Vue 2
      if (vnode.data && vnode.data.scopedSlots && vnode.data.scopedSlots['prefix']) {
        prefixFn = vnode.data.scopedSlots['prefix']
      }
      // Vue 3
      if (!prefixFn) {
        var c3icon = vnode.children
        if (c3icon && typeof c3icon === 'object' && !Array.isArray(c3icon) && typeof c3icon.prefix === 'function') {
          prefixFn = c3icon.prefix
        }
      }

      var labelFn = null
      // Vue 2: default slot là array tĩnh → wrap thành function
      if (vnode.componentOptions && vnode.componentOptions.children && vnode.componentOptions.children.length) {
        var v2label = vnode.componentOptions.children
        labelFn = function () {
          return v2label
        }
      }
      // Vue 3: default slot là function
      if (!labelFn) {
        var c3label = vnode.children
        if (
          c3label &&
          typeof c3label === 'object' &&
          !Array.isArray(c3label) &&
          typeof c3label.default === 'function'
        ) {
          labelFn = c3label.default
        }
      }

      return {
        label: label,
        value: props.value,
        disabled: !!props.disabled,
        data: props,
        icon: prefixFn ? null : this._normalizeIcon(props.icon),
        prefixFn: prefixFn || null,
        labelFn: labelFn || null
      }
    },

    _extractTextFromVnodes(vnodes) {
      if (!vnodes) return ''
      var text = ''
      for (var i = 0; i < vnodes.length; i++) {
        var n = vnodes[i]
        if (typeof n.text === 'string') text += n.text
        if (typeof n.children === 'string') text += n.children
        if (Array.isArray(n.children)) text += this._extractTextFromVnodes(n.children)
      }
      return text.trim()
    },

    _parseGroupLabel(vnodes) {
      if (!vnodes) return { label: '', icon: null }
      var text = ''
      var iconComponent = null
      var iconProps = {}
      var walk = function (nodes) {
        for (var i = 0; i < nodes.length; i++) {
          var n = nodes[i]
          if (typeof n.text === 'string') text += n.text
          if (typeof n.children === 'string') text += n.children
          if (!iconComponent) {
            // Vue 2 component vnode
            if (n.componentOptions && n.componentOptions.Ctor) {
              iconComponent = n.componentOptions.Ctor
              iconProps = (n.data && n.data.attrs) || n.componentOptions.propsData || {}
            } else if (n.type && typeof n.type === 'object' && n.type.name) {
              // Vue 3 component vnode
              iconComponent = n.type
              iconProps = n.props || {}
            }
          }
          if (Array.isArray(n.children)) walk(n.children)
        }
      }
      walk(vnodes)
      var icon = iconComponent
        ? {
            component: iconComponent,
            attrs: {
              size: iconProps.size || 16,
              color: iconProps.color || 'var(--muted-fg)',
              strokeWidth: iconProps.strokeWidth || iconProps['stroke-width'] || 1.75,
              fill: iconProps.fill || 'none'
            }
          }
        : null
      return { label: text.trim(), icon: icon }
    },

    normalizeOption(opt, index) {
      if (opt && opt.type === 'divider') {
        return { type: 'divider', value: '__divider_' + index + '__', disabled: true }
      }
      if (opt && Array.isArray(opt.options)) {
        var self = this
        var header = {
          type: 'group-header',
          label: opt.label !== undefined ? String(opt.label) : '',
          value: '__group_' + index + '__',
          disabled: true,
          icon: this._normalizeIcon(opt.icon)
        }
        var children = (opt.options || []).map(function (o, i) {
          return self.normalizeOption(o, String(index) + '_' + i)
        })
        return [header].concat(children)
      }
      if (typeof opt === 'string' || typeof opt === 'number') {
        return { label: String(opt), value: opt, disabled: false, data: opt }
      }
      return {
        label: opt.label !== undefined ? opt.label : String(opt.value),
        value: opt.value,
        disabled: !!opt.disabled,
        data: opt,
        icon: this._normalizeIcon(opt.icon)
      }
    },

    _normalizeIcon(icon) {
      if (!icon || !icon.component) return null
      return {
        component: icon.component,
        attrs: {
          size: icon.size || 16,
          color: icon.color || 'var(--muted-fg)',
          strokeWidth: icon.strokeWidth || 1.75,
          fill: icon.fill || 'none'
        }
      }
    }
  }
}
</script>
