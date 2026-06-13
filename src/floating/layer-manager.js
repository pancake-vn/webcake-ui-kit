// Monotonic z-index counter shared across every floating component.
// Each opening of a Menu / Dropdown / Select calls nextZIndex() and applies
// the result inline. Closing does NOT decrement — keeping the counter
// monotonic avoids fights between concurrent opens (matches Radix UI's
// approach).

const BASE = 1000
let _counter = BASE

export function nextZIndex() {
  _counter++
  return _counter
}

export function currentZIndex() {
  return _counter
}

// Ensure subsequent nextZIndex() calls return values above `n`.
// Call this when a layer (e.g. Dialog) opens with an explicit z-index so that
// floating panels inside it always land on top.
export function bumpTo(n) {
  const v = Number(n)
  if (!isNaN(v) && v > _counter) _counter = v
}

// Test helper — reset between specs.
export function _reset() {
  _counter = BASE
}
