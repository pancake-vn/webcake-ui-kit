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

// Test helper — reset between specs.
export function _reset() {
  _counter = BASE
}
