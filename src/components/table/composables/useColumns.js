export function flattenColumns(columns) {
  return (columns || []).map(function (col, i) {
    return {
      key: col.key || col.dataIndex || String(i),
      type: col.type || null,
      dataIndex: col.dataIndex || '',
      title: col.title || '',
      width: col.width || null,
      align: col.align == 'left' ? null : col.align,
      fixed: col.fixed || null,
      ellipsis: col.ellipsis || false,
      customCell: col.customCell || null,
      customHeaderCell: col.customHeaderCell || null,
      minWidth: col.minWidth || 50,
      maxWidth: col.maxWidth || Infinity,
      resizable: col.resizable || false
    }
  })
}
