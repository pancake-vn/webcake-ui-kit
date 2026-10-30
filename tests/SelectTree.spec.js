import { WkSelectTree } from '../src/index.js'
import { mount } from './_utils.js'

const TREE = [
  {
    value: 'fe',
    label: 'Frontend',
    children: [
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue' }
    ]
  },
  {
    value: 'be',
    label: 'Backend',
    children: [
      { value: 'node', label: 'Node' },
      { value: 'py', label: 'Python', disabled: true }
    ]
  }
]

const keysOf = nodes => nodes.map(n => n.key)

afterEach(() => {
  document.body.innerHTML = ''
})

describe('WkSelectTree', () => {
  // --- flatten / expand ---

  it('renders only root nodes when collapsed', () => {
    const w = mount(WkSelectTree, { props: { treeData: TREE } })
    expect(keysOf(w.vm.flattenNodes)).toEqual(['fe', 'be'])
    expect(w.vm.flattenNodes.every(n => n.level === 0)).toBe(true)
  })

  it('marks parents as having children and non-leaf', () => {
    const w = mount(WkSelectTree, { props: { treeData: TREE } })
    const fe = w.vm.flattenNodes.find(n => n.key === 'fe')
    expect(fe.hasChildren).toBe(true)
    expect(fe.isLeaf).toBe(false)
  })

  it('defaultExpandAll expands every parent', () => {
    const w = mount(WkSelectTree, { props: { treeData: TREE, defaultExpandAll: true } })
    expect(w.vm.expandedKeys).toEqual(expect.arrayContaining(['fe', 'be']))
    expect(keysOf(w.vm.flattenNodes)).toEqual(['fe', 'react', 'vue', 'be', 'node', 'py'])
  })

  it('onExpand toggles a key and emits tree-expand', () => {
    const w = mount(WkSelectTree, { props: { treeData: TREE } })
    w.vm.onExpand('fe')
    expect(w.vm.expandedKeys).toEqual(['fe'])
    expect(w.emitted('tree-expand')[0][0]).toEqual(['fe'])
    expect(keysOf(w.vm.flattenNodes)).toEqual(['fe', 'react', 'vue', 'be'])
    w.vm.onExpand('fe')
    expect(w.vm.expandedKeys).toEqual([])
  })

  // --- single select ---

  it('single select commits the value and emits change + select', () => {
    const w = mount(WkSelectTree, { props: { treeData: TREE } })
    w.vm.onSelect('react')
    expect(w.emitted('update:value')[0][0]).toBe('react')
    expect(w.emitted('change')[0][0]).toBe('react')
    expect(w.emitted('select')[0][0]).toBe('react')
  })

  it('ignores clicks on disabled nodes', () => {
    const w = mount(WkSelectTree, { props: { treeData: TREE } })
    w.vm.onSelect('py')
    expect(w.emitted('update:value')).toBeFalsy()
  })

  it('builds displayValues (value → label) from current value', () => {
    const w = mount(WkSelectTree, { props: { treeData: TREE, value: 'react' } })
    expect(w.vm.displayValues).toEqual([{ value: 'react', label: 'React' }])
  })

  // --- multiple ---

  it('multiple select adds a key to the array', () => {
    const w = mount(WkSelectTree, { props: { treeData: TREE, multiple: true } })
    w.vm.onSelect('react')
    expect(w.emitted('update:value')[0][0]).toEqual(['react'])
  })

  it('multiple select toggles an already-selected key off', () => {
    const w = mount(WkSelectTree, { props: { treeData: TREE, multiple: true, value: ['react'] } })
    w.vm.onSelect('react')
    expect(w.emitted('update:value')[0][0]).toEqual([])
  })

  // --- checkable (cascade) ---

  it('treeCheckable: checking a parent checks all leaf descendants (SHOW_CHILD default)', () => {
    const w = mount(WkSelectTree, { props: { treeData: TREE, treeCheckable: true } })
    w.vm.onCheck('fe')
    expect(w.emitted('update:value')[0][0]).toEqual(['react', 'vue'])
  })

  it('treeCheckable: checkState marks the parent checked when all children are checked', () => {
    const w = mount(WkSelectTree, { props: { treeData: TREE, treeCheckable: true, value: ['react', 'vue'] } })
    expect(w.vm.checkState.checked.has('fe')).toBe(true)
  })

  it('treeCheckable: half-checks a parent when only some children are checked', () => {
    const w = mount(WkSelectTree, { props: { treeData: TREE, treeCheckable: true, value: ['react'] } })
    expect(w.vm.checkState.half.has('fe')).toBe(true)
    expect(w.vm.checkState.checked.has('fe')).toBe(false)
  })

  it('checkStrictly: toggles only the clicked key, no cascade', () => {
    const w = mount(WkSelectTree, { props: { treeData: TREE, treeCheckable: true, checkStrictly: true } })
    w.vm.onCheck('fe')
    expect(w.emitted('update:value')[0][0]).toEqual(['fe'])
  })

  // --- showCheckedStrategy ---

  it('SHOW_PARENT collapses fully-checked children into the parent key', () => {
    const w = mount(WkSelectTree, {
      props: { treeData: TREE, treeCheckable: true, showCheckedStrategy: 'SHOW_PARENT' }
    })
    w.vm.onCheck('fe')
    expect(w.emitted('update:value')[0][0]).toEqual(['fe'])
  })

  it('SHOW_ALL stores both children and parent keys', () => {
    const w = mount(WkSelectTree, { props: { treeData: TREE, treeCheckable: true, showCheckedStrategy: 'SHOW_ALL' } })
    w.vm.onCheck('fe')
    expect(w.emitted('update:value')[0][0]).toEqual(expect.arrayContaining(['react', 'vue', 'fe']))
  })

  // --- search ---

  it('onSearch filters nodes and keeps the ancestor path, auto-expanding it', () => {
    const w = mount(WkSelectTree, { props: { treeData: TREE } })
    w.vm.onSearch('react')
    expect(w.vm.searchValue).toBe('react')
    expect(keysOf(w.vm.flattenNodes)).toEqual(['fe', 'react'])
  })

  it('onSearch with no match yields an empty flatten list', () => {
    const w = mount(WkSelectTree, { props: { treeData: TREE } })
    w.vm.onSearch('zzz')
    expect(w.vm.flattenNodes).toEqual([])
  })

  // --- clear / deselect ---

  it('handleClear resets to null in single mode', () => {
    const w = mount(WkSelectTree, { props: { treeData: TREE, value: 'react' } })
    w.vm.handleClear()
    expect(w.emitted('update:value')[0][0]).toBeNull()
    expect(w.vm.searchValue).toBe('')
  })

  it('handleClear resets to [] in multiple mode', () => {
    const w = mount(WkSelectTree, { props: { treeData: TREE, multiple: true, value: ['react'] } })
    w.vm.handleClear()
    expect(w.emitted('update:value')[0][0]).toEqual([])
  })

  it('handleDeselect removes a value in multiple mode', () => {
    const w = mount(WkSelectTree, { props: { treeData: TREE, multiple: true, value: ['react', 'vue'] } })
    w.vm.handleDeselect('react')
    expect(w.emitted('update:value')[0][0]).toEqual(['vue'])
  })
})
