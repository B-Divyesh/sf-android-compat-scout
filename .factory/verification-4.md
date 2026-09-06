# Find Android setup changes after an update — verification 4

Verified 2026-09-06 UTC at <https://android-compat-scout.sociobot.in>.

## Verdict

**PASS.** Zero findings were found at every severity. All 19 declared public claims were run separately from a clean checkout and passed. Untested public claims: **0**.

- Implementation reviewed: `f5c113cb3c4cd7abd0a34b59f0599fc813cac491`
- Documentation commit reviewed: `6b0f488e6b21ff949cc30aa002fc2e8a15b6f08e`
- Deployment: `bccb4dca-6577-4f2a-822e-557f4cb02ec0`
- Public CLI release: `v0.1.3`
- Finding count: **0**
- Untested claim count: **0**

`6b0f488` differs from the implementation only in `.factory/handoff.md`; the fresh compiled HTML, hashed JavaScript, hashed CSS, `/install.sh`, `/install.ps1`, `robots.txt`, and `sitemap.xml` match the live deployment byte-for-byte. The deployment does not expose `staticwebapp.config.json` as a public asset, which is expected for deployment configuration.

## First screen

Fresh 1440×900 desktop and 390×844 Android-phone contexts were opened at the live home page before scrolling. Both showed:

- Job: **Find Android setup changes after an update**.
- Audience: owners of customized Android phones and vehicle dongles after an update.
- First action: **Try it with sample data**. The adjacent text says, “See a sample upgrade report first.”
- Facts: free under MIT, the bundled sample runs offline after installation, and exports omit serials and Wi-Fi names.

The desktop and phone screenshots are in the verification evidence directory. Both first loads had `scrollY: 0` and no browser console errors.

## Claims and clean checkout

A new checkout at `6b0f488`, followed by `npm ci`, was used. Each exact command in `.factory/claims.json` ran independently. All 19 passed:

| Claim IDs | Result | Evidence |
| --- | --- | --- |
| `sample-report`, `sample-six-changes`, `snapshot-json`, `requirements-check`, `compare-json`, `redacted-export` | PASS | Categorised demo, fake-authorized ADB JSON, requirements, comparison, and redaction outcomes passed. |
| `installed-demo`, `local-installed-release`, `offline-bundled-demo` | PASS | Installed and downloaded public Linux commands ran from consumer directories; the offline check blocks network syscalls. |
| `checksum-unix-installer`, `checksum-windows-installer` | PASS | Good and corrupt checksum paths passed; Unix coverage includes Linux `sha256sum`, Darwin-shaped `shasum -a 256`, and missing-tool rejection. Windows exercises the real PowerShell script. |
| `release-download-checksums`, `release-distribution`, `mit-license` | PASS | Every published installable asset hashes correctly; release, tap, Scoop, and Winget checks passed. |
| `retained-snapshot-fields`, `benchmark-12-of-15`, `read-only-diagnosis`, `demo-storage-isolation`, `cli-interface-options` | PASS | Retained/redacted fields, all 15 named benchmark cases, read-only ADB allow-list, isolated demo storage, and help/JSON interfaces passed. |

The full per-claim log is `/tmp/android-compat-scout-verify-4.5P245v/repo/.factory/evidence/verification-4/claim-results.txt`.

The complete quality set also passed from that checkout:

```text
npm test                         # 19/19 tests
npm run typecheck
npm run build                    # produces dist/site and release CLI
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo package --allow-dirty
npm run test:browser             # 12/12 local browser tests
```

The fresh static build is 11.32 KB JavaScript (4.33 KB gzip), 7.38 KB CSS (2.24 KB gzip), and a 56.66 KB WebP hero image.

## Installed artifact, error paths, and recovery

The public `compat-scout-x86_64-unknown-linux-musl.tar.gz` archive was downloaded into a new consumer directory and verified against the public `SHA256SUMS` before extraction. Its `compat-scout` binary passed:

- normal `demo --json`: writes the two report files and reports six changes;
- boundary comparison: a snapshot compared with itself returns an empty findings list;
- invalid input: `/dev/null` is rejected as invalid JSON and no report is written;
- missing prerequisite: a nonexistent ADB command is rejected with an Android platform-tools action and no snapshot is written;
- recovery: a valid Android 14-to-15 comparison immediately after both error paths writes a six-change report;
- root help lists snapshot, compare, check, and demo.

The evidence is `/tmp/android-compat-scout-verify-4.5P245v/repo/.factory/evidence/verification-4/installed-artifact-results.txt`.

## Live demo, routes, and privacy

One click on the live primary action opened `/?demo=1` on desktop and phone. The first demo view immediately showed the Android 14-to-15 sample, a six-change summary, and the persistent **Demo — sample data, nothing is saved** label. Altering a rendered sample finding and selecting Reset demo restored the original finding and retained focus on Reset demo. Start for real returned to the home heading.

The live 12-test Playwright run passed. It verifies keyboard operation, skip link, focus routing, Install anchor routing from home and subroutes, Back/Forward scroll restoration, reduced-motion behavior, 44 px persistent targets, 390 px and 200% reflow, phone download safety, route titles and metadata, demo isolation, same-origin demo requests, loaded-demo offline recovery, and zero automated Axe violations on home, demo, privacy, terms, and 404 at phone and desktop sizes.

The demo-isolation claim also seeds localStorage, sessionStorage, IndexedDB, Cache Storage, and cookies; it proves Reset and Start for real preserve those real-data sentinels, create no download or sample residue, and make only same-origin requests. There is no account, analytics, third-party font/script, backend, tenant store, health endpoint, API allowance, payment flow, service-worker reload promise, or update-check feature. Backend isolation, restart, health, 429/Retry-After, and update checks therefore do not apply.

All rendered links were fetched: 13 product links returned 200; the five GitHub download choices returned their expected 302 redirects to the `v0.1.3` assets. `/`, `/demo`, `/privacy`, `/terms`, both installers, robots, and sitemap return 200. `/definitely-missing` returns the designed page with deliberate HTTP 404; this is expected, not a defect. Privacy and Terms have their own titles, headings, metadata, and footer links.

`verify-url.sh` reported HTTP 200, title, `lang=en`, one h1, a main landmark, no missing image alt text, no unlabeled buttons, and no console errors. The live CSP is self-only, with `frame-ancestors 'none'`, plus `nosniff` and strict referrer policy headers. The standalone Axe CLI could not launch because this container has no system Chrome; the accepted Playwright Axe integration ran against the live site and found zero violations across every required route and viewport.

Fresh mobile Lighthouse measured Performance **99**, Accessibility **100**, Best Practices **100**, and SEO **100**; LCP was 1,192 ms, TBT 124 ms, CLS 0, and transfer 64,761 bytes.

## Earlier finding disposition

| Finding | Current disposition |
| --- | --- |
| F-1-1 | Fixed: the public path uses the installer and bundled demo; checkout install remains development-only. |
| F-1-2 | Fixed: public wording promises tested download availability, not unproved runtime coverage. |
| F-1-3 | Fixed: every installable release asset is downloaded and SHA-256 checked. |
| F-1-4 | Fixed: release matrix, Homebrew tap, Scoop manifest, and Winget metadata are tested. |
| F-1-5 | Fixed: demo storage, cookies, downloads, requests, reset, and exit are fully isolated and tested. |
| F-1-6 | Fixed: terminal, docs, and CLI use the real `compat-scout-demo-<timestamp>` output pattern. |
| F-1-7 | Fixed: each route has distinct title, description, canonical, Open Graph, Twitter, and designed HTTP 404 behavior. |
| F-1-8 | Fixed: the report uses plain “changes” wording and understandable categories. |
| F-1-9 | Fixed: slogan and mood-label copy remains absent. |
| F-1-10 | Fixed: root and all documented subcommands expose help and `--json`. |
| F-1-11 | Fixed: landing and README consistently name customized Android-phone and vehicle-dongle owners. |
| F-2-1 | Fixed: phones receive a computer-install note; desktop visitors explicitly choose platform and processor. |
| F-2-2 | Fixed: the actual PowerShell installer passes matching and mismatching checksum behavior tests. |
| F-2-3 | Fixed: snapshot, requirements, comparison, and JSON output each have observable public-command tests. |
| F-2-4 | Fixed: the sample proves exactly six changes. |
| F-2-5 | Fixed: the home title is plain and task-specific. |
| F-2-6 | Fixed: decorative numbered and mood labels remain absent. |
| F-2-7 | Fixed: exact retained and omitted fields are stated consistently and tested. |
| F-2-8 | Fixed: the README section clearly names snapshot capture and comparison. |
| F-2-9 | Fixed: README uses plain “test data” and “automated tests” wording. |
| F-2-10 | Fixed: the demo-documentation link says what the file contains. |
| F-3-1 | Fixed: the headline reports changes rather than claiming causal diagnosis. |
| F-3-2 | Fixed: every route and open chooser reflows at 390 px and 200% text. |
| F-3-3 | Fixed: every visible persistent control meets the 44 px target check. |
| F-3-4 | Fixed: free, offline, and privacy facts appear before scrolling. |
| F-3-5 | Fixed: workflow and safety wording is concrete. |
| F-4-1 | Fixed: desktop first screen includes action, result sentence, and facts. |
| F-4-2 | Fixed: Install scrolls to and focuses its heading from home and subroutes. |
| F-4-3 | Fixed: Back and Forward restore saved scroll positions and heading focus. |
| F-4-4 | Fixed: “Sample report categories” does not imply a missing sort control. |
| F-4-5 | Fixed: visitor copy consistently uses “connectivity.” |
| F-6-1 | Fixed: deployed `/install.sh` matches the reviewed implementation; Darwin-shaped `shasum -a 256`, corrupt-checksum, and missing-tool paths now pass the exact claim test. |

Review 5 had no findings. No new finding was observed.

## Evidence locations

Verification outputs, screenshots, browser results, release-artifact output, link checks, and Lighthouse JSON are under `/tmp/android-compat-scout-verify-4.5P245v/repo/.factory/evidence/verification-4/`. The required published evidence copy is `/work/.evidence/qa-report.md` and `/work/.evidence/qa-result.json`.
