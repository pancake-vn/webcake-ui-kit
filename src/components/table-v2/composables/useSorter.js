export function sortData(source, columnKey, order) {
  if (!columnKey || !order) return source
  var arr = source.slice()
  arr.sort(function (a, b) {
    var av = a[columnKey]
    var bv = b[columnKey]
    if (av === bv) return 0
    var asc = av < bv ? -1 : 1
    return order === 'ascend' ? asc : -asc
  })
  return arr
}
