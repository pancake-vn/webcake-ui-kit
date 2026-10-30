import { flattenRecords, moveTreeNodeByDrop } from '../src/components/table/composables/useFlattenRecords.js'

// Base tree for every case:
//   A
//   ├── B
//   └── C
//       ├── D
//       └── E
//   F
function makeSource() {
  return [
    {
      key: 'A',
      children: [{ key: 'B' }, { key: 'C', children: [{ key: 'D' }, { key: 'E' }] }]
    },
    { key: 'F' }
  ]
}

const EXPANDED = new Set(['A', 'C'])

// Serialize a nested source into "A(B,C(D,E)),F" so assertions read like the tree.
function serialize(nodes) {
  return nodes
    .map(n => {
      const ch = n.children
      if (Array.isArray(ch) && ch.length) return n.key + '(' + serialize(ch) + ')'
      return n.key
    })
    .join(',')
}

function display(source) {
  return flattenRecords(source, 'key', 'children', EXPANDED)
}

// indentSize is 28px throughout (matches the component default).
function move(source, oldIndex, newIndex, dragOffset) {
  return moveTreeNodeByDrop(display(source), source, 'key', 'children', oldIndex, newIndex, dragOffset, 28)
}

describe('moveTreeNodeByDrop — tree drag & drop', () => {
  it('flat display order + metadata is correct', () => {
    const d = display(makeSource())
    expect(d.map(r => r.__key__)).toEqual(['A', 'B', 'C', 'D', 'E', 'F'])
    expect(d.map(r => r.__indent__)).toEqual([0, 1, 1, 2, 2, 0])
    expect(d.map(r => r.__parentKey__)).toEqual([null, 'A', 'A', 'C', 'C', null])
  })

  // Case 1 — reorder siblings (same parent)
  it('reorders C before B under A', () => {
    const tree = move(makeSource(), 2, 1, 0)
    expect(serialize(tree)).toBe('A(C(D,E),B),F')
  })

  it('reorders E before D under C', () => {
    const tree = move(makeSource(), 4, 3, 0)
    expect(serialize(tree)).toBe('A(B,C(E,D)),F')
  })

  it('reorders F before A at root', () => {
    const tree = move(makeSource(), 5, 0, 0)
    expect(serialize(tree)).toBe('F,A(B,C(D,E))')
  })

  // Case 3 — drop inside (nest via rightward offset)
  it('nests B inside C when dragged right', () => {
    const tree = move(makeSource(), 1, 2, 28)
    expect(serialize(tree)).toBe('A(C(B,D,E)),F')
  })

  it('nests F inside A when dragged right onto A', () => {
    // F (idx 5) dropped right after A (idx 1 slot) with one level of right offset.
    const tree = move(makeSource(), 5, 1, 28)
    expect(serialize(tree)).toBe('A(F,B,C(D,E))')
  })

  // Case 2 — change parent / outdent to root
  it('outdents D to root level when dragged left past the subtree', () => {
    const tree = move(makeSource(), 3, 5, -84)
    expect(serialize(tree)).toBe('A(B,C(E)),F,D')
  })

  // Case 4 — moving a node carries its whole subtree
  it('moves C with its D,E descendants to root after F', () => {
    const tree = move(makeSource(), 2, 5, -28)
    expect(serialize(tree)).toBe('A(B),F,C(D,E)')
  })

  // Guards
  it('is a no-op when dropping onto itself', () => {
    expect(move(makeSource(), 2, 2, 0)).toBeNull()
  })

  it('is a no-op when dropping a node into its own descendant', () => {
    // C (idx 2) dropped onto D (idx 3), one of its own children.
    expect(move(makeSource(), 2, 3, 0)).toBeNull()
  })
})
