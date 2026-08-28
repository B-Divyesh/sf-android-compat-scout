# Android Compat Scout handoff

## What shipped

- Rust single-binary CLI (`compat-scout`) for consented ADB snapshots,
  before/after comparisons, declared-requirement checks, JSON output, and an
  offline bundled demo.
- Sample data covering Android version, USB role, permission, and missing-app
  regressions.
- Blueprint drafting-sheet static site in `dist/site`, with `/demo`, `/privacy`,
  `/terms`, a designed 404, mobile layout, keyboard focus, installer scripts,
  and optional Sociobot Pro license verification.
- Original factory-generated hero image at `site/src/assets/blueprint-hero.webp`
  (56 KB WebP). Prompt and generator metadata sit beside it.
- GitHub Actions release workflow, Scoop manifest, winget starter manifest,
  SHA-256 installers, and package workflow steps for Linux deb/rpm and macOS pkg.

## Verified locally

- `npm test` — 3 Rust tests and 2 sandbox claim tests pass.
- `npm run build` — passes; static deploy root is exactly `dist/site/index.html`.
- Chromium screenshots checked at 390×844 and desktop demo routes. The initial
  JavaScript is 4.17 KB gzip, CSS is 1.93 KB gzip, and hero art is 56.66 KB.
- Routes `/`, `/demo`, `/privacy`, and `/terms` load through the static fallback.

## Known gaps / operator action

- No GitHub Release is created from this worker because it has no repository
  push/release authority. After push, run the committed `v0.1.0` tag workflow
  and verify release checksums before making download links live.
- The workflow includes package steps but release-hosted package assets have not
  been exercised on GitHub runners yet. Check the macOS cross-target output and
  update the placeholder Scoop hash from `SHA256SUMS` before publication.
- The $12 Pro site flow follows the billing contract. The factory must register
  the product slug before checkout and verify endpoints return live responses.
