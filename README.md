# 🍰 webcake-ui-kit

> **One component library. Two Vue versions. Zero build step.**
> The Vue UI kit that ships **raw `.vue` files** and works in **Vue 2.7 _and_ Vue 3** out of the box.

**📖 Live docs & Storybook → [ui.webcake.io](https://ui.webcake.io)**

[![npm version](https://img.shields.io/npm/v/webcake-ui-kit.svg?style=flat-square&color=ff6b9d)](https://www.npmjs.com/package/webcake-ui-kit)
[![Vue 2 & 3](https://img.shields.io/badge/Vue-2.7%20%7C%C2%A03-42b883?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![No build](https://img.shields.io/badge/build-not%20required-success?style=flat-square)](#)
[![Docs](https://img.shields.io/badge/docs-ui.webcake.io-ff6b9d?style=flat-square)](https://ui.webcake.io)
[![License](https://img.shields.io/badge/license-ISC-blue?style=flat-square)](LICENSE)

---

## ✨ Why webcake-ui-kit?

Migrating from Vue 2 to Vue 3 is painful. Most UI libraries force you to **pick a side** — and rewrite your app when you switch.

**webcake-ui-kit doesn't.** Every component is authored with strict dual-compatibility rules so the *same import* works whether your codebase is still on Vue 2.7 or already on Vue 3.4+.

```js
import { Button, Dialog, Input } from 'webcake-ui-kit'
// ✅ Works in Vue 2.7
// ✅ Works in Vue 3.4+
// ✅ Same API. Same styles. Same behavior.
```

---

## 🚀 Features

- 🎯 **True dual-compat** — Vue 2.7 & Vue 3.x from a single source. No forks. No `-vue2`/`-vue3` packages.
- 📦 **Ships raw SFC** — no compilation at the library level. Your bundler compiles it once, alongside your app.
- 🎨 **Design-token driven** — themable via CSS variables. Override `--color-primary` and everything follows.
- ♿ **Accessible by default** — semantic HTML, `:focus-visible` rings, ARIA where it matters.
- 🪶 **Tree-shakable** — named exports only. Pull in `Button`, leave `Dialog` behind.
- 🧪 **Tested on both runtimes** — every component has a unit spec that runs against Vue 2 *and* Vue 3 lanes in CI.
- 📖 **Storybook included** — every variant, every state, browse before you install.

---

## 📦 Install

```bash
npm install webcake-ui-kit
# or
yarn add webcake-ui-kit
# or
pnpm add webcake-ui-kit
```

Peer dependency: `vue ^2.6.0 || ^3.0.0`

---

## ⚡ Quick start

### Vue 3

```js
// main.js
import { createApp } from 'vue'
import { Button, Dialog, Input } from 'webcake-ui-kit'
import 'webcake-ui-kit/styles'

import App from './App.vue'

const app = createApp(App)
app.component('Button', Button)
app.component('Dialog', Dialog)
app.component('Input', Input)
app.mount('#app')
```

### Vue 2.7

```js
// main.js
import Vue from 'vue'
import { Button, Dialog, Input } from 'webcake-ui-kit'
import 'webcake-ui-kit/styles'

import App from './App.vue'

Vue.component('Button', Button)
Vue.component('Dialog', Dialog)
Vue.component('Input', Input)

new Vue({ render: h => h(App) }).$mount('#app')
```

### Use it

```vue
<template>
  <div>
    <Button variant="primary" @click="open = true">Open dialog</Button>

    <Dialog v-model="open" title="Hello from webcake 👋">
      <Input v-model="name" placeholder="Your name" />
    </Dialog>
  </div>
</template>

<script>
export default {
  data: () => ({ open: false, name: '' })
}
</script>
```

---

## 🧩 Components

| | | |
|---|---|---|
| **Accordion** | **AccordionItem** | **AlertDialog** |
| **Badge** | **Breadcrumb** | **Button** |
| **ButtonGroup** | **Checkbox** | **CheckboxGroup** |
| **Dialog** | **Divider** | **Input** |
| **Radio** | **RadioGroup** | **RichCheckboxGroup** |
| **RichSwitchGroup** | **Select** | **Sidebar** |
| **Slider** | **Spinner** | **Switch** |
| **SwitchGroup** | **Tabs** | **Tag** |
| **Toggle** | **ToggleGroup** | _…more coming_ |

All components follow the same API conventions: validated props, declared emits, BEM-style class hooks (`ui-button--primary`), and `v-model` where it makes sense.

👉 **Browse every variant, prop, and slot in the live Storybook: [ui.webcake.io](https://ui.webcake.io)**

---

## 🎨 Theming

Every component reads from CSS custom properties. Drop these on `:root` to rebrand the whole kit:

```css
:root {
  --color-primary: #ff6b9d;
  --color-primary-hover: #ff4d8a;
  --radius-md: 12px;
  --font-sans: 'Inter', system-ui, sans-serif;
}
```

No SASS variables, no JS theme objects, no provider components. Just CSS.

---

## 🛡️ The dual-compat guarantee

Every component in this kit is built under strict rules so it compiles cleanly on both runtimes:

- ✅ Pure **Options API** — no `<script setup>`, no `setup()`, no Composition API
- ✅ **Single root** template (Vue 2 has no fragments)
- ✅ **`emits` always declared** (Vue 3 needs it for `$attrs` separation)
- ✅ No Vue-3-only features (`<Teleport>`, `<Suspense>`, multi `v-model`)
- ✅ No Vue-2-only features (filters, `.native`, `$listeners`)

CI runs the full library through:

- 🟢 **Vite + `@vitejs/plugin-vue`** (Vue 3.4)
- 🟣 **webpack 4 + `vue-template-compiler`** (Vue 2.7)
- 🟡 **Storybook 6.5** (Vue 3.2)
- 🧪 **Vitest** on both Vue 2 and Vue 3 lanes, in parallel

If a PR doesn't build on either side, it doesn't ship.

---

## 🏗️ Why "ship raw SFC"?

Most libraries publish pre-compiled `.js` artifacts targeting one Vue runtime. That's how you end up with the Vue 2 / Vue 3 split in the ecosystem.

webcake-ui-kit publishes the **source `.vue` files** directly. Your app's bundler — Vite, webpack, whatever — compiles them against *your* Vue version. One source, two outputs, zero version lock-in.

The tradeoff: you need a bundler that handles `.vue`. (You already do.)

---

## 🧪 Local development

```bash
npm run preview        # Vue 2 + Vue 3 dev servers side by side
npm run test:build     # Compile-check everything (Vue 2, Vue 3, Storybook)
npm test               # Unit suite on both runtimes
```

See [CLAUDE.md](./CLAUDE.md) for the full contributor guide.

**Environment:** Node 14, Python ≤ 3.10 (required for the Vue 2 webpack-4 playground).

---

## 📜 License

ISC © Webcake Team

---

<p align="center">
  <sub>Made with 🍰 by <a href="https://github.com/pancake-vn">pancake-vn</a> — because nobody should have to rewrite their app to upgrade a UI library.</sub>
</p>
