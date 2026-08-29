# Adversarial first-read review 5 — PASS

Reviewed 2026-08-29 UTC against commit `c750245f4576a8e9dd908aa50a47189699f5e8d2` and the live production site at `https://android-compat-scout.sociobot.in`.

## Verdict

**PASS.** There are no blocking, high, medium, or minor findings. The landing page is clear before scrolling, the sample is one click and isolated, every registered claim test passes from a fresh clone, and the earlier findings are confirmed fixed in both the live site and the source. No unlisted claim-like copy was found.

## Cold first read

Fresh Chromium contexts were opened without prior site storage at 390×844 and 1440×900. Before scrolling, the answer was the same at both sizes:

| Check | Answer from the first screen |
| --- | --- |
| What does this do? | It finds Android setup changes after an update and groups them into a JSON report. |
| For whom? | Owners of customized Android phones and vehicle dongles after an update. |
| What should I click first? | **Try it with sample data**; the adjacent copy says it will show a sample upgrade report. |

The action and all three facts were inside the viewport at both sizes. The 390 px page had no horizontal overflow. The landing page made four same-origin requests only (HTML, JS, CSS, and its self-hosted hero image) and produced no console errors.

## Demo and sandbox

The first-screen action opens `/?demo=1` in one click. Its first viewport already contains realistic Android 14→15 results: an OS-version change, a changed location permission, and a missing wireless bridge. The persistent banner reads **“Demo — sample data, nothing is saved”** and includes working **Reset demo** and **Start for real** controls.

In a fresh live browser context, I seeded `localStorage`, `sessionStorage`, IndexedDB, and a cookie with real-data sentinels, then entered demo mode, reset it, and exited it. All sentinels remained unchanged; no demo key or download appeared. Requests throughout the flow stayed on the product origin. The installed CLI sample is independently exercised by the clean-clone claims from a separate consumer directory.

## Copy audit

Counts are whitespace-delimited. Commands are interface text, not prose. Every item is at most 22 words; no banned marketing term, unexplained mood heading, vague primary action, or inconsistent product term remains. Claim-like copy names its registered claim; the remaining items are labels, instructions, sample output, metadata, or headings.

### Landing page

| Copy | Words | Check |
| --- | ---: | --- |
| Skip to main content | 4 | pass |
| Android Compat Scout | 3 | pass |
| Demo | 1 | pass |
| Install | 1 | pass |
| Privacy | 1 | pass |
| Find Android setup changes after an update | 7 | pass |
| For owners of customized Android phones and vehicle dongles after an update, it groups setup changes into a JSON report. | 20 | `compare-json` |
| Try it with sample data | 5 | result-naming action |
| See a sample upgrade report first. | 6 | `sample-report` |
| Free under the MIT License | 5 | `mit-license` |
| Run the bundled sample offline after installation | 7 | `offline-bundled-demo` |
| Leaves out serials and Wi-Fi names | 6 | `redacted-export` |
| Blueprint illustration of a phone, USB cable, and vehicle dongle used for compatibility inspection. | 14 | image alt |
| The sample report lists changed Android settings and app requirements. | 10 | `sample-report` |
| Sample report / Android 14 → 15 | 7 | pass |
| Sample report categories | 3 | pass |
| A report marks update, permission, connectivity, and missing-component changes separately. | 10 | `sample-report` |
| compat-scout demo | 2 | command |
| Demo report written to /tmp/compat-scout-demo-<timestamp> | 5 | `installed-demo` |
| Found 6 changes. | 3 | `sample-six-changes` |
| ACCESS FINE LOCATION permission changed | 5 | sample output |
| Wireless bridge is no longer installed | 6 | sample output |
| cat /tmp/compat-scout-demo-<timestamp>/compat-report.json | 2 | command |
| Compare Android setup snapshots | 4 | pass |
| Capture a snapshot. | 3 | `snapshot-json` |
| Connect your phone and accept its USB-debugging prompt. | 8 | `snapshot-json` |
| List what your setup needs. | 5 | `requirements-check` |
| List the local app, permissions, and device roles it needs. | 10 | `requirements-check` |
| Compare after changes. | 3 | `compare-json` |
| Save a JSON report that lists each detected change. | 9 | `compare-json` |
| Compat Scout reads device information without changing it. | 8 | `read-only-diagnosis` |
| Compat Scout never roots a device, bypasses Android Auto restrictions, changes installed apps, or encourages driving interaction. | 17 | `read-only-diagnosis` |
| Snapshots omit serial numbers, Wi-Fi names, and MAC addresses. | 9 | `redacted-export` |
| Snapshots contain app package names, Android version, and a redacted build fingerprint. | 11 | `retained-snapshot-fields` |
| Store snapshots and reports as private files. | 7 | safety instruction |
| Install the command-line tool | 4 | pass |
| Install a verified release, then run the bundled sample from any folder. | 12 | `local-installed-release` |
| Choose a platform and processor | 5 | result-naming action |
| Windows · x64 | 2 | platform label |
| macOS · Apple silicon | 3 | platform label |
| macOS · Intel | 2 | platform label |
| Linux · x64 | 2 | platform label |
| Linux · ARM64 | 2 | platform label |
| Open install options on a computer | 6 | phone instruction |
| Downloads are available for Windows, macOS, and Linux. | 8 | `release-distribution` |
| Linux / macOS installer | 4 | `checksum-unix-installer` |
| Windows installer | 2 | `checksum-windows-installer` |
| Release page (opens GitHub) | 4 | destination stated |
| A command-line report for Android setup changes. | 7 | pass |
| Terms | 1 | pass |
| Built by Param Factory | 4 | pass |
| v0.1.3 | 1 | version label |

### README

| Copy | Words | Check |
| --- | ---: | --- |
| Android Compat Scout | 3 | pass |
| Find Android setup changes after an update. | 7 | `compare-json` |
| Android Compat Scout is for owners of customized Android phones and vehicle dongles. | 13 | pass |
| With USB-debugging approval, Compat Scout saves device facts as JSON. | 9 | `snapshot-json` |
| It checks what your setup needs and compares snapshots taken before and after a change. | 15 | `requirements-check`, `compare-json` |
| Install | 1 | pass |
| Download a release from GitHub Releases, or use an installer. | 10 | pass |
| Both scripts check the downloaded binary against the release SHA256SUMS file before installation. | 13 | installer claims |
| macOS and Windows builds are unsigned. | 6 | `release-distribution` |
| On macOS, use right-click → Open after downloading the package. | 10 | instruction |
| The release includes Linux archives, .deb, .rpm, macOS archives and .pkg files, a Windows zip, checksums, and latest.json metadata. | 19 | distribution/checksum claims |
| Homebrew users can install the published tap. | 7 | `release-distribution` |
| The release also includes a Scoop manifest. | 7 | `release-distribution` |
| Winget manifests under winget/ are ready for owner submission and are checked with winget validate in the release workflow. | 19 | `release-distribution` |
| For local development only, install from the checkout with cargo install --path . | 13 | developer instruction |
| Capture and compare snapshots | 4 | pass |
| Install Android platform-tools, enable USB debugging, and accept the phone's prompt. | 11 | instruction |
| Take another snapshot after an update or configuration change. | 9 | instruction |
| Use a requirement file when you know which app, permissions, and device roles matter. | 14 | `requirements-check` |
| compat-scout --help lists each command. | 5 | `cli-interface-options` |
| The snapshot, compare, check, and demo commands accept --json for scripting. | 11 | `cli-interface-options` |
| Try the bundled sample | 4 | pass |
| No phone is needed. | 4 | `installed-demo` |
| The binary embeds the invented snapshots and requirement file, so this works after installation from any directory. | 17 | `installed-demo` |
| The bundled sample runs without an account or network after installation. | 10 | `offline-bundled-demo` |
| It prints a persistent temporary output directory containing compat-report.json and compat-check.json. | 11 | `installed-demo` |
| The browser demo is at /?demo=1 (also /demo); it uses only sample data. | 13 | `demo-storage-isolation` |
| See .factory/demo.md for the sample files, reset behavior, and storage checks. | 12 | useful file description |
| Compatibility benchmark | 2 | pass |
| The bundled test data covers 15 named phone and setup cases. | 11 | `benchmark-12-of-15` |
| It invokes the public compare and check commands across OS, connectivity, app, and permission changes. | 15 | `benchmark-12-of-15` |
| Automated tests must detect at least 12 cases; they currently detect all 15. | 13 | `benchmark-12-of-15` |
| Privacy and safety | 3 | pass |
| The collector intentionally avoids serial numbers, Wi-Fi names, and MAC addresses. | 11 | `redacted-export` |
| Snapshots contain app package names, Android version, and a redacted build fingerprint. | 11 | `retained-snapshot-fields` |
| Store snapshots and reports as private files. | 7 | safety instruction |
| Compat Scout does not root a device, bypass restrictions, or modify installed apps. | 13 | `read-only-diagnosis` |
| Do not inspect or operate a device while driving. | 9 | safety instruction |
| Develop and verify | 3 | pass |
| Requirements: Rust stable and Node 22+. | 6 | developer instruction |
| The static deployment output is dist/site. | 6 | developer instruction |
| The release workflow runs for v* tags and publishes the installable artifacts. | 12 | `release-distribution` |
| Do not publish from a workstation; push a tested tag and let GitHub Actions create the release. | 17 | developer instruction |
| License | 1 | pass |
| Free under the MIT License. | 5 | `mit-license` |
| See LICENSE. | 2 | destination stated |

Terminology remains consistent: **snapshot** (device record), **change** (detected difference), **report** (output), **requirements** (declared needs), **connectivity** (network/device category), and **demo** (bundled sample).

## Claims and quality checks

A fresh local clone at `/tmp/android-compat-scout-review-5.OizoG1/repo` ran `npm ci` with zero vulnerabilities. All 19 exact commands in `.factory/claims.json` passed:

| Claim | Result |
| --- | --- |
| `sample-report` | PASS |
| `sample-six-changes` | PASS |
| `snapshot-json` | PASS |
| `requirements-check` | PASS |
| `compare-json` | PASS |
| `redacted-export` | PASS |
| `installed-demo` | PASS |
| `local-installed-release` | PASS |
| `checksum-unix-installer` | PASS |
| `checksum-windows-installer` | PASS |
| `release-download-checksums` | PASS |
| `release-distribution` | PASS |
| `mit-license` | PASS |
| `offline-bundled-demo` | PASS |
| `retained-snapshot-fields` | PASS |
| `benchmark-12-of-15` | PASS |
| `read-only-diagnosis` | PASS |
| `demo-storage-isolation` | PASS |
| `cli-interface-options` | PASS |

The same clone also passed `npm test`, `npm run typecheck`, `npm run build`, `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, and `npm run test:browser`. The production browser suite passed 12/12 with `PLAYWRIGHT_BASE_URL=https://android-compat-scout.sociobot.in npm run test:browser`.

Production checks confirmed route-specific titles, descriptions, and canonical URLs for `/`, `/demo`, `/privacy`, and `/terms`; each route has one h1 and one main landmark. The expected missing route returns HTTP 404 with the designed recovery page. All crawled internal and release links returned HTTP 200. `robots.txt`, `sitemap.xml`, favicon, Apple touch icon, OG image, and both installers return 200. Response headers provide the required CSP (including response-header `frame-ancestors`), `nosniff`, and referrer policy. JavaScript is 4.33 KB gzip; no third-party font or script is loaded.

## Earlier finding verification

Every finding in reviews 1–4 was verified against the live deployment and relevant source/tests, not accepted from its prior closure note alone.

| Earlier id | Current result | Confirmation |
| --- | --- | --- |
| F-1-1 | fixed | Live install panel uses the public installer and demo command; checkout install is development-only in README. |
| F-1-2 | fixed | The unproved runtime promise was narrowed to tested release availability. |
| F-1-3 | fixed | Public release checksum test verifies every installable asset. |
| F-1-4 | fixed | Release matrix, Homebrew, Scoop, and validated Winget metadata are asserted. |
| F-1-5 | fixed | Browser test and manual sentinels cover stores, cookies, requests, reset, and exit. |
| F-1-6 | fixed | Terminal and CLI both use `compat-scout-demo-<timestamp>`. |
| F-1-7 | fixed | Route rendering updates title, description, canonical, OG, and Twitter metadata. |
| F-1-8 | fixed | Demo heading is “Changes to check.” |
| F-1-9 | fixed | Decorative slogans and numbered mood labels are absent. |
| F-1-10 | fixed | Help and `--json` interfaces are covered by `cli-interface-options`. |
| F-1-11 | fixed | Landing and README name the same audience. |
| F-2-1 | fixed | Phones receive a computer-install note; desktops choose platform and processor explicitly. |
| F-2-2 | fixed | The PowerShell installer runs with matching and mismatching mocked checksums. |
| F-2-3 | fixed | Snapshot, requirement, comparison, and JSON behavior have individual tests. |
| F-2-4 | fixed | The bundled sample proves exactly six **changes**. |
| F-2-5 | fixed | Home title uses “Find Android setup changes.” |
| F-2-6 | fixed | Decorative labels are absent. |
| F-2-7 | fixed | Exact retained fields and redaction are disclosed and tested. |
| F-2-8 | fixed | README heading is “Capture and compare snapshots.” |
| F-2-9 | fixed | README uses “test data” and “automated tests.” |
| F-2-10 | fixed | The demo-file link describes the file's contents. |
| F-3-1 | fixed | Headline/report copy names changes, not a proven cause. |
| F-3-2 | fixed | Browser test confirms 390 px and 200% reflow without horizontal scrolling. |
| F-3-3 | fixed | Persistent controls meet the touch-target check. |
| F-3-4 | fixed | Free, offline, and redaction facts are visible above the fold. |
| F-3-5 | fixed | Workflow and safety copy uses concrete terms. |
| F-4-1 | fixed | Desktop test confirms action, outcome, and facts all fit at 1440×900. |
| F-4-2 | fixed | Install link scrolls, announces, and focuses its destination from home and subroutes. |
| F-4-3 | fixed | Back/Forward restores saved scroll and route focus. |
| F-4-4 | fixed | Sample heading is “Sample report categories,” not a nonexistent sort control. |
| F-4-5 | fixed | Visitor-facing copy consistently uses “connectivity.” |

## What would make this perfect

This is PASS-adjacent already: preserve the direct demo URL, complete claims matrix, and production route suite whenever the CLI, release matrix, or landing copy changes. A new capability should add its sample behavior and one observable claim test before its visitor-facing sentence is published.
