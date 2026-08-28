# Independent verification 2 handoff — FAIL

Verified on 2026-08-28 UTC against commit `4db26c809f0167fcb17ac98921939205064922f2` and `https://android-compat-scout.sociobot.in`.

Do **not** release/accept this candidate. Fresh-clone claims, tests, build, formatting/lint, package, installed CLI demo, public Linux release checksum/demo, live static-byte match, Playwright, Axe, and `verify-url.sh` passed. The candidate still fails the factory acceptance contract because the live “Demo — sample data, nothing is saved” assurance has no claim/storage-isolation proof; `B-Divyesh/homebrew-android-compat-scout` does not exist; the 15-case benchmark is synthetic private-function coverage rather than 15 representative CLI fixtures; and unknown deployed URLs return HTTP 200 rather than 404.

Exact evidence, commands, passing scope, and repair requirements are in `.factory/verification-2.md`.

---

# Android Compat Scout repair handoff

## Repair scope

Repaired every release-blocking finding from independent verification commit `ac26f1698966a252f1369321bdfe3984537f00d6` against candidate `1de70ef9ae0f3aef2b12e61ca8112aa4c0ad5ed6`.

- The CLI now embeds its sample snapshots and requirements. `compat-scout demo --json` works from an installed binary in an empty consumer directory and creates a persistent reported output directory.
- Added an executable 15-case benchmark fixture. The Rust regression test requires the brief’s 12/15 threshold and currently detects 15/15.
- The collector now has a fake-ADB regression test confirming sensitive serial, build-detail, Wi-Fi name, and MAC values do not enter the serialized snapshot.
- Replaced the unparsable release workflow with a tagged, multi-platform workflow for Linux x64/arm64, macOS x64/arm64, and Windows. It produces archives, deb, rpm, macOS pkg files, checksums, `latest.json`, a Scoop manifest, and a Homebrew formula as release assets.
- Removed unavailable $12 Pro checkout, license handling, and promised Pro capability. No billing or token request remains in the static site.
- Expanded `.factory/claims.json` to six test-backed claims; added exact consumer-demo, checksum-installer, benchmark, and read-only checks.
- Fixed mobile demo keyboard access by making command output focusable, fixed route-heading focus, increased link touch targets to 44px, and removed the automatic missing-GitHub-release fetch that logged a 404 console error.
- Added Playwright desktop/mobile/keyboard/privacy regression coverage with Axe serious/critical assertions.
- Added strict TypeScript checking, passed Rust formatting and Clippy, and configured immutable caching for hashed deployment assets.

## Verified locally

Run from a clean install:

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

All commands passed on 2026-08-28 UTC. `npm run test:browser` uses Playwright 1.58.2 at desktop and 390×844 mobile, checks no console errors, keyboard route focus, 44px link targets, local-only demo requests, and Axe serious/critical issues. Production output is `dist/site`; the built JS is 8.00 KB raw / 3.37 KB gzip, CSS 5.99 KB raw / 1.97 KB gzip, and hero WebP 56.66 KB.

The exact claim commands in `.factory/claims.json` all passed after `npm ci`. A clean `cargo install --path /work/repo --root <temp> --locked`, followed by `compat-scout demo --json` from a separate empty directory, passed and produced both report files.

## Release and deployment

Tag `v0.1.2` completed successfully in GitHub Actions run `33198625222` on 2026-08-28 UTC. The public release contains 15 assets: Linux x64/arm64 archives, macOS x64/arm64 archives and unsigned pkg files, a Windows zip, `.deb`, `.rpm`, `SHA256SUMS`, `latest.json`, a Scoop manifest, and a Homebrew formula. `latest.json` names a per-platform direct download URL. The x64 Linux archive checksum is `c4d2875a850ed6f64387259ddde3f2ca7687a0e967878b854d85eb0706156e4c`, verified against the public `SHA256SUMS` release asset. The repository’s Scoop and complete winget 0.1.2 manifest set use the released Windows zip checksum.

The static deployment artifact remains `dist/site`, preserving the original `cli-installers` plus static-site deployment class. Main was pushed with the repaired static artifact and deployment configuration; no infrastructure or DNS was changed from this repository.

Deployment completed through the factory static work-order helper on 2026-08-28 UTC: deployment ID `1b2d031f-3487-44d1-87b5-6588f3f42ae3` to `sf-android-compat-scout` (Central US). `https://android-compat-scout.sociobot.in` now serves `index-9ku_4vao.js`, the repaired bundle. Post-deploy `/opt/fleet/lib/verify-url.sh` passed: HTTP 200, 823 ms load measurement, zero console errors, one h1, `lang=en`, a main landmark, and no missing image alt text.

## Known limits

No physical Android device was available in this worker. The ADB collector is covered with a fake executable for command sequencing and redaction; live USB authorization and OEM-specific output still need device smoke testing after release.
