/* eslint-disable */
const PAGE_STYLE = `
  max-width: 1140px;
  margin: 0 auto;
  padding: 40px 28px 80px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: var(--docs-fg, #111827);
  line-height: 1.6;
`

const THEME_CSS = `
  .colors-page {
    --docs-fg: #111827;
    --docs-fg-strong: #0b0f1a;
    --docs-muted: #6b7280;
    --docs-border: #e5e7eb;
    --docs-border-soft: #eef0f3;
    --docs-card-bg: #ffffff;
    --docs-panel-bg: #f8fafc;
  }
  html.dark .colors-page,
  body.dark .colors-page,
  .dark .colors-page {
    --docs-fg: #e6e8eb;
    --docs-fg-strong: #ffffff;
    --docs-muted: #9aa3af;
    --docs-border: #2a2f39;
    --docs-border-soft: #1f242d;
    --docs-card-bg: #161a21;
    --docs-panel-bg: #11151b;
  }

  .section-h2 {
    font-size: 20px;
    font-weight: 700;
    margin: 36px 0 4px;
    letter-spacing: -0.01em;
    color: var(--docs-fg-strong);
  }
  .section-lead {
    color: var(--docs-muted);
    margin: 0 0 14px;
    font-size: 13.5px;
  }

  /* ---------- Semantic swatch ---------- */
  .sw-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 10px;
    margin: 0 0 28px;
  }
  .sw {
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid var(--docs-border);
    background: var(--docs-card-bg);
    transition: transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .sw:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    border-color: var(--docs-fg-strong);
  }
  .sw__chip {
    height: 76px;
    width: 100%;
    position: relative;
    border-bottom: 1px solid var(--docs-border-soft);
    cursor: pointer;
  }
  .sw__chip--checker::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(45deg, #d1d5db 25%, transparent 25%),
      linear-gradient(-45deg, #d1d5db 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #d1d5db 75%),
      linear-gradient(-45deg, transparent 75%, #d1d5db 75%);
    background-size: 12px 12px;
    background-position: 0 0, 0 6px, 6px -6px, -6px 0;
    background-color: #ffffff;
    z-index: 0;
  }
  .sw__fill {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
  }
  .sw__hex {
    position: absolute;
    left: 0; right: 0; bottom: 0;
    padding: 8px 10px;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    pointer-events: none;
    z-index: 2;
  }
  .sw__pick {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    border: none;
    padding: 0;
    margin: 0;
    background: transparent;
  }
  .sw__edited {
    position: absolute;
    top: 6px;
    left: 6px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ec4899;
    box-shadow: 0 0 0 2px rgba(236,72,153,0.25);
    display: none;
    z-index: 2;
  }
  .sw.is-edited .sw__edited { display: block; }
  .sw__meta {
    padding: 8px 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: space-between;
  }
  .sw__name {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px;
    color: var(--docs-fg-strong);
    word-break: break-all;
    line-height: 1.35;
    flex: 1;
    min-width: 0;
  }
  .sw__copy {
    flex: none;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    background: var(--docs-panel-bg);
    color: var(--docs-fg-strong);
    border: 1px solid var(--docs-border);
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
    font-weight: 700;
    line-height: 1;
    transition: background 0.12s ease, color 0.12s ease, border-color 0.12s ease;
  }
  .sw__copy:hover {
    background: var(--docs-fg-strong);
    color: var(--docs-card-bg);
    border-color: var(--docs-fg-strong);
  }

  /* ---------- Raw palette ---------- */
  .pal { margin: 0 0 22px; }
  .pal__head {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin: 0 0 6px;
  }
  .pal__name {
    font-size: 14px;
    font-weight: 700;
    color: var(--docs-fg-strong);
    text-transform: capitalize;
    letter-spacing: -0.01em;
  }
  .pal__sub {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px;
    color: var(--docs-muted);
  }
  .pal__row {
    display: grid;
    grid-template-columns: repeat(11, minmax(0, 1fr));
    gap: 4px;
  }
  @media (max-width: 900px) {
    .pal__row { grid-template-columns: repeat(6, minmax(0, 1fr)); }
  }
  .pal__cell {
    position: relative;
    aspect-ratio: 1 / 1.05;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid var(--docs-border-soft);
    transition: transform 0.1s ease;
  }
  .pal__cell:hover { transform: scale(1.06); z-index: 2; box-shadow: 0 6px 18px rgba(0,0,0,0.15); }
  .pal__cell .sw__pick { z-index: 1; }
  .pal__cell-text {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 6px 7px;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-weight: 600;
    pointer-events: none;
    z-index: 2;
  }
  .pal__step { font-size: 11px; letter-spacing: 0.04em; }
  .pal__hex { font-size: 9.5px; text-transform: uppercase; opacity: 0.92; }
  .pal__copy {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 20px;
    height: 20px;
    border-radius: 5px;
    background: rgba(255,255,255,0.85);
    color: #111;
    border: 1px solid rgba(0,0,0,0.08);
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.12s ease;
    z-index: 4;
    padding: 0;
    font-weight: 700;
  }
  .pal__cell:hover .pal__copy { opacity: 1; }
  .pal__edited {
    position: absolute;
    top: 4px;
    left: 4px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #ec4899;
    box-shadow: 0 0 0 2px rgba(236,72,153,0.25);
    display: none;
    z-index: 3;
  }
  .pal__cell.is-edited .pal__edited { display: block; }

  /* ---------- Top panel ---------- */
  .panel {
    border: 1px solid var(--docs-border);
    border-radius: 14px;
    padding: 16px 20px;
    margin: 0 0 28px;
    background: var(--docs-panel-bg);
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    align-items: center;
    justify-content: space-between;
  }
  .panel__copy { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
  .panel__title {
    font-size: 13px;
    font-weight: 700;
    color: var(--docs-fg-strong);
    letter-spacing: -0.01em;
  }
  .panel__lead { font-size: 12.5px; color: var(--docs-muted); margin: 0; }
  .panel__actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
  .btn {
    appearance: none;
    border: 1px solid var(--docs-border);
    background: var(--docs-card-bg);
    color: var(--docs-fg-strong);
    border-radius: 999px;
    padding: 8px 14px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
  }
  .btn:hover { border-color: var(--docs-fg-strong); }
  .btn--primary {
    background: #111827;
    color: #fff;
    border-color: #111827;
  }
  .btn--primary:hover { background: #1f2937; }
  .panel__count {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 12px;
    color: var(--docs-muted);
  }
  .panel__count b { color: #ec4899; }

  /* ---------- Toast ---------- */
  .copied-toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: #111827;
    color: #fff;
    padding: 9px 16px;
    border-radius: 999px;
    font-size: 12px;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    box-shadow: 0 6px 16px rgba(0,0,0,0.2);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.18s ease;
    z-index: 9999;
  }
  .copied-toast.show { opacity: 1; }
`

if (typeof document !== 'undefined' && !document.getElementById('colors-doc-style')) {
  const styleEl = document.createElement('style')
  styleEl.id = 'colors-doc-style'
  styleEl.textContent = THEME_CSS
  document.head.appendChild(styleEl)
}

const SCALE = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']

const RAW_PALETTES = [
  'neutral',
  'slate',
  'gray',
  'zinc',
  'stone',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose'
]

const BRAND_PALETTES = ['brand-neutrals', 'brand-shades', 'primary-landing']

const SEMANTIC_GROUPS = [
  {
    label: 'Surfaces',
    tokens: ['primary-bg', 'secondary-bg', 'tertiary-bg', 'accent-bg', 'muted-bg', 'body-background']
  },
  { label: 'Foregrounds', tokens: ['primary-fg', 'secondary-fg', 'accent-fg', 'muted-fg', 'inverse-fg'] },
  { label: 'Brand', tokens: ['primary-brand-bg', 'primary-brand-fg', 'primary-brand-hover', 'border-brand'] },
  {
    label: 'Destructive',
    tokens: [
      'destructive',
      'destructive-hover',
      'destructive-subtle',
      'destructive-border',
      'destructive-text',
      'destructive-inverse-fg'
    ]
  },
  { label: 'Borders', tokens: ['border-primary', 'border-secondary', 'border-focus'] },
  {
    label: 'Ghost & Outline',
    tokens: ['ghost', 'ghost-foreground', 'ghost-hover', 'outline', 'outline-hover', 'outline-active']
  },
  { label: 'Effects', tokens: ['focus-ring', 'focus-ring-error', 'backdrop'] },
  { label: 'Notification', tokens: ['positive-500', 'info-500', 'warning-500'] },
  {
    label: 'Component slots',
    tokens: [
      'card',
      'card-foreground',
      'popover',
      'popover-foreground',
      'sidebar',
      'sidebar-muted',
      'sidebar-accent',
      'sidebar-foreground',
      'sidebar-accent-foreground',
      'sidebar-primary',
      'sidebar-primary-foreground',
      'sidebar-border',
      'sidebar-ring',
      'input',
      'button-black',
      'button-black-fg',
      'button-black-hover'
    ]
  }
]

const ALPHA_STEPS = ['0', '001', '333', '5', '10', '15', '20', '30', '40', '50', '60', '70', '80', '90', '95', '100']

/* -------- contrast helper -------- */
function parseHex(hex) {
  const m = (hex || '').trim().replace('#', '')
  if (m.length !== 6) return null
  return { r: parseInt(m.slice(0, 2), 16), g: parseInt(m.slice(2, 4), 16), b: parseInt(m.slice(4, 6), 16) }
}
function luminance(hex) {
  const rgb = parseHex(hex)
  if (!rgb) return 0.5
  const toLin = c => {
    c /= 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * toLin(rgb.r) + 0.7152 * toLin(rgb.g) + 0.0722 * toLin(rgb.b)
}
function readableOn(hex) {
  return luminance(hex) > 0.5 ? '#111827' : '#ffffff'
}

/* Convert any computed color string (#hex / rgb / rgba / space-separated) into
   #RRGGBB (alpha === 1) or #RRGGBBAA (alpha < 1). Returns the original if unparseable. */
function normalizeColor(raw) {
  if (!raw) return ''
  const v = raw.trim()
  if (/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(v)) return v.toUpperCase()
  if (/^#[0-9a-f]{3,4}$/i.test(v)) {
    const expand = v
      .slice(1)
      .split('')
      .map(c => c + c)
      .join('')
    return ('#' + expand).toUpperCase()
  }
  const m = v.match(
    /rgba?\(\s*(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)\s*[, ]\s*(\d+(?:\.\d+)?)\s*(?:[,\/]\s*(\d+(?:\.\d+)?)(%?))?\s*\)/i
  )
  if (!m) return v
  const r = Math.round(parseFloat(m[1]))
  const g = Math.round(parseFloat(m[2]))
  const b = Math.round(parseFloat(m[3]))
  let a = 1
  if (m[4] !== undefined) {
    a = parseFloat(m[4])
    if (m[5] === '%') a /= 100
  }
  const h = n => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0').toUpperCase()
  const base = `#${h(r)}${h(g)}${h(b)}`
  if (a >= 0.999) return base
  return base + h(Math.round(a * 255))
}

/* -------- shared lifecycle methods (mixin-style) -------- */
const SHARED = {
  resolveAll() {
    const cs = getComputedStyle(document.documentElement)
    document.querySelectorAll('[data-token-hex]').forEach(el => {
      const raw = cs.getPropertyValue('--' + el.dataset.tokenHex).trim()
      if (!raw) return
      const hex = normalizeColor(raw)
      el.textContent = hex
      // use the opaque base for contrast calc (strip alpha)
      const base = hex.length === 9 ? hex.slice(0, 7) : hex
      if (/^#[0-9a-f]{6}$/i.test(base)) el.style.color = readableOn(base)
    })
    // tint palette "step" labels too
    document.querySelectorAll('[data-chip-step]').forEach(el => {
      const raw = cs.getPropertyValue('--' + el.dataset.chipStep).trim()
      const hex = normalizeColor(raw)
      const base = hex.length === 9 ? hex.slice(0, 7) : hex
      if (/^#[0-9a-f]{6}$/i.test(base)) el.style.color = readableOn(base)
    })
    // sync color inputs to current values (color input only accepts 6-char hex)
    document.querySelectorAll('input[data-pick-token]').forEach(input => {
      const raw = cs.getPropertyValue('--' + input.dataset.pickToken).trim()
      const hex = normalizeColor(raw)
      const base = hex.length === 9 ? hex.slice(0, 7) : hex
      if (/^#[0-9a-f]{6}$/i.test(base)) input.value = base
    })
    // is-edited dot
    const overrides = window.__colorsOverrides || {}
    document.querySelectorAll('[data-token-card]').forEach(el => {
      el.classList.toggle('is-edited', !!overrides[el.dataset.tokenCard])
    })
    document.querySelectorAll('.panel__count b').forEach(el => {
      el.textContent = Object.keys(overrides).length
    })
  },
  startObserver() {
    this.__obs = new MutationObserver(() => this.resolveAll())
    this.__obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    if (document.body) this.__obs.observe(document.body, { attributes: true, attributeFilter: ['class'] })
  },
  showToast(text) {
    let toast = document.getElementById('colors-toast')
    if (!toast) {
      toast = document.createElement('div')
      toast.id = 'colors-toast'
      toast.className = 'copied-toast'
      document.body.appendChild(toast)
    }
    toast.textContent = text
    toast.classList.add('show')
    clearTimeout(this.__toastT)
    this.__toastT = setTimeout(() => toast.classList.remove('show'), 1300)
  },
  ensureOverrideStyle() {
    let node = document.getElementById('colors-user-theme')
    if (!node) {
      node = document.createElement('style')
      node.id = 'colors-user-theme'
      document.head.appendChild(node)
    }
    return node
  },
  applyOverrides() {
    const map = window.__colorsOverrides || {}
    const lines = Object.entries(map).map(([t, v]) => `  --${t}: ${v} !important;`)
    // brand token bonus: when overriding primary-brand-bg, also retint hover/border + brand-shade-500/600
    if (map['primary-brand-bg']) {
      const v = map['primary-brand-bg']
      lines.push(`  --primary-brand-hover: ${v} !important;`)
      lines.push(`  --border-brand: ${v} !important;`)
    }
    this.ensureOverrideStyle().textContent = `:root, .dark, html.dark, body.dark {\n${lines.join('\n')}\n}`
    this.resolveAll()
  },
  setOverride(token, hex) {
    window.__colorsOverrides = window.__colorsOverrides || {}
    window.__colorsOverrides[token] = hex
    this.applyOverrides()
  },
  resetAllOverrides() {
    window.__colorsOverrides = {}
    const n = document.getElementById('colors-user-theme')
    if (n) n.remove()
    this.resolveAll()
    this.showToast('All overrides cleared')
  },
  exportCss() {
    const map = window.__colorsOverrides || {}
    if (!Object.keys(map).length) {
      this.showToast('No overrides to copy')
      return
    }
    const lines = Object.entries(map).map(([t, v]) => `  --${t}: ${v};`)
    if (map['primary-brand-bg']) {
      lines.push(`  --primary-brand-hover: ${map['primary-brand-bg']};`)
      lines.push(`  --border-brand: ${map['primary-brand-bg']};`)
    }
    const css = `:root {\n${lines.join('\n')}\n}`
    if (navigator.clipboard) navigator.clipboard.writeText(css).catch(() => {})
    this.showToast(`Copied ${Object.keys(map).length} override(s)`)
  },
  bindHandlers() {
    document.querySelectorAll('input[data-pick-token]').forEach(input => {
      if (input.__bound) return
      input.__bound = true
      input.addEventListener('input', e => this.setOverride(input.dataset.pickToken, e.target.value))
    })
    document.querySelectorAll('[data-copy-token]').forEach(el => {
      if (el.__bound) return
      el.__bound = true
      el.addEventListener('click', e => {
        e.stopPropagation()
        const t = '--' + el.dataset.copyToken
        const txt = `var(${t})`
        if (navigator.clipboard) navigator.clipboard.writeText(txt).catch(() => {})
        this.showToast(`Copied  ${txt}`)
      })
    })
  }
}

/* -------- swatch builders -------- */
function swSemantic({ token, checker }) {
  const cls = checker ? 'sw__chip sw__chip--checker' : 'sw__chip'
  const bg = checker ? '' : `style="background: var(--${token});"`
  const fillLayer = checker ? `<span class="sw__fill" style="background: var(--${token});"></span>` : ''
  const pickInput = checker
    ? ''
    : `<input class="sw__pick" type="color" data-pick-token="${token}" title="Click to recolor --${token}" />`
  return `
    <div class="sw" data-token-card="${token}">
      <span class="sw__edited"></span>
      <div class="${cls}" ${bg}>
        ${fillLayer}
        ${pickInput}
        <span class="sw__hex" data-token-hex="${token}">—</span>
      </div>
      <div class="sw__meta">
        <div class="sw__name">--${token}</div>
        <button class="sw__copy" data-copy-token="${token}" title="Copy var(--${token})" aria-label="Copy var(--${token})">⧉</button>
      </div>
    </div>
  `
}

function palCell({ family, step }) {
  const token = `color-${family}-${step}`
  return `
    <div class="pal__cell" data-token-card="${token}" style="background: var(--${token});">
      <input class="sw__pick" type="color" data-pick-token="${token}" title="Click to recolor --${token}" />
      <span class="pal__edited"></span>
      <div class="pal__cell-text">
        <div class="pal__step" data-chip-step="${token}">${step}</div>
        <div class="pal__hex" data-token-hex="${token}">—</div>
      </div>
      <button class="pal__copy" data-copy-token="${token}" title="Copy var(--${token})">⧉</button>
    </div>
  `
}

function palBlock(family) {
  return `
    <div class="pal">
      <div class="pal__head">
        <div class="pal__name">${family.replace('-', ' ')}</div>
        <div class="pal__sub">--color-${family}-*</div>
      </div>
      <div class="pal__row">
        ${SCALE.map(step => palCell({ family, step })).join('')}
      </div>
    </div>
  `
}

const PANEL_HTML = `
  <div class="panel">
    <div class="panel__copy">
      <div class="panel__title">🎨 Live theming</div>
      <p class="panel__lead">
        Click <strong>any swatch chip</strong> to recolor that exact token live across this page and every other Storybook story.
        Use the <strong>⧉</strong> button next to each token name to copy its <code style="font-family:'JetBrains Mono',monospace;">var(--token)</code>.
      </p>
    </div>
    <div class="panel__actions">
      <span class="panel__count">Overrides: <b>0</b></span>
      <button class="btn" data-action="export">Copy CSS</button>
      <button class="btn btn--primary" data-action="reset">Reset all</button>
    </div>
  </div>
`

function bindPanelActions(self) {
  document.querySelectorAll('[data-action]').forEach(el => {
    if (el.__bound) return
    el.__bound = true
    if (el.dataset.action === 'reset') el.addEventListener('click', () => self.resetAllOverrides())
    if (el.dataset.action === 'export') el.addEventListener('click', () => self.exportCss())
  })
}

const MOUNT = {
  mounted() {
    Object.assign(this, SHARED)
    this.$nextTick(() => {
      this.resolveAll()
      this.startObserver()
      this.bindHandlers()
      bindPanelActions(this)
    })
  },
  beforeUnmount() {
    if (this.__obs) this.__obs.disconnect()
  }
}

export default {
  title: 'Foundations/Colors',
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: false },
    docs: { source: { state: 'closed' } }
  }
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  OVERVIEW                                                                  */
/* ────────────────────────────────────────────────────────────────────────── */

export const Overview = () => ({
  ...MOUNT,
  template: `
    <div class="colors-page" style="${PAGE_STYLE}">
      <h1 style="margin: 0 0 6px; font-size: 36px; font-weight: 800; letter-spacing: -0.02em;">Colors</h1>
      <p style="color: var(--docs-muted); margin: 0 0 22px; font-size: 15px;">
        The complete color system. <strong>Click any swatch chip</strong> to recolor that token live; the change cascades to every other Storybook story.
        Use the <strong>⧉</strong> button next to each token name to copy <code style="font-family:'JetBrains Mono',monospace;">var(--token)</code>.
      </p>

      ${PANEL_HTML}

      ${SEMANTIC_GROUPS.map(
        g => `
        <h2 class="section-h2">${g.label}</h2>
        <div class="sw-grid">
          ${g.tokens.map(t => swSemantic({ token: t })).join('')}
        </div>
      `
      ).join('')}

      <h2 class="section-h2">Brand palettes</h2>
      <p class="section-lead">
        Brand-aliased scales. Override <code style="font-family:'JetBrains Mono',monospace;">--color-brand-shades-500</code> (or any other shade) to rebrand the entire kit.
      </p>
      ${BRAND_PALETTES.map(palBlock).join('')}

      <p style="color: var(--docs-muted); font-size: 13px; margin-top: 24px;">
        See <a href="../?path=/story/foundations-colors--raw-palette" style="color: #ec4899; font-weight: 600;">Raw Palette</a>
        for the 22 underlying color scales,
        and <a href="../?path=/story/foundations-colors--alpha" style="color: #ec4899; font-weight: 600;">Alpha</a>
        for transparency tokens.
      </p>
    </div>
  `
})

/* ────────────────────────────────────────────────────────────────────────── */
/*  RAW PALETTE                                                              */
/* ────────────────────────────────────────────────────────────────────────── */

export const RawPalette = () => ({
  ...MOUNT,
  template: `
    <div class="colors-page" style="${PAGE_STYLE}">
      <h1 style="margin: 0 0 6px; font-size: 36px; font-weight: 800; letter-spacing: -0.02em;">Raw palette</h1>
      <p style="color: var(--docs-muted); margin: 0 0 22px; font-size: 15px;">
        22 color families × 11 steps. <strong>Click any cell</strong> to override that exact token live.
        Use the <strong>⧉</strong> button (on hover) to copy <code style="font-family:'JetBrains Mono',monospace;">var(--token)</code>.
      </p>
      ${PANEL_HTML}
      ${RAW_PALETTES.map(palBlock).join('')}
    </div>
  `
})

/* ────────────────────────────────────────────────────────────────────────── */
/*  ALPHA                                                                    */
/* ────────────────────────────────────────────────────────────────────────── */

export const Alpha = () => ({
  ...MOUNT,
  template: `
    <div class="colors-page" style="${PAGE_STYLE}">
      <h1 style="margin: 0 0 6px; font-size: 36px; font-weight: 800; letter-spacing: -0.02em;">Alpha</h1>
      <p style="color: var(--docs-muted); margin: 0 0 22px; font-size: 15px;">
        Transparency tokens. These can't be picked live (color inputs are RGB-only) — they always derive from white/black at a given opacity step.
      </p>

      <h2 class="section-h2">White alpha</h2>
      <div class="sw-grid">
        ${ALPHA_STEPS.map(s => swSemantic({ token: `color-white-alpha-${s}`, checker: true })).join('')}
      </div>

      <h2 class="section-h2">Black alpha</h2>
      <div class="sw-grid">
        ${ALPHA_STEPS.map(s => swSemantic({ token: `color-black-alpha-${s}`, checker: true })).join('')}
      </div>
    </div>
  `
})

Overview.parameters = { docs: { source: { state: 'closed' } } }
RawPalette.parameters = { docs: { source: { state: 'closed' } } }
Alpha.parameters = { docs: { source: { state: 'closed' } } }
