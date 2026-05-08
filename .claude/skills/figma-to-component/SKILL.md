---
name: figma-to-component
description: Use when the user pastes a Figma "Implement this design" prompt (typically containing a figma.com/design/... URL with node-id) and wants the result added to webcake-ui-kit as a new component. Triggers on "implement this design from figma", "figma to component", "tạo component từ figma", or any message containing a figma.com URL paired with an implementation request. Orchestrates fetch → generate dual-compat SFC → review for this specific repo. Do NOT use for generic Figma exploration without an implementation goal — use figma:figma-implement-design directly for that.
---

# Figma → webcake-ui-kit component

This skill turns a Figma node URL into a Vue 2 + Vue 3 dual-compatible SFC under `src/components/`, registered in `src/index.js`, and reviewed against the repo's compat rules. It composes existing infrastructure rather than duplicating it:

- **Figma side**: delegates fetching/parsing to the `figma:figma-implement-design` skill and the `mcp__plugin_figma_figma__*` MCP tools that ship with Claude Code.
- **Authoring side**: delegates the dual-compat rules to the `vue-dual-component` skill in this repo.
- **This skill** owns the project-specific orchestration, file layout, and post-write review.

## Phase 0 — Preconditions (decide silently, only stop if blocked)

Resolve these without asking the user — only escalate if a real blocker remains:

1. **Figma MCP authenticated.** If tools aren't available, run `mcp__plugin_figma_figma__authenticate`. This IS a hard stop — wait for the user to complete OAuth before proceeding.
2. **Component name.** Pull from the Figma node title (`get_metadata` or the `data-name` in `get_design_context`). Convert to PascalCase. Strip Figma decorations (`❖ `, `✅ `, etc.). If the result is unambiguous and doesn't collide with `src/index.js` exports, **use it without asking**. Only ask if (a) name is ambiguous/empty/generic like "Component", or (b) it collides — in which case propose `<Name>V2` or "merge into existing" and ask.
3. **vue-dual-component skill** — re-read `.claude/skills/vue-dual-component/SKILL.md` silently before generating.

## Phase 1 — Analyze (don't write code yet)

Use `mcp__plugin_figma_figma__get_design_context` + `get_variable_defs` (+ `get_screenshot` if visual confirmation helps) to extract:

- **Variants vs interaction states — distinguish carefully:**
  - **Variants** (visual style axes the consumer chooses) → **props**. Examples: `variant` ∈ {primary, secondary, danger}, `size` ∈ {sm, md, lg}, `roundness` ∈ {default, round}, `disabled` (a toggleable mode), `loading`.
  - **Interaction states** (browser-driven, triggered by user events) → **CSS pseudo-classes**, never props. Examples: Figma "Hover" → `:hover`, Figma "Focus" / "Focused" → `:focus-visible`, Figma "Pressed" / "Active" → `:active`. Do **not** create props like `hovered: Boolean` or `focused: Boolean`. The browser handles these states; the component only provides the styling.
  - **Edge case**: if the design has a state that browsers can't express (e.g. "Selected" in a tab group, where selection is logical not interactive), that IS a prop — name it `selected` / `active` / etc. and toggle a class.
  Sanity-fix typos in variant names (e.g. Figma "Infor" → `info`); call this out in the review, don't ask first.
- **Slots**: where does user content go? (default slot, icon-left, icon-right, etc.). Mark anything that's clearly content (not a fixed asset) as a slot. Convert React-style boolean toggles like `showLeftIcon` + `iconLeft: ReactNode` to a single named slot — slot presence determines visibility.
- **Events**: clickable surfaces → `click`; inputs → `input` + `change` (and `update:modelValue` for Vue 3 v-model). Pure presentational components (Badge, Tag, Chip-with-no-onClick) get `emits: []`.
- **Tokens — DEFAULT BEHAVIOR, do not ask:** the repo has a full token system in `src/styles/*.css` (`color_general.css`, `spacing.css`, `typography.css`, `border_radius.css`, `shadow.css`, `alpha_colors.css`, `raw_colors.css`, `brand_colors.css`). **Always** map Figma values to existing CSS vars; never inline hex/px. If a needed semantic token is missing but a raw color exists, add a semantic alias to the appropriate group in `color_general.css` (and mirror in `.dark` if color differs in dark mode). Add reusable effects (focus rings, etc.) to `shadow.css`. The legacy `Button.vue` inlines literals — that file is the exception, not the rule. Don't ask the user about token policy.
- **Layout primitives**: flex/grid/absolute. Translate to plain CSS; no Tailwind, no preprocessors.

**Output of this phase** is a one-paragraph plan: component name, prop table, emits list, slot list, decisions made (renames, dropped boolean props, etc.), and only **genuinely ambiguous** open questions. Don't list every choice as a question — state your decision and move on. Only block on user confirmation when a decision changes the public API in a non-obvious way (e.g. "this design could be a `<button>` or a `<span>` — need click semantics?").

## Phase 2 — Generate

Apply the SFC skeleton from `vue-dual-component` skill. Repo-specific rules — **all of these are mandatory for one component, edit them all in the same change**:

1. **The SFC pair (folder per component)**: create `src/components/<name>/` with two files:
   - `<Name>.vue` — `<template>` (single root), `<script>` (Options API: `name`, `props` with `validator`, `emits`, `methods`), and a single style link line: `<style src="./<name>.css" scoped></style>`. **No inline CSS rules in the SFC.**
   - `<name>.css` — all the BEM rules (`ui-<name>`, `ui-<name>--<modifier>`, `ui-<name>__<element>`, `:hover` / `:focus-visible` / `:active` pseudos for interaction states). Uses `var(--*)` tokens from `src/styles/*.css`.

   Folder name is **lowercase**, Vue file is **PascalCase**, CSS file is **lowercase**. Example: `src/components/badge/Badge.vue` + `src/components/badge/badge.css`. Don't `import './foo.css'` from `<script>` — that produces global CSS and breaks scoping; always link via `<style src=... scoped>`.

2. **Library export**: `src/index.js` — add `export { default as <Name> } from './components/<name>/<Name>.vue'`. Keep exports alphabetical for stable diffs.
3. **Tokens**: colors → `color_general.css` (mirror in `.dark`), spacing → `spacing.css`, radius → `border_radius.css`, typography → `typography.css`, effects/shadows → `shadow.css`. Don't dump everything into `index.css`. Component-only values (e.g. an icon size of 12px specific to Badge) can stay in the SFC's `<style scoped>`.
4. **Vue 3 playground registration**: `playground-vue3/src/main.js` — import the new component and call `app.component('<Name>', <Name>)`. Sort imports alphabetical.
5. **Vue 2 playground registration**: `playground-vue2/src/main.js` — same, but `Vue.component('<Name>', <Name>)`.
6. **Vue 3 showcase**: append a `<section>` to `playground-vue3/src/App.vue` exercising the component's full variant matrix (every prop value × at least one slot scenario × any `:focus-visible` / `:hover` case worth eyeballing). The section is what makes `test:build` actually compile the component — without it the build is a no-op for verification purposes.
7. **Vue 2 showcase**: append the **same** `<section>` to `playground-vue2/src/App.vue` (template syntax is portable since both Vue 2.6+ and Vue 3 support `#name` slot shorthand). Keep the two App.vue files in sync — drift between them is the most common reason "works on Vue 3 but breaks on Vue 2" gets missed.

Steps 1–7 are non-negotiable for a single component change. **Don't** create Storybook stories automatically (Storybook uses a heavier per-component file format) — only mention in review and offer to add if the user wants it.

Re-read `vue-dual-component` SKILL.md before writing — apply its DON'T list strictly. Most common mistakes that slip in from Figma-flavored output: multiple root nodes (Figma frames often produce two siblings), `<script setup>` (Composition API is banned here), `v-model:foo` syntax, reading `class` off `$attrs`.

### Showcase template (steps 6–7)

Aim for a minimal but representative block. For a component with a `variant` × `size` matrix, use a `v-for` table; for a simple component, a single row of representative cases is fine. Include at least:

- One row/cell per variant value (so all branches of conditional CSS get rendered).
- One slot scenario per slot (default + each named slot).
- For interactive states styled with `:hover` / `:focus-visible` / `:active`, add a case with `tabindex="0"` so it's keyboard-reachable when the user verifies visually.

Use a `data()` array of variant names + `v-for` rather than hand-listing each one — easier to extend, and it exercises Vue's template compilation across both versions.

## Phase 3 — Review (mandatory before declaring done)

After writing, run this checklist explicitly in the response — don't just claim it passed:

**Code review (static):**
- [ ] Single root in `<template>`.
- [ ] Pure Options API. No `setup`, no `<script setup>`, no `import { ref, ... } from 'vue'`.
- [ ] `name`, `props` (validated), `emits` declared. No event is emitted that isn't in `emits`.
- [ ] No banned APIs from `vue-dual-component` DON'T list (`Teleport`, fragments, `.native`, `$listeners`, `class`/`style` from `$attrs`, filters, `Vue.set`, **`:deep(...)`**, etc.).
- [ ] **No props named `hovered`/`focused`/`pressed`/`active` for interaction states.** Those are `:hover` / `:focus-visible` / `:active` CSS rules. Props are reserved for variants and logical modes.
- [ ] **Folder layout correct**: `src/components/<name>/<Name>.vue` (PascalCase) + `src/components/<name>/<name>.css` (lowercase). SFC's `<style>` uses `src="./<name>.css" scoped`, no inline rules.
- [ ] **All values in the CSS file use `var(--*)` from `src/styles/*.css`.** No inline hex or raw px (icon container sizes are the only acceptable exception).
- [ ] **Named slots use the dual-compat detection pattern** `!!((this.$scopedSlots && this.$scopedSlots['name']) || this.$slots['name'])`.
- [ ] Class names follow `ui-<name>` / `ui-<name>--<modifier>`.
- [ ] Export added to `src/index.js` (alphabetical).
- [ ] **Both playground `main.js` files register the component globally.**
- [ ] **Both playground `App.vue` files have a showcase section** (kept in sync — same template).
- [ ] **`npm run test:build` exits 0 on both vue3 and vue2.** (Run it yourself; don't claim "should compile".)
- [ ] No new build dependency introduced (no TS, JSX, SCSS, Tailwind utilities).

**Compile-time check (run first, can run yourself):**

After Phase 2 (steps 1–7) is complete, run `npm run test:build` from the repo root. This builds both playground-vue3 (Vite) and playground-vue2 (webpack 4) **in parallel via `concurrently`** and fails fast if the component has any banned API, fragment, `:deep()`, or syntax error on either Vue version. Catch and surface failures before handing off.

If the build fails, **fix the SFC and re-run** — don't hand a broken state to the user. Loop: read error → identify which Vue version + which file → edit → re-run `test:build`. Stop only when both exit code 0, or when blocked by something requiring the user (auth, missing dep, Node version).

Prerequisite: each playground needs `node_modules`. If a build fails with "module not found" / missing deps, instruct the user to `cd playground-vue3 && npm i` and `cd playground-vue2 && npm i` first. Note: `playground-vue2` requires Node 14 (per README) — newer Node may break `npm i` for webpack 4 + vue-loader 15. Don't try to "fix" this by upgrading deps; the pin is intentional.

**Visual verification (must instruct user):**

After compile passes, tell the user the exact commands to run, in this order:

```
npm run dev:vue3      # check rendering on Vue 3.4 at localhost:8001
npm run dev:vue2      # check rendering on Vue 2.7 at localhost:8080
```

For Vue 2: if the playground was set up before this component was added and `webcake-ui-kit` was installed via `file:..` (not aliased), the user may need `cd playground-vue2 && npm i` to pick up the new file. Mention this proactively — it's the #1 "why doesn't my new component show up" issue in this repo.

Note explicitly in the response: **the assistant cannot run the playgrounds and visually confirm rendering** (only `test:build` runs without a browser) — visual confirmation is the user's. Don't claim "tested on both" without evidence beyond the compile pass.

**Fidelity review (against Figma):**
- [ ] All variants from the Figma node are reachable via props.
- [ ] All interactive states (hover/active/disabled/focus) have CSS rules — Figma rarely shows these explicitly; ask if missing.
- [ ] Slot positions match the design's content placeholders.
- [ ] Spacing/typography tokens match within ±1px (Figma export rounding).

## Phase 4 — Reply format

End the turn with exactly:

1. One-paragraph summary of what was added (file paths + line counts).
2. The review checklist above with results.
3. The two `npm run dev:*` commands the user should run.
4. Any open questions or things you punted (e.g. "Figma node showed a `loading` state but no spinner asset — left as TODO; happy to add a CSS spinner if you want").

Do not pad with restatements of the design or generic "let me know if you need changes" filler.

## When to escalate / refuse

- **Design uses Vue-3-only feature semantics** (e.g. teleporting a tooltip, Suspense for async content): stop, explain, propose dual-compat alternative.
- **Design requires a dependency** (icon library, date picker, animation lib): stop, ask the user — adding a runtime dep changes the package's peer surface and should be a deliberate decision.
- **Figma node is a full page, not a component**: this skill is for components. Suggest splitting the design and pointing at the specific node-id of the smallest reusable unit.
- **Auth fails repeatedly**: surface the error verbatim; don't keep retrying or guess at credentials.
