#!/usr/bin/env bash
set -euo pipefail

VERSION="${1:-}"

# Validate argument
if [[ -z "$VERSION" ]]; then
  echo "Usage: $0 <version>  (e.g. 1.2.3 or v1.2.3)" >&2
  exit 1
fi

# Strip leading 'v' so we store bare semver in package.json
VERSION="${VERSION#v}"

# Strict semver: major.minor.patch with optional pre-release + build metadata
SEMVER_RE='^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(-((0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*)(\.(0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*))*))?(\+([0-9a-zA-Z-]+(\.[0-9a-zA-Z-]+)*))?$'
if [[ ! "$VERSION" =~ $SEMVER_RE ]]; then
  echo "Error: '$VERSION' is not a valid semver (expected e.g. 1.2.3, 1.2.3-beta.1)" >&2
  exit 1
fi

TAG="v${VERSION}"

# Must be on master
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$BRANCH" != "master" ]]; then
  echo "Error: must be on master (currently on '$BRANCH')" >&2
  exit 1
fi

# Working tree must be clean
if [[ -n "$(git status --porcelain)" ]]; then
  echo "Error: working tree is dirty - commit or stash changes first" >&2
  exit 1
fi

# Tag must not already exist
if git rev-parse "$TAG" &>/dev/null; then
  echo "Error: tag '$TAG' already exists" >&2
  exit 1
fi

echo "Releasing $TAG..."

# Bump version in package.json (portable - works without npm version flags)
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.version = '${VERSION}';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

git add package.json
git commit -m "chore: release ${TAG}"
git tag -a "$TAG" -m "Release ${TAG}"

echo "Pushing commit and tag..."
git push origin master
git push origin "$TAG"

echo "Done. Released ${TAG}."
