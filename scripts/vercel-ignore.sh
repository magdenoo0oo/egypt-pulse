#!/usr/bin/env bash
# Vercel "Ignored Build Step" (vercel.json ignoreCommand). Exit 0 = skip this deployment, exit 1 = build.
# The data job commits 20-30 times a day; most commits are heartbeats that only rewrite data/meta.json (checkedAt).
# Building every one would spend Vercel Hobby's build minutes, so a heartbeat is skipped when the live deployment is
# less than 2 hours old. Anything else (rates.csv, code, a first deploy, an unknown or missing SHA) builds.
# When in doubt, build: a wasted build is cheap, a site that stops updating is not.
prev="${VERCEL_GIT_PREVIOUS_SHA:-}" # last successful deployment on this branch (skipped ones never count)
[ -n "$prev" ] || exit 1
git cat-file -e "${prev}^{commit}" 2>/dev/null || exit 1 # not in the shallow clone: build
changed="$(git diff --name-only "$prev" HEAD 2>/dev/null)" || exit 1
[ "$changed" = "data/meta.json" ] || exit 1
age=$(( $(git log -1 --format=%ct HEAD) - $(git log -1 --format=%ct "$prev") ))
if [ "$age" -ge 0 ] && [ "$age" -lt 7200 ]; then
  echo "heartbeat only (data/meta.json), live deploy is $((age / 60)) min old: skipping build"
  exit 0
fi
exit 1
