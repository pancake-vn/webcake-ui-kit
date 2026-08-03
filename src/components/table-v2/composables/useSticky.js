export function computeOffsets(columns, columnWidths) {
  var left = {}
  var right = {}
  var leftAcc = 0
  var rightAcc = 0

  for (var i = 0; i < columns.length; i++) {
    var col = columns[i]
    if (col.fixed === 'left') {
      left[col.key] = leftAcc
      leftAcc += columnWidths.get(col.key) || parseWidth(col.width) || 0
    }
  }

  for (var j = columns.length - 1; j >= 0; j--) {
    var colR = columns[j]
    if (colR.fixed === 'right') {
      right[colR.key] = rightAcc
      rightAcc += columnWidths.get(colR.key) || parseWidth(colR.width) || 0
    }
  }

  return { left: left, right: right }
}

function parseWidth(width) {
  if (!width) return 0
  if (typeof width === 'number') return width
  var n = parseInt(width, 10)
  return isNaN(n) ? 0 : n
}
