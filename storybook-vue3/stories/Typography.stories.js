/* eslint-disable */
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
    grid-template-columns: 1fr 260px;
    gap: 24px;
    padding: 24px;
    border: 1px solid var(--docs-border);
    border-radius: 12px;
    background: var(--docs-card-bg);
    margin: 0 0 16px;
    align-items: center;
  }
  @media (max-width: 720px) {
    .type-section { grid-template-columns: 1fr; }
  }
  .type-sample {
    color: var(--docs-fg-strong);
    margin: 0;
    overflow-wrap: anywhere;
  }
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
  .type-meta__row b {
    color: var(--docs-fg-strong);
    font-weight: 600;
  }
  .section-h2 {
    font-size: 22px;
    font-weight: 700;
    margin: 40px 0 6px;
    letter-spacing: -0.01em;
    color: var(--docs-fg-strong);
  }
  .section-lead {
    color: var(--docs-muted);
    margin: 0 0 16px;
    font-size: 14px;
  }
  .family-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 12px;
    margin: 0 0 24px;
  }
  .family-card {
    padding: 18px;
    border: 1px solid var(--docs-border);
    border-radius: 12px;
    background: var(--docs-card-bg);
  }
  .family-card__label {
    font-size: 12px;
    color: var(--docs-muted);
    margin-bottom: 8px;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
  }
  .family-card__preview {
    font-size: 22px;
    color: var(--docs-fg-strong);
    margin-bottom: 4px;
  }
  .family-card__value {
    font-size: 12px;
    color: var(--docs-muted);
    font-family: 'JetBrains Mono', ui-monospace, monospace;
  }
  .weights-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
    margin: 0 0 24px;
  }
  .weight-card {
    padding: 18px;
    border: 1px solid var(--docs-border);
    border-radius: 12px;
    background: var(--docs-card-bg);
  }
  .weight-card__sample {
    font-size: 24px;
    color: var(--docs-fg-strong);
    margin-bottom: 6px;
  }
  .weight-card__token {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px;
    color: var(--docs-muted);
    margin-bottom: 2px;
    word-break: break-all;
  }
  .weight-card__value {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 12px;
    color: var(--docs-fg-strong);
    font-weight: 600;
  }
`

if (typeof document !== 'undefined' && !document.getElementById('type-doc-style')) {
  const styleEl = document.createElement('style')
  styleEl.id = 'type-doc-style'
  styleEl.textContent = THEME_CSS
  document.head.appendChild(styleEl)
}

const SAMPLE = 'The quick brown fox jumps over the lazy dog'

// Each entry: [label, prefix, defaultWeightOverride?]
const STYLES = [
  { label: 'Heading 1', prefix: 'heading-1' },
  { label: 'Heading 2', prefix: 'heading-2' },
  { label: 'Heading 3', prefix: 'heading-3' },
  { label: 'Heading 4', prefix: 'heading-4' },
  { label: 'Paragraph Large', prefix: 'paragraph-large', defaultWeight: 'paragraph-font-weight' },
  { label: 'Paragraph Regular', prefix: 'paragraph-regular', defaultWeight: 'paragraph-font-weight' },
  { label: 'Paragraph Small', prefix: 'paragraph-small', defaultWeight: 'paragraph-font-weight' },
  { label: 'Paragraph Mini', prefix: 'paragraph-mini', defaultWeight: 'paragraph-font-weight' },
  { label: 'Caption', prefix: 'caption' },
  { label: 'Caption Mini', prefix: 'caption-mini' },
  { label: 'Monospaced', prefix: 'monospaced' }
]

function styleRow({ label, prefix, defaultWeight }) {
  const weightVar = defaultWeight ? `var(--${defaultWeight})` : `var(--${prefix}-font-weight)`
  const inlineStyle = `
    font-family: var(--${prefix}-font-family);
    font-size: var(--${prefix}-font-size);
    line-height: var(--${prefix}-line-height);
    font-weight: ${weightVar};
    letter-spacing: var(--${prefix}-letter-spacing);
  `
  return `
    <div class="type-section">
      <p class="type-sample" style="${inlineStyle}">${label} — ${SAMPLE}</p>
      <div class="type-meta">
        <div class="type-meta__name">--${prefix}-*</div>
        <div class="type-meta__row"><span>font-size</span><b data-token-value="${prefix}-font-size">—</b></div>
        <div class="type-meta__row"><span>line-height</span><b data-token-value="${prefix}-line-height">—</b></div>
        <div class="type-meta__row"><span>font-weight</span><b data-token-value="${defaultWeight || prefix + '-font-weight'}">—</b></div>
        <div class="type-meta__row"><span>letter-spacing</span><b data-token-value="${prefix}-letter-spacing">—</b></div>
        <div class="type-meta__row"><span>font-family</span><b data-token-value="${prefix}-font-family">—</b></div>
      </div>
    </div>
  `
}

const FAMILIES = [
  { label: '--font-family-sans', preview: 'Aa Bb Cc 0123' },
  { label: '--font-family-serif', preview: 'Aa Bb Cc 0123' },
  { label: '--font-family-heading', preview: 'Heading Display' },
  { label: '--font-family-body', preview: 'Body copy in paragraphs.' },
  { label: '--font-family-monospace', preview: 'const code = true' }
]

const WEIGHTS = [
  { label: 'Paragraph', token: 'paragraph-font-weight' },
  { label: 'Paragraph Medium', token: 'paragraph-medium-font-weight' },
  { label: 'Paragraph Bold', token: 'paragraph-bold-font-weight' }
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
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: false },
    docs: { source: { state: 'closed' } }
  }
}

export const TextStyles = () => ({
  template: `
    <div class="type-page" style="${PAGE_STYLE}">
      <h1 style="margin: 0 0 6px; font-size: 40px; font-weight: 800; letter-spacing: -0.02em;">Typography</h1>
      <p style="color: var(--docs-muted); margin: 0 0 24px; font-size: 16px;">
        Every text style is a bundle of CSS variables — font-family, size, line-height, weight, and
        letter-spacing. Apply them via <code class="inline">var(--&lt;style&gt;-font-size)</code> etc., or
        compose a class like:
      </p>
      <pre style="background: #0c0f0d; color: #e5e7eb; padding: 14px 16px; border-radius: 10px; font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 12.5px; line-height: 1.7; margin: 0 0 28px; overflow-x: auto;"><code><span style="color:#fbbf24;">.heading-1</span> {
  <span style="color:#86efac;">font-family</span>: <span style="color:#c084fc;">var</span>(--heading-1-font-family);
  <span style="color:#86efac;">font-size</span>:   <span style="color:#c084fc;">var</span>(--heading-1-font-size);
  <span style="color:#86efac;">line-height</span>: <span style="color:#c084fc;">var</span>(--heading-1-line-height);
  <span style="color:#86efac;">font-weight</span>: <span style="color:#c084fc;">var</span>(--heading-1-font-weight);
  <span style="color:#86efac;">letter-spacing</span>: <span style="color:#c084fc;">var</span>(--heading-1-letter-spacing);
}</code></pre>

      ${STYLES.map(styleRow).join('')}
    </div>
  `,
  ...TYPE_LIFECYCLE
})

export const Families = () => ({
  template: `
    <div class="type-page" style="${PAGE_STYLE}">
      <h1 style="margin: 0 0 6px; font-size: 40px; font-weight: 800; letter-spacing: -0.02em;">Font families</h1>
      <p style="color: var(--docs-muted); margin: 0 0 24px; font-size: 16px;">
        Five family aliases. <code class="inline">--font-family-heading</code> and
        <code class="inline">--font-family-body</code> alias to <code class="inline">--font-family-sans</code>
        — override the leaves to retheme.
      </p>
      <div class="family-grid">
        ${FAMILIES.map(
          f => `
          <div class="family-card">
            <div class="family-card__label">${f.label}</div>
            <div class="family-card__preview" style="font-family: var(${f.label});">${f.preview}</div>
            <div class="family-card__value" data-token-value="${f.label.replace('--', '')}">—</div>
          </div>
        `
        ).join('')}
      </div>
    </div>
  `,
  ...TYPE_LIFECYCLE
})

export const Weights = () => ({
  template: `
    <div class="type-page" style="${PAGE_STYLE}">
      <h1 style="margin: 0 0 6px; font-size: 40px; font-weight: 800; letter-spacing: -0.02em;">Paragraph weights</h1>
      <p style="color: var(--docs-muted); margin: 0 0 24px; font-size: 16px;">
        Three reusable weight tokens, shared by all <code class="inline">--paragraph-*</code> styles.
      </p>
      <div class="weights-grid">
        ${WEIGHTS.map(
          w => `
          <div class="weight-card">
            <div class="weight-card__sample" style="font-weight: var(--${w.token});">${w.label}</div>
            <div class="weight-card__token">--${w.token}</div>
            <div class="weight-card__value" data-token-value="${w.token}">—</div>
          </div>
        `
        ).join('')}
      </div>
    </div>
  `,
  ...TYPE_LIFECYCLE
})

TextStyles.parameters = { docs: { source: { state: 'closed' } } }
Families.parameters = { docs: { source: { state: 'closed' } } }
Weights.parameters = { docs: { source: { state: 'closed' } } }
