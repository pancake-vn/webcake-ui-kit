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

Apply the SFC skeleton from `vue-dual-component` skill. Repo-specific rules:

1. File path: `src/components/<Name>.vue`. Mirror `Button.vue`'s structure exactly — `<template>` (single root), `<script>` (Options API: `name`, `props` with `validator`, `emits`, `methods`), `<style scoped>` (BEM `ui-<name>--<modifier>`).
2. Register the export in `src/index.js`: `export { default as <Name> } from './components/<Name>.vue'`. Keep exports alphabetical for stable diffs.
3. Tokens go in the right file: colors → `color_general.css` (mirror in `.dark`), spacing → `spacing.css`, radius → `border_radius.css`, typography → `typography.css`, effects/shadows → `shadow.css`. Don't dump everything into `index.css`. Component-only values (e.g. an icon size of 12px specific to Badge) can stay in the SFC's `<style scoped>`.
4. **Do not** create stories or playground entries automatically — the user adds those when ready. If the design has many variants worth showcasing, mention it in the review and offer to add a story to `storybook-vue3/stories/`.

Re-read `vue-dual-component` SKILL.md before writing — apply its DON'T list strictly. Most common mistakes that slip in from Figma-flavored output: multiple root nodes (Figma frames often produce two siblings), `<script setup>` (Composition API is banned here), `v-model:foo` syntax, reading `class` off `$attrs`.

## Phase 3 — Review (mandatory before declaring done)

After writing, run this checklist explicitly in the response — don't just claim it passed:

**Code review (static):**
- [ ] Single root in `<template>`.
- [ ] Pure Options API. No `setup`, no `<script setup>`, no `import { ref, ... } from 'vue'`.
- [ ] `name`, `props` (validated), `emits` declared. No event is emitted that isn't in `emits`.
- [ ] No banned APIs from `vue-dual-component` DON'T list (`Teleport`, fragments, `.native`, `$listeners`, `class`/`style` from `$attrs`, filters, `Vue.set`, **`:deep(...)`**, etc.).
- [ ] **No props named `hovered`/`focused`/`pressed`/`active` for interaction states.** Those are `:hover` / `:focus-visible` / `:active` CSS rules. Props are reserved for variants and logical modes.
- [ ] **All values in `<style scoped>` use `var(--*)` from `src/styles/*.css`.** No inline hex or raw px (icon container sizes are the only acceptable exception).
- [ ] **Named slots use the dual-compat detection pattern** `!!((this.$scopedSlots && this.$scopedSlots['name']) || this.$slots['name'])`.
- [ ] Class names follow `ui-<name>` / `ui-<name>--<modifier>`.
- [ ] Export added to `src/index.js` (alphabetical).
- [ ] No new build dependency introduced (no TS, JSX, SCSS, Tailwind utilities).

**Visual verification (must instruct user):**

Tell the user the exact commands to run, in this order:

```
npm run dev:vue3      # check rendering on Vue 3.4 at localhost:8001
npm run dev:vue2      # check rendering on Vue 2.7 at localhost:8080
```

For Vue 2: if the playground was set up before this component was added and `webcake-ui-kit` was installed via `file:..` (not aliased), the user may need `cd playground-vue2 && npm i` to pick up the new file. Mention this proactively — it's the #1 "why doesn't my new component show up" issue in this repo.

Note explicitly in the response: **the assistant cannot run the playgrounds and visually confirm rendering** — that step is the user's. Don't claim "tested on both" without evidence.

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
