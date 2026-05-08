export default {
  title: 'Introduction',
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: false },
    docs: {
      description: {
        component: 'webcake-ui-kit — raw `.vue` files, dual-compatible with Vue 2.7 and Vue 3.4.'
      }
    }
  }
}

export const Welcome = () => ({
  template: `
    <div style="
      max-width: 760px;
      margin: 0 auto;
      padding: 48px 24px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #111827;
      line-height: 1.6;
    ">
      <header style="margin-bottom: 32px;">
        <div style="
          display: inline-block;
          padding: 4px 10px;
          border-radius: 9999px;
          background: #DBFDE6;
          color: #13823B;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 12px;
        ">Vue 2 · Vue 3</div>
        <h1 style="margin: 0; font-size: 36px; font-weight: 700; letter-spacing: -0.02em;">
          webcake-ui-kit
        </h1>
        <p style="margin: 8px 0 0; color: #6b7280; font-size: 17px;">
          A small Vue UI library shipped as raw <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;">.vue</code> files,
          consumable from both Vue 2.7 and Vue 3.4 apps without a build step at the library level.
        </p>
      </header>

      <section style="margin-bottom: 28px;">
        <h2 style="font-size: 18px; margin: 0 0 8px;">Design constraints</h2>
        <ul style="margin: 0; padding-left: 20px; color: #374151;">
          <li>Pure <strong>Options API</strong> — no <code>&lt;script setup&gt;</code> or Composition API.</li>
          <li><strong>Single root</strong> in every <code>&lt;template&gt;</code> (Vue 2 has no fragments).</li>
          <li>Always declare <code>emits</code> — Vue 3 needs it for <code>$attrs</code> separation.</li>
          <li>BEM class naming: <code>ui-&lt;name&gt;--&lt;modifier&gt;</code>.</li>
          <li>Style via design tokens (<code>var(--*)</code>) only — no inline hex / px literals.</li>
        </ul>
      </section>

      <section style="margin-bottom: 28px;">
        <h2 style="font-size: 18px; margin: 0 0 8px;">Anatomy of a component</h2>
        <p style="margin: 0 0 8px;">Each component lives in its own folder with three concerns separated:</p>
        <pre style="
          background: #0c0f0d;
          color: #e5e7eb;
          padding: 14px 16px;
          border-radius: 8px;
          font-size: 13px;
          overflow-x: auto;
          margin: 0;
        "><code>src/components/badge/
├── Badge.vue        ← template + script (Options API, declared emits)
└── badge.css        ← BEM rules using var(--*) tokens</code></pre>
      </section>

      <section style="margin-bottom: 28px;">
        <h2 style="font-size: 18px; margin: 0 0 8px;">Components</h2>
        <p style="margin: 0; color: #374151;">
          Pick a component on the left to see its API, variants, and source.
          Each entry has <em>Primary</em>, <em>AllVariants</em>, and <em>Matrix</em> stories,
          plus a <em>FocusVisible</em> demo for keyboard accessibility.
        </p>
      </section>

      <footer style="
        margin-top: 40px;
        padding-top: 16px;
        border-top: 1px solid #e5e7eb;
        color: #6b7280;
        font-size: 13px;
      ">
        Storybook is a compile-check surface (<code>npm run test:storybook</code>) and a docs surface.
        It does <strong>not</strong> replace dual-compat verification — open
        <code>localhost:8001</code> (Vue 3) and <code>localhost:8080</code> (Vue 2) side-by-side via <code>npm run preview</code>.
      </footer>
    </div>
  `
})
Welcome.parameters = {
  docs: { source: { state: 'closed' } }
}
