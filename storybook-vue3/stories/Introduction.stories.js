import Button from '../../src/components/button/Button.vue'
import Badge from '../../src/components/badge/Badge.vue'

const PAGE_STYLE = `
  max-width: 880px;
  margin: 0 auto;
  padding: 56px 32px 80px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: var(--color-text, #111827);
  line-height: 1.65;
`

const CODE_BLOCK = `
  background: #0c0f0d;
  color: #e5e7eb;
  padding: 16px 18px;
  border-radius: 10px;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, monospace;
  font-size: 13px;
  line-height: 1.7;
  overflow-x: auto;
  margin: 0;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.04);
`

const INLINE_CODE = `
  background: rgba(125,125,125,0.12);
  color: #be185d;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.88em;
`

const PILL = (label, color, bg) => `
  <span style="
    display: inline-block;
    padding: 4px 10px;
    border-radius: 9999px;
    background: ${bg};
    color: ${color};
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  ">${label}</span>
`

const SECTION_H2 = `
  font-size: 22px;
  font-weight: 700;
  margin: 48px 0 12px;
  letter-spacing: -0.01em;
  color: var(--color-text, #111827);
`

const MUTED = `color: #6b7280;`

export default {
  title: 'Introduction',
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: false },
    docs: { source: { state: 'closed' } }
  }
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Welcome                                                                  */
/* ────────────────────────────────────────────────────────────────────────── */

export const Welcome = () => ({
  template: `
    <div style="${PAGE_STYLE}">
      <header style="margin-bottom: 32px;">
        ${PILL('Vue 2 · Vue 3 · One source', '#13823B', '#DBFDE6')}
        <h1 style="
          margin: 16px 0 12px;
          font-size: 56px;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.05;
          background: linear-gradient(135deg, #ff6b9d 0%, #c2185b 50%, #6a1b9a 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        ">
          webcake-ui-kit
        </h1>
        <p style="margin: 0; font-size: 20px; ${MUTED} line-height: 1.55;">
          The Vue UI kit that doesn't make you choose.<br />
          <strong style="color: inherit; font-weight: 600;">One library. Two Vue versions. Zero build step.</strong>
        </p>
      </header>

      <div style="
        display: flex;
        gap: 12px;
        margin: 32px 0 48px;
        flex-wrap: wrap;
      ">
        <a href="?path=/story/introduction--installation" style="
          padding: 10px 20px;
          background: #111827;
          color: white;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
        ">Get started →</a>
        <a href="?path=/story/introduction--quick-start" style="
          padding: 10px 20px;
          background: transparent;
          color: #111827;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
        ">Quick start</a>
        <a href="https://github.com/pancake-vn/webcake-ui-kit" target="_blank" rel="noopener" style="
          padding: 10px 20px;
          background: transparent;
          color: #111827;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
        ">GitHub ↗</a>
      </div>

      <section>
        <p style="font-size: 16px; line-height: 1.75;">
          Migrating from Vue 2 to Vue 3 is painful enough — your UI library shouldn't make it worse.
          Most Vue component libraries force you to <strong>pick a side</strong>. webcake-ui-kit refuses that tradeoff.
        </p>
        <p style="font-size: 16px; line-height: 1.75;">
          Every component is hand-authored under strict dual-compatibility rules so the
          <em>same import</em> compiles, renders, and behaves identically on
          <strong>Vue 2.7</strong> and <strong>Vue 3.4+</strong>.
        </p>
      </section>

      <h2 style="${SECTION_H2}">What you get</h2>

      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 16px;
        margin-top: 8px;
      ">
        ${[
          ['🎯', 'True dual-compat', 'One source. Vue 2.7 + Vue 3.x. Tested on both runtimes in CI.'],
          ['📦', 'Ships raw SFC', 'No pre-compiled artifacts. Your bundler compiles once, alongside your app.'],
          [
            '🎨',
            'Token-driven',
            'Override <code style="${INLINE_CODE}">--color-primary</code> and the whole kit rebrands.'
          ],
          [
            '♿',
            'Accessible',
            'Semantic HTML, <code style="${INLINE_CODE}">:focus-visible</code> rings, ARIA where it matters.'
          ],
          ['🪶', 'Tree-shakable', 'Named exports only. Import what you use, leave the rest.'],
          ['📖', 'Storybook included', "You're looking at it. Every variant, every state, browsable."]
        ]
          .map(
            ([icon, title, body]) => `
          <div style="
            padding: 18px;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            background: rgba(255,255,255,0.5);
          ">
            <div style="font-size: 22px; margin-bottom: 8px;">${icon}</div>
            <div style="font-weight: 700; margin-bottom: 4px; font-size: 15px;">${title}</div>
            <div style="font-size: 13.5px; ${MUTED} line-height: 1.55;">${body}</div>
          </div>
        `
          )
          .join('')}
      </div>

      <h2 style="${SECTION_H2}">What it looks like</h2>
      <pre style="${CODE_BLOCK}"><code><span style="color:#94a3b8;">// works on Vue 2.7 AND Vue 3.x — same import, same API</span>
<span style="color:#c084fc;">import</span> { Button, Dialog, Input } <span style="color:#c084fc;">from</span> <span style="color:#86efac;">'webcake-ui-kit'</span>
<span style="color:#c084fc;">import</span> <span style="color:#86efac;">'webcake-ui-kit/styles'</span></code></pre>

      <footer style="
        margin-top: 56px;
        padding-top: 20px;
        border-top: 1px solid #e5e7eb;
        ${MUTED}
        font-size: 13px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      ">
        <span>Next: <strong style="color:#111827;">Installation →</strong></span>
        <a href="?path=/story/introduction--installation" style="
          color: #ff6b9d;
          text-decoration: none;
          font-weight: 600;
        ">Read the install guide →</a>
      </footer>
    </div>
  `
})

/* ────────────────────────────────────────────────────────────────────────── */
/*  Installation                                                             */
/* ────────────────────────────────────────────────────────────────────────── */

export const Installation = () => ({
  template: `
    <div style="${PAGE_STYLE}">
      ${PILL('Step 1 of 3', '#1e40af', '#dbeafe')}
      <h1 style="margin: 16px 0 8px; font-size: 40px; font-weight: 800; letter-spacing: -0.02em;">
        Installation
      </h1>
      <p style="${MUTED} font-size: 17px; margin: 0 0 32px;">
        Add webcake-ui-kit to your Vue 2.7 or Vue 3 project. One package — both runtimes.
      </p>

      <h2 style="${SECTION_H2}">Install the package</h2>
      <p style="margin: 0 0 12px;">Pick your favourite package manager:</p>

      <div style="display: grid; gap: 10px;">
        <pre style="${CODE_BLOCK}"><code><span style="color:#94a3b8;">$</span> <span style="color:#86efac;">npm</span> install webcake-ui-kit</code></pre>
        <pre style="${CODE_BLOCK}"><code><span style="color:#94a3b8;">$</span> <span style="color:#86efac;">pnpm</span> add webcake-ui-kit</code></pre>
        <pre style="${CODE_BLOCK}"><code><span style="color:#94a3b8;">$</span> <span style="color:#86efac;">yarn</span> add webcake-ui-kit</code></pre>
      </div>

      <div style="
        margin: 20px 0;
        padding: 12px 16px;
        background: #fef3c7;
        border-left: 4px solid #f59e0b;
        border-radius: 6px;
        font-size: 14px;
        color: #78350f;
      ">
        <strong>Peer dependency:</strong>
        <code style="${INLINE_CODE} color: #78350f; background: rgba(120,53,15,0.08);">vue ^2.6.0 || ^3.0.0</code>.
        Make sure Vue is already installed in your app.
      </div>

      <h2 style="${SECTION_H2}">Register components</h2>
      <p style="margin: 0 0 16px;">
        webcake-ui-kit uses <strong>named exports</strong>. Import only what you need.
      </p>

      <h3 style="font-size: 16px; font-weight: 700; margin: 24px 0 10px;">Vue 3</h3>
      <pre style="${CODE_BLOCK}"><code><span style="color:#94a3b8;">// main.js</span>
<span style="color:#c084fc;">import</span> { createApp } <span style="color:#c084fc;">from</span> <span style="color:#86efac;">'vue'</span>
<span style="color:#c084fc;">import</span> { Button, Dialog, Input } <span style="color:#c084fc;">from</span> <span style="color:#86efac;">'webcake-ui-kit'</span>
<span style="color:#c084fc;">import</span> <span style="color:#86efac;">'webcake-ui-kit/styles'</span>
<span style="color:#c084fc;">import</span> App <span style="color:#c084fc;">from</span> <span style="color:#86efac;">'./App.vue'</span>

<span style="color:#c084fc;">const</span> app <span style="color:#c084fc;">=</span> createApp(App)
app.component(<span style="color:#86efac;">'Button'</span>, Button)
app.component(<span style="color:#86efac;">'Dialog'</span>, Dialog)
app.component(<span style="color:#86efac;">'Input'</span>, Input)
app.mount(<span style="color:#86efac;">'#app'</span>)</code></pre>

      <h3 style="font-size: 16px; font-weight: 700; margin: 24px 0 10px;">Vue 2.7</h3>
      <pre style="${CODE_BLOCK}"><code><span style="color:#94a3b8;">// main.js</span>
<span style="color:#c084fc;">import</span> Vue <span style="color:#c084fc;">from</span> <span style="color:#86efac;">'vue'</span>
<span style="color:#c084fc;">import</span> { Button, Dialog, Input } <span style="color:#c084fc;">from</span> <span style="color:#86efac;">'webcake-ui-kit'</span>
<span style="color:#c084fc;">import</span> <span style="color:#86efac;">'webcake-ui-kit/styles'</span>
<span style="color:#c084fc;">import</span> App <span style="color:#c084fc;">from</span> <span style="color:#86efac;">'./App.vue'</span>

Vue.component(<span style="color:#86efac;">'Button'</span>, Button)
Vue.component(<span style="color:#86efac;">'Dialog'</span>, Dialog)
Vue.component(<span style="color:#86efac;">'Input'</span>, Input)

<span style="color:#c084fc;">new</span> Vue({ render: h <span style="color:#c084fc;">=&gt;</span> h(App) }).$mount(<span style="color:#86efac;">'#app'</span>)</code></pre>

      <h2 style="${SECTION_H2}">Local-only import</h2>
      <p style="margin: 0 0 12px;">
        Prefer importing per-component instead of registering globally? That works too:
      </p>
      <pre style="${CODE_BLOCK}"><code><span style="color:#94a3b8;">// MyPage.vue</span>
<span style="color:#c084fc;">import</span> { Button, Badge } <span style="color:#c084fc;">from</span> <span style="color:#86efac;">'webcake-ui-kit'</span>

<span style="color:#c084fc;">export default</span> {
  components: { Button, Badge }
}</code></pre>

      <footer style="
        margin-top: 56px;
        padding-top: 20px;
        border-top: 1px solid #e5e7eb;
        ${MUTED}
        font-size: 13px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      ">
        <a href="?path=/story/introduction--welcome" style="color: #6b7280; text-decoration: none;">← Welcome</a>
        <a href="?path=/story/introduction--quick-start" style="
          color: #ff6b9d;
          text-decoration: none;
          font-weight: 600;
        ">Next: Quick start →</a>
      </footer>
    </div>
  `
})

/* ────────────────────────────────────────────────────────────────────────── */
/*  Quick start  — with live components                                       */
/* ────────────────────────────────────────────────────────────────────────── */

export const QuickStart = () => ({
  components: { Button, Badge },
  template: `
    <div style="${PAGE_STYLE}">
      ${PILL('Step 2 of 3', '#1e40af', '#dbeafe')}
      <h1 style="margin: 16px 0 8px; font-size: 40px; font-weight: 800; letter-spacing: -0.02em;">
        Quick start
      </h1>
      <p style="${MUTED} font-size: 17px; margin: 0 0 32px;">
        Get a button on screen in under 60 seconds. The example below is <strong>live</strong> — the
        same components you'll use in your own app.
      </p>

      <h2 style="${SECTION_H2}">Your first component</h2>
      <p style="margin: 0 0 16px;">
        Drop this in any <code style="${INLINE_CODE}">.vue</code> file in your app:
      </p>

      <pre style="${CODE_BLOCK}"><code><span style="color:#f87171;">&lt;template&gt;</span>
  <span style="color:#f87171;">&lt;Button</span> <span style="color:#fbbf24;">variant</span>=<span style="color:#86efac;">"primary"</span> <span style="color:#fbbf24;">@click</span>=<span style="color:#86efac;">"sayHi"</span><span style="color:#f87171;">&gt;</span>
    Click me
  <span style="color:#f87171;">&lt;/Button&gt;</span>
<span style="color:#f87171;">&lt;/template&gt;</span>

<span style="color:#f87171;">&lt;script&gt;</span>
<span style="color:#c084fc;">export default</span> {
  methods: {
    sayHi() { alert(<span style="color:#86efac;">'👋 hi from webcake'</span>) }
  }
}
<span style="color:#f87171;">&lt;/script&gt;</span></code></pre>

      <div style="
        margin: 16px 0 32px;
        padding: 24px;
        border: 1px dashed #d1d5db;
        border-radius: 12px;
        background: rgba(255,255,255,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
      ">
        <span style="${MUTED} font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;">Live →</span>
        <Button variant="primary" @click="sayHi">Click me</Button>
      </div>

      <h2 style="${SECTION_H2}">Variants &amp; sizes</h2>
      <p style="margin: 0 0 16px;">
        Every component exposes its variations through a small, predictable prop API:
      </p>

      <pre style="${CODE_BLOCK}"><code><span style="color:#f87171;">&lt;Button</span> <span style="color:#fbbf24;">variant</span>=<span style="color:#86efac;">"primary"</span><span style="color:#f87171;">&gt;</span>Primary<span style="color:#f87171;">&lt;/Button&gt;</span>
<span style="color:#f87171;">&lt;Button</span> <span style="color:#fbbf24;">variant</span>=<span style="color:#86efac;">"outline"</span><span style="color:#f87171;">&gt;</span>Outline<span style="color:#f87171;">&lt;/Button&gt;</span>
<span style="color:#f87171;">&lt;Button</span> <span style="color:#fbbf24;">variant</span>=<span style="color:#86efac;">"ghost"</span><span style="color:#f87171;">&gt;</span>Ghost<span style="color:#f87171;">&lt;/Button&gt;</span>
<span style="color:#f87171;">&lt;Button</span> <span style="color:#fbbf24;">variant</span>=<span style="color:#86efac;">"destructive"</span><span style="color:#f87171;">&gt;</span>Delete<span style="color:#f87171;">&lt;/Button&gt;</span></code></pre>

      <div style="
        margin: 16px 0 32px;
        padding: 24px;
        border: 1px dashed #d1d5db;
        border-radius: 12px;
        background: rgba(255,255,255,0.4);
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        align-items: center;
        justify-content: center;
      ">
        <Button variant="primary">Primary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Delete</Button>
      </div>

      <h2 style="${SECTION_H2}">Mixing components</h2>
      <p style="margin: 0 0 16px;">
        Components compose freely — slots, props, emits, all standard Vue conventions:
      </p>
      <div style="
        margin: 0 0 32px;
        padding: 24px;
        border: 1px dashed #d1d5db;
        border-radius: 12px;
        background: rgba(255,255,255,0.4);
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;
        justify-content: center;
      ">
        <Button variant="primary" size="sm">Save</Button>
        <Badge>New</Badge>
        <Badge variant="success">Released</Badge>
      </div>

      <h2 style="${SECTION_H2}">Where to go next</h2>
      <ul style="margin: 0; padding-left: 20px; font-size: 15px;">
        <li><a href="?path=/story/introduction--theming" style="color:#ff6b9d; font-weight:600;">Theming</a> — rebrand the kit with CSS variables.</li>
        <li><a href="?path=/story/introduction--dual-compatibility" style="color:#ff6b9d; font-weight:600;">Dual compatibility</a> — how this actually works on both Vue versions.</li>
        <li><strong>Components →</strong> pick one from the left sidebar to see every prop, slot, and variant.</li>
      </ul>

      <footer style="
        margin-top: 56px;
        padding-top: 20px;
        border-top: 1px solid #e5e7eb;
        ${MUTED}
        font-size: 13px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      ">
        <a href="?path=/story/introduction--installation" style="color: #6b7280; text-decoration: none;">← Installation</a>
        <a href="?path=/story/introduction--theming" style="
          color: #ff6b9d;
          text-decoration: none;
          font-weight: 600;
        ">Next: Theming →</a>
      </footer>
    </div>
  `,
  methods: {
    sayHi() {
      // eslint-disable-next-line no-alert
      window.alert('👋 hi from webcake')
    }
  }
})

/* ────────────────────────────────────────────────────────────────────────── */
/*  Theming                                                                   */
/* ────────────────────────────────────────────────────────────────────────── */

export const Theming = () => ({
  template: `
    <div style="${PAGE_STYLE}">
      ${PILL('Step 3 of 3', '#1e40af', '#dbeafe')}
      <h1 style="margin: 16px 0 8px; font-size: 40px; font-weight: 800; letter-spacing: -0.02em;">
        Theming
      </h1>
      <p style="${MUTED} font-size: 17px; margin: 0 0 32px;">
        Every component reads from CSS custom properties. Override them once on
        <code style="${INLINE_CODE}">:root</code> — the whole kit follows.
      </p>

      <h2 style="${SECTION_H2}">Override tokens</h2>
      <pre style="${CODE_BLOCK}"><code><span style="color:#94a3b8;">/* your app's global stylesheet */</span>
<span style="color:#fbbf24;">:root</span> {
  <span style="color:#86efac;">--color-primary</span>: <span style="color:#f87171;">#ff6b9d</span>;
  <span style="color:#86efac;">--color-primary-hover</span>: <span style="color:#f87171;">#ff4d8a</span>;
  <span style="color:#86efac;">--radius-md</span>: <span style="color:#f87171;">12px</span>;
  <span style="color:#86efac;">--font-sans</span>: <span style="color:#86efac;">'Inter'</span>, system-ui, sans-serif;
}</code></pre>

      <p style="margin: 16px 0; font-size: 15px;">
        No SASS variables. No JS theme provider. No runtime patching. Just CSS — the way the platform meant it.
      </p>

      <h2 style="${SECTION_H2}">Dark mode</h2>
      <p style="margin: 0 0 12px;">
        Every color token already has a <code style="${INLINE_CODE}">.dark</code> companion.
        Toggle a class on <code style="${INLINE_CODE}">&lt;html&gt;</code> and you're done:
      </p>
      <pre style="${CODE_BLOCK}"><code><span style="color:#94a3b8;">/* dark theme overrides */</span>
<span style="color:#fbbf24;">.dark</span> {
  <span style="color:#86efac;">--color-bg</span>: <span style="color:#f87171;">#0b0b0f</span>;
  <span style="color:#86efac;">--color-fg</span>: <span style="color:#f87171;">#f4f4f5</span>;
  <span style="color:#94a3b8;">/* …everything else cascades */</span>
}</code></pre>
      <p style="margin: 12px 0; font-size: 14px; ${MUTED}">
        💡 Try toggling the dark-mode switch in the Storybook toolbar (top-right) to see it live.
      </p>

      <h2 style="${SECTION_H2}">Available token groups</h2>
      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 12px;
      ">
        ${[
          ['🎨 Colors', 'src/styles/color_general.css'],
          ['📏 Spacing', 'src/styles/spacing.css'],
          ['🔲 Radius', 'src/styles/border_radius.css'],
          ['🔤 Typography', 'src/styles/typography.css'],
          ['🌑 Shadows', 'src/styles/shadow.css']
        ]
          .map(
            ([title, path]) => `
          <div style="
            padding: 14px;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            background: rgba(255,255,255,0.5);
          ">
            <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">${title}</div>
            <code style="${INLINE_CODE} font-size: 11.5px;">${path}</code>
          </div>
        `
          )
          .join('')}
      </div>

      <footer style="
        margin-top: 56px;
        padding-top: 20px;
        border-top: 1px solid #e5e7eb;
        ${MUTED}
        font-size: 13px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      ">
        <a href="?path=/story/introduction--quick-start" style="color: #6b7280; text-decoration: none;">← Quick start</a>
        <a href="?path=/story/introduction--dual-compatibility" style="
          color: #ff6b9d;
          text-decoration: none;
          font-weight: 600;
        ">Next: Dual compatibility →</a>
      </footer>
    </div>
  `
})

/* ────────────────────────────────────────────────────────────────────────── */
/*  Dual compatibility                                                       */
/* ────────────────────────────────────────────────────────────────────────── */

export const DualCompatibility = () => ({
  template: `
    <div style="${PAGE_STYLE}">
      ${PILL('Deep dive', '#7c2d12', '#fed7aa')}
      <h1 style="margin: 16px 0 8px; font-size: 40px; font-weight: 800; letter-spacing: -0.02em;">
        Dual compatibility
      </h1>
      <p style="${MUTED} font-size: 17px; margin: 0 0 32px;">
        How a single <code style="${INLINE_CODE}">.vue</code> file compiles cleanly on both
        Vue 2.7 and Vue 3.4+.
      </p>

      <h2 style="${SECTION_H2}">The authoring contract</h2>
      <p style="margin: 0 0 16px;">
        Every component in this kit follows the same rules. They're enforced by review, by CI, and by
        the <code style="${INLINE_CODE}">vue-dual-component</code> skill.
      </p>

      <table style="
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
        margin: 0 0 24px;
      ">
        <thead>
          <tr style="background: #f9fafb;">
            <th style="text-align:left; padding: 10px 14px; border-bottom: 1px solid #e5e7eb;">Rule</th>
            <th style="text-align:left; padding: 10px 14px; border-bottom: 1px solid #e5e7eb;">Why</th>
          </tr>
        </thead>
        <tbody>
          ${[
            [
              'Pure Options API',
              'No <code>setup()</code> or Composition API — Vue 2.7 supports both, but Composition syntax fragments the codebase.'
            ],
            ['Single root template', 'Vue 2 has no fragment support.'],
            [
              '<code>emits</code> always declared',
              'Vue 3 needs it for <code>$attrs</code> inheritance. Vue 2 ignores it.'
            ],
            ['No <code>&lt;Teleport&gt;</code> / <code>&lt;Suspense&gt;</code>', 'Vue-3-only built-ins.'],
            ['No filters / <code>.native</code> / <code>$listeners</code>', 'Vue-2-only — removed in Vue 3.'],
            ['No <code>:deep()</code> selector', 'Vue-3-only. Avoid scoped descendant overrides entirely.']
          ]
            .map(
              ([rule, why]) => `
            <tr>
              <td style="padding: 10px 14px; border-bottom: 1px solid #f3f4f6; font-weight: 600;">${rule}</td>
              <td style="padding: 10px 14px; border-bottom: 1px solid #f3f4f6; ${MUTED}">${why}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <h2 style="${SECTION_H2}">CI matrix</h2>
      <p style="margin: 0 0 16px;">
        Every commit goes through four parallel lanes. If a PR doesn't build on either side, it doesn't ship.
      </p>

      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 12px;
        margin: 0 0 32px;
      ">
        ${[
          ['🟢', 'Vue 3.4', 'Vite + @vitejs/plugin-vue'],
          ['🟣', 'Vue 2.7', 'webpack 4 + vue-template-compiler'],
          ['🟡', 'Storybook 6.5', 'Story-side compile check'],
          ['🧪', 'Vitest × 2 lanes', 'Runtime + behavior parity']
        ]
          .map(
            ([icon, title, sub]) => `
          <div style="
            padding: 16px;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
          ">
            <div style="font-size: 22px; margin-bottom: 4px;">${icon}</div>
            <div style="font-weight: 700; font-size: 14px;">${title}</div>
            <div style="${MUTED} font-size: 12.5px; margin-top: 2px;">${sub}</div>
          </div>
        `
          )
          .join('')}
      </div>

      <h2 style="${SECTION_H2}">Anatomy of a component</h2>
      <pre style="${CODE_BLOCK}"><code>src/components/badge/
├── <span style="color:#86efac;">Badge.vue</span>     <span style="color:#94a3b8;">← template + script (Options API, declared emits)</span>
└── <span style="color:#86efac;">badge.css</span>     <span style="color:#94a3b8;">← BEM rules using var(--*) tokens</span></code></pre>

      <p style="margin: 16px 0 0; font-size: 14px; ${MUTED}">
        The SFC links its CSS via <code style="${INLINE_CODE}">&lt;style src="./badge.css" scoped&gt;&lt;/style&gt;</code> —
        no inline rules. This keeps the SFC clean and lets the same CSS file be reused outside the SFC if needed.
      </p>

      <footer style="
        margin-top: 56px;
        padding-top: 20px;
        border-top: 1px solid #e5e7eb;
        ${MUTED}
        font-size: 13px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      ">
        <a href="?path=/story/introduction--theming" style="color: #6b7280; text-decoration: none;">← Theming</a>
        <span>Pick a component from the left sidebar to see it in action →</span>
      </footer>
    </div>
  `
})

Welcome.parameters = { docs: { source: { state: 'closed' } } }
Installation.parameters = { docs: { source: { state: 'closed' } } }
QuickStart.parameters = { docs: { source: { state: 'closed' } } }
Theming.parameters = { docs: { source: { state: 'closed' } } }
DualCompatibility.parameters = { docs: { source: { state: 'closed' } } }
