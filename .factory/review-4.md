# Adversarial first-read review 4 — FAIL

Reviewed 2026-08-28 UTC against `4d0ed2a7d7ec0ec3511015f5b1ae61822e8b38c8` and the production site at `https://android-compat-scout.sociobot.in`.

## Verdict

**FAIL.** Three blocking failures remain. At a normal 1440×900 desktop viewport the primary action is below the first screen. The header's Install link changes the URL but does not reach the install section. Browser Back returns to the right route and h1, but loses the previous scroll position. The latter two are broken routing under the product contract.

`.factory/brief.json` is absent. Scope and missed-leverage checks therefore used the shipped CLI, README, claims contract, and design record.

## Cold first read

Fresh, separate Chromium contexts were used at 390×844 and 1440×900 before scrolling. At 390px, all required first-screen content was visible: the final fact ended at y=625px, and requests were same-origin with no console errors.

| Question | Answer from the 390px first screen |
| --- | --- |
| What does this do? | It groups Android setup changes after an update into a JSON report. |
| For whom? | Owners of customized Android phones and vehicle dongles after an update. |
| What should I click first? | “Try it with sample data” to see a sample upgrade report. |

The desktop viewport gives the first two answers, but not the third. Its `<h1>` occupies y=148–749px; the audience sentence ends at y=858px; “Try it with sample data” occupies y=890–934px, so its readable label is below the 900px viewport. This fails the cold first-screen gate; see F-4-1.

## Findings

### F-4-1 — BLOCKING — the desktop first screen hides the required first action

**Location/quote:** landing hero, “Try it with sample data” and “See a sample upgrade report first.”

At production 1440×900, the primary action's box is y=889.75–933.75px and the facts begin at y=965.75px. A visitor has to scroll before seeing what to click, even though the first-screen contract requires the action, its immediate result, and three facts. In a 30-second cold read this leaves the visitor with a large headline but no visible next step.

**Fix:** reduce the desktop hero headline/layout height so the action and its explanation are wholly visible at 1440×900 (or move the action above the long headline). Add a production Playwright assertion at 1440×900 that the primary action, adjacent result sentence, and all three facts have bottom edges within the viewport.

### F-4-2 — BLOCKING — the header Install link is a dead in-page action

**Location/quote:** header link, “Install”; `site/src/main.ts`, `href="/#install"` and the shared `[data-route]` click handler.

From production mobile, clicking the header link changed the URL to `/#install`, focused the home h1, left `scrollY` at 114px, and left the install section 2,537px below the viewport. The handler prevents the browser's normal fragment navigation, calls `history.pushState`, and renders home again without scrolling to `#install`. The link therefore looks like a usable navigation action but does not deliver its destination.

**Fix:** do not intercept same-page fragment links, or explicitly scroll `#install` into view and move focus to its heading after navigation. Add a browser test that activates the header Install link from both `/` and a subroute, then asserts the install heading is visible and receives an appropriate focus target.

### F-4-3 — BLOCKING — Back does not restore the visitor's previous scroll position

**Location/evidence:** production history flow; `site/src/main.ts`, `pushState`/`popstate` rendering.

Starting at `/`, the browser was scrolled to y=1200. Navigating with the header Privacy link and pressing Back returned to `/` with the home h1 focused, but `scrollY` was 0. The contract requires Back/Forward to restore scroll and focus; only focus is restored. Returning a visitor to the top makes section navigation and comparison of the report/installation content unreliable.

**Fix:** store the current scroll position in each history entry before route navigation, restore it after render on `popstate` (with `history.scrollRestoration = 'manual'` if needed), and retain the destination-h1 focus behavior. Add a route test that scrolls home, visits Privacy, presses Back and Forward, and asserts both route-specific focus and saved scroll positions.

### F-4-4 — MINOR — the sample-report heading implies a sorting control that is not present

**Location/quote:** landing sample-report `<h2>`, “Sort changes by what to check.”

The section is a fixed sample report and provides no sorting control. “Sort” reads as an instruction or promised interaction rather than a section name, while the out-of-context heading does not say that this is the sample output.

**Fix:** use “Sample report categories” (or “Changes in the sample report”) and keep the following sentence to explain the categories.

### F-4-5 — MINOR — the same report category is named two ways

**Location/quotes:** landing sample sentence, “connection”; README benchmark sentence, “connectivity”; CLI/report category, “Connectivity.”

The product calls one category “connection” in the landing explanation and “connectivity” in the README and report. A visitor cannot tell whether this is one category or two related checks.

**Fix:** choose one term everywhere. For example, change the landing sentence to “A report marks update, permission, connectivity, and missing-component changes separately,” then use the same term in the sample and documentation.

## Copy audit

Whitespace-delimited counts below cover every landing/README sentence, heading, action, label, and visible terminal line. Commands are interface text, not prose. No line exceeds 22 words and no banned marketing adjective appears. F-4-4 and F-4-5 are the copy findings; all claim-like lines are mapped to the listed claims in the final column.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | pass |
| Android Compat Scout | 3 | pass |
| Demo | 1 | pass |
| Install | 1 | F-4-2: link action fails |
| Privacy | 1 | pass |
| Find Android setup changes after an update | 7 | pass |
| For owners of customized Android phones and vehicle dongles after an update, it groups setup changes into a JSON report. | 20 | `compare-json` |
| Try it with sample data | 5 | F-4-1: below desktop fold |
| See a sample upgrade report first. | 6 | `sample-report` |
| Free under the MIT License | 5 | `mit-license` |
| Run the bundled sample offline after installation | 7 | `offline-bundled-demo` |
| Leaves out serials and Wi-Fi names | 6 | `redacted-export` |
| Blueprint illustration of a phone, USB cable, and vehicle dongle used for compatibility inspection. | 14 | image alt; pass |
| The sample report lists changed Android settings and app requirements. | 10 | `sample-report` |
| SAMPLE REPORT / ANDROID 14 → 15 | 7 | pass |
| Sort changes by what to check | 6 | F-4-4 |
| A report marks the update, permission, connection, and missing app separately. | 11 | `sample-report`; F-4-5 terminology |
| compat-scout demo | 2 | command |
| Demo report written to /tmp/compat-scout-demo-\<timestamp\> | 5 | `installed-demo` |
| Found 6 changes. | 3 | `sample-six-changes` |
| [Permission] ACCESS FINE LOCATION permission changed | 6 | sample output; pass |
| [Missing component] wireless bridge is no longer installed | 8 | sample output; pass |
| cat /tmp/compat-scout-demo-\<timestamp\>/compat-report.json | 2 | command |
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
| Store snapshots and reports as private files. | 7 | action; pass |
| Install the command-line tool | 4 | pass |
| Install a verified release, then run the bundled sample from any folder. | 12 | `local-installed-release` |
| Choose a platform and processor | 5 | pass |
| Windows · x64 | 2 | pass |
| macOS · Apple silicon | 3 | pass |
| macOS · Intel | 2 | pass |
| Linux · x64 | 2 | pass |
| Linux · ARM64 | 2 | pass |
| Open install options on a computer | 6 | pass |
| Downloads are available for Windows, macOS, and Linux. | 8 | `release-distribution` |
| Linux / macOS installer | 4 | `checksum-unix-installer` |
| Windows installer | 2 | `checksum-windows-installer` |
| Release page (opens GitHub) | 4 | pass |
| A command-line report for Android setup changes. | 7 | pass |
| Terms | 1 | pass |
| Built by Param Factory | 4 | pass |
| v0.1.3 | 1 | pass |

### README

| Copy | Words | Result |
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
| On macOS, use right-click → Open after downloading the package. | 10 | pass |
| The release includes Linux archives, .deb, .rpm, macOS archives and .pkg files, a Windows zip, checksums, and latest.json metadata. | 19 | `release-distribution`, `release-download-checksums` |
| Homebrew users can install the published tap. | 7 | `release-distribution` |
| The release also includes a Scoop manifest. | 7 | `release-distribution` |
| Winget manifests under winget/ are ready for owner submission and are checked with winget validate in the release workflow. | 19 | `release-distribution` |
| For local development only, install from the checkout with cargo install --path . | 13 | developer instruction; pass |
| Capture and compare snapshots | 4 | pass |
| Install Android platform-tools, enable USB debugging, and accept the phone's prompt. | 11 | pass |
| Take another snapshot after an update or configuration change. | 9 | pass |
| Use a requirement file when you know which app, permissions, and device roles matter. | 14 | `requirements-check` |
| compat-scout --help lists each command. | 5 | `cli-interface-options` |
| The snapshot, compare, check, and demo commands accept --json for scripting. | 11 | `cli-interface-options` |
| Try the bundled sample | 4 | pass |
| No phone is needed. | 4 | `installed-demo` |
| The binary embeds the invented snapshots and requirement file, so this works after installation from any directory. | 17 | `installed-demo` |
| The bundled sample runs without an account or network after installation. | 10 | `offline-bundled-demo` |
| It prints a persistent temporary output directory containing compat-report.json and compat-check.json. | 11 | `installed-demo` |
| The browser demo is at /?demo=1 (also /demo); it uses only sample data. | 13 | `demo-storage-isolation` |
| See .factory/demo.md for the sample files, reset behavior, and storage checks. | 12 | pass |
| Compatibility benchmark | 2 | pass |
| The bundled test data covers 15 named phone and setup cases. | 11 | `benchmark-12-of-15` |
| It invokes the public compare and check commands across OS, connectivity, app, and permission changes. | 15 | `benchmark-12-of-15`; F-4-5 terminology |
| Automated tests must detect at least 12 cases; they currently detect all 15. | 13 | `benchmark-12-of-15` |
| Privacy and safety | 3 | pass |
| The collector intentionally avoids serial numbers, Wi-Fi names, and MAC addresses. | 11 | `redacted-export` |
| Snapshots contain app package names, Android version, and a redacted build fingerprint. | 11 | `retained-snapshot-fields` |
| Store snapshots and reports as private files. | 7 | action; pass |
| Compat Scout does not root a device, bypass restrictions, or modify installed apps. | 13 | `read-only-diagnosis` |
| Do not inspect or operate a device while driving. | 9 | safety instruction; pass |
| Develop and verify | 3 | pass |
| Requirements: Rust stable and Node 22+. | 6 | developer instruction; pass |
| The static deployment output is dist/site. | 6 | developer instruction; pass |
| The release workflow runs for v* tags and publishes the installable artifacts. | 12 | `release-distribution` |
| Do not publish from a workstation; push a tested tag and let GitHub Actions create the release. | 17 | developer instruction; pass |
| License | 1 | pass |
| Free under the MIT License. | 5 | `mit-license` |
| See LICENSE. | 2 | pass |

The terms **snapshot**, **change**, **report**, **requirements**, and **demo** are otherwise used consistently. Primary actions name their outcomes; none uses “Submit,” “Go,” or “Continue” generically.

## Demo and sandbox

**PASS.** One click from a fresh 390px home page opened `/?demo=1`. The first demo viewport already showed the invented Android 14→15 report with OS, permission, and missing-component findings. The persistent “Demo — sample data, nothing is saved” banner, Reset demo, and Start for real controls were present.

The production `@claim:demo-storage-isolation` browser test passed. It seeds real localStorage, sessionStorage, IndexedDB, Cache Storage, and cookies, enters the direct demo URL, alters/resets/exits it, and confirms all sentinels are unchanged, no download occurs, no sample residue remains, and all requests are same-origin. The loaded demo also reset and exited while the browser was offline. The CLI demo claims run `compat-scout demo` in a consumer directory and verify both persisted sample reports. No real-data storage or third-party request was observed.

## Claims — clean clone

Fresh clone: `/tmp/android-compat-scout-review-4.oX6fN6/repo` at `4d0ed2a7d7ec0ec3511015f5b1ae61822e8b38c8`. `npm ci` completed with zero reported vulnerabilities. I ran every exact command named by all 19 entries in `.factory/claims.json`; all passed. The aggregate confirmation, `npm test -- --grep @claim`, passed all 18 Vitest claim tests plus the Rust public-CLI benchmark test.

| Claim ids | Result |
| --- | --- |
| `sample-report`, `sample-six-changes`, `snapshot-json`, `requirements-check`, `compare-json`, `redacted-export` | PASS |
| `installed-demo`, `local-installed-release`, `offline-bundled-demo`, `demo-storage-isolation` | PASS |
| `checksum-unix-installer`, `checksum-windows-installer`, `release-download-checksums`, `release-distribution` | PASS |
| `mit-license`, `retained-snapshot-fields`, `benchmark-12-of-15`, `read-only-diagnosis`, `cli-interface-options` | PASS |

`npm run typecheck`, `npm run build`, `cargo fmt --check`, and `cargo clippy --all-targets -- -D warnings` also passed in that clone. The production Playwright suite passed 9/9; its last-run record reports `status: "passed"` and no failed tests.

There are no unlisted claim-like sentences in the audited landing or README copy. The failures above are observable presentation/routing behavior not represented by a claims entry.

## Earlier finding verification

Every previous review, polish record, and handoff was read. The following confirms the cited work is still present in production and code, rather than accepting the prior “fixed” labels.

| Earlier ids | Current confirmation |
| --- | --- |
| F-1-1 | fixed: public landing install uses the installer and bundled demo; checkout installation remains explicitly development-only in README. |
| F-1-2 | fixed: no runtime claim remains; the exact “downloads are available” wording is covered by the release matrix. |
| F-1-3 | fixed: release checksum test fetches and hashes the full asset set. |
| F-1-4 | fixed: 0.1.3 includes version/defaultLocale/installer Winget manifests and claim checks the validation workflow. |
| F-1-5 | fixed: direct demo test seeds/preserves every named browser store, cookies, downloads, and request log. |
| F-1-6 | fixed: terminal, README, and CLI agree on `compat-scout-demo-<timestamp>`. |
| F-1-7 | fixed: `/`, `/demo`, `/privacy`, `/terms`, and 404 have route-specific title, description, canonical, OG, and Twitter metadata. |
| F-1-8 | fixed: the user-facing report heading is “Changes to check,” and sample count uses “changes.” |
| F-1-9 | fixed at the cited slogans: concrete headings/facts replaced the prior slogans and numbered mood labels. |
| F-1-10 | fixed: root and named subcommands expose the documented help/`--json` interface. |
| F-1-11 | fixed: landing and README use the same customized-phone/vehicle-dongle audience wording. |
| F-2-1 | fixed: phone visitors see no guessed download; desktop visitors choose an explicit platform/processor. |
| F-2-2 | fixed: the real PowerShell installer is exercised with matching and mismatching checksum fixtures. |
| F-2-3 | fixed: snapshot, requirement, and comparison public-command outcomes have distinct claim tests. |
| F-2-4 | fixed: the bundled sample asserts exactly six “changes.” |
| F-2-5 | fixed: home title is “Android Compat Scout — Find Android setup changes.” |
| F-2-6 | fixed: prior numbered/mood labels are absent. |
| F-2-7 | fixed: retained snapshot fields are exact, consistent, and covered by `retained-snapshot-fields`. |
| F-2-8 | fixed: README section is “Capture and compare snapshots.” |
| F-2-9 | fixed: README uses “test data” and “automated tests.” |
| F-2-10 | fixed: demo documentation link says what it contains. |
| F-3-1 | fixed: headline states change comparison, not causal diagnosis. |
| F-3-2 | fixed: all routes and the open chooser pass 390px/200% reflow assertion. |
| F-3-3 | fixed: production test checks all visible persistent controls at 44px minimum. |
| F-3-4 | fixed: first-screen price, offline, and privacy facts are present and separately tested. |
| F-3-5 | fixed: prior “Declare,” “meaningful,” and vague device-reading copy is absent. |

F-4-1 through F-4-5 are newly observed and do not reopen a prior id.

## Structure, privacy, and identity

| Check | Result |
| --- | --- |
| Metadata and semantics | PASS: `lang=en`, one h1 and main per route, title pattern, descriptions, canonical, OG/Twitter metadata, favicon, and apple icon are present. |
| Real routes and 404 | PASS: `/`, `/demo`, `/privacy`, and `/terms` return 200; an unknown route returns the designed 404 with HTTP 404. |
| Header/footer | PARTIAL: shared header/footer, skip link, Privacy/Terms, and factory credit are present; header Install fails F-4-2. |
| History/focus | PARTIAL: h1 focus on route changes works; Back scroll restoration fails F-4-3. |
| Links | PARTIAL: production asset/download links and legal links resolve through the passing claims/browser checks; the in-page Install link fails F-4-2. |
| Security/privacy | PASS: production CSP is response-header delivered with `frame-ancestors`; same-origin request log, zero console errors, and no runtime third-party scripts were confirmed. |
| Accessibility | PASS except the route defects: Axe found no violations at mobile/desktop, 44px persistent controls and 390px/200% reflow pass. |
| Visual identity | PASS: the blueprint drafting-sheet palette, square rules, mono instrument labels, and original phone/cable/dongle art match `.factory/design.md` and are not a generic SaaS template. |

## Missed leverage

No AI feature is warranted. The core job is deterministic, local comparison of device data; sending those facts to a model would weaken the stated privacy boundary. The CLI already imports snapshots/requirements and exports JSON. No provider key, decorative AI feature, analytics, or external runtime script was found.

A local human-readable HTML report could be useful in a later product decision, but the absent brief does not establish it as a required job. It is not logged as a finding for this review.

## What would make this perfect

Make the desktop first screen genuinely actionable; repair fragment navigation and history scroll restoration with focused regression tests; replace the misleading sample heading; and standardize the connectivity term. Then rerun the complete clean-clone claim matrix, 390px/1440px cold-read checks, demo storage/request log, all-route crawl, Back/Forward flow, and production browser suite. A PASS requires zero findings.
