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

Tag `v0.1.1` is the release trigger. The static deployment artifact remains `dist/site`, preserving the original `cli-installers` plus static-site deployment class. The release and deployed-site verification results are appended here after the pushed tag’s GitHub Actions workflow finishes.

## Known limits

No physical Android device was available in this worker. The ADB collector is covered with a fake executable for command sequencing and redaction; live USB authorization and OEM-specific output still need device smoke testing after release.
