---
name: vue-dual-component
description: Use when authoring or editing a component in src/components/ for the webcake-ui-kit. Enforces the Vue 2 + Vue 3 dual-compatibility rules (pure Options API, raw SFC, single-root template) and the registration/testing steps required by this repo. Trigger on any "tạo component / thêm component / sửa component / new component / add component" request, or any edit under src/components/*.vue or src/index.js.
---

# Building dual-compat (Vue 2 + Vue 3) components for webcake-ui-kit

This package ships **raw `.vue` files** (see root `package.json` → `"build": "echo 'No need to build - shipping raw SFC'"` and `"main": "src/index.js"`). The same SFC must compile under Vue 2.7 (playground-vue2, vue-loader 15) and Vue 3.4 (playground-vue3, @vitejs/plugin-vue). Every rule below exists to keep that contract.

## Hard rules — DO

1. **Pure Options API only.** `data()`, `props`, `computed`, `methods`, `watch`, lifecycle hooks. No `setup()`, no `<script setup>`, no `defineComponent`, no Composition API imports. The package description (`package.json`) declares this explicitly.
2. **Single root element in `<template>`.** Vue 2 rejects fragments. If you need siblings, wrap in a `<div>` or `<span>`.
3. **Always declare `name`** on the component (matches existing `Button.vue`).
4. **Always declare `emits: [...]`** for every event you `$emit`. Vue 2.7 accepts and ignores it; Vue 3 needs it for proper `$attrs` separation and devtools.
5. **Use `<style scoped>`** (matches existing `Button.vue`). Class names use the `ui-<component>` / `ui-<component>--<modifier>` BEM-ish pattern from `Button.vue`.
6. **Validate every prop** with `type` + `default` + (when enum-like) `validator`. Mirror the Button.vue style.
7. **Register the new component** in `src/index.js` as a named export: `export { default as Foo } from './components/Foo.vue'`.

## Hard rules — DON'T

These either break Vue 2, break Vue 3, or change the public surface in incompatible ways:

- ❌ `<script setup>` / `setup()` / `ref` / `reactive` / `computed()` from `vue` — Composition API is banned per project description.
- ❌ Multiple root nodes in template (Vue 3 fragments) — breaks Vue 2.
- ❌ `v-model:argName="x"` or multiple v-models — Vue 3 only. If you must support model binding, use a single default v-model and emit `input` (Vue 2 default) **and** `update:modelValue` (Vue 3 default). Prefer exposing `value` prop + `@change` event instead of v-model when feasible.
- ❌ `Teleport`, `Suspense`, `defineAsyncComponent`, `<KeepAlive>` with Vue-3-only options — Vue 3 only.
- ❌ Vue 2 filters (`{{ x | foo }}`) — removed in Vue 3.
- ❌ `.native` event modifier — removed in Vue 3. Components forward events explicitly via `@click="$emit('click', $event)"`.
- ❌ `$listeners` — removed in Vue 3 (merged into `$attrs`). Don't read it.
- ❌ Reading `class` / `style` off `$attrs` — Vue 3 includes them, Vue 2 does not. Behavior diverges.
- ❌ Functional components via `functional: true` SFC attribute — semantics changed; just write a normal component.
- ❌ Global Vue APIs: `Vue.extend`, `Vue.observable`, `Vue.set`, `Vue.delete`, `Vue.nextTick` (use `this.$nextTick`).
- ❌ `inheritAttrs: false` combined with manual `v-bind="$attrs"` unless you've thought through the class/style divergence above.
- ❌ Build-time-only features (CSS Modules `<style module>` is fine in both, but PostCSS plugins, TS in `<script lang="ts">`, JSX, etc. require consumers to have those loaders — keep SFC plain JS + plain CSS).

## Required SFC skeleton

Copy this when creating a new component. It mirrors `src/components/Button.vue`:

```vue
<template>
  <div :class="['ui-foo', `ui-foo--${variant}`]">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Foo',
  props: {
    variant: {
      type: String,
      default: 'default',
      validator: v => ['default', 'alt'].includes(v)
    }
  },
  emits: ['change'],
  methods: {
    onChange(e) {
      this.$emit('change', e)
    }
  }
}
</script>

<style scoped>
.ui-foo { /* base */ }
.ui-foo--default { /* variant */ }
.ui-foo--alt { /* variant */ }
</style>
```

## Workflow when adding/editing a component

1. Create/edit `src/components/<Name>.vue` following the skeleton.
2. Add the export to `src/index.js`.
3. Verify Vue 3 in the storybook or vue3 playground: `npm run dev:vue3` (from repo root).
4. Verify Vue 2 in the vue2 playground: `npm run dev:vue2` (from repo root). **Both must render** — Vue 2 is the easier one to break (fragments, Composition API, etc.).
5. If first-time setup, the playgrounds need `npm i` inside their own folders — see README. Note: `playground-vue2` uses webpack 4 + vue-loader 15 + vue-template-compiler 2.7, which require Node 14 (per README "Requirement"). If `npm i` fails on a newer Node, that's the cause — don't try to upgrade webpack/vue-loader to "fix" it.

## Quick self-check before declaring done

Run through this list mentally against your diff:

- [ ] Template has exactly one root element.
- [ ] No `setup`, no `<script setup>`, no `import { ref, ... } from 'vue'`.
- [ ] `name`, `props` (validated), `emits` declared.
- [ ] No banned APIs from the DON'T list.
- [ ] New component is exported from `src/index.js`.
- [ ] Tested visually in **both** `dev:vue2` and `dev:vue3` (or explicitly told the user one playground is unavailable and why).

## When the rules conflict with a feature request

If the user asks for something only Vue 3 supports (e.g. `<Teleport>`, multiple v-models, fragments), stop and tell them — don't silently produce code that will break Vue 2. Offer the closest dual-compat alternative (e.g. a single v-model with both `input` and `update:modelValue` emits; a portal-like pattern via `appendChild` in `mounted`; a wrapper `<div>` for fragment cases).
