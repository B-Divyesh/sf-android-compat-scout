# Android Compat Scout — review 6 handoff

## Result

Review 6 is **FAIL** with one blocking finding and one untested claim. Product code was not modified.

The public `/install.sh` is labeled for Linux and macOS but always calls `sha256sum`. Clean macOS provides `shasum`, so the advertised one-line macOS install path exits before installation. The `@claim:checksum-unix-installer` test passes only on its Linux branch and does not cover this path.

The full report is `.factory/review-6.md`.

## Reviewed versions

- Implementation candidate: `056154783698b109a254f605111c2c3dd8cda65a`
- Documentation checkout: `42b8596b91c9d8fd65fb9fc5eba8aac7069dd05c`
- Public CLI release: `v0.1.3`
- Live URL: <https://android-compat-scout.sociobot.in>

The live HTML and hashed assets match the clean build. The live installer is byte-identical to the candidate installer.

## Verification

From clean checkout `/tmp/android-compat-scout-review-6.4ES1Zz/repo`:

```sh
npm ci
# every exact .factory/claims.json command separately: 19/19 exited successfully
npm test
npm run typecheck
npm run build
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo package --allow-dirty
npm run test:browser
PLAYWRIGHT_BASE_URL=https://android-compat-scout.sociobot.in npm run test:browser
```

The full suite passed 19 unit/claim tests. Local and live browser suites passed 12/12. The live URL check had no console error, and Axe CLI found zero violations. Mobile Lighthouse scored 100 in all four categories, with LCP 1,126 ms, TBT 60 ms, CLS 0, and 64,779 transferred bytes.

The downloaded Linux release passed checksum, demo, JSON, identical-snapshot, malformed-input, missing-ADB, recovery, help, and version checks from a clean consumer directory. Fresh phone and desktop demo flows preserved real browser data and made no third-party request or download. The designed unknown route returned the expected 404 and remained usable.

Evidence is under `/work/.evidence/review-6/`.

## Required next step

Update `install.sh` to use checksum tooling available on both Linux and macOS. Add a Darwin-path test with `shasum` available and `sha256sum` absent. After redeployment, rerun every claim command and the live installer check before declaring PASS.
