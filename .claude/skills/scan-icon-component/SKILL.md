---
name: scan-icon
description: Use when the user wants to scan Lucide icon source files and convert them into icon components for webcake-ui-kit. Triggers on requests like "scan lucide icons", "generate icon components", "convert lucide to webcake-ui-kit", "sync lucide icons", or when the user provides a cloned Lucide repository / icon folder for processing. Orchestrates repository analysis → icon parsing → AST extraction → component generation → validation for this specific repo. Do NOT use for generic SVG conversion outside the Lucide architecture.
---

# lucide/icons → webcake-ui-kit component

This skill scans Lucide icon source files and converts them into production-ready webcake-ui-kit icon components with Vue 2 + Vue 3 dual compatibility.

- **Lucide repository source**: clone and analyze the official Lucide repository from :contentReference[oaicite:0]{index=0}. After cloning, scan the `/icons` directory recursively and parse all Lucide icon source files directly from the local filesystem. Detect icon declaration patterns, extract `iconNode` data, normalize SVG structure into AST format, and convert icons into webcake-ui-kit compatible components. Ignore non-icon files, tests, docs, build artifacts, temporary files, and generated output folders.
- **Authoring side**: delegates the dual-compat rules to the `vue-dual-component` skill in this repo.
- **Review side**: delegates the quality gate to the `component-review` skill in this repo (Phase 2 => Step 6 ).

# Phase 1 — Scan Lucide repository

## Preconditions

Before scanning icons:

- clone the official Lucide repository from :contentReference[oaicite:0]{index=0}
- work from the local cloned repository
- scan icons directly from the repository filesystem
- do NOT manually inspect files one-by-one

The scanner must operate programmatically through filesystem traversal.

---

# Step 1 — Scan Lucide icon files

Locate the `/icons` directory inside the cloned Lucide repository and generate a filesystem scanning script to recursively index the entire icon collection.

The scanner should:

- recursively only scan the entire `/icons` directory
- group related files by icon name
- detect `.json`, `.svg`, `.js`, `.ts`, and `.tsx` icon sources
- support Lucide structures where a single icon contains multiple related files
- normalize path separators across operating systems
- build deterministic grouped icon entries

---

# Example filesystem structure

```txt
/icons
├── 2fa.json
├── 2fa.svg
├── 3d-glasses.json
├── 3d-glasses.svg
...
```

---

## Step 2 — Build normalized icon manifest

After filesystem scanning completes, build a normalized icon manifest from the grouped icon entries.

Do NOT generate components directly from raw filesystem files.

Generation must happen from normalized manifest data.

The manifest builder should:

- merge related files into a single icon entry
- resolve the primary source file
- attach metadata files
- attach SVG sources
- normalize icon naming
- cache grouped results
- validate icon completeness
- skip malformed icon groups safely

Example grouped entry:

```json
{
  "name": "search",
  "componentName": "Search",
  "svg": "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-search-icon lucide-search'><path d='m21 21-4.34-4.34'/><circle cx='11' cy='11' r='8'/></svg>",
  "metadata": {
    "tags": ["find", "scan", "magnifier", "magnifying glass", "lens"],

    "categories": ["text", "social"]
  },

  "generation": {
    "importName": "WkiSearch",
    "exportName": "WkiSearch",
    "fileName": "Search.vue",
    "directory": "src/icons",
    "pascalName": "Search",
    "kebabName": "search"
  }
}
```

---

# Naming convention (canonical — applies to every generated icon)

Given a lucide icon with kebab-case name `<kebab>`:

| Field                                     | Pattern                                  | Example for `search-x` |
| ----------------------------------------- | ---------------------------------------- | ---------------------- |
| Filename (on disk)                        | `<PascalName>.vue` — **no `Wki` prefix** | `SearchX.vue`          |
| Component option `name`                   | `Wki<PascalName>`                        | `WkiSearchX`           |
| Export identifier in `src/icons/index.js` | `Wki<PascalName>`                        | `WkiSearchX`           |
| Import path inside Vue file               | `./<PascalName>.vue`                     | `./SearchX.vue`        |

The `Wki` prefix lives in the **export name** and in the component's `name` option only — **never in the filename**. This matches the existing repo convention (`BottomLeft.vue` → `export { default as WkiBottomLeft } from './BottomLeft.vue'`).

Edge cases:

- Lucide icons whose name begins with a digit (e.g. `2fa`, `3d-glasses`) cannot become JS identifiers as-is. Prefix the PascalName with `N`: `2fa` → file `N2Fa.vue`, export `WkiN2Fa`. (Or pick another deterministic policy — but be explicit; do not silently drop the digit.)
- Single-letter prefixes (e.g. `a-arrow-down`) collapse to `AArrowDown.vue` / `WkiAArrowDown`.

# Manifest storage requirements

After normalization, persist the generated manifest inside the repository.

The manifest must be stored as a reusable project asset for:

- Storybook icon search
- icon documentation
- autocomplete tooling
- icon explorer pages
- future incremental generation
- metadata indexing
- search filtering

````

Persist the normalized icon manifest inside the repository so Storybook can reuse it later for icon search, filtering, metadata lookup, and icon preview rendering.

Recommended structure:

```txt
scripts/generated/icons/
└── manifest.json
````

# Phase 2 — Generate icon infrastructure & components

After the normalized icon manifest is completed, generate webcake-ui-kit icon infrastructure and icon components from manifest data.

Do NOT generate components from raw filesystem files.

All component generation must use normalized manifest entries only.

SVG content must already be normalized into AST structures before entering this phase.

---

# Step 1 — Create shared BaseIcon infrastructure

Before generating any icon component, first create a shared wrapper component named `BaseIcon`.

All generated icons MUST use `BaseIcon`.

Generated icon components are responsible for rendering their own `<svg>` element.

`BaseIcon` should NOT render `<svg>` directly.

---

# BaseIcon responsibilities

`BaseIcon` centralizes all shared icon behavior.

It must manage:

- size
- color
- strokeWidth
- fill
- className
- accessibility attrs

This allows all generated icons to inherit shared behavior from a single source.

Future icon updates should only require changes inside `BaseIcon`.

---

# Generate BaseIcon

Expected structure — single file, alongside the generated icons in the flat `src/icons/` directory:

```txt
src/icons/
└── BaseIcon.vue
```

Do **not** create a nested `src/components/icons/BaseIcon/` folder. The icons live at `src/icons/<PascalName>.vue` and import `BaseIcon` from `./BaseIcon.vue` (relative, same directory).

---

# BaseIcon render structure

`BaseIcon` should render:

```vue
<template>
  <span class="base-icon" :style="styles" v-bind="$attrs" v-on="$listeners">
    <slot />
  </span>
</template>

<script>
export default {
  name: 'BaseIcon',

  props: {
    size: {
      type: [Number, String],
      default: 24
    },

    color: {
      type: String,
      default: 'currentColor'
    },
    strokeWidth: {
      type: [Number, String],
      default: 1.75
    },

    fill: {
      type: String,
      default: 'none'
    }
  },

  computed: {
    styles() {
      const normalizeSize = value => {
        return typeof value === 'number' ? `${value}px` : value
      }

      return {
        '--size': normalizeSize(this.size),
        '--color': this.color,
        '--stroke-width': this.strokeWidth,
        '--fill': this.fill
      }
    }
  }
}
</script>

<style scoped>
.base-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* ::v-deep is mandatory here. The <svg> is slotted in from the child icon
   component, so it carries the child's scope hash — a plain `.base-icon svg`
   selector under `<style scoped>` would compile to `.base-icon[data-v-BASE] svg[data-v-BASE]`
   and never match the slotted svg. The combinator form `.base-icon ::v-deep svg`
   works in both Vue 2.7 (combinator) and Vue 3 (deprecated but still functional). */
.base-icon ::v-deep svg {
  width: var(--size);
  height: var(--size);
  color: var(--color);
  stroke-width: var(--stroke-width);
  fill: var(--fill);
}
</style>
```

CSS-scoping pitfall — read this before tweaking BaseIcon styles:

- Vue's `<style scoped>` tags every selector with `[data-v-<hash>]` of the **component that owns the template**.
- The `<svg>` rendered by `<WkiSearch />` lives in `WkiSearch`'s template, not in `BaseIcon`'s — so the svg's DOM attribute is `data-v-<hash-of-WkiSearch>`, not `data-v-<hash-of-BaseIcon>`.
- A plain `.base-icon svg` selector inside BaseIcon's scoped block therefore can never match. CSS variables set on `.base-icon` (via inline `:style`) **do** inherit into the svg (because variable inheritance is DOM-based, not scope-based), but the declarations that consume those variables (`width: var(--size)`) need a selector that actually matches the svg — hence `::v-deep`.

Do not "fix" this by removing the deep combinator and re-scoping — it cannot work without piercing scope. The other valid options are: (a) two style blocks, scoped + unscoped, or (b) per-icon shared CSS import. If neither of those is wanted, `::v-deep` is the path.

Recommended defaults:

```txt
size = 24
color = currentColor
stroke = currentColor
strokeWidth = 1.75
fill = none
```

---

# Generated icon structure

Generated icon components should render — example file is `src/icons/Search.vue`:

```vue
<template>
  <BaseIcon v-bind="$attrs">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  </BaseIcon>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'Search',

  components: {
    BaseIcon
  }
}
</script>
```

Note the naming split:

- file on disk: `Search.vue` (no `Wki` prefix)
- `name` option: `Search`
- export in `src/icons/index.js`: `export { default as WkiSearch } from './Search.vue'`

Generated icons should ONLY contain:

- raw SVG structure
- normalized SVG nodes

All shared styling and behavior must come from `BaseIcon`.

---

# Required BaseIcon props

Do NOT rename props.

Do NOT change prop behavior.

---

# BaseIcon validation

Validate:

- prop forwarding
- slot rendering
- SVG attribute inheritance
- shared CSS application
- Vue 2 compatibility
- Vue 3 compatibility

If BaseIcon generation fails:

```txt
FAILED: unable to generate BaseIcon infrastructure
```

Do NOT continue icon generation until `BaseIcon` is valid.

# Step 2 — Analyze existing icon infrastructure

After `BaseIcon` is generated, analyze existing repo architecture:

- icon wrappers
- composables
- shared SVG utilities
- naming conventions
- export patterns
- Vue 2 compatibility patterns
- Vue 3 compatibility patterns

Reuse existing repo infrastructure whenever possible.

Do NOT reinvent icon abstractions.

---

# Step 3 — Build component generation AST

Convert normalized manifest entries into generation-ready AST structures.

Example:

```json
{
  "componentName": "Search",

  "imports": ["@/components/icons/BaseIcon"],

  "svg": "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-search-icon lucide-search'><path d='m21 21-4.3-4.3'/><circle cx='11' cy='11' r='8'/></svg>"
}
```

This AST becomes the single source of truth for icon generation.

All generators must consume AST data instead of raw SVG strings.

---

# Step 4 — Generate icon components

Generate Vue 2 + Vue 3 dual-compatible icon components from normalized AST data.

All generated icons MUST use `BaseIcon`.

Generated icons are responsible for rendering their own `<svg>` element.

---

## Expected structure

The repo uses a **flat** `src/icons/` layout (one `.vue` per icon, shared `BaseIcon.vue` alongside). Match it — do **not** create a nested `src/icons/<Name>/` folder per icon.

```txt
src/icons/
├── BaseIcon.vue          # shared wrapper (created once in Phase 2 Step 1)
├── Search.vue            # one file per icon — PascalName, no Wki prefix
├── SearchX.vue
├── ArrowUp.vue
└── index.js              # exports use the Wki prefix: WkiSearch, WkiSearchX, ...
```

Only generate files required by repo conventions.

Avoid unnecessary scaffolding (no per-icon `index.js`, no `__tests__/` folder, no `README.md`).

---

## Generated component architecture

Generated icon components should:

- import `BaseIcon`
- render a single `<svg>`
- inherit all shared behavior from `BaseIcon`

Example — file path is `src/icons/Search.vue`:

```vue
<template>
  <BaseIcon v-bind="$attrs">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  </BaseIcon>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: 'Search',

  components: {
    BaseIcon
  }
}
</script>
```

---

## Generated component rules

Generated icons should ONLY contain:

- raw SVG structure
- normalized SVG nodes

All shared behavior must come from `BaseIcon`.

Do NOT:

- duplicate wrapper logic
- duplicate shared props
- duplicate SVG defaults
- duplicate shared styles
- inject inline sizing styles
- inject inline color styles
- manage shared SVG behavior locally

---

## SVG generation rules

The generated `<svg>` element should preserve:

- xmlns
- viewBox
- fill
- stroke
- accessibility attrs if present

SVG AST nodes must preserve:

- node ordering
- attributes
- path data
- transforms
- stroke values
- fill values

Transformation must be fully lossless.

---

## Critical SVG rules

Do NOT:

- rewrite SVG path data
- optimize SVG
- merge paths
- simplify nodes
- remove attributes
- reorder nodes
- mutate transforms
- normalize path commands

Generated output must remain visually identical to the original SVG source.

---

# Step 5 — Generate exports

Automatically register generated icons in:

```txt
src/icons/index.js
```

Each export pairs a **Wki-prefixed identifier** with a **non-prefixed filename**:

```js
export { default as WkiBottomRight } from './BottomRight.vue'
export { default as WkiBottomLeft } from './BottomLeft.vue'
export { default as WkiSearch } from './Search.vue'
export { default as WkiSearchX } from './SearchX.vue'
export { default as WkiAArrowDown } from './AArrowDown.vue'
```

Requirements:

- deterministic ordering (sort by export identifier)
- no duplicate exports
- export identifier always starts with `Wki`; filename never does
- preserve any pre-existing hand-written exports above the auto-generated block — wrap the generated lines with a sentinel pair (`// --- AUTO-GENERATED LUCIDE EXPORTS START ---` / `... END ---`) so reruns replace only the generated region

---

# Step 6 — Validate generated components

Validate:

- Vue syntax validity
- Vue 2 compatibility
- Vue 3 compatibility
- missing exports
- duplicate component names
- malformed SVG nodes
- invalid imports
- broken snapshots

If validation fails:

```txt
FAILED: unable to generate valid component
```

Never auto-fix corrupted SVG structures.

Never guess missing data.

---

# Step 7 — Generate processing report

At the end return:

```txt
Processed: X
Generated: X
Skipped: X
Failed: X
```

Also report:

- duplicate names
- invalid SVG structures
- unsupported node types
- malformed exports
- failed validations
