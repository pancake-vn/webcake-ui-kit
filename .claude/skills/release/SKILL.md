---
name: release
description: Use when the user wants to publish a new version of webcake-ui-kit to npm. Triggers include "release", "publish", "phát hành", "publish lên npm", "tạo tag", "release patch/minor/major", "ra version mới". Automates the full flow — pick bump level, generate a CHANGELOG entry from git log, commit it, bump version + create tag + publish to npm (via scripts/release.js), then create a GitHub Release with the same notes. Don't use for releasing playground apps or non-package work.
---

# Release — full publish flow for webcake-ui-kit

Orchestrates: **CHANGELOG → version bump → npm publish → git push → GitHub Release**.

`scripts/release.js` already handles steps 2–4 (version bump + `npm publish` + `git push --follow-tags`). This skill wraps it with CHANGELOG generation (before) and `gh release create` (after), and sequences everything so the version tag includes the CHANGELOG entry in its tree.

## Preconditions — abort if any fail

Run these first; stop with a clear message if any fails. Do NOT continue with workarounds.

- `git status --porcelain` is empty. If dirty, print the files and stop — user must commit/stash first.
- Current branch is `master` or `main`. If not, confirm with the user via AskUserQuestion before continuing.
- `npm whoami` succeeds. If not: tell user to run `npm login`.
- `gh auth status` shows authenticated. If not: tell user to run `gh auth login`.
- `gh --version` works (gh CLI installed).

## Step 1 — Decide bump level

If the user already passed `patch` / `minor` / `major` in their message, use that.

Otherwise:

1. Get commits since the last release: `git log $(git describe --tags --abbrev=0 2>/dev/null || git rev-list --max-parents=0 HEAD)..HEAD --oneline --no-merges`. (Falls back to root commit if no tags yet.)
2. Suggest a bump:
   - Any `feat:`, `add:`, new component, new export → **minor**
   - Only `fix:`, `[fix]`, docs, chore, deps → **patch**
   - `!:` in subject or `BREAKING CHANGE` in body → **major**
3. Use AskUserQuestion to confirm. Show the suggestion first labeled `(Recommended)`. Don't pick silently — releases are public, the user owns the call.

## Step 2 — Compute next version

Read `package.json#version`, apply the chosen bump locally to get `NEXT_VERSION` (e.g. `1.0.1` + `patch` → `1.0.2`). Use this for the CHANGELOG heading and the GitHub Release tag/title. Don't write `package.json` yet — `npm version` does that in step 6.

## Step 3 — Draft the CHANGELOG entry

From the commit list, classify each commit into Keep-a-Changelog sections. Skip merge commits, the previous `release: vX.Y.Z` commit, and trivial chore noise.

- **Added** — new components, new features, new exports.
- **Changed** — modifications to existing behavior, refactors users may notice.
- **Fixed** — bug fixes.
- **Docs** — documentation changes (include only if there's nothing else, or as a tail section).
- **Internal** — build/deps/tooling (omit from public CHANGELOG unless that's all there is).

Rewrite each bullet in user-facing language — don't just dump the commit subject. Example: commit `[fix] badge alignment in vue2` becomes `- Fixed Badge vertical alignment on Vue 2.7`.

Output format (this is what you'll prepend to `CHANGELOG.md`):

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added

- ...

### Changed

- ...

### Fixed

- ...
```

Use today's date (ISO `YYYY-MM-DD`). Omit empty sections.

## Step 4 — Confirm with the user

Show the draft entry plus a one-line summary: `Release vX.Y.Z (bumping from vA.B.C).` Ask the user to confirm or edit before any files are written or commands run. Use AskUserQuestion with options like `Looks good — proceed` / `Let me edit it first`. Wait for explicit approval.

## Step 5 — Write + commit CHANGELOG.md

- If `CHANGELOG.md` doesn't exist, create it with this header:

  ```markdown
  # Changelog

  All notable changes to this project are documented in this file.
  The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
  and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
  ```

  Then append the new entry below.

- If it exists, prepend the new entry directly below the header (above previous versions) using Edit (anchor on a stable line near the top, e.g. the Semantic Versioning link).

- Commit it:
  ```
  git add CHANGELOG.md
  git commit -m "docs(changelog): v<NEXT_VERSION>"
  ```

This commit must land **before** `npm version` runs, so it's on the branch when the version tag is created. The tag itself will point at the subsequent `release: vX.Y.Z` commit, but the branch (and the npm tarball, which packs from `src/` + `README.md` + `LICENSE`) reflects the latest tree. Note: `CHANGELOG.md` is NOT in `package.json#files` — it ships on GitHub only, not in the npm tarball. That's fine; the GitHub Release in step 7 is the canonical user-facing log.

## Step 6 — Run the release script

Run the existing wrapper — do NOT replace it:

```
npm run release:<bump>     # patch | minor | major
```

What it does (see `scripts/release.js`):

1. Re-verifies npm login, clean tree, branch.
2. `npm version <bump> -m "release: v%s"` — bumps `package.json`, creates the release commit + git tag `vX.Y.Z`.
3. Runs `prepublishOnly` (= `npm run test:build && npm test`) then `npm publish`.
4. `git push --follow-tags`.

If publish fails: the version was already bumped locally. **Do not re-run the skill.** Tell the user to fix the underlying issue, then run `npm publish` manually (the bump commit + tag still need to be pushed; the script already attempted that).

For a rehearsal, use `node scripts/release.js <bump> --dry-run` (skips publish + push). Only run this if the user explicitly asks for a dry run.

## Step 7 — Create the GitHub Release

After the npm publish succeeds and the tag is pushed:

```powershell
# Write notes to a temp file so newlines + markdown survive
$notes = @'
### Added
- ...

### Fixed
- ...
'@
$notes | Out-File -Encoding utf8 .release-notes.tmp.md
gh release create v<NEXT_VERSION> --title "v<NEXT_VERSION>" --notes-file .release-notes.tmp.md
Remove-Item .release-notes.tmp.md
```

The notes body is the same content written in step 5, minus the `## [X.Y.Z] - DATE` heading (gh adds its own title).

If `gh release create` fails because the tag isn't on the remote yet, the push in step 6 didn't complete — run `git push --follow-tags` manually, then re-run the `gh release create` command. Don't create a Release without a corresponding tag on origin.

## Step 8 — Report back

Final report (concise):

- Bumped `vA.B.C → vX.Y.Z`.
- CHANGELOG entry committed.
- npm: `https://www.npmjs.com/package/webcake-ui-kit/v/X.Y.Z`
- GitHub Release: output of `gh release view v<X.Y.Z> --json url -q .url`.

If any step was skipped (e.g. dry run) or failed, list it explicitly with the manual command to recover.

## Don'ts

- Don't bump version by editing `package.json` directly. Always go through `npm version` (via `scripts/release.js`) so the bump commit + tag are created atomically.
- Don't skip the CHANGELOG step. The point of this skill is that no version ships without one.
- Don't pass `--skip-checks` unless the user explicitly asks. The `prepublishOnly` gate (`test:build` + `test`) is the last line of defense against dual-compat regressions hitting npm.
- Don't create the GitHub Release before `npm publish` succeeds — a GH Release for a version that doesn't exist on npm misleads users.
- Don't re-run the whole skill after a mid-flow failure. Each step has a manual recovery; jumping back to step 1 will try to bump the version a second time.
