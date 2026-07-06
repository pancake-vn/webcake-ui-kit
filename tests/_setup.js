// jsdom does not implement ResizeObserver — stub it so components that call
// new ResizeObserver(...) in mounted() don't throw in the test environment.
if (typeof ResizeObserver === 'undefined') {
  global.ResizeObserver = class ResizeObserver {
    constructor(cb) {
      this._cb = cb
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}
