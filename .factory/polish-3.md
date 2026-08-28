# Polish 3 — cumulative review closure

Repair target: `49ad29d84d33f7cf147ad3514d4ab74150c4d9a2`. Review source: `db317115ae308a8d359a1986cc65ed9c7ec41193`. Repair commits: `4fea451a2f91380e4285bdd85f71ac4403ec9b3a` and `7790325d569496c17fdd497c770e19943ae7f143`. Static deployment: `a7c3033c-8fee-4acd-8263-f72816caa9ab` at <https://android-compat-scout.sociobot.in>.

The clean clone at `/tmp/android-compat-scout-polish-3.NYhQZO/repo` ran every exact command in `.factory/claims.json`: **19/19 passed**. Its full suite also passed: `npm test` (19 tests), `npm run typecheck`, `npm run test:browser` (9 tests), `npm run build`, `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, and `cargo package --allow-dirty`.

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the public Unix installer and `compat-scout demo`; checkout-only install remains explicitly development-only in the README. | `@claim:local-installed-release`; production browser test `desktop landing has no console errors and offers explicit release choices`; [live desktop](/tmp/android-compat-scout-polish-3-live/screenshot-desktop.png). |
| F-1-2 | Replaced the under-proved runtime wording with “Downloads are available for Windows, macOS, and Linux.” | `@claim:release-distribution`; production browser device matrix; live `/`. |
| F-1-3 | Kept the checksum promise only in README and its exact public-asset hash test. | `@claim:release-download-checksums` downloaded and hashed all 11 public installable assets. |
| F-1-4 | Completed the winget version/defaultLocale/installer set, added a Windows `winget validate` CI workflow, and retained the complete release matrix check. | `@claim:release-distribution`; successful [Windows validation run](https://github.com/B-Divyesh/sf-android-compat-scout/actions/runs/33214884847). |
| F-1-5 | Preserved the direct `?demo=1` isolated sample and README location. | `@claim:demo-storage-isolation`; live demo reset/exit returned empty local/session storage and cookies. |
| F-1-6 | Preserved the real `compat-scout-demo-<timestamp>` output pattern in site, docs, and CLI. | `@claim:installed-demo`; live terminal recording on `/` and `/demo`. |
| F-1-7 | Preserved route-specific title, description, canonical, Open Graph, Twitter, focus, and 404 behavior. | Production Playwright `each real route supplies its own canonical, description, and social metadata`; live `/demo`, `/privacy`, `/terms`; unknown route returned 404. |
| F-1-8 | Kept “Changes to check” as the sample-report heading. | Production Playwright 9/9; live `/?demo=1`. |
| F-1-9 | Kept earlier slogans removed and retained only concrete headings and facts. | Updated `.factory/copy-audit.md`; live desktop/mobile screenshots. |
| F-1-10 | Kept documented `--json` help behavior registered and tested. | `@claim:cli-interface-options`. |
| F-1-11 | Kept “owners of customized Android phones and vehicle dongles” consistent across landing and README. | Copy audit; live `/`; README. |
| F-2-1 | Kept the architecture-safe desktop chooser and computer-only phone instruction. | Production browser device matrix; live `/` at mobile and desktop widths. |
| F-2-2 | Kept the behavioral PowerShell checksum test. | `@claim:checksum-windows-installer` passed from clean clone. |
| F-2-3 | Kept plain JSON-report capability wording and public command tests. | `@claim:snapshot-json`, `@claim:requirements-check`, and `@claim:compare-json`. |
| F-2-4 | Kept the exact “Found 6 changes.” sample wording and count. | `@claim:sample-six-changes`; live `/` and `/?demo=1`. |
| F-2-5 | Kept the plain home/social title and route metadata coverage. | Production metadata Playwright test; `verify.json`. |
| F-2-6 | Kept numbered/mood labels out of landing and 404 copy. | `.factory/copy-audit.md`; [live mobile](/tmp/android-compat-scout-polish-3-live/screenshot-mobile.png). |
| F-2-7 | Replaced the imprecise report warning with the exact snapshot fields and action; registered it. | `@claim:retained-snapshot-fields`; live `/privacy`; README Privacy and safety. |
| F-2-8 | Kept the README heading “Capture and compare snapshots.” | README and copy audit. |
| F-2-9 | Kept plain “test data” and “automated tests” benchmark wording. | `@claim:benchmark-12-of-15`; README and copy audit. |
| F-2-10 | Kept the README demo-documentation sentence specific about sample files, reset, and storage checks. | README link and `.factory/demo.md`; `@claim:demo-storage-isolation`. |
| F-3-1 | Rewrote landing and README headline to “Find Android setup changes after an update,” removing causal diagnosis. | `@claim:compare-json`; live `/` heading; both live screenshots. |
| F-3-2 | Made install grid children shrink, constrained code/download containers, and added 390px/200%-text reflow coverage including open chooser. | Production Playwright `every route reflows at 390px and 200% text without page-level horizontal scrolling`; live mobile screenshot. |
| F-3-3 | Gave wordmark and demo-banner controls 44px minimum targets; expanded the browser test to every visible link, button, and summary. | Production Playwright `every persistent control meets the touch-target minimum`; live `/?demo=1`. |
| F-3-4 | Replaced distribution-only hero facts with price, offline, and privacy facts; registered each new claim. | `@claim:mit-license`, `@claim:offline-bundled-demo` (network syscalls blocked), and `@claim:redacted-export`; live `/`. |
| F-3-5 | Rewrote “Declare,” “meaningful,” vague report wording, and the completeness caption with concrete terms. | Updated copy audit; live `/` and [mobile screenshot](/tmp/android-compat-scout-polish-3-live/screenshot-mobile.png). |

## Live evidence

- `/opt/fleet/lib/verify-url.sh` output: [verify.json](/tmp/android-compat-scout-polish-3-live/verify.json) — HTTP 200, 842 ms, zero console errors, `lang=en`, one h1, main landmark, no missing alt text, and no unlabeled buttons.
- Production Playwright: `PLAYWRIGHT_BASE_URL=https://android-compat-scout.sociobot.in npm run test:browser` — 9/9 passed. It covers one-click demo isolation, reset/exit, offline loaded demo, Axe scans, metadata, focus, all persistent controls, route reflow at 390px/200%, and explicit platform choices.
- Cold screenshots: [desktop](/tmp/android-compat-scout-polish-3-live/screenshot-desktop.png) and [390px mobile](/tmp/android-compat-scout-polish-3-live/screenshot-mobile.png).
- Lighthouse mobile: [JSON](/tmp/android-compat-scout-polish-3-live/lighthouse-mobile.json) — Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1098 ms, TBT 21 ms, CLS 0, transfer 64,210 bytes.
- Live route check: `/`, `/demo`, `/privacy`, `/terms`, and `/?demo=1` returned 200; `/not-a-real-page-polish-3` returned 404. Live route h1 focus, title, and canonical checks passed for all four real routes.

No finding is deferred.
