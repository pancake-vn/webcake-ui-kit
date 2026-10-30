export function flattenRecords(source, rowKey, childrenField, expandedKeys) {
  var result = []
  var stack = []

  for (var i = source.length - 1; i >= 0; i--) {
    stack.push({ record: source[i], indent: 0, parentKey: null })
  }

  while (stack.length > 0) {
    var item = stack.pop()
    var record = item.record
    var indent = item.indent
    var children = record[childrenField]
    var hasChildren = Array.isArray(children) && children.length > 0
    var key = record[rowKey]

    var flatRecord = Object.assign({}, record, {
      __indent__: indent,
      __hasChildren__: hasChildren,
      __key__: key,
      __parentKey__: item.parentKey
    })
    result.push(flatRecord)

    if (hasChildren && expandedKeys.has(String(key))) {
      for (var j = children.length - 1; j >= 0; j--) {
        stack.push({ record: children[j], indent: indent + 1, parentKey: key })
      }
    }
  }

  return result
}

export function collectAllKeys(source, rowKey, childrenField) {
  var keys = new Set()
  var stack = source.slice()
  while (stack.length > 0) {
    var record = stack.pop()
    var children = record[childrenField]
    if (Array.isArray(children) && children.length > 0) {
      keys.add(String(record[rowKey]))
      for (var i = 0; i < children.length; i++) stack.push(children[i])
    }
  }
  return keys
}

// Returns string keys of all descendants of the node identified by targetKey.
export function collectDescendantKeys(source, rowKey, childrenField, targetKey) {
  var keys = []
  var findStack = source.slice()
  var targetRecord = null
  while (findStack.length > 0) {
    var r = findStack.pop()
    if (String(r[rowKey]) === String(targetKey)) {
      targetRecord = r
      break
    }
    var ch = r[childrenField]
    if (Array.isArray(ch) && ch.length > 0) {
      for (var i = 0; i < ch.length; i++) findStack.push(ch[i])
    }
  }
  if (!targetRecord) return keys
  var descStack = []
  var rootCh = targetRecord[childrenField]
  if (Array.isArray(rootCh)) {
    for (var k = 0; k < rootCh.length; k++) descStack.push(rootCh[k])
  }
  while (descStack.length > 0) {
    var desc = descStack.pop()
    keys.push(String(desc[rowKey]))
    var descCh = desc[childrenField]
    if (Array.isArray(descCh) && descCh.length > 0) {
      for (var j = 0; j < descCh.length; j++) descStack.push(descCh[j])
    }
  }
  return keys
}

function clampNum(n, min, max) {
  return Math.max(min, Math.min(n, max))
}

// Deep-clone a nested record list so the children arrays are new references.
function deepCloneTree(nodes, childrenField) {
  return nodes.map(function (n) {
    var clone = Object.assign({}, n)
    var ch = n[childrenField]
    if (Array.isArray(ch)) clone[childrenField] = deepCloneTree(ch, childrenField)
    return clone
  })
}

// Remove (and return) the node with `key`, wherever it sits in the tree. Mutates `tree`.
function removeNodeFromTree(tree, key, rowKey, childrenField) {
  var removed = null
  function walk(arr) {
    for (var i = 0; i < arr.length; i++) {
      if (String(arr[i][rowKey]) === String(key)) {
        removed = arr.splice(i, 1)[0]
        return true
      }
      var ch = arr[i][childrenField]
      if (Array.isArray(ch) && ch.length > 0 && walk(ch)) return true
    }
    return false
  }
  walk(tree)
  return removed
}

// Resolve the children array of `parentKey` (null → root array). Mutates tree to add [] if absent.
function findChildrenArr(tree, parentKey, rowKey, childrenField) {
  if (parentKey == null) return tree
  var stack = tree.slice()
  while (stack.length > 0) {
    var n = stack.pop()
    if (String(n[rowKey]) === String(parentKey)) {
      if (!Array.isArray(n[childrenField])) n[childrenField] = []
      return n[childrenField]
    }
    var ch = n[childrenField]
    if (Array.isArray(ch) && ch.length > 0) {
      for (var i = 0; i < ch.length; i++) stack.push(ch[i])
    }
  }
  return null
}

// Full tree drag-and-drop using a horizontal-offset depth projection (dnd-kit model).
// `display` is the visible flat list (rows carry __key__/__indent__/__parentKey__);
// oldIndex/newIndex are flat positions from SortableJS; dragOffset is the horizontal
// pointer delta in px; indentSize is px per depth level. The dragged node keeps its
// whole subtree. Returns a new nested source, or null for a no-op (e.g. drop into self).
export function moveTreeNodeByDrop(display, source, rowKey, childrenField, oldIndex, newIndex, dragOffset, indentSize) {
  if (oldIndex === newIndex) return null
  var active = display[oldIndex]
  if (!active) return null
  var activeKey = active.__key__

  // Mark the dragged node + all descendants so we can skip them when reading neighbours.
  var subtree = {}
  subtree[String(activeKey)] = true
  var descendants = collectDescendantKeys(source, rowKey, childrenField, activeKey)
  for (var d = 0; d < descendants.length; d++) subtree[descendants[d]] = true

  // Dropping onto a row inside the dragged subtree is meaningless.
  var overRow = display[newIndex]
  if (overRow && subtree[String(overRow.__key__)]) return null

  // Visual order after moving just the active row to newIndex.
  var V = display.slice()
  V.splice(oldIndex, 1)
  V.splice(newIndex, 0, active)
  var pos = newIndex

  // Nearest visible neighbours above/below the drop slot, skipping the dragged subtree.
  var prevItem = null
  for (var p = pos - 1; p >= 0; p--) {
    if (!subtree[String(V[p].__key__)]) {
      prevItem = V[p]
      break
    }
  }
  var nextItem = null
  for (var q = pos + 1; q < V.length; q++) {
    if (!subtree[String(V[q].__key__)]) {
      nextItem = V[q]
      break
    }
  }

  // Project a target depth from the horizontal drag offset, clamped by the neighbours.
  var step = indentSize || 28
  var dragDepth = Math.round((dragOffset || 0) / step)
  var projectedDepth = (active.__indent__ || 0) + dragDepth
  var maxDepth = prevItem ? prevItem.__indent__ + 1 : 0
  var minDepth = nextItem ? nextItem.__indent__ : 0
  var depth = clampNum(projectedDepth, minDepth, maxDepth)

  // Resolve new parent + the sibling to insert after, from depth vs prevItem.
  var parentKey, insertAfterKey
  if (!prevItem) {
    parentKey = null
    insertAfterKey = null
  } else if (depth > prevItem.__indent__) {
    parentKey = prevItem.__key__
    insertAfterKey = null
  } else if (depth === prevItem.__indent__) {
    parentKey = prevItem.__parentKey__
    insertAfterKey = prevItem.__key__
  } else {
    var anchor = null
    for (var r = pos - 1; r >= 0; r--) {
      if (subtree[String(V[r].__key__)]) continue
      if (V[r].__indent__ === depth) {
        anchor = V[r]
        break
      }
    }
    parentKey = anchor ? anchor.__parentKey__ : null
    insertAfterKey = anchor ? anchor.__key__ : null
  }

  // Never reparent a node under itself or one of its descendants.
  if (parentKey != null && subtree[String(parentKey)]) return null

  var tree = deepCloneTree(source, childrenField)
  var node = removeNodeFromTree(tree, activeKey, rowKey, childrenField)
  if (!node) return null

  var arr = findChildrenArr(tree, parentKey, rowKey, childrenField)
  if (!arr) return null

  if (insertAfterKey == null) {
    arr.unshift(node)
  } else {
    var at = -1
    for (var s = 0; s < arr.length; s++) {
      if (String(arr[s][rowKey]) === String(insertAfterKey)) {
        at = s
        break
      }
    }
    if (at === -1) arr.push(node)
    else arr.splice(at + 1, 0, node)
  }

  return tree
}
