# Adversarial first-read review 1 — FAIL

Reviewed 2026-08-28 UTC against commit `38965241cc3f2b85b8396a71d7b6622305a7f6a5` and `https://android-compat-scout.sociobot.in`.

## Verdict

**FAIL.** The first read and one-click sample are clear, but the public install instruction cannot work for a visitor without a source checkout. The site also has unregistered visitor-facing claims, a false sample-terminal path, and incorrect per-route canonical/description metadata. A PASS requires zero findings.

## Cold first read

Fresh Chromium contexts at 390×844 and 1440×900, before scrolling, gave the same answer.

| Question | Answer from the first screen |
| --- | --- |
| What does this do? | It finds Android setup changes that broke a custom phone/dongle setup and turns device facts into a report. |
| For whom? | “custom-phone and dongle owners after an update.” |
| What should I click first? | “Try it with sample data”; the adjacent text says it will show a sample upgrade report. |

This gate passes. The mobile primary action and all three plain facts were visible without scrolling. The landing page loaded with no console errors and made only same-origin requests for HTML, JS, CSS, and the hero image.

## Findings

### F-1-1 — BLOCKING — the public installation example requires the source checkout

**Location/quote:** landing page, “Install the command-line tool” code block: `cargo install --path .`.

A visitor who follows the preceding sentence, “Download a release for your computer, then run the bundled sample,” has no checkout containing `Cargo.toml`. `cargo install --path .` therefore fails in the directory where a downloaded release was extracted, and it is explicitly labelled “For local development only” in the README. The real job cannot be started from the landing page’s shown command.

**Fix:** replace the landing code block with a usable release installation command, for example `curl -fsSL https://android-compat-scout.sociobot.in/install.sh | sh` followed by `compat-scout demo`, and give Windows/macOS equivalents through labelled links. Add a browser/content regression test that rejects `--path .` from the public install section and asserts the shown command matches a tested installer path.

### F-1-2 — HIGH — “Runs on your computer” is an unlisted claim

**Location/quote:** landing hero fact: “Runs on your computer.”

This is a visitor-facing operational/privacy claim, but `.factory/claims.json` has no claim naming this landing location or proving the full locally installed release path. `installed-demo` is listed only for “Demo page, README” and installs from a source checkout, not a public release.

**Fix:** add a `local-installed-release` claim whose `where` includes this hero fact, and test a downloaded release binary in a fresh consumer directory with network disabled after download. Or remove the fact.

### F-1-3 — HIGH — “Release downloads include checksums” is an unlisted claim

**Location/quote:** landing hero fact: “Release downloads include checksums.”

The registered installer claim proves a mocked Unix installer checks a checksum before placement. It does not register this release-download assertion or prove that the public release exposes a matching `SHA256SUMS` file.

**Fix:** register a separate public-release checksum claim (or expand the existing claim’s wording, `where`, and sandbox), and test that the release asset and its published SHA-256 entry match. If this cannot be tested in the build sandbox, remove the fact from the landing page.

### F-1-4 — HIGH — the README has visitor-facing distribution claims with no matching claim entries

**Location/quotes:** README Install section: “macOS and Windows builds are unsigned.” “The release includes Linux archives, `.deb`, `.rpm`, macOS archives and `.pkg` files, a Windows zip, checksums, and `latest.json` metadata.” “Homebrew users can install the published tap:” and “The release also includes a Scoop manifest; winget manifests under `winget/` are ready for owner submission.”

These are decisions a visitor may rely on to choose an install method. None is in `.factory/claims.json`; the present installer test exercises only a mocked Unix installer. The README’s distribution promises are consequently not checked from a clean consumer environment.

**Fix:** register individual release/distribution claims with tests that fetch or inspect the published assets, Homebrew formula, and Scoop manifest; then retain only the distribution paths actually proved. Keep the unsigned warning, but prove it from the release metadata or state it only on the download page where it is enforced.

### F-1-5 — MEDIUM — the README’s browser-demo assurance is unlisted at its published location

**Location/quote:** README “The browser demo is at `/demo`; it uses only sample data.”

`demo-storage-isolation` is a good test, but its `where` lists “Demo banner, .factory/demo.md”, not the README. The claim manifest must identify every public location where a visitor relies on this assurance.

**Fix:** add `README` to that claim’s `where`, retain its clean-browser storage/request assertion, and include the README location in the claim test’s documentation.

### F-1-6 — MEDIUM — the visual demo shows an output directory that the CLI never writes

**Location/quote:** landing and demo terminal recording: “Demo report written to `/tmp/compat-scout-demo`.”

The actual `demo` implementation creates `/tmp/compat-scout-demo-<timestamp>` unless `--out-dir` is supplied. A visitor copying the visual’s path will not find the report there. The sample is meant to demonstrate the real command, so this discrepancy is misleading.

**Fix:** render `/tmp/compat-scout-demo-<timestamp>` or “a temporary `compat-scout-demo-*` folder,” and add a test that derives the displayed sample output from the command’s documented behavior.

### F-1-7 — MEDIUM — route canonical URLs and descriptions remain the home page’s metadata

**Location/evidence:** live `/demo`, `/privacy`, and `/terms` each set a route-specific title, but each retains canonical `https://android-compat-scout.sociobot.in/` and description “Find Android upgrade changes that break a local app, dongle, or custom device setup.”

This marks Privacy and Terms as copies of the landing page for crawlers and gives their shared cards the wrong description.

**Fix:** update canonical URL, meta description, Open Graph title/description, and Twitter title/description during route rendering. Add a browser test for all four real routes.

### F-1-8 — MINOR — the product preview uses unexplained jargon

**Location/quote:** demo card heading: “Compatibility signals.”

“Signals” does not tell a cold visitor whether these are errors, differences, or things to repair. The rows themselves are concrete, so the heading should be equally direct.

**Fix:** replace with “Changes to check” or “Problems found after the update.”

### F-1-9 — MINOR — decorative copy does not communicate a usable fact

**Location/quotes:** hero caption: “Trace the change. Keep the evidence.” workflow heading: “Take evidence before guessing.” footer: “Private evidence for Android setup changes.”

These phrases are slogans/metaphors rather than section names or actionable facts. “Private” also reads as an unqualified privacy promise alongside the separately testable redaction and demo-isolation promises.

**Fix:** use “Compare Android setup snapshots” for the workflow heading; remove the hero caption or replace it with “The report lists each changed Android setting and app requirement”; replace the footer line with a concrete, registered statement or omit it.

### F-1-10 — MINOR — README command-interface claims have no registered proof

**Location/quotes:** README Use section: “`compat-scout --help` documents each command.” and “The snapshot, compare, check, and demo commands accept `--json` for scripting.”

These statements describe interfaces a CLI user may rely on. No `.factory/claims.json` entry names them or asserts the advertised option on each command.

**Fix:** add a `cli-interface-options` claim that invokes every listed command with `--help` and verifies its accepted `--json` option, with README in `where`; otherwise reduce the prose to only the commands whose options are tested.

### F-1-11 — MINOR — terminology changes for the same audience

**Location/quotes:** landing “custom-phone and dongle owners” versus README “owners of customized Android phones, vehicle dongles, and local apps.”

The landing and README use different names for the same phone/dongle setup. A cold visitor cannot tell whether a “vehicle dongle” is a narrower supported case or merely a new name.

**Fix:** choose one phrase, for example “owners of customized Android phones and vehicle dongles,” and use it on both surfaces.

## Demo and sandbox checks

The visible “Try it with sample data” link opened `/demo` in one click. Its first screen already showed three realistic Android 14→15 findings (OS, permission, missing component). The persistent banner, “Demo — sample data, nothing is saved,” was visible. Reset rerendered the sample and Start for real returned to `/` with the destination h1 focused.

In a fresh 390px browser context before and after Reset and Start for real, localStorage, sessionStorage, IndexedDB, Cache Storage, and cookies were empty. The request log contained only same-origin document, JS, CSS, and image requests. No offline promise is made, so no offline claim was evaluated. This gate passes.

## Claim commands from a clean clone

Fresh clone: `/tmp/android-compat-scout-review-1.kFLo8r` at the reviewed SHA. `npm ci` completed with zero reported vulnerabilities. Each exact `.factory/claims.json` command passed.

| Claim id | Result |
| --- | --- |
| `sample-report` | PASS |
| `redacted-export` | PASS |
| `installed-demo` | PASS |
| `checksum-installers` | PASS |
| `benchmark-12-of-15` | PASS |
| `read-only-diagnosis` | PASS |
| `demo-storage-isolation` | PASS |

`npm run test:browser` (four tests) and `npm run build` also passed in that clone. The claim command results do not remove F-1-2 through F-1-5: those are public assertions whose locations or promised outcomes are absent from the registered claim contract.

## Copy audit

Word counts use whitespace-delimited words. Command snippets and navigation-only labels are listed when they are visible text; code syntax is not treated as prose. No audited sentence exceeds 22 words. The flags are F-1-8 and F-1-9; claim-like sentences are covered by F-1-2 through F-1-5.

### Landing page

| Text | Words | Result |
| --- | ---: | --- |
| Find what broke your Android setup | 6 | pass |
| For custom-phone and dongle owners after an update, it turns scattered device facts into a clear report. | 17 | pass |
| Try it with sample data | 5 | pass |
| See a private upgrade report first. | 6 | F-1-9: “private” is vague/unregistered; use “See a sample upgrade report first.” |
| Runs on your computer | 4 | F-1-2: unlisted claim |
| Leaves out serials and Wi-Fi names | 6 | registered redaction claim |
| Release downloads include checksums | 4 | F-1-3: unlisted claim |
| Trace the change. | 3 | F-1-9: slogan |
| Keep the evidence. | 3 | F-1-9: slogan |
| Sort changes by what to check | 6 | pass |
| A report marks the update, permission, connection, and missing app separately. | 11 | covered by categorized-report claim |
| Demo report written to /tmp/compat-scout-demo | 5 | F-1-6: inaccurate path |
| Found 6 compatibility signals. | 4 | pass |
| ACCESS FINE LOCATION permission changed | 5 | pass |
| Wireless bridge is no longer installed | 6 | pass |
| Take evidence before guessing | 4 | F-1-9: mood heading |
| Capture a snapshot. | 3 | pass |
| Connect your phone and accept its USB-debugging prompt. | 8 | pass |
| Declare the setup. | 3 | pass |
| List the local app, permissions, and device roles it needs. | 10 | pass |
| Compare after changes. | 3 | pass |
| Save a report that names each meaningful difference. | 8 | pass |
| It reports facts. | 3 | covered by read-only claim |
| It does not change your phone. | 6 | covered by read-only claim |
| Compat Scout never roots a device, bypasses Android Auto restrictions, changes installed apps, or encourages driving interaction. | 17 | covered by read-only claim |
| Snapshots omit serial numbers, Wi-Fi names, and MAC addresses. | 9 | covered by redaction claim |
| Keep reports where you trust them. | 6 | pass |
| Install the command-line tool | 4 | pass |
| Download a release for your computer, then run the bundled sample. | 11 | contradicted by F-1-1’s displayed command |
| Download for this computer | 4 | pass |
| Linux / macOS installer | 4 | pass |
| Windows installer | 2 | pass |
| Release page | 2 | pass |
| Private evidence for Android setup changes. | 6 | F-1-9: vague privacy slogan |

### README

| Text | Words | Result |
| --- | ---: | --- |
| Find what broke your Android setup. | 6 | pass |
| Android Compat Scout is for owners of customized Android phones, vehicle dongles, and local apps. | 15 | pass |
| It collects a consented ADB snapshot, checks declared requirements, and compares a before/after pair into a JSON report. | 18 | pass |
| Download a release from GitHub Releases, or use an installer: | 10 | pass |
| Both scripts check the downloaded binary against the release SHA256SUMS file before installation. | 13 | registered checksum claim |
| macOS and Windows builds are unsigned. | 6 | F-1-4: unlisted distribution claim |
| On macOS, use right-click → Open after downloading the package. | 10 | pass |
| The release includes Linux archives, .deb, .rpm, macOS archives and .pkg files, a Windows zip, checksums, and latest.json metadata. | 19 | F-1-4: unlisted distribution claim |
| Homebrew users can install the published tap: | 7 | F-1-4: unlisted distribution claim |
| The release also includes a Scoop manifest; winget manifests under winget/ are ready for owner submission. | 16 | F-1-4: unlisted distribution claim |
| For local development only, install from the checkout with cargo install --path . | 13 | pass; conflicts with F-1-1 when used on landing |
| Install Android platform-tools, enable USB debugging, and accept the phone’s prompt. | 11 | pass |
| Take another snapshot after an update or configuration change. | 9 | pass |
| Use a requirement file when you know which app, permissions, and device roles matter: | 14 | pass |
| compat-scout --help documents each command. | 5 | F-1-10: unlisted CLI-interface assertion |
| The snapshot, compare, check, and demo commands accept --json for scripting. | 11 | F-1-10: unlisted CLI-interface assertion |
| No phone is needed: | 4 | covered by bundled-demo claim in substance; add README to `where` |
| The binary embeds the invented snapshots and requirement file, so this works after installation from any directory. | 17 | registered installed-demo claim |
| It prints a persistent temporary output directory containing compat-report.json and compat-check.json. | 11 | registered sample-report/installed-demo claim |
| The browser demo is at /demo; it uses only sample data. | 11 | F-1-5: `where` missing README |
| The bundled 15-case fixture ships redacted inputs for named phone and setup scenarios. | 13 | covered by benchmark claim |
| It invokes the public compare and check commands across OS, connectivity, app, and permission changes. | 15 | covered by benchmark claim |
| The regression suite requires at least 12 detected cases and currently verifies all 15. | 14 | registered benchmark claim |
| The collector intentionally avoids serial numbers, Wi-Fi names, and MAC addresses. | 11 | registered redaction claim |
| Reports can still reveal installed package names and Android build information, so store them carefully. | 15 | pass: safety disclosure |
| Compat Scout does not root a device, bypass restrictions, or modify installed apps. | 13 | registered read-only claim |
| Do not inspect or operate a device while driving. | 9 | pass: safety instruction |
| Requirements: Rust stable and Node 22+. | 6 | pass |
| The static deployment output is dist/site. | 6 | pass: developer documentation |
| The release workflow runs for v* tags and publishes the installable artifacts. | 12 | F-1-4: unlisted distribution assertion |
| Do not publish from a workstation; push a tested tag and let GitHub Actions create the release. | 17 | pass: maintainer instruction |
| MIT. | 1 | pass |
| See LICENSE. | 2 | pass |

The same physical-phone concept appears as “custom-phone” on the landing page and “customized Android phones” in the README (F-1-11).

## Structure, routes, and visual check

Live `/`, `/demo`, `/privacy`, and `/terms` returned 200. A deliberately unknown URL returned the designed 404 with HTTP 404. `robots.txt`, `sitemap.xml`, installers, release page, and the platform release download returned 200. The header/footer, skip link, real URLs, Back navigation, and h1 focus-on-route-change worked. Each checked page had one h1, a main landmark, no console errors, and no serious/critical Axe violations at desktop or 390px. The drawn blueprint-sheet system is distinct from a generic SaaS template and matches the documented visual direction.

F-1-7 remains: dynamic route metadata is incomplete despite the working visual routes.

## History and missed leverage

No earlier `.factory/review-*.md` or `.factory/polish-*.md` files exist. I read the existing handoff and verification records. Their prior demo-storage, benchmark-fixture, installer-checksum, Homebrew, and real-404 repairs are present in the live site/code and passed their corresponding current checks. The historical physical-device limitation remains a recommended manual smoke test, not a reproduced defect in this demo/CLI sandbox review.

The brief file is not present. The existing CLI already produces JSON reports and the core job is deterministic diagnosis; an AI feature would not be an obvious or honest improvement. No decorative AI feature or embedded provider key was found.

## What would make this perfect

Show a genuinely runnable public install command first, have the page’s terminal recording match the actual command output, register and test every distribution/privacy/CLI statement where it appears, and make each route’s canonical/social metadata describe that route. Then rerun this complete cold review from a clean clone and live browser context.
