# Adversarial first-read review 2 — FAIL

Reviewed 2026-08-28 UTC against commit `52d83c141dbc98d920e22455c0d3983661f12176` and `https://android-compat-scout.sociobot.in`.

## Verdict

**FAIL.** The cold first screen and one-click demo work, but the product still has five blocking findings: the device-specific download lies on Android and cannot reliably infer CPU architecture, three earlier claim fixes remain incomplete, and the Windows installer claim still has no behavioral test. Two public capability claims are also absent or too narrow in `.factory/claims.json`, and the copy has six smaller plain-language defects. PASS requires zero findings and no untested claim.

## Cold first read

Fresh Chromium contexts at 390×844 and 1440×900 were opened before scrolling. A second mobile run used a Pixel 5 Android user agent rather than only a narrow desktop browser viewport.

| Question | Answer from the first screen |
| --- | --- |
| What does this do? | It finds changes that broke an Android phone or vehicle-dongle setup and puts the device facts in a report. |
| For whom? | Owners of customized Android phones and vehicle dongles after an update. |
| What should I click first? | “Try it with sample data”; the adjacent sentence says it opens a sample upgrade report. |

This gate passes. On mobile the headline, audience sentence, primary action, result explanation, and three facts all appear before the first scroll. On desktop the third fact ends at 895 px in a 900 px viewport. The headline has six words, the audience sentence has 20, and the primary action has five.

## Findings

### F-2-1 — BLOCKING — “Download for this computer” selects an incompatible file on phones and cannot reliably select CPU architecture

**Location/quote:** landing install section, “Download for this computer”; `site/src/main.ts:82-89`.

With a Pixel 5 user agent, the live link resolves to `compat-scout-x86_64-unknown-linux-musl.tar.gz`. That binary cannot run on Android. The same code sends every Mac to the ARM build and every non-Windows/non-Mac browser to Linux x64, so it is also wrong for Intel Macs and Linux ARM computers. A visitor is given a device-specific assurance that the implementation cannot support.

**Fix:** on Android and iOS, replace the link with “Open install options on a computer” and explain that the CLI runs on Windows, macOS, or Linux. On desktop, open a platform/architecture chooser instead of claiming reliable automatic detection. Add Playwright cases for Android, iOS, Intel Mac, Apple Silicon, Linux x64, and Linux ARM user agents; assert that no unsupported device gets a direct binary.

### F-1-3 — BLOCKING, reopened — the checksum claim still tests only one of the claimed downloads

**Location/quote:** landing fact, “Release downloads include checksums”; README install section; `.factory/claims.json` claim `release-download-checksums`.

The earlier finding was registered, but its test downloads and verifies only the Linux x64 archive. The release currently has checksums for the other Linux, macOS, Windows, deb, and rpm artifacts, but the claim test would still pass if any of those entries disappeared. The plural public claim remains only partly proved.

**Fix:** compare every installable release asset against `SHA256SUMS`, fail on missing or extra installable assets, and hash each downloaded artifact. If only Linux x64 is intentionally tested, narrow the public sentence to name Linux x64.

### F-1-4 — BLOCKING, reopened — the distribution test does not cover every package named in the README

**Location/quote:** README: “The release includes Linux archives, `.deb`, `.rpm`, macOS archives and `.pkg` files, a Windows zip, checksums, and `latest.json` metadata.”

The `release-distribution` test checks Linux x64, one ARM macOS pkg, Windows x64, deb, rpm, and metadata names. It does not require the Linux ARM archive, either macOS archive, or the Intel macOS pkg. The live release currently contains them, but the registered test can pass after those documented packages regress. This is a half-fix of the earlier F-1-4 claim-coverage finding.

**Fix:** make the test assert the complete documented matrix: Linux x64/ARM64 archives, macOS x64/ARM64 archives and pkgs, Windows zip, deb, rpm, checksums, and `latest.json`. Validate `latest.json` URLs too, or narrow the README to the exact assets under test.

### F-1-5 — BLOCKING, reopened — “nothing is saved” is not completely covered by its claim test

**Location/quote:** demo banner, “Demo — sample data, nothing is saved”; README: “it uses only sample data”; `@claim:demo-storage-isolation`.

The claim test checks only `localStorage` and `sessionStorage` in an initially empty context. It does not seed real data, inspect IndexedDB, Cache Storage, cookies, file downloads, or the whole-flow request log. It therefore cannot detect several ways the broad promise could regress or whether Reset damages real browser data. This leaves the earlier F-1-5 repair incomplete.

The current live behavior itself passes a stronger manual check: seeded real values in localStorage, sessionStorage, IndexedDB, and Cache Storage remained unchanged through demo entry, Reset, and Start for real; cookies stayed empty and every request was same-origin. The defect is the repeatable claim proof, not an observed live data write.

**Fix:** extend the tagged Playwright claim test to seed sentinel real data in every browser store, enter `/?demo=1`, alter/reset/exit the demo, and assert that all sentinels are unchanged, demo data is gone, no download occurred, cookies did not change, and every request stayed same-origin.

### F-2-2 — BLOCKING — the Windows checksum promise is still checked as source text, not behavior

**Location/quote:** README: “Both scripts check the downloaded binary against the release `SHA256SUMS` file before installation”; `.factory/claims.json`: “The Windows and Unix installers check SHA-256 before placing a binary on PATH.”

The tagged test executes the Unix installer with valid and invalid hashes. For Windows it only checks that `install.ps1` contains the strings `Get-FileHash` and `Checksum did not match`. Those strings can remain while installation occurs before validation or while the script is otherwise broken. This is the remaining half of the installer-sandbox defect recorded in the earlier verification handoff.

**Fix:** execute `install.ps1` under PowerShell with mocked downloads for a matching and mismatching hash. Assert that the good binary reaches the destination and that no destination file exists after the bad hash. Split Unix and Windows into separate claim ids if their sandboxes differ.

### F-2-3 — HIGH — the README’s core product capability is an unlisted claim

**Location/quote:** README: “It collects a consented ADB snapshot, checks declared requirements, and compares a before/after pair into a JSON report.” Landing: “it turns device facts into a clear report.”

These are the product’s central snapshot, requirement-check, comparison, and JSON-output promises. `sample-report` covers only the bundled demo, `benchmark-12-of-15` covers selected fixture classifications, and `cli-interface-options` covers help/flags. No claim entry names and tests the full published core behavior. “Consented ADB snapshot” is also jargon-heavy, while “clear” is subjective and untestable.

**Fix:** use: “With USB-debugging approval, Compat Scout saves device facts as JSON. It checks what your setup needs and compares snapshots taken before and after a change.” Register separate fake-ADB snapshot, requirements-check, and compare/JSON claims with public-CLI outcome tests. On the landing page use “It groups Android setup changes into a JSON report.”

### F-2-4 — HIGH — the exact six-result statement is unlisted and uses an inconsistent term

**Location/quote:** landing and demo terminal, “Found 6 compatibility signals.”

This is a quantitative outcome. `sample-report` asserts four category names but does not assert six results, and its `where` omits the landing preview. The site otherwise calls these items changes, findings, or differences; “compatibility signals” adds unexplained terminology.

**Fix:** either register “The sample report contains six changes” for both landing and demo and assert `findings.length === 6`, or replace the line with the already-supported “Found changes in four categories.” Use “changes” throughout.

### F-2-5 — MINOR — the home-page title uses developer jargon

**Location/quote:** `<title>` and social title, “Android Compat Scout — Find Android setup regressions.”

“Regressions” is less direct than the visible headline and weakens the required plain-language title pattern.

**Fix:** use “Android Compat Scout — Find Android setup changes” in the title and social metadata.

### F-2-6 — MINOR — decorative section labels carry numbering and mood, not information

**Location/quotes:** landing: “LOCAL COMPATIBILITY INSPECTION / 01”, “WORKFLOW / 02”, and “INSTALL / 03”; demo: “SANDBOX / SAMPLE UPGRADE.”

The numbered labels are brand decoration duplicated by the real headings. “Sandbox” is implementation jargon for a visitor. They do not identify information that the adjacent headings do not already provide.

**Fix:** remove the three numbered landing labels. Replace the demo label with “SAMPLE DATA / ANDROID 14 → 15” or remove it.

### F-2-7 — MINOR — the report-storage instruction is too vague to act on

**Location/quote:** landing safety section, “Keep reports where you trust them.”

The reader is not told what is sensitive or what safe storage means.

**Fix:** use “Reports include package names and Android build details. Store them as private files.”

### F-2-8 — MINOR — the README heading “Use it” does not name the section

**Location/quote:** README heading, “Use it.”

In a heading list, this gives no indication that the section covers taking and comparing snapshots.

**Fix:** rename it “Capture and compare snapshots.”

### F-2-9 — MINOR — the benchmark section uses testing jargon where plain words work

**Location/quotes:** README: “The bundled 15-case fixture…” and “The regression suite requires…”

“Fixture” and “regression suite” are avoidable testing terms for readers evaluating the product.

**Fix:** use “The bundled test data covers 15 named phone and setup cases.” and “Automated tests must detect at least 12 cases; they currently detect all 15.”

### F-2-10 — MINOR — the README file link does not say what the file provides

**Location/quote:** README: “See `.factory/demo.md`.”

The sentence makes the reader open an internal project file to learn why it matters.

**Fix:** use “See `.factory/demo.md` for the sample files, reset behavior, and storage checks.”

## Copy audit

Counts are whitespace-delimited. This includes headings, navigation, actions, terminal text, alt text, and footer labels so no visitor-facing landing text is silently excluded. No item exceeds 22 words and no banned marketing word appears. “Clear” is flagged as an untestable adjective under F-2-3. Primary actions use result-naming verbs; “Try it with sample data,” “Reset demo,” and “Start for real” match the demo contract.

### Landing page

| Text | Words | Result |
| --- | ---: | --- |
| Android Compat Scout | 3 | pass |
| Demo | 1 | pass |
| Install | 1 | pass |
| Privacy | 1 | pass |
| LOCAL COMPATIBILITY INSPECTION / 01 | 5 | F-2-6 |
| Find what broke your Android setup | 6 | pass |
| For owners of customized Android phones and vehicle dongles after an update, it turns device facts into a clear report. | 20 | F-2-3: subjective “clear” and incomplete claim coverage |
| Try it with sample data | 5 | pass |
| See a sample upgrade report first. | 6 | pass |
| Runs on your computer | 4 | registered; F-2-1 affects the adjacent device download |
| Leaves out serials and Wi-Fi names | 6 | registered |
| Release downloads include checksums | 4 | F-1-3 reopened |
| Blueprint illustration of a phone, USB cable, and vehicle dongle used for compatibility inspection. | 14 | pass (image alt) |
| The report lists each changed Android setting and app requirement. | 10 | registered sample-report meaning; add landing to `where` with F-2-4 |
| SAMPLE REPORT / ANDROID 14 → 15 | 7 | pass |
| Sort changes by what to check | 6 | pass |
| A report marks the update, permission, connection, and missing app separately. | 11 | registered sample-report meaning; landing location missing |
| compat-scout demo | 2 | pass (command) |
| Demo report written to /tmp/compat-scout-demo-&lt;timestamp&gt; | 5 | pass for the shown Unix terminal |
| Found 6 compatibility signals. | 4 | F-2-4 |
| ACCESS FINE LOCATION permission changed | 5 | pass (sample output) |
| Wireless bridge is no longer installed | 6 | pass (sample output) |
| cat /tmp/compat-scout-demo-&lt;timestamp&gt;/compat-report.json | 2 | pass (command) |
| WORKFLOW / 02 | 3 | F-2-6 |
| Compare Android setup snapshots | 4 | pass |
| Capture a snapshot. | 3 | pass |
| Connect your phone and accept its USB-debugging prompt. | 8 | pass |
| Declare the setup. | 3 | pass |
| List the local app, permissions, and device roles it needs. | 10 | pass |
| Compare after changes. | 3 | pass |
| Save a report that names each meaningful difference. | 8 | pass |
| It reports facts. | 3 | registered |
| It does not change your phone. | 6 | registered |
| Compat Scout never roots a device, bypasses Android Auto restrictions, changes installed apps, or encourages driving interaction. | 17 | registered read-only/safety meaning |
| Snapshots omit serial numbers, Wi-Fi names, and MAC addresses. | 9 | registered |
| Keep reports where you trust them. | 6 | F-2-7 |
| INSTALL / 03 | 3 | F-2-6 |
| Install the command-line tool | 4 | pass |
| Install a verified release, then run the bundled sample from any folder. | 12 | registered |
| Download for this computer | 4 | F-2-1 |
| Linux / macOS installer | 4 | pass (link label) |
| Windows installer | 2 | pass (link label) |
| Release page (opens GitHub) | 4 | pass |
| A command-line report for Android setup changes. | 7 | pass |
| Privacy | 1 | pass |
| Terms | 1 | pass |
| Built by Param Factory | 4 | pass |
| v0.1.2 | 1 | pass |

### README

| Text | Words | Result |
| --- | ---: | --- |
| Android Compat Scout | 3 | pass |
| Find what broke your Android setup. | 6 | pass |
| Android Compat Scout is for owners of customized Android phones and vehicle dongles. | 13 | pass |
| It collects a consented ADB snapshot, checks declared requirements, and compares a before/after pair into a JSON report. | 18 | F-2-3 |
| Install | 1 | pass |
| Download a release from GitHub Releases, or use an installer: | 10 | pass |
| Both scripts check the downloaded binary against the release SHA256SUMS file before installation. | 13 | F-2-2 |
| macOS and Windows builds are unsigned. | 6 | registered |
| On macOS, use right-click → Open after downloading the package. | 10 | pass |
| The release includes Linux archives, .deb, .rpm, macOS archives and .pkg files, a Windows zip, checksums, and latest.json metadata. | 19 | F-1-4 reopened |
| Homebrew users can install the published tap: | 7 | registered |
| The release also includes a Scoop manifest. | 7 | registered |
| Winget manifests under winget/ are ready for owner submission. | 9 | registered |
| For local development only, install from the checkout with cargo install --path .. | 13 | pass |
| Use it | 2 | F-2-8 |
| Install Android platform-tools, enable USB debugging, and accept the phone’s prompt. | 11 | pass |
| Take another snapshot after an update or configuration change. | 9 | pass (code comment) |
| Use a requirement file when you know which app, permissions, and device roles matter: | 14 | pass |
| compat-scout --help lists each command. | 5 | registered |
| The snapshot, compare, check, and demo commands accept --json for scripting. | 11 | registered |
| Try the bundled sample | 4 | pass |
| No phone is needed: | 4 | registered installed-demo meaning |
| The binary embeds the invented snapshots and requirement file, so this works after installation from any directory. | 17 | registered |
| It prints a persistent temporary output directory containing compat-report.json and compat-check.json. | 11 | registered |
| The browser demo is at /?demo=1 (also /demo); it uses only sample data. | 13 | F-1-5 reopened for incomplete proof |
| See .factory/demo.md. | 2 | F-2-10 |
| Compatibility benchmark | 2 | pass |
| The bundled 15-case fixture ships redacted inputs for named phone and setup scenarios. | 13 | F-2-9 |
| It invokes the public compare and check commands across OS, connectivity, app, and permission changes. | 15 | registered |
| The regression suite requires at least 12 detected cases and currently verifies all 15. | 14 | F-2-9; quantitative claim is registered |
| Privacy and safety | 3 | pass |
| The collector intentionally avoids serial numbers, Wi-Fi names, and MAC addresses. | 11 | registered |
| Reports can still reveal installed package names and Android build information, so store them carefully. | 15 | pass |
| Compat Scout does not root a device, bypass restrictions, or modify installed apps. | 13 | registered |
| Do not inspect or operate a device while driving. | 9 | pass |
| Develop and verify | 3 | pass |
| Requirements: Rust stable and Node 22+. | 6 | pass |
| The static deployment output is dist/site. | 6 | pass |
| The release workflow runs for v* tags and publishes the installable artifacts. | 12 | registered release-distribution meaning |
| Do not publish from a workstation; push a tested tag and let GitHub Actions create the release. | 17 | pass |
| License | 1 | pass |
| MIT. | 1 | pass |
| See LICENSE. | 2 | pass |

The existing `.factory/copy-audit.md` is not itself exhaustive: it omits navigation, alt text, terminal output, several landing sections, footer copy, and the README. The tables above are the complete review audit.

## Demo and sandbox

The one-click path passes behaviorally. From a fresh home page, “Try it with sample data” opened `/?demo=1`. The first demo viewport already showed the invented Android 14→15 comparison with OS, permission, and missing-component results. The persistent banner, Reset demo, and Start for real were present. Reset restored a deliberately altered result row; Start for real returned to `/` and focused the home h1.

The stronger live isolation run seeded real data in localStorage, sessionStorage, IndexedDB, and Cache Storage before entering the demo. All real sentinels were unchanged after Reset and exit; the `demo:compat-scout` session value was removed; cookies remained empty. The whole flow requested only the product origin and logged no console errors. No offline claim is made, so offline reload is not applicable. F-1-5 concerns missing automated coverage, not observed live persistence.

For the CLI, the clean-clone claim tests installed or downloaded the binary and ran the bundled demo from a separate consumer directory. The reports persisted at the path returned by the command. The demo did not require a connected phone.

## Claims — clean clone

Fresh clone: `/tmp/android-compat-review2.vs1j5U/repo` at the reviewed commit. `npm ci` reported zero vulnerabilities. Every exact command in `.factory/claims.json` returned zero:

| Claim id | Exact command | Result |
| --- | --- | --- |
| `sample-report` | `npm test -- --grep @claim:sample-report` | PASS |
| `redacted-export` | `npm test -- --grep @claim:redacted-export` | PASS |
| `installed-demo` | `npm test -- --grep @claim:installed-demo` | PASS |
| `local-installed-release` | `npm test -- --grep @claim:local-installed-release` | PASS |
| `checksum-installers` | `npm test -- --grep @claim:checksum-installers` | PASS, but incomplete under F-2-2 |
| `release-download-checksums` | `npm test -- --grep @claim:release-download-checksums` | PASS, but incomplete under F-1-3 |
| `release-distribution` | `npm test -- --grep @claim:release-distribution` | PASS, but incomplete under F-1-4 |
| `benchmark-12-of-15` | `npm test -- --grep @claim:benchmark-12-of-15` | PASS |
| `read-only-diagnosis` | `npm test -- --grep @claim:read-only-diagnosis` | PASS |
| `demo-storage-isolation` | `npm test -- --grep @claim:demo-storage-isolation` | PASS, but incomplete under F-1-5 |
| `cli-interface-options` | `npm test -- --grep @claim:cli-interface-options` | PASS |

No listed command failed. The gaps above exist because several passing tests assert only part of their public sentence. F-2-3 and F-2-4 are unlisted claim-like sentences.

## Earlier finding verification

### `.factory/review-1.md`

| Earlier id | Current result | Live and code confirmation |
| --- | --- | --- |
| F-1-1 | fixed | Landing shows the public installer plus `compat-scout demo`; no public `cargo install --path .`. |
| F-1-2 | fixed | `local-installed-release` is registered and a public Linux release runs outside the checkout. F-2-1 is a separate device-selection defect. |
| F-1-3 | **reopened, BLOCKING** | Registered test verifies only one download; see F-1-3 above. |
| F-1-4 | **reopened, BLOCKING** | Registered distribution test omits several packages named in README; see F-1-4 above. |
| F-1-5 | **reopened, BLOCKING** | README location is registered, but the claim test does not cover all browser stores, real-data sentinels, or requests; see F-1-5 above. |
| F-1-6 | fixed | Terminal uses `compat-scout-demo-<timestamp>` consistently. |
| F-1-7 | fixed | Every real route has distinct canonical, description, Open Graph, Twitter, and title metadata. |
| F-1-8 | fixed at the cited heading | “Changes to check” is live. The remaining terminal term is separately F-2-4. |
| F-1-9 | fixed at every cited quote | The three cited slogans were removed. New decorative labels are separately F-2-6. |
| F-1-10 | fixed | Root and four subcommand help/`--json` behavior is registered and tested. |
| F-1-11 | fixed | Landing and README consistently say customized Android phones and vehicle dongles. |

### Earlier polish and handoff findings

The public v0.1.2 release and Homebrew tap exist; installed demo data is embedded and persistent; the 15 public-CLI fixtures detect 15/15 cases; the paid stub is gone; unknown URLs return a designed HTTP 404; route h1 focus, touch targets, immutable asset caching, console output, formatting, Clippy, and serious/critical Axe checks pass. The earlier Windows-installer proof remains only half repaired and is reopened as F-2-2. The earlier demo-isolation proof remains incomplete and is reopened as F-1-5. No physical Android device was available, as in the earlier handoffs; the fake-ADB sandbox test passed.

## Structure, links, accessibility, and identity

| Check | Result |
| --- | --- |
| Route titles | Distinct and under 60 characters; home title wording fails plain-language quality under F-2-5. |
| Semantics | `lang=en`, one h1, one main, ordered h1→h2 outlines, header/nav/footer on every live route. |
| Metadata | Route-specific description, canonical, Open Graph and Twitter metadata; SVG favicon, 180 px apple-touch icon, and 1200×630 product art. |
| 404 | Unknown URL returns HTTP 404 with the designed blueprint-style page and home link. |
| Routing | `/`, `/demo`, `/privacy`, and `/terms` deep-link with 200. SPA links update history, focus the new h1, and back restores scroll after the smooth-scroll transition. The Install hash resolves on home from legal/demo routes. |
| Links | Every rendered internal, installer, GitHub release, selected Linux asset, metadata, favicon, and social-image URL returned 200. README relative links exist. |
| Accessibility | Axe 4.10.2 reported zero violations on all five routes at 390×844 and 1440×900. Focus rings, skip link, reduced motion, alt text, and ≥44 px tested targets pass. |
| Console/privacy | No console errors. Cold and full demo flows made only same-origin requests. |
| Visual identity | Pass. The blueprint grid, square drafting marks, dark terminal, cyan/amber fault notation, and original phone/cable/dongle art are distinct from a generic SaaS template and match `.factory/design.md`. |
| Size/build | JavaScript is 9.06 KB raw / 3.72 KB gzip; CSS 5.99 KB raw / 1.97 KB gzip; hero WebP 56.66 KB. |

`/opt/fleet/lib/verify-url.sh` passed after creating its output directory: HTTP 200, 586 ms observed load, no console errors, title, `lang=en`, one h1, main, no missing alt text, and no unlabeled buttons.

## Other quality gates

From the clean clone, all passed: `npm test`, `npm run typecheck`, `npm run test:browser` (5 tests), `npm run build`, `cargo fmt --check`, and `cargo clippy --all-targets -- -D warnings`. The build produced `dist/site` and the release binary. `LICENSE` is MIT. Privacy and Terms routes are present.

## Missed leverage

No `.factory/brief.json` is present, so this check used the README, artifact contract, and shipped workflows. No additional AI or sync feature is justified. The product already imports snapshots/requirements and exports JSON, and its local, read-only diagnosis does not need a model. Adding a Sociobot call would send device facts away and weaken the present local-first boundary. No decorative AI or embedded provider key is present.

## What would make this perfect

Make the download action honest on phones and architecture-safe on desktops. Complete the five blocking claim tests so every platform/storage promise is observable, register the core snapshot/check/compare and exact sample-count claims, then apply the six concrete copy rewrites above. Re-run the full clean-clone claim matrix, Android/iOS/desktop browser matrix, copy audit, crawl, Axe scan, and live privacy log. A PASS is appropriate only when that rerun produces zero findings.
