# Find Android setup changes after an update — review 7

Reviewed 2026-09-06 UTC at <https://android-compat-scout.sociobot.in>.

## Verdict

**PASS — zero findings at every severity and zero untested public claims.**

- Finding count: **0**
- Untested claim count: **0**
- Implementation candidate: `f5c113cb3c4cd7abd0a34b59f0599fc813cac491`
- Documentation checkout reviewed: `281b72362cba4763156b0dff8cf3f0cbcfbdea7e`
- Public release: `v0.1.3`

The commits after `f5c113c` change only `.factory` reports. A fresh build at
`281b723` matched the live HTML, JavaScript, CSS, hero image, both installers,
`robots.txt`, and `sitemap.xml` byte for byte. The live runtime is therefore the
implementation candidate under review.

`.factory/brief.json` is absent. The injected researched brief, repository
contract, `.factory/design.md`, shipped interface, and public claims were used
as the acceptance sources.

## First screen

Fresh 1440×900 desktop and 390×844 phone browser contexts opened the live home
page at scroll position zero. Before scrolling, both clearly stated:

- Job: **Find Android setup changes after an update**.
- Audience: owners of customized Android phones and vehicle dongles after an
  update.
- First action: **Try it with sample data**. Its adjacent explanation says,
  “See a sample upgrade report first.”
- Facts: free under MIT, the installed sample runs offline, and exports omit
  serials and Wi-Fi names.

Every required item fit inside both first viewports. No console or page error
occurred.

## Claims from a clean checkout

A new clone at `281b723` was installed with `npm ci`. Each exact command in
`.factory/claims.json` ran separately. Each claim has exactly one matching
`@claim:<id>` test tag.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `sample-report` | PASS | Demo report separated OS, permission, connectivity, app, and missing-component changes. |
| `sample-six-changes` | PASS | Demo JSON contained exactly six changes. |
| `snapshot-json` | PASS | Authorized fake ADB facts matched saved JSON. |
| `requirements-check` | PASS | Public check command wrote and streamed prerequisite findings. |
| `compare-json` | PASS | Public compare command wrote and streamed the grouped JSON report. |
| `redacted-export` | PASS | Serial, Wi-Fi name, MAC, and full build detail were absent. |
| `installed-demo` | PASS | Installed command ran outside the checkout and saved both reports. |
| `local-installed-release` | PASS | Public Linux release was hashed and ran from a consumer folder. |
| `checksum-unix-installer` | PASS | Linux and Darwin-shaped good, corrupt, and missing-tool paths ran. |
| `checksum-windows-installer` | PASS | The real PowerShell installer accepted a good hash and rejected a bad one. |
| `release-download-checksums` | PASS | Every installable `v0.1.3` asset matched `SHA256SUMS`. |
| `release-distribution` | PASS | Release matrix, latest metadata, Homebrew, Scoop, and Winget checks passed. |
| `mit-license` | PASS | The shipped license and landing fact matched MIT. |
| `offline-bundled-demo` | PASS | The downloaded command ran with network syscalls blocked and no account data. |
| `retained-snapshot-fields` | PASS | Package names, Android version, and redacted fingerprint were retained. |
| `benchmark-12-of-15` | PASS | Public commands detected all 15 named cases. |
| `read-only-diagnosis` | PASS | The collector used only the declared read-only ADB command set. |
| `demo-storage-isolation` | PASS | Browser stores, cookies, requests, downloads, reset, and exit remained isolated. |
| `cli-interface-options` | PASS | Root and all four commands exposed help and accepted `--json`. |

Landing, legal, installer, command-help, and README copy were cross-checked
against the claim registry. No unlisted, broader, false, incomplete, or
untested public claim was found.

The aggregate quality gates also passed:

```text
npm test                              19/19 tests
npm run typecheck                     pass
npm run build                         pass; dist/site produced
cargo fmt --check                     pass
cargo clippy --all-targets -- -D warnings
cargo package --allow-dirty           pass
npm run test:browser                  12/12 local
PLAYWRIGHT_BASE_URL=https://android-compat-scout.sociobot.in npm run test:browser
                                      12/12 live
```

The fresh site build contains 11.32 KB JavaScript, 7.38 KB CSS, and a 56.66 KB
hero image, all below the product budgets.

## Demo, real-data isolation, and recovery

The primary action opened `/?demo=1` in one click on desktop and phone. The
first demo view showed an invented Android 14-to-15 comparison, populated OS,
permission, and missing-component guidance, and a terminal result reporting
six changes. The persistent label **Demo — sample data, nothing is saved**
remained visible after scrolling.

Changing a rendered sample row and choosing Reset demo restored the Android
14-to-15 row and returned focus to Reset demo. Start for real returned to `/`
and focused the home heading. The fresh manual contexts retained no local or
session storage, IndexedDB, Cache Storage, cookies, or downloads. The claim
test additionally seeded real sentinels in every store and proved that demo,
reset, and exit did not change them. Every demo request remained same-origin.

The public Linux x64 archive was downloaded into a separate consumer folder
and verified against the published checksum. Its installed command passed:

- normal `demo --json`, with six comparison changes and two prerequisite
  findings;
- boundary comparison of a snapshot with itself, with zero findings;
- invalid empty JSON, with exit 1 and no report written;
- missing ADB, with exit 1, a platform-tools recovery instruction, and no
  snapshot written;
- a valid six-change comparison immediately after both errors;
- version, root help, and command listing.

The CLI demo wrote only to its chosen output directory and never invoked ADB.

## Browser, accessibility, privacy, and routes

- Home, demo, Privacy, Terms, installers, robots, sitemap, the release page,
  and all five platform download links resolved. The deliberately unknown URL
  returned the designed page with HTTP 404, its own title and heading, legal
  links, and a route home. This expected 404 is not a defect.
- Each real route has its own title, description, canonical, Open Graph, and
  Twitter metadata. Each has `lang=en`, one h1, one main landmark, shared
  navigation, and a shared footer.
- Keyboard traversal reached every control, showed a 3 px cyan focus outline,
  operated the demo link with Enter and Reset with Space, and found no trap.
  Route changes, install navigation, and Back/Forward restored the required
  focus and scroll positions.
- All persistent controls met 44 px minimum targets. Every route and the open
  platform chooser reflowed at 390 px and 200% text without horizontal page
  scrolling.
- Reduced-motion mode matched and reduced animation and transition durations
  to 0.01 ms. No flashing or autoplay content exists.
- Playwright Axe found zero violations on home, demo, Privacy, Terms, and 404
  at desktop and phone sizes. The standalone Axe CLI was also attempted; its
  bundled ChromeDriver did not match the preinstalled Chromium, so the
  repository's accepted Playwright Axe integration supplied the completed
  route-wide scan.
- `verify-url.sh` returned HTTP 200, title, `lang=en`, one h1, a main landmark,
  complete image alt text, labelled buttons, and no console errors.
- The live response sends a self-only CSP with `frame-ancestors 'none'`,
  `X-Content-Type-Options: nosniff`, and a strict referrer policy. No analytics,
  tracking, third-party font/script, account, or runtime data service exists.

Fresh mobile Lighthouse scored **100 Performance, 100 Accessibility, 100 Best
Practices, and 100 SEO**. LCP was 1,148 ms, total blocking time was 0 ms, CLS
was 0, and transfer size was 64,782 bytes.

There is no backend, tenant store, account, shared database, payment flow,
health endpoint, live API allowance, or update checker. Tenant isolation,
restart persistence, 429/Retry-After, billing, and update checks do not apply.
The browser site makes no offline-reload promise; the tested offline claim is
for the installed bundled CLI sample.

## Earlier finding disposition

Every earlier review and verification report, including minor findings, was
read and checked against current live behavior, source, or the clean tests.

| Finding | Current proof |
| --- | --- |
| F-1-1 | Fixed: public installation uses release installers; checkout installation is development-only. |
| F-1-2 | Fixed: public wording promises tested download availability, not unproved OS runtime coverage. |
| F-1-3 | Fixed: every installable release asset was downloaded and hashed. |
| F-1-4 | Fixed: release assets, Homebrew, Scoop, complete Winget metadata, and workflow validation passed. |
| F-1-5 | Fixed: seeded stores, cookies, requests, downloads, reset, and exit are covered. |
| F-1-6 | Fixed: terminal, docs, and CLI use `compat-scout-demo-<timestamp>`. |
| F-1-7 | Fixed: route-specific metadata and designed HTTP 404 passed live. |
| F-1-8 | Fixed: output uses plain “changes” wording and named categories. |
| F-1-9 | Fixed: cited slogans and mood labels remain absent. |
| F-1-10 | Fixed: root and all documented commands expose help and `--json`. |
| F-1-11 | Fixed: landing and README consistently name the same audience. |
| F-2-1 | Fixed: phones receive a computer-install note; desktop users choose platform and processor. |
| F-2-2 | Fixed: the PowerShell installer passes matching and mismatching checksum behavior. |
| F-2-3 | Fixed: snapshot, requirements, compare, and JSON outcomes have public-command tests. |
| F-2-4 | Fixed: the sample asserts exactly six changes. |
| F-2-5 | Fixed: the home title names the job in plain words. |
| F-2-6 | Fixed: decorative numbered and mood labels remain absent. |
| F-2-7 | Fixed: retained and omitted snapshot fields are exact, consistent, and tested. |
| F-2-8 | Fixed: the README section names snapshot capture and comparison. |
| F-2-9 | Fixed: README uses “test data” and “automated tests.” |
| F-2-10 | Fixed: the demo-documentation link says what the file contains. |
| F-3-1 | Fixed: the headline promises change comparison, not causal diagnosis. |
| F-3-2 | Fixed: all routes and the chooser pass 390 px and 200% reflow. |
| F-3-3 | Fixed: all visible persistent controls pass the 44 px target check. |
| F-3-4 | Fixed: price, offline, and privacy facts appear before scrolling. |
| F-3-5 | Fixed: workflow and safety wording is concrete. |
| F-4-1 | Fixed: the desktop action, result sentence, and facts fit before scrolling. |
| F-4-2 | Fixed: Install scrolls to and focuses its heading from home and subroutes. |
| F-4-3 | Fixed: Back and Forward restore saved scroll and route focus. |
| F-4-4 | Fixed: “Sample report categories” does not imply a missing control. |
| F-4-5 | Fixed: visitor copy consistently uses “connectivity.” |
| F-6-1 | Fixed: live Unix installer uses `shasum -a 256` on the Darwin path and passes good, corrupt, and missing-tool checks. |

Review 5 reported no findings. The original verification's release/workflow,
paid-stub, broken-demo, claim-coverage, benchmark, Axe, console, focus/target,
routing/cache, and Clippy findings remain closed. Verification 2's demo-proof,
Homebrew, benchmark, sandbox-matching, and true-404 findings also remain
closed. The formerly advertised paid stub was removed; the shipped product is
free under MIT and makes no purchase claim.

## Evidence

Fresh review output, screenshots, claim logs, browser results, consumer CLI
results, URL checks, and Lighthouse JSON are under
`/tmp/android-compat-scout-review-7.lSLyjE/repo/.factory/evidence/review-7/`.
The required copies are `/work/.evidence/qa-report.md` and
`/work/.evidence/qa-result.json`.

**Final verdict: PASS — 0 findings and 0 untested claims.**
