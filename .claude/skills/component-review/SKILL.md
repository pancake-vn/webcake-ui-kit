---
name: component-review
description: Use when reviewing or verifying a webcake-ui-kit component before declaring it done — either after authoring a new component, after editing an existing one, or when the user explicitly asks to "review", "kiểm tra", "audit", or "verify" the latest component change. Also invoked as Phase 3 by the figma-to-component skill. Runs the full quality gate (static checks + builds + Storybook compile + visual instructions). Don't use this for code review of non-component files (general PR review).
---

# Component review — quality gate before "done"

This skill is the canonical post-authoring check for any webcake-ui-kit component. It runs in a fixed order so nothing gets skipped. The skill assumes:

- The component change is already on disk (skill verifies, doesn't author).
- The user wants a structured pass/fail report, not a vague "looks good".

## Step 0 — Identify the target

Determine which component(s) to review:

1. If the user named a component ("review Badge"), use that.
2. Otherwise, run `git status` and `git diff --name-only HEAD` from the repo root to find recently-touched files under `src/components/<name>/`. If multiple components changed, review each — but report them as separate sections.
3. If nothing has changed and no component is named, ask the user which component to review. Don't guess.

## Step 1 — File layout audit

For each target `<Name>` (PascalCase), verify the folder layout:

- [ ] `src/components/<name>/<Name>.vue` exists (lowercase folder, PascalCase Vue file).
- [ ] `src/components/<name>/<name>.css` exists (lowercase CSS file).
- [ ] The SFC's `<style>` block is exactly `<style src="./<name>.css" scoped></style>` — no inline rules, no `import './<name>.css'` from `<script>`.
- [ ] No leftover flat `src/components/<Name>.vue` (legacy migration artifact).

Flag any violation with the exact path so the user can fix.

## Step 2 — Dual-compat static check (the SFC)

Read the `.vue` file and grep/inspect for the following. Each `[ ]` is a fail-if-true item:

- [ ] **Single root in `<template>`** — no fragment / multiple top-level elements.
- [ ] No `<script setup>`. No `setup()` function. No `import { ref, computed, reactive, ... } from 'vue'`. (Composition API banned — pure Options API only.)
- [ ] `name`, `props`, `emits` all declared at the top level of the component object. `props` use `type` + `default` + (when enum) `validator`. `emits` is an array, even if empty.
- [ ] Every `$emit('foo', ...)` call has `'foo'` listed in `emits`.
- [ ] **No props for interaction states** — no `hovered`, `focused`, `pressed`, `active` (those are `:hover` / `:focus-visible` / `:active` CSS, not props). `selected` / `expanded` for logical state IS allowed.
- [ ] **Named-slot detection is dual-compat**: `!!((this.$scopedSlots && this.$scopedSlots['name']) || this.$slots['name'])`. Flag if you see only `this.$slots[...]` (misses Vue 2.6+ v-slot users).
- [ ] No banned APIs: `<Teleport>`, `<Suspense>`, `defineAsyncComponent`, `v-model:argName`, multi v-model, `Vue.set`, `Vue.extend`, `Vue.observable`, `.native` modifier, reading `$listeners`, reading `class` / `style` from `$attrs`, Vue 2 filters (`{{ x | foo }}`), `functional: true`, `<script lang="ts">`, JSX.

## Step 3 — CSS audit (the `.css` file)

Read the linked `.css` file:

- [ ] **Every value uses `var(--*)` from `src/styles/*.css`** — no inline hex (`#3b82f6`), no raw px values for spacing/radius/typography. Allowed exceptions: icon container sizes (e.g. `width: 12px` for slot wrappers), 1px borders.
- [ ] If the component needed a new semantic token, it was added to the right file: colors → `color_general.css` (mirror in `.dark`), spacing → `spacing.css`, radius → `border_radius.css`, typography → `typography.css`, shadows/effects → `shadow.css`. Not dumped into `index.css`.
- [ ] **No `:deep(...)`** function selector — Vue-3-only. Vue 2 uses `::v-deep`. Either use neither (recommended) or accept the divergence (not recommended).
- [ ] Interaction states use pseudo-classes: `:hover`, `:focus-visible` (with `outline: none` + `box-shadow: var(--shadow-focus-ring)`), `:active`. For destructive variants, `.ui-foo--destructive:focus-visible` uses `var(--shadow-focus-ring-error)`.
- [ ] Class names follow `ui-<name>` / `ui-<name>--<modifier>` / `ui-<name>__<element>` BEM convention.

## Step 4 — Wiring audit (everywhere the component is referenced)

- [ ] `src/index.js` exports `<Name>` from the new path (`./components/<name>/<Name>.vue`), alphabetical order.
- [ ] `playground-vue3/src/main.js` imports and registers via `app.component('<Name>', <Name>)`.
- [ ] `playground-vue2/src/main.js` imports and registers via `Vue.component('<Name>', <Name>)`.
- [ ] `playground-vue3/src/App.vue` has a `<section>` for `<Name>` exercising every variant (use `v-for` over a `data()` array, not hand-listed).
- [ ] `playground-vue2/src/App.vue` has the **same** section (literal copy — drift is the #1 cause of "works on one Vue but not the other" misses).
- [ ] `storybook-vue3/stories/<Name>.stories.js` exists with required exports: `Primary`, `AllVariants`, `Matrix` (when 2+ prop axes), one slot story, `FocusVisible` (with `tabindex="0"`) if the component has `:focus-visible` styling.

## Step 5 — Lint + format check (run yourself)

Run from repo root:

```
npm run lint           # eslint . — must exit 0
npm run format:check   # prettier --check . — must exit 0
```

Common failures for new components:

- **Composition API import in `src/`** — `no-restricted-imports` rule blocks `ref`/`reactive`/`computed`/`watch`/`setup`-family/`defineComponent`/etc. from `vue` inside `src/**`. Rewrite to Options API.
- **`v-model:argName` in template** — `vue/no-v-model-argument` (Vue-3-only syntax breaks Vue 2).
- **Multiple template roots** — `vue/no-multiple-template-root` (breaks Vue 2 fragments).
- **Prettier diff** — usually trailing semicolons, double quotes, or lines over 120 chars. Run `npm run format` to auto-fix; re-run `format:check`.

If both fail and the diff is small + obvious (whitespace, quote style), run `npm run lint:fix && npm run format` and re-check. Otherwise report failures with the exact rule name and file path; let the author fix substantive lint errors. Don't disable rules to silence a real violation.

The Husky `pre-commit` hook would catch these at commit time anyway, but the review must report them up front so they don't surprise the user.

## Step 6 — Compile-time verification (run yourself)

Run from repo root:

```
npm run test:build
```

All three targets (vue3, vue2, storybook) must exit code 0. Fix-loop on failure: read error, identify file/version, edit, re-run. Don't hand back a broken state.

If a build fails because a playground lacks `node_modules` or storybook hasn't been installed, instruct the user — don't try to install yourself unless they say so. Note: `playground-vue2` is pinned to Node 14 (per README); newer Node may break `npm i` for webpack 4.

## Step 7 — Fidelity check (against source intent)

If the component was generated from a Figma node, re-fetch via `mcp__plugin_figma_figma__get_screenshot` (just the URL — don't embed inline) and verify:

- [ ] Every variant value in the design exists as a prop value.
- [ ] Every interactive state shown in the design has matching CSS pseudo-class rules (`:hover` / `:focus-visible` / `:active` / `[disabled]`).
- [ ] Slot positions match content placeholders.
- [ ] Spacing/typography tokens map to within ±1px of the design (Figma export rounding).
- [ ] Variant names match (with sane typo-correction noted — e.g. Figma "Infor" → `info`).

If no Figma source, skip this step but note in the report.

## Step 8 — Visual handoff

The assistant **cannot** verify rendering. Tell the user the exact commands and what to look for:

```
npm run preview                  # both Vue 2 + Vue 3 dev servers, auto-opens 2 Chrome windows split
cd storybook-vue3 && npm run storybook   # Storybook on port 6006
```

Specifically ask the user to verify:

1. Component renders identically on `localhost:8001` (Vue 3) and `localhost:8080` (Vue 2). Diffs between the two = dual-compat regression.
2. Tab into focusable cases — `:focus-visible` ring appears with correct color (default ring vs error ring on destructive).
3. Storybook controls panel works (changing `variant` dropdown re-renders).

Don't claim "verified visually" without the user reporting back.

## Reply format

End the review with:

1. **Pass / fail** verdict (one line).
2. The 7 audit sections above (file layout, dual-compat static, CSS, wiring, lint+format, build, fidelity), each with `✅` or `❌` + concrete fix instruction for any failure.
3. The 3 commands the user should run to verify visually.
4. Any open items punted (e.g. "Figma showed a `loading` state — not implemented; ask if needed").

Keep it scannable — bullets, not paragraphs. No filler ("let me know if you have questions").

## When NOT to do work in this skill

- Don't author or fix code by default. **Report** failures with exact paths + fix instructions; let the user (or another skill turn) do the edit. The exception: if Step 5 (build) fails on something trivially obvious from the error (e.g. typo in import path), fix it and re-run — but call it out in the report.
- Don't run `npm i` unless the user explicitly asks. Missing deps → flag and stop.
- Don't run `npm run dev:*` or `npm run preview` (long-running, blocks). Visual is the user's job.
