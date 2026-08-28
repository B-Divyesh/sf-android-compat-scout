# Polish 2 — cumulative review closure

Repair target: `52d83c141dbc98d920e22455c0d3983661f12176`. Review source: `1396c8c2ddc8e849b51a8c0dfab1be231ee24a85`. Production URL: `https://android-compat-scout.sociobot.in`. Release: `v0.1.3`; GitHub Actions run `33210140124`. Final site deployment: `f5ea54ca-8683-43ce-b767-df770db448ec` from site-code commit `1742769`.

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Removed architecture guessing. Android and iOS now say to open install options on a computer. Every desktop gets an explicit Windows x64, macOS Apple silicon, macOS Intel, Linux x64, and Linux ARM64 chooser. | Playwright `Android, iOS, macOS, and Linux visitors never receive a guessed binary`; [Android home](evidence/polish-2/live-android-home.png); [platform chooser](evidence/polish-2/live-platform-options.png); live `/`. |
| F-2-2 | Split the installer contract into Unix and Windows claims. The Windows test runs the real `install.ps1` in PowerShell with mocked good and bad downloads, then checks the destination. | `@claim:checksum-windows-installer` and `@claim:checksum-unix-installer`; both passed individually and in the clean-clone suite. |
| F-2-3 | Rewrote the first-screen sentence around a concrete JSON report. Rewrote README setup copy in plain words. Added public-command tests for snapshot JSON, requirement checks, and before/after JSON comparison. | `@claim:snapshot-json`, `@claim:requirements-check`, `@claim:compare-json`; `.factory/copy-audit.md`; live `/`. |
| F-2-4 | Replaced “compatibility signals” with “changes” in the site and CLI. Registered the exact sample count and asserted six JSON findings. | `@claim:sample-six-changes`; public `v0.1.3` archive prints `Found 6 changes.`; live `/` and `/?demo=1`. |
| F-2-5 | Changed the home title and both social titles to “Android Compat Scout — Find Android setup changes.” | Playwright `each real route supplies its own canonical, description, and social metadata`; `verify.json`; live `/`. |
| F-2-6 | Removed all three numbered landing labels. Replaced demo “sandbox” wording with “Sample data / Android 14 → 15.” Removed decorative 404 labeling too. | `.factory/copy-audit.md`; [desktop](evidence/polish-2/screenshot-desktop.png); [demo](evidence/polish-2/live-android-demo.png); live routes. |
| F-2-7 | Replaced the vague storage line with the exact sensitive fields and action: reports contain package names and Android build details; store them as private files. | `.factory/copy-audit.md`; live landing safety section. |
| F-2-8 | Renamed README “Use it” to “Capture and compare snapshots.” | README audit in `.factory/copy-audit.md`. |
| F-2-9 | Replaced “fixture” and “regression suite” with “test data” and “automated tests.” | README audit; `@claim:benchmark-12-of-15` still executes all 15 public-CLI cases and detects 15/15. |
| F-2-10 | Expanded the README link sentence to name the sample files, reset behavior, and storage checks. | README and `.factory/demo.md`. |

## Rechecked review 1 findings

| Finding | Change made or preserved | Evidence |
| --- | --- | --- |
| F-1-1 | The public install block remains the live `install.sh` command plus `compat-scout demo`; checkout-only installation appears only under local development. | Playwright `desktop landing has no console errors and offers explicit release choices`; live `/`; `@claim:local-installed-release`. |
| F-1-2 | Replaced the broad fact with “Runs on Windows, macOS, or Linux” and proved the complete release matrix. | `@claim:release-distribution`; device matrix Playwright test. |
| F-1-3 | The claim now requires the checksum list to equal the complete 11-file installable set and downloads and hashes every file. | `@claim:release-download-checksums`; public `v0.1.3/SHA256SUMS`. |
| F-1-4 | The distribution test now requires both Linux archives, both macOS archives and packages, Windows zip, deb, rpm, raw binaries, checksum and latest metadata, Homebrew, Scoop, and winget. It validates every `latest.json` URL and package-manager hash. | `@claim:release-distribution`; GitHub release run `33210140124`; Homebrew update `a8a1d96`. |
| F-1-5 | The demo claim now seeds and preserves real data in localStorage, sessionStorage, IndexedDB, Cache Storage, and cookies. It also checks reset, exit, downloads, demo residue, and same-origin requests. | `@claim:demo-storage-isolation`; Playwright production run; [demo screenshot](evidence/polish-2/live-android-demo.png). |
| F-1-6 | The preview still uses the real `/tmp/compat-scout-demo-<timestamp>` output pattern. | `@claim:installed-demo`; public `v0.1.3` consumer run. |
| F-1-7 | Route-specific title, canonical, description, Open Graph, and Twitter metadata remain active on home, demo, privacy, and terms. | Metadata Playwright test; production route matrix; `verify.json`. |
| F-1-8 | “Changes to check” remains the report heading, and the last “signals” wording was removed from terminal and CLI output. | `@claim:sample-six-changes`; live home and demo screenshots. |
| F-1-9 | The cited slogans remain removed. The complete site and README audit contains no banned language or over-22-word sentence. | `.factory/copy-audit.md`; live route review. |
| F-1-10 | Root and all four command help surfaces still expose the documented `--json` option. | `@claim:cli-interface-options`. |
| F-1-11 | Landing and README still use “owners of customized Android phones and vehicle dongles.” | `.factory/copy-audit.md`; live `/`; README. |

## Verification evidence

- Every exact command in `.factory/claims.json` passed from clean clone `/tmp/android-compat-scout-polish2.LIizUg/repo` at `b9b752226bb4962a1c8ee8b384e7d27b9abb570f`: 16/16 claims.
- The full clean-clone suite passed at `/tmp/android-compat-scout-suite.iIylW9/repo`, commit `f8b73de3a2b5ddf1baa91a97838b0822b16d36cc`: `npm ci`, `npm test` (6 Rust and 16 Vitest tests), `npm run typecheck`, `npm run test:browser` (7 tests), `npm run build`, `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, and `cargo package --allow-dirty`.
- The final local and production browser suites pass 8/8 after adding the loaded-session offline case. They cover device-specific install copy, mobile first-screen fit, keyboard focus, real routes and metadata, all-store demo isolation, no downloads, same-origin requests, zero Axe violations on five routes at 390 and 1440 pixels, no console errors, and offline reset/exit.
- `/opt/fleet/lib/verify-url.sh` recorded HTTP 200, 729 ms load, zero console errors, `lang=en`, one h1, a main landmark, no missing alt text, and no unlabeled buttons in [verify.json](evidence/polish-2/verify.json).
- The live link crawl returned 200 for every internal, legal, installer, GitHub release, and five direct platform links. `/not-a-real-page-polish-2` returned HTTP 404; `/demo`, `/privacy`, and `/terms` returned 200.
- The live hashed JavaScript, CSS, and hero WebP are byte-identical to the final local `dist/site` build.
- Mobile Lighthouse 13.0.1: Performance 100, Accessibility 100, Best Practices 100, SEO 100, LCP 1059 ms, TBT 25 ms, CLS 0, and 64,039 transferred bytes. Evidence: [Lighthouse JSON](evidence/polish-2/lighthouse-mobile.json).
- Production screenshots: [desktop](evidence/polish-2/screenshot-desktop.png), [390 px](evidence/polish-2/screenshot-mobile.png), [Android home](evidence/polish-2/live-android-home.png), [Android demo](evidence/polish-2/live-android-demo.png), and [platform chooser](evidence/polish-2/live-platform-options.png).

All findings from both adversarial reviews are closed. No severity is deferred.
