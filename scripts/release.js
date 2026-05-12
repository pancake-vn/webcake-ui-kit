#!/usr/bin/env node
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { tmpdir } from 'node:os'
import { createInterface } from 'node:readline'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(__dirname, '..')
const pkgPath = join(repoRoot, 'package.json')
const changelogPath = join(repoRoot, 'CHANGELOG.md')

const run = (cmd, opts = {}) => execSync(cmd, { stdio: 'inherit', cwd: repoRoot, ...opts })
const capture = cmd => execSync(cmd, { cwd: repoRoot, encoding: 'utf8' }).trim()

const prompt = question =>
  new Promise(resolve => {
    const rl = createInterface({ input: process.stdin, output: process.stdout })
    rl.question(question, answer => {
      rl.close()
      resolve(answer.trim())
    })
  })

const extractChangelogSection = version => {
  let src
  try {
    src = readFileSync(changelogPath, 'utf8')
  } catch {
    return ''
  }
  const lines = src.split('\n')
  const out = []
  let inSection = false
  for (const line of lines) {
    if (/^## \[/.test(line)) {
      if (inSection) break
      if (line.includes(`[${version}]`)) {
        inSection = true
        continue
      }
    }
    if (inSection) out.push(line)
  }
  return out.join('\n').trim()
}

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
}
const log = (msg, color = '') => console.log(`${color}${msg}${c.reset}`)
const step = (n, msg) => log(`\n${c.cyan}${c.bold}[${n}]${c.reset} ${msg}`)
const ok = msg => log(`  ${c.green}OK${c.reset} ${msg}`)
const fail = msg => {
  log(`  ${c.red}FAIL${c.reset} ${msg}`)
  process.exit(1)
}

const bump = (process.argv[2] || 'patch').toLowerCase()
const skipChecks = process.argv.includes('--skip-checks')
const dryRun = process.argv.includes('--dry-run')
const otpArg = process.argv.find(a => a.startsWith('--otp='))
const otpFromArg = otpArg ? otpArg.slice('--otp='.length) : process.env.NPM_OTP || ''

if (!['patch', 'minor', 'major'].includes(bump)) {
  fail(`Usage: node scripts/release.js <patch|minor|major> [--skip-checks] [--dry-run] [--otp=XXXXXX]`)
}

const main = async () => {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
  log(`\n${c.bold}Releasing ${pkg.name}${c.reset} ${c.gray}(${bump} bump)${c.reset}`)

  step(1, 'Check npm login')
  try {
    const who = capture('npm whoami')
    ok(`Logged in as ${c.bold}${who}${c.reset}`)
  } catch {
    fail(`Not logged in. Run: ${c.yellow}npm login${c.reset}`)
  }

  step(2, 'Sync per-component exports')
  if (dryRun) {
    log(`  ${c.gray}[dry-run] would run: node scripts/sync-exports.js${c.reset}`)
  } else {
    run('node scripts/sync-exports.js')
    const syncDiff = capture('git status --porcelain package.json')
    if (syncDiff) {
      log(`  ${c.yellow}package.json updated — committing${c.reset}`)
      run('git add package.json')
      run('git commit -m "chore: sync per-component exports"')
      ok('Synced + committed')
    } else {
      ok('Already in sync')
    }
  }

  step(3, 'Check git working tree clean')
  const status = capture('git status --porcelain')
  if (status) {
    log(status, c.gray)
    fail('Working tree has uncommitted changes. Commit or stash first.')
  }
  ok('Clean')

  step(4, 'Check current branch')
  const branch = capture('git rev-parse --abbrev-ref HEAD')
  log(`  Current branch: ${c.bold}${branch}${c.reset}`)
  if (branch !== 'master' && branch !== 'main') {
    log(`  ${c.yellow}WARN${c.reset} Not on master/main. Continuing anyway.`)
  }

  step(5, 'Check registry for current version')
  try {
    const remoteVersion = capture(`npm view ${pkg.name} version`)
    log(`  Local:  ${c.bold}${pkg.version}${c.reset}`)
    log(`  npm:    ${c.bold}${remoteVersion}${c.reset}`)
  } catch {
    log(`  ${c.gray}(package not yet published)${c.reset}`)
  }

  step(6, `Bump version (${bump})`)
  // Idempotent resume: if the tag for the current package.json#version already
  // exists locally, a previous run already bumped — skip and resume from
  // publish. Without this, re-running after a publish failure piles duplicate
  // "release: vX.Y.Z" commits on top of each other.
  const currentTag = `v${pkg.version}`
  let currentTagExists = false
  try {
    capture(`git rev-parse --verify --quiet refs/tags/${currentTag}`)
    currentTagExists = true
  } catch {
    currentTagExists = false
  }
  let alreadyPublished = false
  try {
    capture(`npm view ${pkg.name}@${pkg.version} version`)
    alreadyPublished = true
  } catch {
    alreadyPublished = false
  }

  if (currentTagExists && alreadyPublished) {
    fail(
      `Tag ${currentTag} exists and ${pkg.name}@${pkg.version} is already on npm. ` +
        `Bump package.json manually or delete the stale tag.`
    )
  }

  if (currentTagExists) {
    log(
      `  ${c.gray}Tag ${currentTag} already exists locally and ${pkg.name}@${pkg.version} is not on npm — skipping bump (resume mode)${c.reset}`
    )
    ok(`Resuming at ${c.bold}${pkg.version}${c.reset}`)
  } else if (dryRun) {
    log(`  ${c.gray}[dry-run] would run: npm version ${bump}${c.reset}`)
  } else {
    run(`npm version ${bump} -m "release: v%s"`)
    const newPkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
    ok(`Version → ${c.bold}${newPkg.version}${c.reset}`)
  }

  step(7, skipChecks ? 'Publish (skip prepublishOnly checks)' : 'Publish (runs prepublishOnly gate)')
  const basePublishCmd = skipChecks ? 'npm publish --ignore-scripts' : 'npm publish'

  if (dryRun) {
    log(`  ${c.gray}[dry-run] would run: ${basePublishCmd} [+ --otp=...]${c.reset}`)
  } else {
    let otp = otpFromArg
    let attempt = 0
    const maxAttempts = 3
    while (attempt < maxAttempts) {
      attempt++
      if (!otp) {
        otp = await prompt(`  ${c.yellow}Enter npm 2FA OTP${c.reset} (6 digits from authenticator, blank to skip): `)
      }
      const cmd = otp ? `${basePublishCmd} --otp=${otp}` : basePublishCmd
      try {
        run(cmd)
        ok('Published')
        break
      } catch {
        if (attempt >= maxAttempts) {
          fail(
            `Publish failed after ${maxAttempts} attempts. Local version was bumped — once you have a fresh OTP, run manually:\n` +
              `    ${c.yellow}${basePublishCmd} --otp=XXXXXX${c.reset}\n` +
              `    ${c.yellow}git push --follow-tags${c.reset}\n` +
              `    ${c.yellow}node scripts/release.js --gh-only${c.reset} ${c.gray}(or run gh release create yourself)${c.reset}`
          )
        }
        log(
          `  ${c.yellow}Publish failed${c.reset} (likely bad/expired OTP). Try a fresh code (attempt ${attempt + 1}/${maxAttempts}).`
        )
        otp = ''
      }
    }
  }

  step(8, 'Push commit + tag to origin')
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

  step(9, 'Create GitHub Release')
  const finalPkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
  const tag = `v${finalPkg.version}`
  if (dryRun) {
    log(`  ${c.gray}[dry-run] would run: gh release create ${tag} ...${c.reset}`)
  } else {
    try {
      capture('gh auth status')
    } catch {
      log(
        `  ${c.yellow}WARN${c.reset} gh CLI not authenticated. Run manually: ${c.yellow}gh release create ${tag}${c.reset}`
      )
    }
    const body = extractChangelogSection(finalPkg.version)
    if (!body) {
      log(`  ${c.yellow}WARN${c.reset} No CHANGELOG section for [${finalPkg.version}]. Skipping GitHub Release.`)
    } else {
      const notesFile = join(tmpdir(), `release-notes-${tag}.md`)
      writeFileSync(notesFile, body + '\n')
      try {
        run(`gh release create ${tag} --title ${tag} --notes-file "${notesFile}"`)
        ok(`GitHub Release ${tag} created`)
      } catch {
        log(`  ${c.yellow}WARN${c.reset} gh release create failed. Run manually:`)
        log(`    ${c.yellow}gh release create ${tag} --title ${tag} --notes-file "${notesFile}"${c.reset}`)
      } finally {
        try {
          unlinkSync(notesFile)
        } catch {
          // best-effort cleanup of the temp notes file
        }
      }
    }
  }

  log(`\n${c.green}${c.bold}✓ Released ${finalPkg.name}@${finalPkg.version}${c.reset}`)
  log(`  ${c.gray}https://www.npmjs.com/package/${finalPkg.name}/v/${finalPkg.version}${c.reset}\n`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
