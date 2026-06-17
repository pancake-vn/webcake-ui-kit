export const toCssSize = v => {
  if (v == null) return undefined
  return typeof v === 'number' ? `${v}px` : v
}
