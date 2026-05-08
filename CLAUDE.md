# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`webcake-ui-kit` is a Vue UI library that ships **raw `.vue` files** (no build step at the library level) and is consumed by both Vue 2 and Vue 3 apps. The package's `main` is `src/index.js` and `package.json` only includes `src/` in `files`. The "build" script is intentionally a no-op:

```
"build": "echo 'No need to build - shipping raw SFC'"
```

This shape is the central design constraint — every authoring decision flows from it.

## Dual-compat is the whole product

Components must compile under both Vue 2.7 (Options API era, vue-template-compiler) and Vue 3.4 (`@vitejs/plugin-vue`). Concretely:

- **Pure Options API only.** No `<script setup>`, no `setup()`, no Composition API imports. Per `package.json` description.
- **Single root element** in `<template>` (Vue 2 has no fragments).
- **Always declare `emits`** on the component — Vue 2.7 accepts and ignores it; Vue 3 needs it for `$attrs` separation.
- **Avoid Vue-3-only features** (`<Teleport>`, `<Suspense>`, `v-model:arg`, multi v-model) and **Vue-2-only features** (filters, `.native`, `$listeners`, `Vue.set`/`Vue.extend`).
- **`$attrs` divergence:** Vue 3's `$attrs` includes `class`/`style`, Vue 2's does not. Don't read these off `$attrs`.

Two project-scoped skills encode the workflow:

- `.claude/skills/vue-dual-component/SKILL.md` — full DO/DON'T list + SFC skeleton. Auto-loads on edits to `src/components/*.vue` or `src/index.js`.
- `.claude/skills/figma-to-component/SKILL.md` — orchestrates Figma → SFC: composes the Figma MCP (`mcp__plugin_figma_figma__*`) and the `figma:figma-implement-design` skill with the dual-compat rules above, then runs a review checklist. Triggers on prompts like "Implement this design from Figma. @<figma.com URL>".

## Adding a component

A new component touches **eight files** in one change — anything less and `test:build` is meaningless:

1. `src/components/<name>/<Name>.vue` — the SFC. Single-root template, Options API, validated props, declared `emits`, BEM `ui-<name>--<modifier>`. **No inline `<style>` block** — link the CSS file via `<style src="./<name>.css" scoped></style>`.
1b. `src/components/<name>/<name>.css` — the actual CSS rules (folder name lowercase, Vue file PascalCase, CSS file lowercase).
2. `src/index.js` — named export, alphabetical: `export { default as <Name> } from './components/<name>/<Name>.vue'`.
3. `src/styles/*.css` — add any missing semantic tokens (most are already there).
4. `playground-vue3/src/main.js` — register globally with `app.component(...)`.
5. `playground-vue2/src/main.js` — register globally with `Vue.component(...)`.
6. `playground-vue3/src/App.vue` — append a showcase `<section>` exercising every variant.
7. `playground-vue2/src/App.vue` — append the **same** section (keep the two App.vue in sync).

Then `npm run test:build` to compile-check both versions, and `dev:vue3` / `dev:vue2` for visual.

The skill at `.claude/skills/figma-to-component/SKILL.md` automates steps 1–7 from a Figma URL and runs `test:build` itself before handing off.

## Commands

All commands run from the repo root unless noted.

```
npm run dev:vue3        # Vite playground (port 8001) — Vue 3.4
npm run dev:vue2        # webpack-dev-server (port 8080) — Vue 2.7
npm run preview         # both dev servers in parallel via concurrently — open both ports side-by-side
npm run dev             # bare Vite at root (rarely used; no entry HTML)
npm run build           # no-op, prints reminder

npm run build:vue3      # production build of playground-vue3 (compile check)
npm run build:vue2      # production build of playground-vue2 (compile check)
npm run test:build      # both builds in parallel via concurrently — Tier 1 dual-compat compile check
```

`preview` is the daily driver while authoring components: it brings up both Vue 2 and Vue 3 dev servers at once with HMR, prefixed output (`[vue3]` / `[vue2]`), and Ctrl+C kills both. Open `localhost:8001` (Vue 3) and `localhost:8080` (Vue 2) side-by-side to spot dual-compat regressions in real time. No `--kill-others-on-fail` here — if one dev server crashes the other keeps running so you don't lose state on the working side.

`test:build` is the cheapest CI signal: runs both vite and webpack builds in parallel via `concurrently` (with `--kill-others-on-fail` so one failure stops the other). If either fails, the component has a compile-time issue (banned API, fragment, `:deep()`, syntax) on that Vue version. It only catches what compilers see — runtime warnings (prop validators, slot quirks) still need visual verification via `dev:vue3` / `dev:vue2`.

Vite-side gotcha encoded in `playground-vue3/vite.config.js`: `resolve.dedupe: ['vue']` is required because the lib is aliased to `../src` (which has no `node_modules`). Without dedupe, Rollup fails to resolve the `vue` import that `@vitejs/plugin-vue` injects when compiling SFCs from outside the playground's tree.

For `test:build` to be meaningful, the showcase pages in `playground-vue{2,3}/src/App.vue` must actually mount the component being tested. When adding a new component, append it to both showcase pages so the build "touches" it.

First-time setup for each sandbox (each has its own `node_modules`):

```
cd playground-vue2 && npm i
cd playground-vue3 && npm i
cd storybook-vue3 && npm i      # Storybook 6.5, Vue 3.2
```

Storybook (from `storybook-vue3/`):

```
npm run storybook               # start-storybook -p 6006
npm run build-storybook
```

There is no unit test runner, no linter, and no typecheck configured. Verification has two layers: `npm run test:build` for compile-time checks (Tier 1), and visual verification via `dev:vue3` / `dev:vue2` for runtime/visual checks.

## How the sandboxes resolve the library

This affects whether your edits to `src/` show up live:

- **`playground-vue3`** aliases `webcake-ui-kit` → `../src` in `vite.config.js`. Edits to `src/` hot-reload directly.
- **`playground-vue2`** installs `webcake-ui-kit` as `"file:.."` in `package.json` (no webpack alias to `../src`). Depending on npm's link/copy behavior, edits may require re-running `npm i` inside `playground-vue2/` to propagate. The webpack config also aliases `vue$` → `vue/dist/vue.esm.js` (runtime+compiler build) — needed because `main.js` registers components globally.
- **`storybook-vue3`** has its own setup under `storybook-vue3/stories/`.

## Environment requirements (from README)

- **Node 14** and **Python ≤ 3.10**. These constraints come from `playground-vue2` (webpack 4 + vue-loader 15 + their native deps). If `npm i` fails on a newer Node, that's why — don't try to "fix" it by upgrading webpack/vue-loader; the pin is intentional.

## Repository layout (orientation only)

- `src/` — the published library (raw SFC + `index.js` + `styles/`).
- `playground-vue2/` — webpack 4 sandbox for Vue 2.7.
- `playground-vue3/` — Vite sandbox for Vue 3.4.
- `storybook-vue3/` — Storybook 6.5 for Vue 3.2.
- `vite.config.js` (root) — minimal, only used by the rarely-run root `dev`.
