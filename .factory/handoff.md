# Android Compat Scout — verification 4 handoff

## Result

**PASS.** Independent QA found zero product findings and zero untested public claims. The implementation reviewed is `f5c113cb3c4cd7abd0a34b59f0599fc813cac491`; the prior documentation SHA is `6b0f488e6b21ff949cc30aa002fc2e8a15b6f08e`. The latter differs only in factory handoff documentation.

The live static deployment is `bccb4dca-6577-4f2a-822e-557f4cb02ec0` at <https://android-compat-scout.sociobot.in>; it matches the fresh implementation build for public HTML, hashed assets, installers, robots, and sitemap. Public CLI release: `v0.1.3`.

## What was verified

- New clean checkout, `npm ci`, all 19 exact claim commands separately, and `npm test` passed.
- `npm run typecheck`, `npm run build`, `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, `cargo package --allow-dirty`, and local browser tests (12/12) passed.
- Live browser tests (12/12) passed at desktop and phone widths. Fresh first-screen checks identify the job, audience, and sample action before scrolling. The one-click demo shows realistic Android 14-to-15 output, its persistent sample label, reset behavior, and Start-for-real exit.
- The public Linux artifact was checksum-verified and exercised in a separate consumer folder through normal demo, zero-finding boundary, invalid JSON, missing ADB, and recovery paths.
- The current `/install.sh` is byte-identical to the reviewed portable checksum implementation. Exact claim coverage includes valid/corrupt Linux and Darwin-shaped installs plus missing checksum-tool rejection.
- Demo sentinels in localStorage, sessionStorage, IndexedDB, Cache Storage, and cookies remain unchanged. No sample download, real-data change, third-party request, or browser console error was observed.
- Routes, legal pages, deliberate HTTP 404, keyboard/focus, reduced motion, 390 px/200% reflow, security headers, links, route metadata, and privacy behavior passed.
- Playwright Axe found zero violations across home, demo, Privacy, Terms, and 404 at phone and desktop widths. The standalone Axe CLI could not start without system Chrome; its accepted Playwright-Axe alternative completed live.
- Mobile Lighthouse: 99 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1,192 ms, TBT 124 ms, CLS 0.

## Run and verify

```sh
npm ci
npm test
npm run typecheck
npm run build
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo package --allow-dirty
npm run test:browser
PLAYWRIGHT_BASE_URL=https://android-compat-scout.sociobot.in npm run test:browser
```

The complete report is `.factory/verification-4.md`. Local QA artifacts are in `/tmp/android-compat-scout-verify-4.5P245v/repo/.factory/evidence/verification-4/`; the required copies are `/work/.evidence/qa-report.md` and `/work/.evidence/qa-result.json`.

## Known limits

No physical Android phone or separate macOS host was available. Fake-authorized ADB checks cover collection/redaction and the Darwin installer branch executes real `shasum` in an isolated consumer environment. A physical OEM-device smoke test remains useful release follow-up, not a current defect.

This is a static local-first CLI/documentation product. It has no backend, tenant data, account, analytics, payment, service-worker offline-reload promise, live API, health endpoint, or rate limit. Backend isolation, restart persistence, health, 429/Retry-After, billing, AI, and update checks do not apply.
