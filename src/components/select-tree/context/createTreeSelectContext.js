export function createTreeSelectContext() {
  return {
    // Danh sách node phẳng (đã lọc theo expand/search) để TreeList render
    flattenNodes: [],
    // Trạng thái checkbox (cascade) — Set các key
    checkedKeys: new Set(),
    halfCheckedKeys: new Set(),
    // Highlight cho mode single/multiple (không checkbox) — Set các key
    selectedKeys: new Set(),
    // Flags
    checkable: false,
    multiple: false,
    treeNodeSelectable: true,
    actions: {
      onSelect: null,
      onExpand: null,
      onCheck: null
    }
  }
}
