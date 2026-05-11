#!/usr/bin/env node
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(__dirname, '..')
const pkgPath = join(repoRoot, 'package.json')

const run = (cmd, opts = {}) =>
  execSync(cmd, { stdio: 'inherit', cwd: repoRoot, ...opts })
const capture = (cmd) =>
  execSync(cmd, { cwd: repoRoot, encoding: 'utf8' }).trim()

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
}
const log = (msg, color = '') => console.log(`${color}${msg}${c.reset}`)
const step = (n, msg) => log(`\n${c.cyan}${c.bold}[${n}]${c.reset} ${msg}`)
const ok = (msg) => log(`  ${c.green}OK${c.reset} ${msg}`)
const fail = (msg) => {
  log(`  ${c.red}FAIL${c.reset} ${msg}`)
  process.exit(1)
}

const bump = (process.argv[2] || 'patch').toLowerCase()
const skipChecks = process.argv.includes('--skip-checks')
const dryRun = process.argv.includes('--dry-run')

if (!['patch', 'minor', 'major'].includes(bump)) {
  fail(`Usage: node scripts/release.js <patch|minor|major> [--skip-checks] [--dry-run]`)
}

const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
log(`\n${c.bold}Releasing ${pkg.name}${c.reset} ${c.gray}(${bump} bump)${c.reset}`)

step(1, 'Check npm login')
try {
  const who = capture('npm whoami')
  ok(`Logged in as ${c.bold}${who}${c.reset}`)
} catch {
  fail(`Not logged in. Run: ${c.yellow}npm login${c.reset}`)
}

step(2, 'Check git working tree clean')
const status = capture('git status --porcelain')
if (status) {
  log(status, c.gray)
  fail('Working tree has uncommitted changes. Commit or stash first.')
}
ok('Clean')

step(3, 'Check current branch')
const branch = capture('git rev-parse --abbrev-ref HEAD')
log(`  Current branch: ${c.bold}${branch}${c.reset}`)
if (branch !== 'master' && branch !== 'main') {
  log(`  ${c.yellow}WARN${c.reset} Not on master/main. Continuing anyway.`)
}

step(4, 'Check registry for current version')
try {
  const remoteVersion = capture(`npm view ${pkg.name} version`)
  log(`  Local:  ${c.bold}${pkg.version}${c.reset}`)
  log(`  npm:    ${c.bold}${remoteVersion}${c.reset}`)
} catch {
  log(`  ${c.gray}(package not yet published)${c.reset}`)
}

step(5, `Bump version (${bump})`)
if (dryRun) {
  log(`  ${c.gray}[dry-run] would run: npm version ${bump}${c.reset}`)
} else {
  run(`npm version ${bump} -m "release: v%s"`)
  const newPkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
  ok(`Version → ${c.bold}${newPkg.version}${c.reset}`)
}

step(6, skipChecks ? 'Skip prepublishOnly checks (--skip-checks)' : 'Run prepublishOnly checks')
const publishCmd = skipChecks
  ? 'npm publish --ignore-scripts'
  : 'npm publish'

if (dryRun) {
  log(`  ${c.gray}[dry-run] would run: ${publishCmd}${c.reset}`)
} else {
  try {
    run(publishCmd)
    ok('Published')
  } catch {
    fail(`Publish failed. Local version was bumped — fix the issue then re-run \`${publishCmd}\` manually.`)
  }
}

step(7, 'Push commit + tag to origin')
if (dryRun) {
  log(`  ${c.gray}[dry-run] would run: git push --follow-tags${c.reset}`)
} else {
  try {
    run('git push --follow-tags')
    ok('Pushed')
  } catch {
    log(`  ${c.yellow}WARN${c.reset} Could not push. Run manually: ${c.yellow}git push --follow-tags${c.reset}`)
  }
}

const finalPkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
log(`\n${c.green}${c.bold}✓ Released ${finalPkg.name}@${finalPkg.version}${c.reset}`)
log(`  ${c.gray}https://www.npmjs.com/package/${finalPkg.name}${c.reset}\n`)
