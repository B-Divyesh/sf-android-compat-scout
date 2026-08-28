# Adversarial first-read review 3 — FAIL

Reviewed 2026-08-28 UTC against commit `49ad29d84d33f7cf147ad3514d4ab74150c4d9a2` and `https://android-compat-scout.sociobot.in`.

## Verdict

**FAIL.** The cold first screen and demo are clear and usable, and all 16 declared claim commands pass. The product still has four blocking findings: its headline claims causal diagnosis that the tool does not perform, the cross-platform runtime statement is not tested on the named platforms, the winget manifests are not ready for submission, and the rewritten sensitive-report warning remains outside the claims contract. The 390 px landing page also overflows horizontally, three mobile controls miss the 44 px target minimum, the first-screen facts omit price and offline behavior, and three copy lines remain vague or subjective. PASS requires zero findings.

`.factory/brief.json` is absent. Scope was therefore checked against `README.md`, the product contract, the shipped CLI, and the live site.

## Cold first read

Fresh Chromium contexts at 390×844 and 1440×900 were opened before scrolling. The mobile check used both a plain 390 CSS-pixel viewport and an Android user agent.

| Question | Answer from the first screen |
| --- | --- |
| What does this do? | It compares Android setup information after an update and puts changes into a JSON report. |
| For whom? | Owners of customized Android phones and vehicle dongles after an update. |
| What should I click first? | “Try it with sample data”; the adjacent text says it opens a sample upgrade report. |

This gate passes. The headline, audience sentence, primary action, result explanation, and three short facts are visible before scrolling at 390×844 and 1440×900. The exact headline is nevertheless misleading about causal diagnosis; see F-3-1.

## Findings

### F-3-1 — BLOCKING — the headline promises to identify the cause, but the product only reports changes

**Location/quote:** landing h1 and README opening sentence: “Find what broke your Android setup.”

The shipped commands compare snapshots and requirements. `@claim:compare-json` proves that they group detected changes into a JSON report; it does not prove that a detected change caused a breakage. `.factory/claims.json` has no causal-diagnosis claim. A visitor may reasonably read the headline as an answer to “what caused this failure,” which the product cannot establish.

**Fix:** use “Find Android setup changes after an update” on the landing page and in the README. Keep causal language only if a new claim test demonstrates a known-breakage case where the command identifies the actual cause rather than merely a correlated difference.

### F-1-2 — BLOCKING, reopened — the named operating-system runtime claim is still only an asset-presence test

**Location/quote:** landing first-screen fact and mobile install note: “Runs on Windows, macOS, or Linux.”

The previous unlisted runtime claim was rewritten and mapped to `release-distribution`, but that test checks release filenames, URLs, checksums, and package metadata. `local-installed-release` executes only the Linux x64 archive. No declared claim test starts the Windows, macOS Intel, macOS ARM, or Linux ARM binaries. The published sentence is therefore broader than its registered, observable proof.

**Fix:** either rewrite it to “Downloads are available for Windows, macOS, and Linux,” which the existing distribution test proves, or add platform CI jobs that install and execute `compat-scout demo` from each published package and register that exact runtime claim.

### F-1-4 — BLOCKING, reopened — the winget package set is not ready for submission

**Location/quote:** README Install section: “Winget manifests under `winget/` are ready for owner submission.”

For version 0.1.3, `Sociobot.AndroidCompatScout.yaml` declares `ManifestType: defaultLocale`; the `.locale.en-US.yaml` file declares `ManifestType: locale`; and no file declares the required multi-file `ManifestType: version` with `DefaultLocale`. The `release-distribution` test only searches these files for version, URL, and checksum strings, so it passes without validating the winget manifest set. This is an unfixed part of the earlier distribution finding.

**Fix:** create the required version manifest, make the en-US file the default-locale manifest, remove the duplicate/incorrect locale role, and make `@claim:release-distribution` run an official winget schema or `winget validate` check over the complete folder. Until that passes, rewrite the sentence to “Draft winget manifests are included for owner review.”

### F-2-7 — BLOCKING, reopened — the replacement privacy warning is an unlisted and imprecise claim

**Location/quotes:** landing safety section: “Reports include package names and Android build details.” README Privacy and safety: “Reports can still reveal installed package names and Android build information, so store them carefully.”

No `.factory/claims.json` entry names this disclosure. `snapshot-json` happens to assert an app package and Android release in a snapshot, while `compare-json` asserts report format, count, and categories. Neither registered claim states or tests what sensitive fields a report retains. The wording also switches between “build details” and “build information.” This half-fixes the earlier vague storage warning by replacing it with a new unregistered privacy claim.

**Fix:** state the exact retained fields with one term, for example: “Snapshots contain app package names, Android version, and a redacted build fingerprint.” Register that sentence for the landing page and README, then test those fields in serialized snapshots and reports. Keep “Store snapshots and reports as private files” as the action.

### F-3-2 — HIGH — the landing page is 532 px wide in a 390 px viewport

**Location/evidence:** live landing page at 390×844; `document.documentElement.scrollWidth === 532` while `innerWidth === 390`. The overflowing nodes are the second `.install` grid child, its `<pre>`, `.download-options`, and installer links.

The first screen fits, but scrolling to installation exposes clipped content and horizontal page movement on the required phone width. The browser suite checks that the last hero fact is above the fold, but never asserts horizontal reflow.

**Fix:** allow grid children to shrink (`.install > * { min-width: 0; }`), constrain the code/download containers to the available width, and keep horizontal scrolling inside `<pre>` only. Add a 390 px and 200% text-size test asserting `documentElement.scrollWidth <= innerWidth` on every route, with the platform chooser both closed and open.

### F-3-3 — MEDIUM — three mobile controls are smaller than 44 px

**Location/evidence:** live `/?demo=1` at 390 px. The home wordmark measures 130×30 px, “Reset demo” 116×40 px, and “Start for real” 124×36 px.

These are persistent navigation/demo controls, but they miss the accessibility skill's 44 px touch-target baseline. The current target-size test excludes the wordmark and demo-banner controls.

**Fix:** give `.wordmark`, `.demo-banner button`, and `.demo-banner a` a 44 px minimum block size without reducing visible spacing. Extend the browser assertion to every visible `a`, `button`, and `summary`, with a documented exception only for inline prose links whose surrounding line box supplies equivalent spacing.

### F-3-4 — MEDIUM — the first-screen facts omit price and offline behavior

**Location/quote:** the three hero facts are “Runs on Windows, macOS, or Linux,” “Leaves out serials and Wi-Fi names,” and “Release downloads include checksums.”

The mandatory first-screen shape asks for privacy, offline, and price facts. The current set gives privacy plus two distribution facts. A first-time visitor cannot tell whether the CLI costs money or needs an account/network after installation.

**Fix:** state the actual commercial and network boundaries, for example “Free under the MIT License” and “Works without an account or network after installation,” alongside the exact redaction fact. Register and test the offline/no-account statement; do not infer it only from the current implementation.

### F-3-5 — MINOR — three workflow lines remain vague or subjective

**Location/quotes:** “Declare the setup.” “Save a report that names each meaningful difference.” “It reports facts.”

“Declare” is avoidable technical language, “meaningful” is an untestable judgment, and “reports facts” does not identify which facts. These lines do not pass the first-read rule as cleanly as the surrounding concrete copy.

**Fix:** use “List what your setup needs.”, “Save a JSON report that lists each detected change.”, and “Compat Scout reads device information without changing it.” Also replace “The report lists each changed Android setting and app requirement” with “The sample report lists changed Android settings and app requirements” to avoid an unproved completeness claim.

## Copy audit

Counts are whitespace-delimited. The audit includes each unique navigation, heading, action, label, image alt text, terminal line, platform-specific variant, footer line, metadata sentence, and every README prose sentence. Repeated navigation/footer links are listed once. Commands are listed as interface copy but are not judged as prose. No item exceeds 22 words and no banned marketing word appears. Findings are marked inline.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Android Compat Scout — Find Android setup changes | 8 | pass; document/social title |
| Find Android update changes that affect a customized phone or vehicle dongle. | 12 | pass; metadata description |
| Skip to main content | 4 | pass |
| Android Compat Scout | 3 | pass |
| Demo | 1 | pass |
| Install | 1 | pass |
| Privacy | 1 | pass |
| Find what broke your Android setup | 6 | F-3-1: causal overclaim |
| For owners of customized Android phones and vehicle dongles after an update, it groups setup changes into a JSON report. | 20 | pass; `compare-json` |
| Try it with sample data | 5 | pass; result-naming action |
| See a sample upgrade report first. | 6 | pass |
| Runs on Windows, macOS, or Linux | 6 | F-1-2 reopened; runtime is under-tested |
| Leaves out serials and Wi-Fi names | 6 | pass; `redacted-export` |
| Release downloads include checksums | 4 | pass; `release-download-checksums` |
| Blueprint illustration of a phone, USB cable, and vehicle dongle used for compatibility inspection. | 14 | pass; image alt |
| The report lists each changed Android setting and app requirement. | 10 | F-3-5: “each” overstates completeness |
| Sample report / Android 14 → 15 | 7 | pass |
| Sort changes by what to check | 6 | pass |
| A report marks the update, permission, connection, and missing app separately. | 11 | pass; `sample-report` |
| compat-scout demo | 2 | command |
| Demo report written to /tmp/compat-scout-demo-&lt;timestamp&gt; | 5 | pass; `installed-demo` |
| Found 6 changes. | 3 | pass; `sample-six-changes` |
| [Permission] ACCESS FINE LOCATION permission changed | 6 | sample output |
| [Missing component] wireless bridge is no longer installed | 8 | sample output |
| cat /tmp/compat-scout-demo-&lt;timestamp&gt;/compat-report.json | 2 | command |
| Compare Android setup snapshots | 4 | pass |
| Capture a snapshot. | 3 | pass; `snapshot-json` |
| Connect your phone and accept its USB-debugging prompt. | 8 | pass |
| Declare the setup. | 3 | F-3-5: jargon |
| List the local app, permissions, and device roles it needs. | 10 | pass |
| Compare after changes. | 3 | pass; `compare-json` |
| Save a report that names each meaningful difference. | 8 | F-3-5: subjective claim |
| It reports facts. | 3 | F-3-5: vague heading |
| It does not change your phone. | 6 | pass; `read-only-diagnosis` |
| Compat Scout never roots a device, bypasses Android Auto restrictions, changes installed apps, or encourages driving interaction. | 17 | pass; read-only boundary and safety wording |
| Snapshots omit serial numbers, Wi-Fi names, and MAC addresses. | 9 | pass; `redacted-export` |
| Reports include package names and Android build details. | 8 | F-2-7 reopened; unlisted privacy claim |
| Store them as private files. | 5 | pass; concrete safety action |
| Install the command-line tool | 4 | pass |
| Install a verified release, then run the bundled sample from any folder. | 12 | pass; installer and installed-demo claims |
| Choose a platform and processor | 5 | pass; desktop action |
| Windows · x64 | 2 | pass |
| macOS · Apple silicon | 3 | pass |
| macOS · Intel | 2 | pass |
| Linux · x64 | 2 | pass |
| Linux · ARM64 | 2 | pass |
| Open install options on a computer | 6 | pass; phone instruction |
| The command-line tool runs on Windows, macOS, or Linux. | 9 | F-1-2 reopened; runtime is under-tested |
| Linux / macOS installer | 4 | pass; `checksum-unix-installer` |
| Windows installer | 2 | pass; `checksum-windows-installer` |
| Release page (opens GitHub) | 4 | pass |
| A command-line report for Android setup changes. | 7 | pass |
| Terms | 1 | pass |
| Built by Param Factory | 4 | pass |
| v0.1.3 | 1 | pass |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Android Compat Scout | 3 | pass |
| Find what broke your Android setup. | 6 | F-3-1: causal overclaim |
| Android Compat Scout is for owners of customized Android phones and vehicle dongles. | 13 | pass |
| With USB-debugging approval, Compat Scout saves device facts as JSON. | 9 | pass; `snapshot-json` |
| It checks what your setup needs and compares snapshots taken before and after a change. | 15 | pass; `requirements-check`, `compare-json` |
| Install | 1 | pass |
| Download a release from GitHub Releases, or use an installer. | 10 | pass |
| Both scripts check the downloaded binary against the release SHA256SUMS file before installation. | 13 | pass; both installer claims |
| macOS and Windows builds are unsigned. | 6 | pass; `release-distribution` |
| On macOS, use right-click → Open after downloading the package. | 10 | pass |
| The release includes Linux archives, .deb, .rpm, macOS archives and .pkg files, a Windows zip, checksums, and latest.json metadata. | 19 | pass; `release-distribution` and checksum claim |
| Homebrew users can install the published tap. | 7 | pass; `release-distribution` |
| The release also includes a Scoop manifest. | 7 | pass; `release-distribution` |
| Winget manifests under winget/ are ready for owner submission. | 9 | F-1-4 reopened; manifest set is invalid/incomplete |
| For local development only, install from the checkout with cargo install --path . | 13 | pass |
| Capture and compare snapshots | 4 | pass |
| Install Android platform-tools, enable USB debugging, and accept the phone's prompt. | 11 | pass |
| Take another snapshot after an update or configuration change. | 9 | pass |
| Use a requirement file when you know which app, permissions, and device roles matter. | 14 | pass |
| compat-scout --help lists each command. | 5 | pass; `cli-interface-options` |
| The snapshot, compare, check, and demo commands accept --json for scripting. | 11 | pass; `cli-interface-options` |
| Try the bundled sample | 4 | pass |
| No phone is needed. | 4 | pass; `installed-demo` |
| The binary embeds the invented snapshots and requirement file, so this works after installation from any directory. | 17 | pass; `installed-demo` |
| It prints a persistent temporary output directory containing compat-report.json and compat-check.json. | 11 | pass; `installed-demo` |
| The browser demo is at /?demo=1 (also /demo); it uses only sample data. | 13 | pass; `demo-storage-isolation` |
| See .factory/demo.md for the sample files, reset behavior, and storage checks. | 12 | pass |
| Compatibility benchmark | 2 | pass |
| The bundled test data covers 15 named phone and setup cases. | 11 | pass; `benchmark-12-of-15` |
| It invokes the public compare and check commands across OS, connectivity, app, and permission changes. | 15 | pass; benchmark integration test |
| Automated tests must detect at least 12 cases; they currently detect all 15. | 13 | pass; `benchmark-12-of-15` |
| Privacy and safety | 3 | pass |
| The collector intentionally avoids serial numbers, Wi-Fi names, and MAC addresses. | 11 | pass; `redacted-export` |
| Reports can still reveal installed package names and Android build information, so store them carefully. | 15 | F-2-7 reopened; unlisted privacy claim and inconsistent term |
| Compat Scout does not root a device, bypass restrictions, or modify installed apps. | 13 | pass; `read-only-diagnosis` |
| Do not inspect or operate a device while driving. | 9 | pass |
| Develop and verify | 3 | pass |
| Requirements: Rust stable and Node 22+. | 6 | pass |
| The static deployment output is dist/site. | 6 | pass; build verified |
| The release workflow runs for v* tags and publishes the installable artifacts. | 12 | pass; `release-distribution` |
| Do not publish from a workstation; push a tested tag and let GitHub Actions create the release. | 17 | pass |
| License | 1 | pass |
| MIT. | 1 | pass |
| See LICENSE. | 2 | pass |

### Terminology and actions

| Concept | Term in use | Result |
| --- | --- | --- |
| Collected device record | snapshot | consistent |
| Detected difference | change | consistent except subjective “meaningful difference”; F-3-5 |
| Output | report | consistent, but its retained-data wording differs; F-2-7 |
| Declared app/device needs | requirements | “Declare the setup” is avoidable jargon; F-3-5 |
| Bundled isolated example | demo | consistent |
| Installed command | Compat Scout / `compat-scout` | consistent by prose/command context |

Primary actions name results or destinations: “Try it with sample data,” “Reset demo,” “Start for real,” “Choose a platform and processor,” and “Go to overview.” No action uses “Submit,” “Go,” or “Continue” without a destination.

## Demo and sandbox

The demo gate passes. From a fresh 390 px context, one click on “Try it with sample data” opened `/?demo=1`. The first demo viewport already showed the Android 14→15 comparison, OS and permission changes, and the missing wireless bridge. “Demo — sample data, nothing is saved,” “Reset demo,” and “Start for real” were visible. After a result row was altered in the DOM, Reset restored it. Start for real returned to `/`.

Before entry, the browser was seeded with real sentinels in localStorage, sessionStorage, IndexedDB, Cache Storage, and a cookie. Every sentinel was unchanged after Reset and exit. No download occurred. The full flow requested only the product origin and produced no console errors. No offline claim is published; the already-loaded demo nevertheless continued to reset and exit under the existing offline browser test.

The CLI path was exercised by the clean-clone `installed-demo` and `local-installed-release` claim commands. Each ran `compat-scout demo` from a consumer directory outside the checkout and verified both output files.

## Claims — clean clone

Clean clone: `/tmp/android-compat-review3.ipaSQq/repo` at `49ad29d84d33f7cf147ad3514d4ab74150c4d9a2`. `npm ci` completed with zero reported vulnerabilities. Every exact command in `.factory/claims.json` returned zero.

| Claim id | Exact command | Result |
| --- | --- | --- |
| `sample-report` | `npm test -- --grep @claim:sample-report` | PASS |
| `sample-six-changes` | `npm test -- --grep @claim:sample-six-changes` | PASS |
| `snapshot-json` | `npm test -- --grep @claim:snapshot-json` | PASS |
| `requirements-check` | `npm test -- --grep @claim:requirements-check` | PASS |
| `compare-json` | `npm test -- --grep @claim:compare-json` | PASS |
| `redacted-export` | `npm test -- --grep @claim:redacted-export` | PASS |
| `installed-demo` | `npm test -- --grep @claim:installed-demo` | PASS |
| `local-installed-release` | `npm test -- --grep @claim:local-installed-release` | PASS |
| `checksum-unix-installer` | `npm test -- --grep @claim:checksum-unix-installer` | PASS |
| `checksum-windows-installer` | `npm test -- --grep @claim:checksum-windows-installer` | PASS |
| `release-download-checksums` | `npm test -- --grep @claim:release-download-checksums` | PASS |
| `release-distribution` | `npm test -- --grep @claim:release-distribution` | PASS, but incomplete for F-1-2 and F-1-4 |
| `benchmark-12-of-15` | `npm test -- --grep @claim:benchmark-12-of-15` | PASS |
| `read-only-diagnosis` | `npm test -- --grep @claim:read-only-diagnosis` | PASS |
| `demo-storage-isolation` | `npm test -- --grep @claim:demo-storage-isolation` | PASS |
| `cli-interface-options` | `npm test -- --grep @claim:cli-interface-options` | PASS |

There is no untested listed claim. F-3-1 and F-2-7 are public claims without matching entries. F-1-2 is broader than the outcome of its cited entry. F-1-4 is contradicted by the winget manifest structure despite its passing string checks.

## Earlier finding verification

### Review 1

| Earlier id | Current result | Live and code confirmation |
| --- | --- | --- |
| F-1-1 | fixed | Landing uses the public Unix installer and `compat-scout demo`; checkout-only installation stays in the README's local-development paragraph. |
| F-1-2 | **reopened, BLOCKING** | The replacement names three operating systems, but only Linux x64 is executed; see F-1-2 above. |
| F-1-3 | fixed | The checksum test requires and downloads all 11 installable assets. |
| F-1-4 | **reopened, BLOCKING** | Release assets, Homebrew, and Scoop are checked, but the claimed submission-ready winget set lacks a version manifest; see F-1-4 above. |
| F-1-5 | fixed | The claim test seeds and preserves all named browser stores and cookies, checks no download, and records same-origin requests. |
| F-1-6 | fixed | Terminal uses `/tmp/compat-scout-demo-<timestamp>`, matching CLI behavior. |
| F-1-7 | fixed | Home, demo, privacy, terms, and 404 have route-specific titles, descriptions, canonicals, and social metadata. |
| F-1-8 | fixed | “Changes to check” and “Found 6 changes” are used consistently. |
| F-1-9 | fixed at cited locations | Earlier slogans and numbered mood labels are absent. New copy issues are F-3-1 and F-3-5. |
| F-1-10 | fixed | Root and all four subcommands expose the documented help and `--json` option. |
| F-1-11 | fixed | Landing and README use “owners of customized Android phones and vehicle dongles.” |

### Review 2

| Earlier id | Current result | Live and code confirmation |
| --- | --- | --- |
| F-2-1 | fixed | Phone visitors get no guessed binary; desktop visitors get five explicit platform/processor choices. |
| F-2-2 | fixed | The Windows installer is executed with mocked good and bad checksums; bad input leaves no installed binary. |
| F-2-3 | fixed | Snapshot, requirement-check, and compare behavior each have public-command claim tests and plainer copy. |
| F-2-4 | fixed | The sample uses “changes,” and exactly six are asserted. |
| F-2-5 | fixed | Home title is “Android Compat Scout — Find Android setup changes.” |
| F-2-6 | fixed | Numbered decorative labels and “sandbox” are absent. |
| F-2-7 | **reopened, BLOCKING** | The concrete replacement introduced an unregistered sensitive-content claim; see F-2-7 above. |
| F-2-8 | fixed | README heading is “Capture and compare snapshots.” |
| F-2-9 | fixed | README uses “test data” and “automated tests.” |
| F-2-10 | fixed | The `.factory/demo.md` link says it documents sample files, reset behavior, and storage checks. |

The polish and handoff assertions about release assets, checksums, demo isolation, route metadata, designed 404, same-origin browser requests, build size, console output, and Axe results were independently reproduced. Their broad “touch targets” assertion was incomplete; see F-3-3.

As in the earlier handoffs, no physical Android device was attached. This does not reopen a finding because the declared snapshot sandbox explicitly uses an authorized fake ADB executable, and that end-to-end test passed.

## Structure, links, accessibility, and identity

| Check | Result |
| --- | --- |
| Titles and headings | PASS: route-specific titles follow the required pattern; every checked page has one h1 and one main. |
| Metadata | PASS: descriptions, canonicals, Open Graph/Twitter fields, SVG favicon, 180 px apple-touch icon, and 1200×630 OG image are present. |
| Routes and 404 | PASS: `/`, `/demo`, `/privacy`, and `/terms` return 200; an unknown URL returns the designed blueprint 404 with HTTP 404. |
| History and focus | PASS: SPA navigation focuses the new h1; Back restores the prior home scroll position (1192 px observed, 1199 px restored). |
| Links | PASS: every rendered internal, installer, release-page, and five platform-download link resolved to 200; README relative links exist. |
| Header/footer | PASS: consistent wordmark, three-item navigation, skip link, product one-liner, Privacy, Terms, factory credit, and version. |
| Security/privacy | PASS: CSP is delivered as a response header with `frame-ancestors`; no console errors or third-party demo requests were observed. |
| Automated accessibility | PASS with manual exceptions: Axe found zero violations on five routes at 390 and 1440 px, but target sizes fail F-3-3 and reflow fails F-3-2. |
| Visual identity | PASS: the square blueprint sheet, drafting grid, dark terminal, cyan/amber notation, and original phone/cable/dongle art are product-specific rather than generic SaaS cards/gradients. |
| Size/build | PASS: built JS is 9.31 kB raw / 3.74 kB gzip; CSS is 6.85 kB raw / 2.14 kB gzip; hero WebP is 56.66 kB. |

`verify-url.sh` passed production: HTTP 200, 600 ms observed load, no console errors, `lang=en`, one h1, main present, no missing alt text, and no unlabeled buttons. The production Playwright suite passed 8/8 and Axe reported no automated violations. The clean-clone `npm run typecheck`, `npm run build`, `cargo fmt --check`, and `cargo clippy --all-targets -- -D warnings` all passed; `dist/site` was produced.

## Missed leverage

No additional AI or sync feature is justified. The product already imports snapshots and requirements and exports JSON. Its core comparison is deterministic and local; sending device facts to a model would weaken the current privacy boundary without an obvious user benefit. No decorative AI feature, provider key, analytics, or third-party runtime script was found.

The most useful missing capability is not AI: a human-readable HTML report export would let a phone owner share or archive results without reading JSON. If added, it should be a local `--format html` output, redact the same identifiers, include a sample in the demo, and have its own claim test. This is missed leverage, not a blocker for the current CLI contract.

## What would make this perfect

Replace the causal headline with a truthful change-comparison headline; either narrow or genuinely execute-test the cross-platform claim; repair and validate the winget manifest set; register and test the exact sensitive fields retained in snapshots and reports; eliminate 390 px horizontal overflow; make every persistent control at least 44 px; add tested price/offline facts to the first screen; and apply the three concrete copy rewrites. Then rerun the complete claim matrix, 390 px/200% reflow check, all-control target-size scan, link crawl, route/focus history check, demo storage/request log, and clean build. A PASS is appropriate only if that rerun has zero findings.
