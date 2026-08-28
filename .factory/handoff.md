# Android Compat Scout — polish 4 handoff

## Outcome

Commit `056154783698b109a254f605111c2c3dd8cda65a` closes every finding in reviews 1–4. It repairs desktop first-screen visibility, explicit Install-anchor navigation, history scroll restoration, the sample-report heading, and connectivity terminology without changing the blueprint drafting-sheet identity. It is pushed to `origin/main` and deployed through the static work-order configuration as deployment `1f4a0178-4a88-49e7-b07c-c12926359f1c`.

## Run and verify

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

The static site output is `dist/site`. The CLI demo is `compat-scout demo`; the direct isolated web demo is `https://android-compat-scout.sociobot.in/?demo=1` (also `/demo`). `?demo=1` does not touch real browser storage and provides Reset demo and Start for real.

Fresh-clone evidence: `/tmp/android-compat-scout-polish-4.8BpT0o/repo` at the repair commit passed `npm ci` with zero vulnerabilities, every exact command in all 19 claim entries, aggregate claim tests (18 Vitest + 1 Rust benchmark), typecheck, browser tests (12/12), build, format, Clippy, and package checks.

Production evidence: `verify-url.sh` passed with a 636 ms cold load, no console errors, valid title/lang/h1/main/alt/button checks. The live browser suite passed 12/12. `/`, `/demo`, `/privacy`, `/terms`, installers, robots, and sitemap return 200; a made-up path returns 404. Mobile Lighthouse scored performance 100, accessibility 100, SEO 100, LCP 1061 ms, CLS 0. Screenshots and JSON reports are under `/tmp/android-compat-scout-polish-4-evidence/live/`.

## Known gaps / next steps

None. The current static deployment and v0.1.3 CLI release are release-ready. A future CLI feature change should use a new `v*` tag so the GitHub Actions release workflow rebuilds platform artifacts.
