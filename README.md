<div align="center">

# 🍰 webcake-ui-kit

### The Vue UI kit that doesn't make you choose.

**One library. Two Vue versions. Zero build step.**
Ship the same components to Vue 2.7 _and_ Vue 3 — from a single source, with one import.

<br />

[![npm version](https://img.shields.io/npm/v/webcake-ui-kit.svg?style=for-the-badge&color=ff6b9d&logo=npm&logoColor=white)](https://www.npmjs.com/package/webcake-ui-kit)
[![Vue 2 & 3](https://img.shields.io/badge/Vue-2.7%20%7C%C2%A03.x-42b883?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![No build](https://img.shields.io/badge/build-not%20required-success?style=for-the-badge)](#-why-ship-raw-sfc)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)

<br />

### 📖 **[Live Docs & Storybook → ui.webcake.io](https://ui.webcake.io)**

<sub>Browse every component, prop, slot, and variant — running live in the browser.</sub>

<br />

</div>

---

## 👋 Welcome

Migrating from Vue 2 to Vue 3 is painful enough — your UI library shouldn't make it worse.

Most Vue component libraries force you to **pick a side**. Choose Vue 2 → you're stuck. Choose Vue 3 → you have to rewrite the app first. Either way, you carry the cost.

**webcake-ui-kit refuses that tradeoff.** Every component is hand-authored under strict dual-compatibility rules so the _same import_ compiles, renders, and behaves identically on **Vue 2.7** and **Vue 3.4+** — from a codebase you can grep, fork, and theme as if it were your own.

```js
import { WkButton, WkDialog, WkInput } from 'webcake-ui-kit'
// ✅ Vue 2.7 — works
// ✅ Vue 3.x — works
// ✅ Same API. Same styles. Same behavior. One source of truth.
```

No `-vue2` package. No `-vue3` package. No build artifact gymnastics. Just `.vue` files, the way the framework intended.

---

## ⚡ Quick start

Get a button on screen in **under 60 seconds**.

### 1. Install

```bash
npm install webcake-ui-kit
```

```bash
pnpm add webcake-ui-kit
```

```bash
yarn add webcake-ui-kit
```

> Peer dependency: `vue ^2.6.0 || ^3.0.0`. That's it.

### 2. Import the styles once

```js
import 'webcake-ui-kit/styles'
```

### 3. Register components

<table>
<tr>
<th width="50%">

**Vue 3**

</th>
<th width="50%">

**Vue 2.7**

</th>
</tr>
<tr>
<td>

```js
// main.js
import { createApp } from 'vue'
import { WkButton, WkDialog, WkInput } from 'webcake-ui-kit'
import 'webcake-ui-kit/styles'
import App from './App.vue'

const app = createApp(App)
app.component('WkButton', WkButton)
app.component('WkDialog', WkDialog)
app.component('WkInput', WkInput)
app.mount('#app')
```

</td>
<td>

```js
// main.js
import Vue from 'vue'
import { WkButton, WkDialog, WkInput } from 'webcake-ui-kit'
import 'webcake-ui-kit/styles'
import App from './App.vue'

Vue.component('WkButton', WkButton)
Vue.component('WkDialog', WkDialog)
Vue.component('WkInput', WkInput)

new Vue({ render: h => h(App) }).$mount('#app')
```

</td>
</tr>
</table>

### 4. Use it

```vue
<template>
  <div>
    <WkButton variant="primary" @click="open = true">Open dialog</WkButton>

    <WkDialog v-model="open" title="Hello from webcake 👋">
      <WkInput v-model="name" placeholder="Your name" />
    </WkDialog>
  </div>
</template>

<script>
export default {
  data: () => ({ open: false, name: '' })
}
</script>
```

🎉 **That's it.** The same `.vue` file works on both runtimes — no `#ifdef`, no wrapper, no shim.

---

## ✨ Why teams pick webcake

<table>
<tr>
<td width="33%" valign="top">

### 🎯 True dual-compat

One source. Vue 2.7 and Vue 3.x. Tested on both runtimes in CI — every PR, every component.

</td>
<td width="33%" valign="top">

### 📦 Ships raw SFC

No pre-compiled artifacts. Your bundler compiles `.vue` files once, alongside your app. Zero version lock.

</td>
<td width="33%" valign="top">

### 🎨 Token-driven theming

Override `--color-primary` and the whole kit rebrands. No SASS, no providers, no JS theme objects.

</td>
</tr>
<tr>
<td valign="top">

### ♿ Accessible by default

Semantic HTML, `:focus-visible` rings, ARIA where it matters. Not retrofitted — designed in.

</td>
<td valign="top">

### 🪶 Tree-shakable

Named exports only. Import `Button`, leave the rest behind. No `Vue.use(KitchenSink)`.

</td>
<td valign="top">

### 📖 Storybook included

Every component, every variant, every prop — browsable before you `npm install`.

</td>
</tr>
</table>

---

## 🧩 Components

All exports are prefixed with **`Wk`** to avoid global name collisions and to be greppable across consumer apps.

<div align="center">

| Forms                     | Overlays      | Layout              | Display      |
| :------------------------ | :------------ | :------------------ | :----------- |
| WkButton                  | WkDialog      | WkAccordion         | WkBadge      |
| WkButtonGroup             | WkAlertDialog | WkAccordionItem     | WkTag        |
| WkInput                   | WkTooltip\*   | WkTabs              | WkDivider    |
| WkCheckbox                |               | WkBreadcrumb        | WkSpinner    |
| WkCheckboxGroup           |               | WkPagination        | WkTypography |
| WkRadio / WkRadioGroup    |               | WkSidebarItem       |              |
| WkSelect / WkSelectOption |               | WkSidebarGroupLabel |              |
| WkSwitch / WkSwitchGroup  |               |                     |              |
| WkToggle / WkToggleGroup  |               |                     |              |
| WkSlider                  |               |                     |              |
| WkRichCheckboxGroup       |               |                     |              |
| WkRichSwitchGroup         |               |                     |              |

<sub>\* coming soon · _more on the way_</sub>

</div>

All components follow the same conventions: **validated props**, **declared emits**, **BEM-style hooks** (`ui-button--primary`), and `v-model` where it makes sense.

👉 **Want to see them in action?** [Browse the live Storybook →](https://ui.webcake.io)

---

## 🎨 Theming

Every component reads from CSS custom properties. Drop them on `:root` and the whole kit rebrands:

```css
:root {
  --color-primary: #ff6b9d;
  --color-primary-hover: #ff4d8a;
  --radius-md: 12px;
  --font-sans: 'Inter', system-ui, sans-serif;
}
```

Dark mode? Already wired — every color token has a `.dark` companion. Toggle a class on `<html>` and you're done.

```css
.dark {
  --color-bg: #0b0b0f;
  --color-fg: #f4f4f5;
  /* …everything else cascades */
}
```

No SASS variables. No JS theme provider. No runtime patching. Just CSS, the way the platform meant it.

---

## 🛡️ The dual-compat guarantee

Every component compiles cleanly on both runtimes — enforced by a strict authoring contract:

- ✅ **Pure Options API** — no `<script setup>`, no `setup()`, no Composition API imports
- ✅ **Single root template** (Vue 2 has no fragments)
- ✅ **`emits` always declared** (Vue 3 needs it for `$attrs` separation)
- ✅ No Vue-3-only features (`<Teleport>`, `<Suspense>`, multi `v-model`)
- ✅ No Vue-2-only features (filters, `.native`, `$listeners`)

And every commit runs through **four parallel build lanes**:

|     | Runtime | Bundler                             | What it catches                       |
| :-: | :------ | :---------------------------------- | :------------------------------------ |
| 🟢  | Vue 3.4 | Vite + `@vitejs/plugin-vue`         | Modern compile errors, fragment leaks |
| 🟣  | Vue 2.7 | webpack 4 + `vue-template-compiler` | Legacy compile errors, banned APIs    |
| 🟡  | Vue 3.2 | Storybook 6.5                       | Story-side regressions                |
| 🧪  | Both    | Vitest × 2 lanes                    | Runtime + behavior parity             |

**If a PR doesn't build on either side, it doesn't ship.** Period.

---

## 🏗️ Why ship raw SFC?

Most Vue libraries publish pre-compiled `.js` artifacts targeting _one_ Vue runtime. That's how the ecosystem ended up fragmented into `-vue2` and `-vue3` packages.

webcake-ui-kit publishes the **source `.vue` files** directly. Your app's bundler — Vite, webpack, whatever you use — compiles them against _your_ Vue version. One source, two outputs, zero version lock-in.

> **The tradeoff:** you need a bundler that handles `.vue`. _(You already do.)_

This is the entire reason the kit exists. Everything else — the components, the tokens, the Storybook — is downstream of that decision.

---

## 🚦 Compatibility

|                    | Version                                 |    Status    |
| :----------------- | :-------------------------------------- | :----------: |
| Vue 2              | `2.7.x`                                 | ✅ supported |
| Vue 3              | `3.0+` (tested on `3.4`)                | ✅ supported |
| Bundlers           | Vite, webpack 4/5, Rollup, esbuild      |      ✅      |
| Node (consumer)    | any version your bundler supports       |      ✅      |
| Node (contributor) | **14.x** (Vue 2 sandbox uses webpack 4) |  ⚠️ pinned   |

---

## 🧪 Local development

```bash
npm run preview        # Vue 2 + Vue 3 dev servers side by side (HMR on both)
npm run test:build     # Compile-check everything (Vue 2, Vue 3, Storybook) — ~16s
npm test               # Unit suite on both runtimes, in parallel
```

Visit **`localhost:8001`** (Vue 3) and **`localhost:8080`** (Vue 2) side-by-side to spot dual-compat regressions in real time.

Full contributor workflow — including the 10-file checklist for adding a component — lives in [CLAUDE.md](./CLAUDE.md).

**Environment:** Node 14 · Python ≤ 3.10 (the Vue 2 playground uses webpack 4 with native deps).

---

## 🌐 Resources

<div align="center">

|                         |                                                                                  |
| :---------------------: | :------------------------------------------------------------------------------- |
| 🌍 **Docs & Storybook** | [ui.webcake.io](https://ui.webcake.io)                                           |
|       📦 **npm**        | [npmjs.com/package/webcake-ui-kit](https://www.npmjs.com/package/webcake-ui-kit) |
|      🐙 **GitHub**      | [pancake-vn/webcake-ui-kit](https://github.com/pancake-vn/webcake-ui-kit)        |
|      🐛 **Issues**      | [Report a bug](https://github.com/pancake-vn/webcake-ui-kit/issues)              |
|   💬 **Discussions**    | [Ask a question](https://github.com/pancake-vn/webcake-ui-kit/discussions)       |

</div>

---

## 🤝 Contributing

PRs welcome — especially new components, accessibility fixes, and Vue 2/3 parity bug reports.

Before opening one:

1. Read [CLAUDE.md](./CLAUDE.md) — it documents the dual-compat rules and the 10-file checklist for adding a component.
2. Run `npm run test:build && npm test` — both must pass on Vue 2 _and_ Vue 3 lanes.
3. Add a Storybook story and a unit spec. New components without both are not accepted.

---

## 📜 License

**MIT** © Webcake Team — use it, fork it, ship it.

---

<div align="center">
  <sub>Made with 🍰 by <a href="https://github.com/pancake-vn">pancake-vn</a></sub>
  <br />
  <sub>Because nobody should have to rewrite their app to upgrade a UI library.</sub>
</div>
