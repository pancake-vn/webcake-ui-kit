---
name: component-test
description: Use when authoring or updating unit tests for components in src/components/ for webcake-ui-kit. Produces a dual-compat spec file under tests/ that runs against both Vue 2.7 (Vitest + @vitejs/plugin-vue2) and Vue 3.4 (Vitest + @vitejs/plugin-vue). Trigger on "viết test / thêm test / test component / write tests for X" and on any new file under src/components/*.vue that lacks a matching tests/*.spec.js.
---

# Writing dual-compat unit tests for webcake-ui-kit components

Specs live at the repo root in `tests/` and are executed by **two** Vitest runners — one inside `playground-vue2/` (Vue 2.7 + `@vue/test-utils@^1`) and one inside `playground-vue3/` (Vue 3.4 + `@vue/test-utils@^2`). The same spec file must pass under both. That's the whole bar.

Run with `npm test` from repo root. Individual lanes: `npm run test:vue2`, `npm run test:vue3`.

## Hard rules — DO

1. **One spec per component**, named `tests/<Name>.spec.js` (PascalCase matching the `src/index.js` export). E.g. `Button.vue` → `tests/Button.spec.js`.
2. **Import the component from `'../src/index.js'`** (the public entry), not from its folder. This catches export-wiring regressions for free.
3. **Use the local `mount` shim from `./_utils.js`**, never `@vue/test-utils` directly. The shim normalizes the v1 vs v2 API divergence (`propsData` vs `props`).
4. **Pass props via `props: { ... }`** in the mount options — the shim translates to `propsData` automatically for Vue 2.
5. **Slots: prefer string templates** (`slots: { default: 'text' }`) over JSX/render fns. Both runtimes accept the string form; JSX would need separate Vue 2 setup.
6. **Assert what users observe**, not implementation details: rendered text (`w.text()`), classes (`w.classes()`), attributes (`w.attributes('type')`), emitted events (`w.emitted('click')`), DOM presence (`w.find('.foo').exists()`).
7. **Async DOM updates require `await`.** `await w.trigger('click')`, `await w.setProps({ ... })`, `await w.vm.$nextTick()`. Forgetting `await` is the #1 source of flake.
8. **Test the contract that's already declared on the component:** every entry in `props` (especially `validator`-restricted enums), every event in `emits`, every named slot, disabled/loading/error behavior. If a prop has 5 enum values, a `Matrix`-style test that loops them is fine — keep it terse.
9. **Wait for at least one full pass before declaring done.** Run `npm test` from repo root — Vue 2 and Vue 3 lanes run in parallel via `concurrently`. Both must exit 0.

## Hard rules — DON'T

- ❌ Import from `'../src/components/foo/Foo.vue'` directly — go through `'../src/index.js'`.
- ❌ Import `mount` from `'@vue/test-utils'` directly — use `'./_utils.js'`. Otherwise Vue 2 lane warns "Invalid prop type" because v1 misreads the `props` option as a prop-options schema.
- ❌ Add a per-spec runner config or Jest dependency. The two `vitest.config.js` files in each playground are the only test entry points.
- ❌ Test composition-API behavior (`setup`, `ref`, `reactive`). Components here are pure Options API — testing CSS pseudo-class behavior (`:hover`, `:focus-visible`) also doesn't belong in unit tests; that's visual / Storybook territory.
- ❌ Reach into `wrapper.vm` to inspect or mutate internal data. Drive the component through its public props and DOM events; assert on observable output. Exception: `wrapper.vm.$emit` listening is fine when there's no DOM trigger (e.g. testing a `provide`/`inject` parent–child contract).
- ❌ Mock the `webcake-ui-kit` resolution or stub child components for compound widgets (e.g. `AlertDialog` uses `Dialog` + `Button`). The real components are cheap; stubbing hides integration bugs.
- ❌ Snapshot tests. They drift, mask intent, and produce noisy diffs. Write explicit assertions instead.
- ❌ Hard-code element counts when a class/role/text query is available. `find('.ui-foo')` > `findAll('span').at(0)`.

## Spec skeleton

Copy verbatim, then edit:

```js
import { ComponentName } from '../src/index.js'
import { mount } from './_utils.js'

describe('ComponentName', () => {
  it('renders default state', () => {
    const w = mount(ComponentName, {
      props: {
        /* required defaults */
      }
    })
    expect(w.classes()).toContain('ui-component-name')
  })

  it('applies variant class', () => {
    const w = mount(ComponentName, { props: { variant: 'destructive' } })
    expect(w.classes()).toContain('ui-component-name--destructive')
  })

  it('emits change on interaction', async () => {
    const w = mount(ComponentName, {
      props: {
        /* ... */
      }
    })
    await w.trigger('click')
    expect(w.emitted('change')).toBeTruthy()
  })

  it('respects disabled', async () => {
    const w = mount(ComponentName, { props: { disabled: true } })
    await w.trigger('click')
    expect(w.emitted('change')).toBeFalsy()
  })
})
```

## Patterns for the harder cases

### v-model (legacy + Vue 3 form)

Components emit both `change` (Vue 2 default) and `update:modelValue` (Vue 3 default). Assert **both** are emitted when relevant:

```js
const w = mount(Checkbox, { props: { checked: false } })
await w.find('input').setChecked(true)
expect(w.emitted('change')).toBeTruthy()
expect(w.emitted('update:modelValue')).toBeTruthy()
```

### Named slots

Use string templates so both runtimes handle it identically:

```js
const w = mount(Button, {
  slots: { 'icon-left': '<svg class="my-icon"/>' }
})
expect(w.find('.my-icon').exists()).toBe(true)
```

### Provide / inject (parent–child contracts: Accordion, ToggleGroup, AlertDialog)

Mount the **parent** with the child in the default slot so the real `provide()` runs. Don't fake the injection.

```js
const w = mount(ToggleGroup, {
  props: { value: 'a' },
  slots: { default: '<button class="ui-toggle">a</button>' } // or compose real children via render
})
```

For compositions that need actual child components in slots, prefer mounting via a tiny wrapper component:

```js
const Harness = {
  components: { Accordion, AccordionItem },
  template: `<Accordion :default-open="['x']"><AccordionItem value="x" label="Hi">body</AccordionItem></Accordion>`
}
const w = mount(Harness)
```

### Teleport / `appendChild` to body (Dialog, AlertDialog)

`Dialog` `appendChild`s its root to `document.body` in `mounted()`. Two consequences for tests:

- `w.html()` may not contain the body — query `document.body` (jsdom) for assertions on visibility / content.
- Always `w.unmount()` (or `w.destroy()` in v1) at end-of-test to clean up the body, or wrap in `afterEach(() => document.body.innerHTML = '')`.

### Transitions

Vue 3 transitions are no-op in tests by default with `@vue/test-utils@2`. Vue 2 transitions may need `await w.vm.$nextTick()` after toggling open state. Assert on the underlying state (props/emitted events) when transitions get flaky — that's the contract.

## Coverage checklist for a "complete" spec

- [ ] Renders with default props (smoke test — first test).
- [ ] Every enum prop (`variant`, `size`, `roundness`, `layout`, etc.): assert at least one non-default value applies the expected class.
- [ ] Every event in `emits`: at least one test that triggers it and one that confirms it does **not** fire when disabled/loading/invalid.
- [ ] Every named slot: assert content surfaces in the rendered DOM.
- [ ] Boolean state classes: `disabled`, `loading`, `error`, `checked`/`active`/`open` — one assertion each.
- [ ] v-model contract (when applicable): emits both `change` and `update:modelValue` on user interaction; reads from `modelValue` when provided, falls back to legacy prop (`checked` / `value` / `open` / `active`) otherwise.

Aim for ~5–10 tests per component. More than 15 usually means you're testing CSS or framework behavior — trim.

## Workflow when adding/updating a spec

1. Read the component SFC to enumerate `props`, `emits`, and `<slot>`s.
2. Draft the spec at `tests/<Name>.spec.js` following the skeleton above.
3. Run `npm test` from repo root. If only one lane fails:
   - **Vue 2 fail only:** likely a v1/v2 API drift — verify the shim handled props (use `props:` in mount opts, never `propsData:`). Vue 2 also tends to print prop-validator warnings; treat them as real bugs in the test setup, not noise.
   - **Vue 3 fail only:** something Vue-3-specific (e.g. transitions/async timing). Add `await w.vm.$nextTick()` or assert on emitted events instead of post-transition DOM.
4. Fix and re-run until both lanes are green. The `concurrently` runner shows `[vue2]` / `[vue3]` prefixes.
5. `npm run lint` — must exit 0. The `tests/` override in `.eslintrc.cjs` exposes `jest`-style globals (`describe`/`it`/`expect`).

## When a component genuinely can't be unit-tested

A few legitimate cases where you should write **fewer / different** tests rather than force coverage:

- **Pure visual primitives** (`Divider` is just two CSS-driven classes): one render-and-classes test is enough.
- **Components that exist only as composition wrappers** (`AlertDialog` wraps `Dialog`): test the props it surfaces and events it forwards; don't re-test `Dialog`'s internals.
- **Body-mounting modals** (`Dialog`): test open/close state transitions, emitted events on mask click / Esc / cancel button, and `confirmLoading` plumbing. Don't try to assert on focus trap or scroll lock — those are integration-test territory.
