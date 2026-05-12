/* eslint-disable */
import WkTypography from '../../src/components/typography/Typography.vue'

const PAGE_STYLE = `
  max-width: 1080px;
  margin: 0 auto;
  padding: 48px 32px 80px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: var(--docs-fg, #111827);
  line-height: 1.6;
`

const THEME_CSS = `
  .type-page {
    --docs-fg: #111827;
    --docs-fg-strong: #0b0f1a;
    --docs-muted: #6b7280;
    --docs-border: #e5e7eb;
    --docs-card-bg: rgba(15,23,42,0.025);
    --docs-table-head: #f9fafb;
    --docs-code-bg: rgba(125,125,125,0.12);
    --docs-code-fg: #be185d;
  }
  html.dark .type-page,
  body.dark .type-page,
  .dark .type-page {
    --docs-fg: #e6e8eb;
    --docs-fg-strong: #ffffff;
    --docs-muted: #9aa3af;
    --docs-border: #2a2f39;
    --docs-card-bg: rgba(255,255,255,0.04);
    --docs-table-head: #1c2128;
    --docs-code-bg: rgba(255,255,255,0.08);
    --docs-code-fg: #ff89b5;
  }
  .type-page code.inline {
    background: var(--docs-code-bg);
    color: var(--docs-code-fg);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;
    font-size: 0.88em;
  }
  .type-section {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 24px;
    padding: 20px 24px;
    border: 1px solid var(--docs-border);
    border-radius: 12px;
    background: var(--docs-card-bg);
    margin: 0 0 14px;
    align-items: center;
  }
  @media (max-width: 720px) {
    .type-section { grid-template-columns: 1fr; }
  }
  .type-sample { color: var(--docs-fg-strong); margin: 0; overflow-wrap: anywhere; }
  .type-meta {
    border-left: 1px solid var(--docs-border);
    padding-left: 20px;
    font-size: 12px;
  }
  @media (max-width: 720px) {
    .type-meta { border-left: 0; border-top: 1px solid var(--docs-border); padding-left: 0; padding-top: 16px; }
  }
  .type-meta__name {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 12px;
    color: var(--docs-fg-strong);
    margin-bottom: 8px;
    word-break: break-all;
  }
  .type-meta__row {
    display: flex;
    justify-content: space-between;
    color: var(--docs-muted);
    padding: 2px 0;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px;
  }
  .type-meta__row b { color: var(--docs-fg-strong); font-weight: 600; }
  .section-h2 {
    font-size: 22px;
    font-weight: 700;
    margin: 40px 0 6px;
    letter-spacing: -0.01em;
    color: var(--docs-fg-strong);
  }
  .section-lead { color: var(--docs-muted); margin: 0 0 16px; font-size: 14px; }
  .demo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 12px;
    margin: 0 0 24px;
  }
  .demo-card {
    padding: 18px;
    border: 1px solid var(--docs-border);
    border-radius: 12px;
    background: var(--docs-card-bg);
  }
  .demo-card__label {
    font-size: 11px;
    color: var(--docs-muted);
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`

if (typeof document !== 'undefined' && !document.getElementById('type-doc-style')) {
  const styleEl = document.createElement('style')
  styleEl.id = 'type-doc-style'
  styleEl.textContent = THEME_CSS
  document.head.appendChild(styleEl)
}

const SAMPLE = 'The quick brown fox jumps over the lazy dog'

const STYLES = [
  { label: 'Heading 1', variant: 'heading-1', weightToken: 'heading-1-font-weight' },
  { label: 'Heading 2', variant: 'heading-2', weightToken: 'heading-2-font-weight' },
  { label: 'Heading 3', variant: 'heading-3', weightToken: 'heading-3-font-weight' },
  { label: 'Heading 4', variant: 'heading-4', weightToken: 'heading-4-font-weight' },
  { label: 'Paragraph Large', variant: 'paragraph-large', weightToken: 'paragraph-font-weight' },
  { label: 'Paragraph Regular', variant: 'paragraph-regular', weightToken: 'paragraph-font-weight' },
  { label: 'Paragraph Small', variant: 'paragraph-small', weightToken: 'paragraph-font-weight' },
  { label: 'Paragraph Mini', variant: 'paragraph-mini', weightToken: 'paragraph-font-weight' },
  { label: 'Caption', variant: 'caption', weightToken: 'caption-font-weight' },
  { label: 'Caption Mini', variant: 'caption-mini', weightToken: 'caption-mini-font-weight' },
  { label: 'Monospaced', variant: 'monospaced', weightToken: 'monospaced-font-weight' }
]

const FAMILIES = [
  { token: 'font-family-sans', preview: 'Aa Bb Cc 0123' },
  { token: 'font-family-serif', preview: 'Aa Bb Cc 0123' },
  { token: 'font-family-heading', preview: 'Heading display' },
  { token: 'font-family-body', preview: 'Body copy in paragraphs.' },
  { token: 'font-family-monospace', preview: 'const code = true' }
]

const WEIGHTS = [
  { label: 'Regular', token: 'paragraph-font-weight' },
  { label: 'Medium', token: 'paragraph-medium-font-weight' },
  { label: 'Bold', token: 'paragraph-bold-font-weight' }
]

const TYPE_LIFECYCLE = {
  mounted() {
    this.__resolve = () => {
      const cs = getComputedStyle(document.documentElement)
      document.querySelectorAll('[data-token-value]').forEach(el => {
        const v = cs.getPropertyValue('--' + el.dataset.tokenValue)
        if (v) el.textContent = v.trim()
      })
    }
    this.$nextTick(() => {
      this.__resolve()
      this.__obs = new MutationObserver(this.__resolve)
      this.__obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
      if (document.body) this.__obs.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    })
  },
  beforeUnmount() {
    if (this.__obs) this.__obs.disconnect()
  }
}

export default {
  title: 'Foundations/Typography',
  component: WkTypography,
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: false },
    docs: { source: { state: 'closed' } }
  }
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Text styles — uses <WkTypography> directly so the on-page output is the   */
/*  exact same component consumers ship.                                      */
/* ────────────────────────────────────────────────────────────────────────── */

export const TextStyles = () => ({
  components: { WkTypography },
  data: () => ({ STYLES, SAMPLE }),
  ...TYPE_LIFECYCLE,
  template: `
    <div class="type-page" style="${PAGE_STYLE}">
      <h1 style="margin: 0 0 6px; font-size: 40px; font-weight: 800; letter-spacing: -0.02em;">Typography</h1>
      <p style="color: var(--docs-muted); margin: 0 0 18px; font-size: 16px;">
        Eleven text styles, each a bundle of CSS variables. Use them via the
        <code class="inline">&lt;WkTypography variant="…"&gt;</code> component, the
        <code class="inline">.wk-&lt;variant&gt;</code> utility class, or the
        <code class="inline">--font-&lt;variant&gt;</code> shorthand token.
      </p>

      <pre style="background: #0c0f0d; color: #e5e7eb; padding: 14px 16px; border-radius: 10px; font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 12.5px; line-height: 1.7; margin: 0 0 28px; overflow-x: auto;"><code><span style="color:#94a3b8;">// component</span>
&lt;<span style="color:#fbbf24;">WkTypography</span> <span style="color:#86efac;">variant</span>=<span style="color:#f87171;">"heading-1"</span>&gt;Hello&lt;/<span style="color:#fbbf24;">WkTypography</span>&gt;

<span style="color:#94a3b8;">// utility class</span>
&lt;h1 <span style="color:#86efac;">class</span>=<span style="color:#f87171;">"wk-heading-1"</span>&gt;Hello&lt;/h1&gt;

<span style="color:#94a3b8;">// font shorthand</span>
<span style="color:#fbbf24;">.my-heading</span> { <span style="color:#86efac;">font</span>: <span style="color:#c084fc;">var</span>(--font-heading-1); }</code></pre>

      <div v-for="s in STYLES" :key="s.variant" class="type-section">
        <WkTypography :variant="s.variant" class="type-sample">{{ s.label }} — {{ SAMPLE }}</WkTypography>
        <div class="type-meta">
          <div class="type-meta__name">variant="{{ s.variant }}"</div>
          <div class="type-meta__row"><span>font-size</span><b :data-token-value="s.variant + '-font-size'">—</b></div>
          <div class="type-meta__row"><span>line-height</span><b :data-token-value="s.variant + '-line-height'">—</b></div>
          <div class="type-meta__row"><span>font-weight</span><b :data-token-value="s.weightToken">—</b></div>
          <div class="type-meta__row"><span>letter-spacing</span><b :data-token-value="s.variant + '-letter-spacing'">—</b></div>
          <div class="type-meta__row"><span>font-family</span><b :data-token-value="s.variant + '-font-family'">—</b></div>
        </div>
      </div>
    </div>
  `
})

/* ────────────────────────────────────────────────────────────────────────── */

export const Families = () => ({
  data: () => ({ FAMILIES }),
  ...TYPE_LIFECYCLE,
  template: `
    <div class="type-page" style="${PAGE_STYLE}">
      <h1 style="margin: 0 0 6px; font-size: 40px; font-weight: 800; letter-spacing: -0.02em;">Font families</h1>
      <p style="color: var(--docs-muted); margin: 0 0 24px; font-size: 16px;">
        Five family aliases. <code class="inline">--font-family-heading</code> and
        <code class="inline">--font-family-body</code> alias to <code class="inline">--font-family-sans</code>
        by default — override the leaves to retheme.
      </p>
      <div class="demo-grid">
        <div v-for="f in FAMILIES" :key="f.token" class="demo-card">
          <div class="demo-card__label">--{{ f.token }}</div>
          <div :style="{ fontFamily: 'var(--' + f.token + ')', fontSize: '22px' }">{{ f.preview }}</div>
          <div style="font-size: 12px; color: var(--docs-muted); font-family: 'JetBrains Mono', monospace; margin-top: 6px;" :data-token-value="f.token">—</div>
        </div>
      </div>
    </div>
  `
})

/* ────────────────────────────────────────────────────────────────────────── */

export const Weights = () => ({
  components: { WkTypography },
  data: () => ({ WEIGHTS }),
  ...TYPE_LIFECYCLE,
  template: `
    <div class="type-page" style="${PAGE_STYLE}">
      <h1 style="margin: 0 0 6px; font-size: 40px; font-weight: 800; letter-spacing: -0.02em;">Paragraph weights</h1>
      <p style="color: var(--docs-muted); margin: 0 0 24px; font-size: 16px;">
        Three reusable weight tokens. Apply via the <code class="inline">weight</code>
        prop on <code class="inline">&lt;WkTypography&gt;</code>, or the
        <code class="inline">.wk-weight-&lt;name&gt;</code> utility class.
      </p>
      <div class="demo-grid">
        <div v-for="w in WEIGHTS" :key="w.token" class="demo-card">
          <div class="demo-card__label">.wk-weight-{{ w.label.toLowerCase() }}</div>
          <WkTypography variant="paragraph-large" :weight="w.label.toLowerCase()" style="font-size: 22px;">{{ w.label }}</WkTypography>
          <div style="font-size: 12px; color: var(--docs-muted); font-family: 'JetBrains Mono', monospace; margin-top: 6px;" :data-token-value="w.token">—</div>
        </div>
      </div>
    </div>
  `
})

/* ────────────────────────────────────────────────────────────────────────── */
/*  Playground — variant/weight/align/color knobs                             */
/* ────────────────────────────────────────────────────────────────────────── */

export const Playground = () => ({
  components: { WkTypography },
  data() {
    return {
      variant: 'paragraph-regular',
      weight: '',
      align: 'inherit',
      color: '',
      text: 'The quick brown fox jumps over the lazy dog',
      VARIANTS: STYLES.map(s => s.variant),
      WEIGHT_OPTIONS: ['', 'regular', 'medium', 'bold'],
      ALIGN_OPTIONS: ['inherit', 'left', 'center', 'right'],
      COLOR_OPTIONS: [
        '',
        'primary-fg',
        'secondary-fg',
        'muted-fg',
        'accent-fg',
        'inverse-fg',
        'destructive',
        'destructive-text'
      ]
    }
  },
  template: `
    <div class="type-page" style="${PAGE_STYLE}">
      <h1 style="margin: 0 0 6px; font-size: 40px; font-weight: 800; letter-spacing: -0.02em;">Typography playground</h1>
      <p style="color: var(--docs-muted); margin: 0 0 24px; font-size: 16px;">
        Twist the knobs to see how the component reacts. The output is a real
        <code class="inline">&lt;WkTypography&gt;</code> instance.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 24px;">
        <label style="display:flex;flex-direction:column;gap:4px;font-size:12px;color:var(--docs-muted);font-family:'JetBrains Mono',monospace;">
          variant
          <select v-model="variant" style="padding:6px 8px;border-radius:6px;border:1px solid var(--docs-border);background:transparent;color:inherit;">
            <option v-for="v in VARIANTS" :key="v" :value="v">{{ v }}</option>
          </select>
        </label>
        <label style="display:flex;flex-direction:column;gap:4px;font-size:12px;color:var(--docs-muted);font-family:'JetBrains Mono',monospace;">
          weight
          <select v-model="weight" style="padding:6px 8px;border-radius:6px;border:1px solid var(--docs-border);background:transparent;color:inherit;">
            <option v-for="w in WEIGHT_OPTIONS" :key="w || 'none'" :value="w">{{ w || '(default)' }}</option>
          </select>
        </label>
        <label style="display:flex;flex-direction:column;gap:4px;font-size:12px;color:var(--docs-muted);font-family:'JetBrains Mono',monospace;">
          align
          <select v-model="align" style="padding:6px 8px;border-radius:6px;border:1px solid var(--docs-border);background:transparent;color:inherit;">
            <option v-for="a in ALIGN_OPTIONS" :key="a" :value="a">{{ a }}</option>
          </select>
        </label>
        <label style="display:flex;flex-direction:column;gap:4px;font-size:12px;color:var(--docs-muted);font-family:'JetBrains Mono',monospace;">
          color
          <select v-model="color" style="padding:6px 8px;border-radius:6px;border:1px solid var(--docs-border);background:transparent;color:inherit;">
            <option v-for="c in COLOR_OPTIONS" :key="c || 'none'" :value="c">{{ c || '(default)' }}</option>
          </select>
        </label>
      </div>

      <textarea v-model="text" rows="3" style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid var(--docs-border);background:transparent;color:inherit;font:inherit;margin-bottom:24px;"></textarea>

      <div style="padding: 32px 28px; border: 1px dashed var(--docs-border); border-radius: 12px; background: var(--docs-card-bg);">
        <WkTypography :variant="variant" :weight="weight" :align="align" :color="color">{{ text }}</WkTypography>
      </div>
    </div>
  `
})

TextStyles.parameters = { docs: { source: { state: 'closed' } } }
Families.parameters = { docs: { source: { state: 'closed' } } }
Weights.parameters = { docs: { source: { state: 'closed' } } }
Playground.parameters = { docs: { source: { state: 'closed' } } }
