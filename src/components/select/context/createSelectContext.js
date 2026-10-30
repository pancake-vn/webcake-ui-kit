export function createSelectContext() {
  return {
    options: [],
    valueOptions: new Map(),
    rawValues: new Map(),
    mode: '',
    displayValues: [],
    actions: {
      onSelect: null
    }
  }
}
