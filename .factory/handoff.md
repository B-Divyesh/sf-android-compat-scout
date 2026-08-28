# Android Compat Scout — polish 3 handoff

## Outcome

PASS. This repair closes every finding in `.factory/review-1.md`, `.factory/review-2.md`, and `.factory/review-3.md`; the full mapping is in `.factory/polish-3.md`. No finding of any severity is deferred.

The product remains a Rust single-binary CLI with a static Vite landing site. It now has a bounded, non-causal first-screen headline; one-click `?demo=1` isolation with reset/exit; a complete claims contract; corrected winget manifests validated by the official Windows CLI; 44px persistent mobile controls; and 390px/200%-text reflow coverage.

## Commits and deployment

- Product repair: `4fea451a2f91380e4285bdd85f71ac4403ec9b3a` (`fix: close review three findings`).
- Winget CI repair: `7790325d569496c17fdd497c770e19943ae7f143` (`ci: validate winget manifest sets`).
- Both commits are pushed to `origin/main`.
- Static deployment: `a7c3033c-8fee-4acd-8263-f72816caa9ab` to <https://android-compat-scout.sociobot.in>.
- Official Windows validation: <https://github.com/B-Divyesh/sf-android-compat-scout/actions/runs/33214884847> — success.

## How to run and verify

```sh
npm ci
npm test
npm run typecheck
npm run test:browser
npm run build
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo package --allow-dirty
```

Demo URLs are `/?demo=1` and `/demo`. The browser sample is storage-free: its banner says “Demo — sample data, nothing is saved,” Reset demo rerenders only sample UI, and Start for real returns to `/`. The CLI demo is `compat-scout demo`; it embeds its samples and writes to a persistent `compat-scout-demo-<timestamp>` directory.

## Verification evidence

- Clean clone: `/tmp/android-compat-scout-polish-3.NYhQZO/repo`, commit `7790325d569496c17fdd497c770e19943ae7f143`.
- From that clone, `npm ci` reported zero vulnerabilities and all 19 exact claim commands from `.factory/claims.json` passed individually. The full clean-clone suite passed: `npm test` (19 tests), `npm run typecheck`, `npm run test:browser` (9 tests), `npm run build`, Rust format/clippy, and package verification.
- Production `PLAYWRIGHT_BASE_URL=https://android-compat-scout.sociobot.in npm run test:browser`: 9/9 passed. It checks one-click demo isolation, storage sentinels, offline reset/exit, no third-party requests, metadata, h1 focus, 44px controls, 390px/200%-text reflow, all real routes, 404 legal links, and Axe violations.
- [verify-url output](/tmp/android-compat-scout-polish-3-live/verify.json): HTTP 200, 842 ms, zero console errors, title/lang/h1/main/alt/button checks passed.
- Cold production screenshots: [desktop](/tmp/android-compat-scout-polish-3-live/screenshot-desktop.png) and [390px mobile](/tmp/android-compat-scout-polish-3-live/screenshot-mobile.png).
- [Mobile Lighthouse JSON](/tmp/android-compat-scout-polish-3-live/lighthouse-mobile.json): Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1098 ms, TBT 21 ms, CLS 0, transfer 64,210 bytes.
- Live URLs: `/`, `/demo`, `/privacy`, `/terms`, and `/?demo=1` returned 200; `/not-a-real-page-polish-3` returned 404. Route titles/canonicals and destination-h1 focus passed on all real routes.

## Known gaps and next steps

None. No new binary tag was needed because this repair changes documentation, static-site behavior, claims, accessibility, and package manifests; the existing public `v0.1.3` binary remains the artifact exercised by release/install claims.
