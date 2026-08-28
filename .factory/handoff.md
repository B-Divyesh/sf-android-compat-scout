# Android Compat Scout — polish 2 handoff

## Outcome

PASS. Every finding in `.factory/review-1.md` and `.factory/review-2.md` is closed. The detailed finding-to-change-to-evidence matrix is in `.factory/polish-2.md`.

The product remains a Rust single-binary CLI with a static Vite site in `dist/site`. Its blueprint drafting-sheet identity is unchanged. The landing page now uses direct first-screen wording, an isolated one-click `/?demo=1` sample, architecture-safe install choices, complete route metadata, legal links, and mobile layouts tested at 390 px.

## Release and deployment

- CLI release: `v0.1.3` from commit `1348064`, GitHub Actions run `33210140124`.
- Release contents: 15 assets covering Linux x64/ARM64 archives, macOS x64/ARM64 archives and packages, Windows x64 zip, deb, rpm, raw binaries, `SHA256SUMS`, `latest.json`, Scoop, and Homebrew metadata.
- Homebrew tap update: `B-Divyesh/homebrew-android-compat-scout` commit `a8a1d96`.
- Final site-code commit: `1742769`.
- Production deployment: `f5ea54ca-8683-43ce-b767-df770db448ec` to `https://android-compat-scout.sociobot.in`.
- Catalog copy: “Find Android setup changes with local snapshots and a command-line report.”

## Verification

Every exact `.factory/claims.json` command passed from `/tmp/android-compat-scout-final.kQLFdm/repo` at clean-clone commit `40f69a4cee542a71895a87481325ed68b75a748e`: 16/16.

The complete clean-clone suite passed from `/tmp/android-compat-scout-suite.iIylW9/repo` at `f8b73de3a2b5ddf1baa91a97838b0822b16d36cc`:

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

`npm test` passed 6 Rust tests and 16 Vitest tests. The final local and production browser suites passed 8/8. They cover the six required user-agent classes, keyboard focus, all route metadata, 390 px first-screen fit, all-store demo isolation, same-origin requests, no downloads, offline use after load, and zero Axe violations on home, demo, privacy, terms, and 404 at mobile and desktop widths.

Production checks:

- `verify-url.sh`: HTTP 200, 729 ms, zero console errors, `lang=en`, one h1, main present, no missing alt text, no unlabeled buttons.
- Unknown route: HTTP 404. `/demo`, `/privacy`, and `/terms`: HTTP 200.
- Link crawl: every rendered internal, legal, installer, release, and direct platform link returned 200.
- The deployed JavaScript, CSS, and hero image are byte-identical to the final local `dist/site` build.
- Lighthouse 13.0.1 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100, LCP 1059 ms, TBT 25 ms, CLS 0, total transferred bytes 64,039, no runtime error.
- Built assets: JavaScript 9.31 KB raw / 3.74 KB gzip; CSS 6.85 KB raw / 2.14 KB gzip; hero WebP 56.66 KB.
- Public Linux release checksum: `4e2c565d54bc12d69ed208b51791f895ecaa5940fb8170f938da51c84f10f3ac`; its installed demo ran outside the checkout and wrote both JSON reports.

Evidence is under `.factory/evidence/polish-2/`, including screenshots, `verify.json`, and the Lighthouse report.

## Run locally

```sh
npm ci
npm test
npm run test:browser
npm run build
```

Run browser checks against production with:

```sh
PLAYWRIGHT_BASE_URL=https://android-compat-scout.sociobot.in npm run test:browser
```

## Known gaps and next steps

No reviewed or testable product gap remains. No physical Android device was attached to this worker; the collector path is covered by an authorized fake-ADB end-to-end test that verifies command sequencing, JSON output, and identifier redaction. Winget publication stays outside the worker scope; the complete `0.1.3` manifests are ready for owner submission.
