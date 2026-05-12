#!/usr/bin/env bash
#
# release.sh — webcake-ui-kit release flow (shell variant).
#
# What it does:
#   1. Preflight (clean tree, branch, npm + gh auth)
#   2. Run the gate manually: sync:exports:check + test:build
#   3. npm version <bump> (commits package.json + creates tag)
#   4. npm publish
#   5. git push --follow-tags
#   6. gh release create with notes pulled from CHANGELOG.md
#
# Usage: scripts/release.sh [patch|minor|major]
# Default bump: patch
#
# The `prepublishOnly` hook in package.json runs sync:exports:check + test:build
# again at publish time as a second line of defense. `npm test` is intentionally
# not part of the gate (see CHANGELOG known-issues for failing specs).

set -euo pipefail

BUMP="${1:-patch}"
case "$BUMP" in
  patch|minor|major) ;;
  *)
    echo "release.sh: bump must be one of: patch | minor | major (got: $BUMP)" >&2
    exit 1
    ;;
esac

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

# ---- Preflight -------------------------------------------------------------

if [ -n "$(git status --porcelain)" ]; then
  echo "release.sh: working tree is dirty. Commit or stash first." >&2
  git status --short >&2
  exit 1
fi

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [ "$BRANCH" != "master" ] && [ "$BRANCH" != "main" ]; then
  echo "release.sh: not on master/main (current: $BRANCH). Aborting." >&2
  exit 1
fi

if ! npm whoami > /dev/null 2>&1; then
  echo "release.sh: not logged in to npm. Run 'npm login' first." >&2
  exit 1
fi

if ! gh auth status > /dev/null 2>&1; then
  echo "release.sh: gh CLI not authenticated. Run 'gh auth login' first." >&2
  exit 1
fi

CURRENT_VERSION="$(node -p "require('./package.json').version")"
echo "release.sh: current version $CURRENT_VERSION, bumping $BUMP"

# ---- Gate ------------------------------------------------------------------

echo "release.sh: running sync:exports:check"
npm run --silent sync:exports:check

echo "release.sh: running test:build (Vue 2 + Vue 3 + Storybook compile)"
npm run --silent test:build

# ---- Version bump + publish + push ----------------------------------------

echo "release.sh: bumping version"
npm version "$BUMP" -m "release: v%s"

NEXT_VERSION="$(node -p "require('./package.json').version")"
TAG="v$NEXT_VERSION"
echo "release.sh: new version $NEXT_VERSION (tag $TAG)"

echo "release.sh: publishing to npm"
npm publish

echo "release.sh: pushing commit + tag to origin"
git push --follow-tags

# ---- GitHub Release --------------------------------------------------------

NOTES_FILE="$(mktemp -t release-notes-XXXXXX.md)"
trap 'rm -f "$NOTES_FILE"' EXIT

# Extract the section for $NEXT_VERSION from CHANGELOG.md
# (from `## [NEXT_VERSION]` up to the next `## [` heading, excluding the heading itself)
awk -v v="$NEXT_VERSION" '
  BEGIN { in_section = 0 }
  /^## \[/ {
    if (in_section) exit
    if (index($0, "[" v "]") > 0) { in_section = 1; next }
  }
  in_section { print }
' CHANGELOG.md > "$NOTES_FILE"

if [ ! -s "$NOTES_FILE" ]; then
  echo "release.sh: warning — no matching CHANGELOG section for [$NEXT_VERSION], using a fallback body" >&2
  echo "Release $TAG" > "$NOTES_FILE"
fi

echo "release.sh: creating GitHub Release $TAG"
gh release create "$TAG" --title "$TAG" --notes-file "$NOTES_FILE"

REL_URL="$(gh release view "$TAG" --json url -q .url)"
echo
echo "release.sh: done."
echo "  npm:    https://www.npmjs.com/package/webcake-ui-kit/v/$NEXT_VERSION"
echo "  github: $REL_URL"
