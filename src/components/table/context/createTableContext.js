export function createTableContext() {
  return {
    columns: {
      flat: [],
      leaf: []
    },

    rows: {
      customRow: () => {},
      customHeaderRow: () => {}
    },

    data: {
      source: [],
      display: [],
      loading: false,
      emptyText: ''
    },

    layout: {
      bordered: false,
      size: 'md',
      tableLayout: 'auto',
      scroll: null,
      rowKey: 'key',
      scrollBarWidth: 0,
      containerWidth: 0,
      columnWidths: new Map(),
      rowHeight: 50,
      headerHeight: 40,
      height: 0,
      hasSlotSelectionHeader: false
    },

    sort: {
      columnKey: null,
      order: null
    },

    selection: {
      selectedRowKeys: [],
      hideSelectAll: false,
      columnWidth: 0,
      type: '',
      checkAll: false,
      onChange: (_selectedRowKeys, _selectedRows) => {},
      onSelect: (_ecord, _selected, _selectedRows, _nativeEvent) => {},
      onSelectAll: (_selected, _selectedRows, _changeRows) => {},
      onSelectNone: () => {}
    },

    draggable: {
      enabled: false,
      enableAnimationFlip: false,
      columnWidth: 0,
      handleReorder: (_fromIndex, _toIndex, _dataSource) => {},
      draggingRecord: null,
      getPreviewEl: null
    },

    sticky: {
      leftOffsets: {},
      rightOffsets: {}
    },

    virtual: {
      enabled: false,
      startIndex: 0,
      endIndex: 0,
      offsetY: 0
    },

    tree: {
      childrenField: null,
      expandedKeys: [],
      indentSize: 28
    },

    actions: {
      sort: null,
      select: null,
      resize: null,
      expand: null,
      reorder: null
    }
  }
}
