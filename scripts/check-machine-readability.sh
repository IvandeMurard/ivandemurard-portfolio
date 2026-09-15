#!/usr/bin/env bash
# Checks that this site still serves its content to machines.
#
#   ./scripts/check-machine-readability.sh [base-url]
#   npm run check:machine -- https://ivandemurard.com
#
# Exits non-zero on any failure. ALLOW_KNOWN_FAILURES=1 downgrades the checks
# that are blocked by static hosting (see notes inline) to warnings.

set -uo pipefail

BASE="${1:-https://ivandemurard.com}"
BASE="${BASE%/}"
JOURNAL="/journal/harnesses-graders-closed-loops"
CASE="/aetherix"
ALLOW="${ALLOW_KNOWN_FAILURES:-0}"

fails=0
pass() { printf '  ok    %s\n' "$1"; }
fail() { printf '  FAIL  %s\n' "$1"; fails=$((fails + 1)); }
warn() { printf '  warn  %s (known platform limit)\n' "$1"; }

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

status() { curl -s -o "$2" -w '%{http_code}' "$1"; }

check_route() {
  local path="$1" label="$2"
  printf '\n%s (%s)\n' "$label" "$path"

  # 1. .md URL resolves and is not HTML
  local code
  code="$(status "$BASE$path.md" "$tmp/md")"
  if [ "$code" = "200" ] && ! head -c 200 "$tmp/md" | grep -qi '<!doctype html'; then
    pass "GET $path.md -> 200, non-HTML body"
  else
    fail "GET $path.md -> $code or HTML body"
  fi
  # Content-Type is application/octet-stream on this host and is not settable
  # from the project; we assert "not text/html" instead.
  if curl -s -I "$BASE$path.md" | grep -qi 'content-type: text/html'; then
    fail "$path.md served as text/html"
  fi

  # 2. content negotiation on the HTML URL
  local negcode
  negcode="$(curl -s -H 'Accept: text/markdown' -o "$tmp/neg" -w '%{http_code}' "$BASE$path")"
  if [ "$negcode" = "200" ] && curl -s -I -H 'Accept: text/markdown' "$BASE$path" | grep -qi 'content-type: text/markdown'; then
    pass "GET $path (Accept: text/markdown) -> 200 text/markdown"
  else
    fail "GET $path (Accept: text/markdown) -> $negcode, wrong content-type"
  fi

  # 3. drift check: the .md body must be present inside the negotiated body.
  # Byte equality is impossible here: the negotiated variant is produced by the
  # hosting layer from the rendered page and carries site chrome.
  local probe
  probe="$(grep -m1 -E '^[A-Za-z].{60,}' "$tmp/md" | head -c 60)"
  if [ -n "$probe" ] && grep -qF "$probe" "$tmp/neg"; then
    pass "the .md body and the negotiated body agree"
  else
    fail "the .md variant and the negotiated variant have drifted"
  fi

  # 4. ?format=md must never be 2xx HTML
  local fcode
  fcode="$(status "$BASE$path?format=md" "$tmp/fmt")"
  if [ "${fcode:0:1}" != "2" ] || ! head -c 200 "$tmp/fmt" | grep -qi '<!doctype html'; then
    pass "GET $path?format=md -> $fcode, not HTML"
  elif [ "$ALLOW" = "1" ]; then
    warn "GET $path?format=md -> 200 HTML"
  else
    fail "GET $path?format=md -> 200 HTML (static hosting cannot route query strings)"
  fi

  # 5. head announces the variant and a canonical
  curl -s "$BASE$path" -o "$tmp/html"
  if grep -q 'rel="alternate"' "$tmp/html" && grep -q 'type="text/markdown"' "$tmp/html"; then
    pass "HTML head announces the markdown variant"
  else
    fail "HTML head has no rel=alternate text/markdown"
  fi
  if grep -q 'rel="canonical"' "$tmp/html"; then
    pass "HTML head has a canonical"
  else
    fail "HTML head has no canonical"
  fi
}

printf 'Machine readability checks against %s\n' "$BASE"

check_route "$JOURNAL" "journal entry"
check_route "$CASE" "case study"

printf '\ncorpus files\n'
if curl -s "$BASE/llms.txt" | grep -q '\.md'; then
  pass "llms.txt lists at least one .md URL"
else
  fail "llms.txt lists no .md URL"
fi

printf '\nsitemap\n'
sitemap="$(curl -s "$BASE/sitemap.xml")"
if [ -z "$sitemap" ]; then
  fail "sitemap.xml is empty or unreachable"
else
  pass "sitemap.xml -> 200"
  while read -r loc; do
    [ -z "$loc" ] && continue
    code="$(curl -s -o /dev/null -w '%{http_code}' "$loc.md")"
    if [ "$code" = "200" ]; then
      pass "$loc.md -> 200"
    else
      fail "$loc.md -> $code"
    fi
  done < <(printf '%s' "$sitemap" | grep -o '<loc>[^<]*/journal/[^<]*</loc>' | sed -e 's/<loc>//' -e 's|</loc>||' | grep -v '/journal$')
fi

printf '\n'
if [ "$fails" -gt 0 ]; then
  printf '%s check(s) failed\n' "$fails"
  exit 1
fi
printf 'all checks passed\n'
