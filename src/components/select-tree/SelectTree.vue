<template>
  <BaseSelect
    ref="baseSelect"
    v-bind="$attrs"
    :optionList="TreeList"
    :displayValues="displayValues"
    :searchValue="searchValue"
    :mode="baseMode"
    :isEmpty="flattenNodes.length === 0"
    @search="onSearch"
    @deselect="handleDeselect"
    @clear="handleClear"
  >
    <template #icon v-if="hasIconSlot()">
      <slot name="icon" />
    </template>
    <template #contentHeader>
      <slot name="contentHeader" />
    </template>
    <template #contentFooter>
      <slot name="contentFooter" />
    </template>
  </BaseSelect>
</template>

<script>
import BaseSelect from '../base-select/BaseSelect.vue'
import TreeList from './TreeList.vue'
import { createTreeSelectContext } from './context/createTreeSelectContext.js'

// Conduct trạng thái check từ danh sách key đã lưu (bất kể showCheckedStrategy).
// - conduct down: node cha được check -> mọi con cháu checked
// - conduct up: mọi con checked -> cha checked; một phần -> cha half-checked
function conductCheck(storedKeys, keyEntities) {
  var checked = new Set()
  function down(k) {
    var e = keyEntities.get(k)
    if (!e) return
    checked.add(k)
    e.childrenKeys.forEach(down)
  }
  storedKeys.forEach(down)

  var all = Array.from(keyEntities.values()).sort(function (a, b) {
    return b.level - a.level
  })
  all.forEach(function (ent) {
    if (ent.isLeaf) return
    var allChecked =
      ent.childrenKeys.length > 0 &&
      ent.childrenKeys.every(function (ck) {
        return checked.has(ck)
      })
    if (allChecked) checked.add(ent.key)
  })

  var half = new Set()
  all.forEach(function (ent) {
    if (ent.isLeaf || checked.has(ent.key)) return
    var some = ent.childrenKeys.some(function (ck) {
      return checked.has(ck) || half.has(ck)
    })
    if (some) half.add(ent.key)
  })

  return { checked: checked, half: half }
}

export default {
  name: 'SelectTree',

  inheritAttrs: false,

  components: {
    BaseSelect
  },

  props: {
    value: [String, Number, Array],
    treeData: {
      type: Array,
      default: function () {
        return []
      }
    },
    multiple: Boolean,
    treeCheckable: Boolean,
    checkStrictly: Boolean,
    treeNodeSelectable: {
      type: Boolean,
      default: true
    },
    defaultExpandAll: Boolean,
    // SHOW_CHILD | SHOW_PARENT | SHOW_ALL
    showCheckedStrategy: {
      type: String,
      default: 'SHOW_CHILD',
      validator: function (v) {
        return ['SHOW_CHILD', 'SHOW_PARENT', 'SHOW_ALL'].indexOf(v) !== -1
      }
    },
    fieldNames: {
      type: Object,
      default: function () {
        return { label: 'label', value: 'value', children: 'children' }
      }
    }
  },

  emits: ['update:value', 'change', 'select', 'tree-expand'],

  data() {
    return {
      internalValue: undefined,
      searchValue: '',
      expandedKeys: [],
      treeCtx: createTreeSelectContext()
    }
  },

  provide() {
    return {
      treeSelectContext: this.treeCtx
    }
  },

  computed: {
    TreeList() {
      return TreeList
    },

    checkable() {
      return this.treeCheckable
    },

    isMultiple() {
      return this.multiple || this.treeCheckable
    },

    baseMode() {
      return this.isMultiple ? 'multiple' : 'single'
    },

    rawValues() {
      var value = this.value !== undefined ? this.value : this.internalValue
      if (Array.isArray(value)) return value
      return value == null ? [] : [value]
    },

    // Map<key, { key, value, label, disabled, node, parentKey, level, isLeaf, childrenKeys }>
    keyEntities() {
      var entities = new Map()
      var labelField = this.fieldNames.label
      var valueField = this.fieldNames.value
      var childrenField = this.fieldNames.children
      var self = this

      function walk(nodes, parentKey, level) {
        ;(nodes || []).forEach(function (node) {
          var key = node[valueField]
          var childNodes = node[childrenField] || []
          entities.set(key, {
            key: key,
            value: key,
            label: node[labelField],
            disabled: !!node.disabled,
            node: node,
            parentKey: parentKey,
            level: level,
            isLeaf: childNodes.length === 0,
            childrenKeys: childNodes.map(function (c) {
              return c[valueField]
            })
          })
          walk(childNodes, key, level + 1)
        })
      }

      walk(this.treeData, null, 0)
      // Tránh unused warning cho self khi minify
      void self
      return entities
    },

    valueOptions() {
      var m = new Map()
      this.keyEntities.forEach(function (ent, key) {
        m.set(key, { value: key, label: ent.label })
      })
      return m
    },

    checkState() {
      if (!this.checkable) return { checked: new Set(), half: new Set() }
      if (this.checkStrictly) {
        return { checked: new Set(this.rawValues), half: new Set() }
      }
      return conductCheck(this.rawValues, this.keyEntities)
    },

    checkedLeafKeys() {
      var checked = this.checkState.checked
      var set = new Set()
      this.keyEntities.forEach(function (ent) {
        if (ent.isLeaf && checked.has(ent.key)) set.add(ent.key)
      })
      return set
    },

    selectedKeySet() {
      return new Set(this.rawValues)
    },

    searchLower() {
      return (this.searchValue || '').trim().toLowerCase()
    },

    // Set các key có label khớp; null nếu không search
    matchedKeys() {
      if (!this.searchLower) return null
      var q = this.searchLower
      var set = new Set()
      this.keyEntities.forEach(function (ent) {
        if (String(ent.label).toLowerCase().indexOf(q) !== -1) set.add(ent.key)
      })
      return set
    },

    // Khi search: node khớp + toàn bộ tổ tiên của chúng (giữ đường dẫn cây)
    visibleKeySet() {
      if (!this.matchedKeys) return null
      var visible = new Set()
      var entities = this.keyEntities
      this.matchedKeys.forEach(function (key) {
        visible.add(key)
        var p = entities.get(key).parentKey
        while (p != null) {
          visible.add(p)
          p = entities.get(p).parentKey
        }
      })
      return visible
    },

    // Auto-expand: tổ tiên của các node khớp. null nếu không search
    searchExpandedKeys() {
      if (!this.matchedKeys) return null
      var set = new Set()
      var entities = this.keyEntities
      this.matchedKeys.forEach(function (key) {
        var p = entities.get(key).parentKey
        while (p != null) {
          set.add(p)
          p = entities.get(p).parentKey
        }
      })
      return set
    },

    mergedExpandedKeys() {
      if (this.searchExpandedKeys) return this.searchExpandedKeys
      return new Set(this.expandedKeys)
    },

    flattenNodes() {
      var result = []
      var checked = this.checkState.checked
      var half = this.checkState.half
      var selected = this.selectedKeySet
      var visible = this.visibleKeySet
      var expanded = this.mergedExpandedKeys
      var entities = this.keyEntities
      var childrenField = this.fieldNames.children
      var valueField = this.fieldNames.value

      function walk(nodes, level) {
        ;(nodes || []).forEach(function (node) {
          var key = node[valueField]
          var ent = entities.get(key)
          if (!ent) return
          if (visible && !visible.has(key)) return
          var isExpanded = expanded.has(key)
          result.push({
            key: key,
            label: ent.label,
            level: level,
            isLeaf: ent.isLeaf,
            hasChildren: !ent.isLeaf,
            disabled: ent.disabled,
            expanded: isExpanded,
            selected: selected.has(key),
            checked: checked.has(key),
            halfChecked: half.has(key)
          })
          if (!ent.isLeaf && isExpanded) {
            walk(node[childrenField] || [], level + 1)
          }
        })
      }

      walk(this.treeData, 0)
      return result
    },

    displayValues() {
      var entities = this.keyEntities
      return this.rawValues.map(function (v) {
        var ent = entities.get(v)
        return { value: v, label: ent ? ent.label : v }
      })
    }
  },

  watch: {
    flattenNodes: {
      immediate: true,
      handler(v) {
        this.treeCtx.flattenNodes = v
      }
    },
    checkState: {
      immediate: true,
      handler(v) {
        this.treeCtx.checkedKeys = v.checked
        this.treeCtx.halfCheckedKeys = v.half
      }
    },
    selectedKeySet: {
      immediate: true,
      handler(v) {
        this.treeCtx.selectedKeys = v
      }
    },
    checkable: {
      immediate: true,
      handler(v) {
        this.treeCtx.checkable = v
      }
    },
    isMultiple: {
      immediate: true,
      handler(v) {
        this.treeCtx.multiple = v
      }
    }
  },

  created() {
    this.treeCtx.actions.onSelect = this.onSelect
    this.treeCtx.actions.onExpand = this.onExpand
    this.treeCtx.actions.onCheck = this.onCheck
    this.treeCtx.treeNodeSelectable = this.treeNodeSelectable

    if (this.defaultExpandAll) {
      var keys = []
      this.keyEntities.forEach(function (ent) {
        if (!ent.isLeaf) keys.push(ent.key)
      })
      this.expandedKeys = keys
    }
  },

  methods: {
    hasIconSlot() {
      return !!((this.$scopedSlots && this.$scopedSlots['icon']) || this.$slots['icon'])
    },
    commit(next) {
      if (this.value === undefined) this.internalValue = next
      this.$emit('update:value', next)
      this.$emit('change', next)
    },

    setOpen(open) {
      if (this.$refs.baseSelect) this.$refs.baseSelect.setOpen(open)
    },

    onSearch(value) {
      this.searchValue = value
    },

    onExpand(key) {
      var idx = this.expandedKeys.indexOf(key)
      if (idx === -1) {
        this.expandedKeys = this.expandedKeys.concat(key)
      } else {
        this.expandedKeys = this.expandedKeys.filter(function (k) {
          return k !== key
        })
      }
      this.$emit('tree-expand', this.expandedKeys)
    },

    onSelect(key) {
      var ent = this.keyEntities.get(key)
      if (!ent || ent.disabled) return

      // Node cha không được chọn -> click label = expand (chỉ khi không checkbox)
      if (!this.treeNodeSelectable && !ent.isLeaf && !this.checkable) {
        this.onExpand(key)
        return
      }

      if (this.checkable) {
        this.onCheck(key)
        this.searchValue = ''
        return
      }

      if (this.isMultiple) {
        var arr = this.rawValues.slice()
        var i = arr.indexOf(key)
        if (i === -1) arr.push(key)
        else arr.splice(i, 1)
        this.commit(arr)
      } else {
        this.commit(key)
        this.setOpen(false)
      }
      this.searchValue = ''
      this.$emit('select', key)
    },

    getLeafDescendants(key) {
      var ent = this.keyEntities.get(key)
      if (!ent) return []
      if (ent.isLeaf) return [key]
      var res = []
      var entities = this.keyEntities
      function walk(k) {
        var e = entities.get(k)
        if (!e) return
        if (e.isLeaf) {
          res.push(k)
          return
        }
        e.childrenKeys.forEach(walk)
      }
      walk(key)
      return res
    },

    // Suy ra danh sách lưu vào v-model từ tập leaf đã check, theo showCheckedStrategy
    deriveStored(leafSet) {
      var entities = this.keyEntities
      var full = new Set(leafSet)
      var all = Array.from(entities.values()).sort(function (a, b) {
        return b.level - a.level
      })
      all.forEach(function (ent) {
        if (ent.isLeaf) return
        var allChecked =
          ent.childrenKeys.length > 0 &&
          ent.childrenKeys.every(function (ck) {
            return full.has(ck)
          })
        if (allChecked) full.add(ent.key)
      })

      if (this.showCheckedStrategy === 'SHOW_CHILD') {
        return Array.from(leafSet)
      }
      if (this.showCheckedStrategy === 'SHOW_PARENT') {
        var res = []
        full.forEach(function (k) {
          var ent = entities.get(k)
          var parentChecked = ent.parentKey != null && full.has(ent.parentKey)
          if (!parentChecked) res.push(k)
        })
        return res
      }
      return Array.from(full)
    },

    onCheck(key) {
      var ent = this.keyEntities.get(key)
      if (!ent || ent.disabled) return

      if (this.checkStrictly) {
        var arr = this.rawValues.slice()
        var i = arr.indexOf(key)
        if (i === -1) arr.push(key)
        else arr.splice(i, 1)
        this.commit(arr)
        return
      }

      var current = this.checkedLeafKeys
      var targets = this.getLeafDescendants(key)
      var fullyChecked =
        targets.length > 0 &&
        targets.every(function (l) {
          return current.has(l)
        })

      var next = new Set(current)
      if (fullyChecked) {
        targets.forEach(function (l) {
          next.delete(l)
        })
      } else {
        targets.forEach(function (l) {
          next.add(l)
        })
      }
      this.commit(this.deriveStored(next))
    },

    handleDeselect(value) {
      if (this.checkable) {
        this.onCheck(value)
        return
      }
      if (this.isMultiple) {
        this.commit(
          this.rawValues.filter(function (v) {
            return v !== value
          })
        )
      } else {
        this.commit(null)
      }
    },

    handleClear() {
      this.commit(this.isMultiple ? [] : null)
      this.searchValue = ''
    }
  }
}
</script>
