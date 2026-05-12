---
name: release
description: Use when the user wants to publish a new version of webcake-ui-kit to npm. Triggers include "release", "publish", "phát hành", "publish lên npm", "tạo tag", "release patch/minor/major", "ra version mới". You (Claude) handle CHANGELOG drafting + commit + post-release verification. The actual `npm version → npm publish → git push → gh release create` is done by `scripts/release.js`, which the **user runs themselves in their terminal** because the 2FA OTP prompt needs an interactive TTY that the Bash tool does not provide. Don't use for releasing playground apps or non-package work.
---

# Release — webcake-ui-kit publish flow

You do everything around the release; `scripts/release.js` does the release itself. The OTP boundary is the reason this is split.

`scripts/release.js` is **idempotent**: if a previous run got far enough to bump the version + create a `vX.Y.Z` tag but then failed at publish (rejected/expired OTP, network blip, etc.), re-running it detects the existing tag, skips the bump step, and resumes from publish. You do NOT need to clean anything up before asking the user to re-run it.

## Preconditions — abort if any fail

Run these first in parallel. Stop with a clear message if any fails. Do NOT continue with workarounds.

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
   - `!:` in subject, `BREAKING CHANGE` in body, or renamed/removed public exports → **major**
3. Use AskUserQuestion to confirm. Show the suggestion first labeled `(Recommended)`. Don't pick silently — releases are public, the user owns the call. If the user passed a level but the commit history clearly contradicts it (e.g. they asked `patch` but the diff renames every export), surface that conflict via AskUserQuestion before continuing.

## Step 2 — Compute next version

Read `package.json#version`, apply the chosen bump locally to get `NEXT_VERSION` (e.g. `1.0.1` + `patch` → `1.0.2`). Use this for the CHANGELOG heading. Don't write `package.json` yet — `scripts/release.js` does that via `npm version` in step 6.

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

This commit must land **before** `scripts/release.js` runs, so it's on the branch when the version tag is created. The npm tarball packs from `src/` + `README.md` + `LICENSE` (see `package.json#files`); `CHANGELOG.md` is intentionally NOT in the tarball — it lives on GitHub. The GitHub Release that `scripts/release.js` creates in its step 9 reads this same CHANGELOG section as its body, so the content authored here flows straight to the Release page.

`storybook-vue3/stories/Changelog.stories.js` also imports `CHANGELOG.md` as raw source (via the webpack `.md → asset/source` rule wired in `storybook-vue3/.storybook/main.js`) and parses it into the "Changelog" docs page in Storybook. So **once you commit `CHANGELOG.md`, the Storybook Changelog page picks up the new entry automatically** — no separate file to update. If you ever need to verify the page renders, run `cd storybook-vue3 && npm run storybook` and open the "Changelog" entry in the sidebar.

## Step 6 — Hand off to the user to run scripts/release.js

**Do NOT run `node scripts/release.js patch` via the Bash tool.** The script prompts for an npm 2FA OTP via `readline.question()`; the Bash tool has no interactive TTY, so the prompt receives EOF immediately, the OTP arrives empty, publish is rejected, and the script burns its 3 retries against an empty string. The user must run the script in a context with a real TTY.

Two equivalent ways for the user; offer them both:

```bash
# Option 1 — paste into chat with the `!` prefix
! node scripts/release.js patch

# Option 2 — run directly in your terminal
node scripts/release.js patch
```

Option 1 is preferred because the script's stdout streams back into the conversation, so you can pick up at step 7 without the user having to copy-paste anything.

What the script does, end-to-end:

1. Pre-flight: npm login check, sync per-component exports (auto-commit if drift), working-tree-clean check, branch check, show local vs npm version.
2. **Bump step** — runs `npm version <bump> -m "release: v%s"` UNLESS the tag for the current `package.json#version` already exists locally and that version is not yet on npm. In that case it prints `Resuming at X.Y.Z` and skips the bump. This is the resume-after-failure path; if a previous attempt half-finished, this is what carries it across the line.
3. **Publish step** — prompts `Enter npm 2FA OTP (6 digits...)`. User types the code from their authenticator app. Retries up to 3 times on rejection. Accepts `--otp=XXXXXX` or `NPM_OTP` env var if the user wants to skip the prompt.
4. `git push --follow-tags` — pushes the bump commit + new tag.
5. `gh release create vX.Y.Z` — body is the matching `## [X.Y.Z]` section from `CHANGELOG.md` (so the entry written in step 5 of this skill is the GitHub Release body too).

If the user reports a failure or you see one in the streamed output:

- **Bad OTP** — script handles it; just remind them to use the latest 6-digit code (codes rotate every ~30s).
- **Network / registry hiccup** — tell them to re-run `node scripts/release.js patch`. Idempotent resume kicks in.
- **prepublishOnly fails (`sync:exports:check` or `test:build`)** — that's a real product-side problem; diagnose, fix, re-run.
- **`fatal: tag vX.Y.Z already exists` from `npm version`** — should NOT happen now that the script checks first. If you see it, the tag points to something stale and is on origin/npm too — escalate to the user; don't auto-delete pushed tags.

## Step 7 — Verify and report

Run these in parallel after the script finishes:

```
npm view webcake-ui-kit@<NEXT_VERSION> version
gh release view v<NEXT_VERSION> --json url -q .url
```

Final report (concise):

- Bumped `vA.B.C → vX.Y.Z`.
- CHANGELOG entry committed.
- npm: `https://www.npmjs.com/package/webcake-ui-kit/v/<NEXT_VERSION>`
- GitHub Release: `<URL from gh release view>`

If `npm view` doesn't show the new version yet, registry propagation can take ~30s — wait and retry once before reporting it as missing.

## Don'ts

- **Don't run `node scripts/release.js` via the Bash tool.** OTP prompt will hang or fail 3x. Hand off to the user with the `!` prefix.
- **Don't bump version by editing `package.json` directly.** Always go through `npm version` (via `scripts/release.js`) so the bump commit + tag are created atomically.
- **Don't run `npm publish` directly outside the script** unless you're explicitly recovering from a half-finished release. The script's resume mode handles that case better.
- **Don't skip the CHANGELOG step.** No version ships without an entry — the GitHub Release body depends on it.
- **Don't pass `--skip-checks`** unless the user explicitly asks. The `prepublishOnly` gate (`sync:exports:check && test:build`) is the last line of defense against compile-time regressions.
- **Don't re-run this skill from step 1 after a mid-flow failure in step 6.** The script is idempotent — just have the user re-run it.
- **Don't delete pushed tags** to "fix" a stale-tag error. That breaks consumers who already fetched. Escalate to the user.
