#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(__dirname, '..')
const pkgPath = join(repoRoot, 'package.json')
const indexPath = join(repoRoot, 'src', 'index.js')

const check = process.argv.includes('--check')

const indexSrc = readFileSync(indexPath, 'utf8')
const re = /export\s*\{\s*default\s+as\s+(\w+)\s*\}\s*from\s*['"]([^'"]+)['"]/g
const components = []
let m
while ((m = re.exec(indexSrc)) !== null) {
  components.push({ name: m[1], path: m[2] })
}
components.sort((a, b) => a.name.localeCompare(b.name))

if (components.length === 0) {
  console.error('sync-exports: no named exports found in src/index.js')
  process.exit(1)
}

const pkgRaw = readFileSync(pkgPath, 'utf8')
const pkg = JSON.parse(pkgRaw)
const oldExports = pkg.exports || {}

const isComponentEntry = k => /^\.\/[A-Z]\w*$/.test(k)
const canonical = ['.', './styles', './styles/*', './components/*', './package.json']

const newExports = {}
const carry = k => {
  if (oldExports[k] !== undefined) newExports[k] = oldExports[k]
}

carry('.')
carry('./styles')
carry('./styles/*')
for (const { name, path } of components) {
  newExports[`./${name}`] = path.replace(/^\.\//, './src/')
}
carry('./components/*')
for (const [k, v] of Object.entries(oldExports)) {
  if (canonical.includes(k)) continue
  if (isComponentEntry(k)) continue
  if (k in newExports) continue
  newExports[k] = v
}
carry('./package.json')

const drift = JSON.stringify(oldExports) !== JSON.stringify(newExports)

if (!drift) {
  console.log(`sync-exports: in sync (${components.length} components)`)
  process.exit(0)
}

if (check) {
  console.error('sync-exports: drift detected — run `npm run sync:exports`')
  process.exit(1)
}

pkg.exports = newExports

const trailingNewline = pkgRaw.endsWith('\n') ? '\n' : ''
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + trailingNewline)
console.log(`sync-exports: wrote ${components.length} component subpaths`)
