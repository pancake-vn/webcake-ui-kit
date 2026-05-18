import changelogMd from '../../CHANGELOG.md'

/* ────────────────────────────────────────────────────────────────────────── */
/*  Theme — same tokens as Introduction.stories.js so docs feel uniform.    */
/* ────────────────────────────────────────────────────────────────────────── */

const THEME_CSS = `
  .docs-page {
    --docs-fg: #111827;
    --docs-fg-strong: #0b0f1a;
    --docs-muted: #6b7280;
    --docs-border: #d1d5db;
    --docs-border-soft: #e5e7eb;
    --docs-card-bg: rgba(15,23,42,0.025);
    --docs-table-head: #f9fafb;
    --docs-link: #ec4899;
    --docs-link-hover: #db2777;
    color: var(--docs-fg);
  }
  .dark .docs-page,
  html.dark .docs-page,
  body.dark .docs-page {
    --docs-fg: #e6e8eb;
    --docs-fg-strong: #ffffff;
    --docs-muted: #9aa3af;
    --docs-border: #3a4150;
    --docs-border-soft: #2a2f39;
    --docs-card-bg: rgba(255,255,255,0.05);
    --docs-table-head: #1c2128;
    --docs-link: #ff89b5;
    --docs-link-hover: #ffaecc;
  }
  .docs-page a:not(.docs-btn) { color: var(--docs-link); }
  .docs-page a:not(.docs-btn):hover { color: var(--docs-link-hover); }
  .docs-page strong { color: var(--docs-fg-strong); }
`

if (typeof document !== 'undefined' && !document.getElementById('docs-theme-style')) {
  const styleEl = document.createElement('style')
  styleEl.id = 'docs-theme-style'
  styleEl.textContent = THEME_CSS
  document.head.appendChild(styleEl)
}

const PAGE_STYLE = `
  max-width: 880px;
  margin: 0 auto;
  padding: 56px 32px 80px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: var(--docs-fg);
  line-height: 1.65;
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
  color: var(--docs-fg);
`

const MUTED = `color: var(--docs-muted);`

const VERSION_HEADER = `
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin: 56px 0 4px;
  padding-top: 24px;
  border-top: 1px solid var(--docs-border-soft);
`

const VERSION_TAG = `
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--docs-fg-strong);
  margin: 0;
`

const VERSION_DATE = `
  font-size: 13px;
  ${MUTED}
  font-variant-numeric: tabular-nums;
`

const SECTION_H3 = `
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin: 24px 0 10px;
  color: var(--docs-muted);
`

const SECTION_COLORS = {
  Added: { color: '#13823B', bg: '#DBFDE6' },
  Changed: { color: '#1e40af', bg: '#dbeafe' },
  Fixed: { color: '#7c2d12', bg: '#fed7aa' },
  Removed: { color: '#7f1d1d', bg: '#fecaca' },
  Deprecated: { color: '#78350f', bg: '#fef3c7' },
  Security: { color: '#581c87', bg: '#e9d5ff' },
  Docs: { color: '#1f2937', bg: '#e5e7eb' },
  Internal: { color: '#374151', bg: '#f3f4f6' }
}

const BULLET_LIST = `
  margin: 0 0 8px;
  padding: 0;
  list-style: none;
`

const BULLET_ITEM = `
  position: relative;
  padding: 6px 0 6px 22px;
  font-size: 15px;
  line-height: 1.6;
  color: var(--docs-fg);
`

const BULLET_DOT = `
  position: absolute;
  left: 4px;
  top: 14px;
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: var(--docs-link);
  opacity: 0.7;
`

/* ────────────────────────────────────────────────────────────────────────── */
/*  Tiny markdown helper — just what Keep-a-Changelog needs.                */
/* ────────────────────────────────────────────────────────────────────────── */

const escapeHtml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Inline markdown: `code`, **bold**, *italic*, [text](href)
const renderInline = raw => {
  let s = escapeHtml(raw)
  s = s.replace(/`([^`]+)`/g, (_, code) => `<code style="${INLINE_CODE}">${code}</code>`)
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
  return s
}

const parseChangelog = md => {
  const releases = []
  const lines = md.split('\n')
  let current = null
  let currentSection = null

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/, '')

    // Release heading: "## [1.0.1] - 2026-05-12"
    const releaseMatch = line.match(/^##\s+\[([^\]]+)\](?:\s*-\s*(.+))?$/)
    if (releaseMatch) {
      if (current) releases.push(current)
      current = { version: releaseMatch[1], date: (releaseMatch[2] || '').trim(), sections: [] }
      currentSection = null
      continue
    }

    if (!current) continue

    // Section heading: "### Added"
    const sectionMatch = line.match(/^###\s+(.+)$/)
    if (sectionMatch) {
      currentSection = { title: sectionMatch[1].trim(), items: [] }
      current.sections.push(currentSection)
      continue
    }

    // Bullet: "- something"
    const bulletMatch = line.match(/^-\s+(.+)$/)
    if (bulletMatch && currentSection) {
      currentSection.items.push(bulletMatch[1].trim())
      continue
    }

    // Continuation of a bullet on the next indented line.
    const continuationMatch = line.match(/^ {2,}(.+)$/)
    if (continuationMatch && currentSection && currentSection.items.length > 0) {
      const last = currentSection.items.length - 1
      currentSection.items[last] = `${currentSection.items[last]} ${continuationMatch[1].trim()}`
    }
  }

  if (current) releases.push(current)
  return releases
}

const renderRelease = (release, isLatest) => {
  const sections = release.sections
    .filter(s => s.items.length > 0)
    .map(s => {
      const palette = SECTION_COLORS[s.title] || { color: '#374151', bg: '#f3f4f6' }
      const pill = `
        <span style="
          display: inline-block;
          padding: 3px 9px;
          border-radius: 9999px;
          background: ${palette.bg};
          color: ${palette.color};
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-right: 8px;
          vertical-align: middle;
        ">${s.title}</span>
      `
      const items = s.items
        .map(
          item => `
            <li style="${BULLET_ITEM}">
              <span style="${BULLET_DOT}"></span>
              ${renderInline(item)}
            </li>
          `
        )
        .join('')
      return `
        <div style="margin: 24px 0 8px;">
          <div style="${SECTION_H3} margin-top: 0; padding-top: 0; display: flex; align-items: center;">
            ${pill}
          </div>
          <ul style="${BULLET_LIST}">${items}</ul>
        </div>
      `
    })
    .join('')

  return `
    <article>
      <header style="${VERSION_HEADER}">
        <h2 style="${VERSION_TAG}">
          v${escapeHtml(release.version)}
        </h2>
        ${release.date ? `<time style="${VERSION_DATE}">${escapeHtml(release.date)}</time>` : ''}
        ${isLatest ? PILL('Latest', '#13823B', '#DBFDE6') : ''}
      </header>
      ${sections}
    </article>
  `
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Story                                                                    */
/* ────────────────────────────────────────────────────────────────────────── */

export default {
  title: 'Changelog',
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: false },
    docs: { source: { state: 'closed' } }
  }
}

const releases = parseChangelog(changelogMd || '')
const latestVersion = releases[0]?.version

export const AllReleases = () => {
  const releasesHtml =
    releases.length === 0
      ? `<p style="${MUTED}">No releases yet.</p>`
      : releases.map((r, i) => renderRelease(r, r.version === latestVersion && i === 0)).join('')

  return {
    data() {
      return { releasesHtml }
    },
    template: `
      <div class="docs-page" style="${PAGE_STYLE}">
        <header style="margin-bottom: 32px;">
          ${PILL('Release notes', '#1e40af', '#dbeafe')}
          <h1 style="
            margin: 16px 0 8px;
            font-size: 44px;
            font-weight: 800;
            letter-spacing: -0.02em;
            line-height: 1.1;
          ">
            Changelog
          </h1>
          <p style="${MUTED} font-size: 16px; margin: 0; line-height: 1.6;">
            All notable changes to <code style="${INLINE_CODE}">webcake-ui-kit</code>.
            Format follows
            <a href="https://keepachangelog.com/en/1.1.0/" target="_blank" rel="noopener">Keep a Changelog</a>;
            versioning follows
            <a href="https://semver.org/spec/v2.0.0.html" target="_blank" rel="noopener">SemVer</a>.
          </p>
          <p style="${MUTED} font-size: 13.5px; margin: 14px 0 0;">
            Sourced directly from
            <a href="https://github.com/pancake-vn/webcake-ui-kit/blob/master/CHANGELOG.md" target="_blank" rel="noopener">
              CHANGELOG.md
            </a>
            in the repo — this page rebuilds automatically when the file changes.
          </p>
        </header>
        <div v-html="releasesHtml"></div>
      </div>
    `
  }
}

AllReleases.parameters = { docs: { source: { state: 'closed' } } }
