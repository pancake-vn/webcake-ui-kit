#!/usr/bin/env node
/**
 * scan-lucide-icons.js
 *
 * Scans the locally cloned Lucide repository, builds a normalized icon manifest,
 * and generates Vue 2 + Vue 3 dual-compatible icon components into src/icons/.
 *
 * Usage:
 *   node scripts/scan-lucide-icons.js                       # scan all
 *   node scripts/scan-lucide-icons.js --limit 5             # scan first N (alphabetical)
 *   node scripts/scan-lucide-icons.js --lucide /abs/path    # override lucide repo path
 *   node scripts/scan-lucide-icons.js --dry-run             # build manifest only, no .vue
 *
 * Output:
 *   scripts/generated/icons/manifest.json
 *   src/icons/Wki<PascalName>.vue   (one per icon)
 *   src/icons/index.js              (exports appended deterministically, fenced block)
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, extname, join, relative, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// -------------------- args --------------------

function parseArgs(argv) {
  const out = { limit: Infinity, lucide: null, dryRun: false }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--limit') out.limit = parseInt(argv[++i], 10)
    else if (a === '--lucide') out.lucide = argv[++i]
    else if (a === '--dry-run') out.dryRun = true
  }
  return out
}

const args = parseArgs(process.argv)

// -------------------- paths --------------------

const REPO_ROOT = resolve(__dirname, '..')
const LUCIDE_ROOT = args.lucide || resolve(REPO_ROOT, '..', 'lucide')
const LUCIDE_ICONS = join(LUCIDE_ROOT, 'icons')
const OUT_MANIFEST = join(REPO_ROOT, 'scripts', 'generated', 'icons', 'manifest.json')
const OUT_ICONS_DIR = join(REPO_ROOT, 'src', 'icons')
const OUT_INDEX = join(OUT_ICONS_DIR, 'index.js')

// -------------------- helpers --------------------

function ensureDir(p) {
  mkdirSync(p, { recursive: true })
}

function toPascalCase(kebab) {
  return kebab
    .split(/[-_]/g)
    .filter(Boolean)
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join('')
}

function toComponentName(kebab) {
  // numeric-prefixed names (e.g. "2fa", "3d-glasses") cannot start with a digit
  // in JS identifiers or Vue component names — prefix with "N".
  const pascal = toPascalCase(kebab)
  return /^[0-9]/.test(pascal) ? 'N' + pascal : pascal
}

// -------------------- Step 1: scan filesystem --------------------

function scanLucideIcons(rootDir) {
  if (!existsSync(rootDir)) {
    throw new Error(`Lucide icons directory not found: ${rootDir}`)
  }
  const files = readdirSync(rootDir)
  const byName = new Map()
  for (const f of files) {
    const ext = extname(f).toLowerCase()
    if (ext !== '.svg' && ext !== '.json') continue
    const base = f.slice(0, -ext.length)
    if (!byName.has(base)) byName.set(base, { name: base, svg: null, json: null })
    const entry = byName.get(base)
    if (ext === '.svg') entry.svg = join(rootDir, f)
    if (ext === '.json') entry.json = join(rootDir, f)
  }
  const grouped = []
  for (const entry of byName.values()) {
    if (!entry.svg) continue
    grouped.push(entry)
  }
  grouped.sort((a, b) => a.name.localeCompare(b.name))
  return grouped
}

// -------------------- Step 2: parse svg + metadata --------------------

function readJsonSafe(p) {
  if (!p) return null
  try {
    return JSON.parse(readFileSync(p, 'utf8'))
  } catch {
    return null
  }
}

function extractSvgInner(svgRaw) {
  const openMatch = svgRaw.match(/<svg[^>]*>/)
  const closeMatch = svgRaw.match(/<\/svg>\s*$/)
  if (!openMatch || !closeMatch) {
    throw new Error('Malformed SVG: missing <svg>/</svg> tags')
  }
  const inner = svgRaw.slice(openMatch.index + openMatch[0].length, closeMatch.index)
  return inner.trim()
}

function reindentInner(inner) {
  const lines = inner
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
  return lines.map(l => `      ${l}`).join('\n')
}

// -------------------- Step 3: build manifest --------------------

function buildManifest(grouped, limit) {
  const slice = grouped.slice(0, Math.min(limit, grouped.length))
  const entries = []
  const skipped = []
  for (const g of slice) {
    try {
      const svgRaw = readFileSync(g.svg, 'utf8')
      const inner = extractSvgInner(svgRaw)
      const meta = readJsonSafe(g.json) || {}
      const pascal = toComponentName(g.name)
      entries.push({
        name: g.name,
        kebabName: g.name,
        pascalName: pascal,
        componentName: pascal,
        displayName: `Wki${pascal}`,
        svgRaw,
        svgInner: inner,
        metadata: {
          tags: meta.tags || [],
          categories: meta.categories || [],
          contributors: meta.contributors || []
        },
        generation: {
          importName: `Wki${pascal}`,
          exportName: `Wki${pascal}`,
          fileName: `${pascal}.vue`,
          directory: 'src/icons',
          pascalName: pascal,
          kebabName: g.name
        }
      })
    } catch (e) {
      skipped.push({ name: g.name, reason: e.message })
    }
  }
  return { entries, skipped, totalAvailable: grouped.length }
}

// -------------------- Step 4: generate Vue component --------------------

function generateVueComponent(entry) {
  const innerIndented = reindentInner(entry.svgInner)
  return `<template>
  <BaseIcon v-bind="$attrs" v-on="listeners">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
${innerIndented}
    </svg>
  </BaseIcon>
</template>

<script>
import BaseIcon from './BaseIcon.vue'

export default {
  name: '${entry.pascalName}',
  components: { BaseIcon },
  inheritAttrs: false,
  emits: [],
  computed: {
    listeners() {
      return this.$listeners || {}
    }
  }
}
</script>
`
}

// -------------------- Step 5: write outputs --------------------

function writeManifest(manifest) {
  ensureDir(dirname(OUT_MANIFEST))
  const slim = manifest.entries.map(e => ({
    name: e.name,
    componentName: e.componentName,
    displayName: e.displayName,
    pascalName: e.pascalName,
    kebabName: e.kebabName,
    fileName: e.generation.fileName,
    directory: e.generation.directory,
    metadata: e.metadata
  }))
  writeFileSync(
    OUT_MANIFEST,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        source: 'lucide/icons',
        count: slim.length,
        totalAvailable: manifest.totalAvailable,
        skipped: manifest.skipped,
        icons: slim
      },
      null,
      2
    ) + '\n'
  )
}

function writeComponents(manifest) {
  ensureDir(OUT_ICONS_DIR)
  for (const entry of manifest.entries) {
    const target = join(OUT_ICONS_DIR, entry.generation.fileName)
    writeFileSync(target, generateVueComponent(entry))
  }
}

// -------------------- Step 6: update src/icons/index.js --------------------

const EXPORT_MARKER_START = '// --- AUTO-GENERATED LUCIDE EXPORTS START ---'
const EXPORT_MARKER_END = '// --- AUTO-GENERATED LUCIDE EXPORTS END ---'

function updateIndex(manifest) {
  let existing = ''
  if (existsSync(OUT_INDEX)) existing = readFileSync(OUT_INDEX, 'utf8')

  const startIdx = existing.indexOf(EXPORT_MARKER_START)
  const endIdx = existing.indexOf(EXPORT_MARKER_END)
  let preserved = existing
  if (startIdx !== -1 && endIdx !== -1) {
    preserved =
      existing.slice(0, startIdx).trimEnd() +
      '\n' +
      existing.slice(endIdx + EXPORT_MARKER_END.length).replace(/^\n+/, '')
  }
  preserved = preserved.trimEnd()

  const lines = manifest.entries
    .slice()
    .sort((a, b) => a.displayName.localeCompare(b.displayName))
    .map(e => `export { default as ${e.displayName} } from './${e.generation.fileName}'`)
    .join('\n')

  const block = `${EXPORT_MARKER_START}\n${lines}\n${EXPORT_MARKER_END}\n`
  const next = (preserved ? preserved + '\n\n' : '') + block
  writeFileSync(OUT_INDEX, next)
}

// -------------------- main --------------------

function main() {
  console.log(`[scan] lucide root: ${LUCIDE_ROOT}`)
  console.log(`[scan] limit: ${args.limit === Infinity ? 'all' : args.limit}`)
  console.log(`[scan] dry-run: ${args.dryRun}`)

  const grouped = scanLucideIcons(LUCIDE_ICONS)
  console.log(`[scan] found ${grouped.length} svg files in lucide/icons`)

  const manifest = buildManifest(grouped, args.limit)
  console.log(`[manifest] entries: ${manifest.entries.length}, skipped: ${manifest.skipped.length}`)

  writeManifest(manifest)
  console.log(`[write] manifest: ${relative(REPO_ROOT, OUT_MANIFEST)}`)

  if (!args.dryRun) {
    writeComponents(manifest)
    console.log(`[write] components: ${manifest.entries.length} files into ${relative(REPO_ROOT, OUT_ICONS_DIR)}`)
    updateIndex(manifest)
    console.log(`[write] exports updated in ${relative(REPO_ROOT, OUT_INDEX)}`)
  }

  console.log('')
  console.log(`Processed: ${manifest.entries.length + manifest.skipped.length}`)
  console.log(`Generated: ${args.dryRun ? 0 : manifest.entries.length}`)
  console.log(`Skipped:   ${manifest.skipped.length}`)
  console.log(`Failed:    0`)
  if (manifest.skipped.length) {
    console.log('')
    console.log('Skipped detail:')
    for (const s of manifest.skipped) console.log(`  - ${s.name}: ${s.reason}`)
  }
}

main()
