# Android Compat Scout — repair 3 handoff

## Result

**PASS.** The blocking macOS installer finding and its claim-coverage gap are fixed. The deployed Linux/macOS installer now uses `sha256sum` when present, falls back to macOS `shasum -a 256`, and stops with a clear error before placement when neither tool exists.

The outcome test executes the real installer in isolated Linux and Darwin-shaped consumer environments. It proves successful placement with valid hashes, rejection with invalid hashes, and no placement without a checksum tool. The Darwin environment contains `shasum` and intentionally has no `sha256sum`.

## Versions and deployment

- Implementation commit: `f5c113cb3c4cd7abd0a34b59f0599fc813cac491`
- Previous implementation candidate: `056154783698b109a254f605111c2c3dd8cda65a`
- Repair starting checkout: `8cd3e34915295e7c76f822bf496c781f4028c11e`
- Handoff evidence commit: `HANDOFF_COMMIT_PENDING`
- Public CLI release: `v0.1.3` (unchanged)
- Static deployment: `bccb4dca-6577-4f2a-822e-557f4cb02ec0`
- Live URL: <https://android-compat-scout.sociobot.in>

The later handoff commit changes factory documentation only. The deployed implementation is `f5c113c`. The live `/install.sh` SHA-256 is `6250810dbaa7916dc32bb536f06705a6feabd08cf540a1956751be7efa6149e6`, byte-identical to the implementation build.

## Changes

- Added portable SHA-256 selection to `site/public/install.sh`.
- Expanded `@claim:checksum-unix-installer` from a host-Linux check into Linux, macOS, corrupt-download, and missing-tool outcomes.
- Updated the claim sandbox description to match the executed consumer environments.
- Kept the CLI, site copy, release assets, design, demo storage model, and product scope unchanged.
- Kept `.factory/copy-audit.md` current because no visitor-facing sentence changed.
- Confirmed `.factory/catalog-description.txt` is verb-first and 79 characters, then copied it to `/work/.evidence/catalog-description.txt`.

## Clean-checkout verification

Clean checkout: `/tmp/android-compat-scout-repair-3.JQ4xlB/repo` at the implementation commit.

- `npm ci`: passed, zero vulnerabilities.
- Every exact command in all 19 `.factory/claims.json` entries: 19/19 passed separately.
- `npm test`: 19/19 passed.
- `npm run typecheck`: passed.
- `npm run build`: passed and produced `dist/site` plus the release CLI.
- `cargo fmt --check`: passed.
- `cargo clippy --all-targets -- -D warnings`: passed.
- `cargo package --allow-dirty`: passed and verified the package.
- `npm run test:browser`: 12/12 passed locally.

The built site contains 11.32 KB JavaScript, 7.38 KB CSS, and a 56.66 KB hero image before gzip. These remain below the product budgets.

## Installed artifact and installer checks

The public Linux x64 v0.1.3 archive was downloaded into a new consumer directory and matched `SHA256SUMS`. Its installed command passed:

- normal demo with both JSON files and six changes;
- JSON output;
- identical-snapshot boundary with zero changes;
- malformed JSON rejection without an output report;
- missing-ADB rejection without a snapshot;
- valid recovery after both errors;
- root help and version output.

The deployed installer was downloaded cold and substituted into the platform claim test. Linux with `sha256sum`, Darwin with only `shasum`, bad hashes on both, and Darwin without either checksum tool all produced the required outcomes. The live Linux installer also installed v0.1.3 into a new home directory and ran its six-change demo outside the repository.

## Live browser and accessibility checks

- Production Playwright: 12/12 passed.
- Factory URL verifier: HTTP 200, 854 ms observed load, no console errors, `lang=en`, one h1, main landmark, complete alt text, and labeled buttons.
- Standalone Axe CLI 4.10.3: zero violations. The repository Axe suite also found zero violations on home, demo, privacy, terms, and 404 at phone and desktop sizes.
- Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 1,175 ms, TBT 104 ms, CLS 0, transfer 64,734 bytes.
- Reduced-motion mode leaves no animation or transition over 0.01 ms.
- Keyboard checks passed for the skip link, route-heading focus, Enter activation, Space reset, and reset focus return.
- Every route reflows at 390 px with 200% text. Persistent controls meet the 44 px target check.
- `/`, `/demo`, `/privacy`, `/terms`, both installers, robots, and sitemap return 200. The designed unknown route correctly returns HTTP 404.
- CSP, `nosniff`, strict referrer policy, route metadata, Back/Forward scroll restoration, offline loaded-demo recovery, and internal links passed.

Fresh 1440×900 desktop and 390×844 phone contexts showed this before scrolling:

- Job: find Android setup changes after an update.
- Audience: owners of customized Android phones and vehicle dongles after an update.
- First action: **Try it with sample data**; the adjacent sentence says it opens a sample upgrade report.
- Facts: MIT license, installed sample works offline, and exports omit serials and Wi-Fi names.

In both contexts, the one-click sample showed the Android 14→15 report and the persistent **Demo — sample data, nothing is saved** banner. Reset restored an altered finding and retained focus. Start for real returned to the landing page. Local storage, session storage, IndexedDB, Cache Storage, and cookie sentinels remained unchanged. No download, third-party request, or console error occurred.

## Earlier finding disposition

| Findings | Current proof |
| --- | --- |
| F-1-1–F-1-4 | Public install path, full release checksums, platform assets, Homebrew, Scoop, and Winget checks passed. |
| F-1-5–F-1-7 | Demo storage/request isolation, real temporary output path, and route-specific metadata passed live. |
| F-1-8–F-1-11 | Plain report terms, concrete copy, CLI help/JSON interface, and audience wording remain fixed. |
| F-2-1–F-2-4 | Platform chooser, PowerShell checksum behavior, core CLI outcomes, and exact six-change sample passed. |
| F-2-5–F-2-10 | Plain title, removed decorative labels, retained-field disclosure, README headings, testing terms, and demo link remain fixed. |
| F-3-1–F-3-5 | Non-causal headline, mobile reflow, touch targets, first-screen facts, and concrete workflow copy passed live. |
| F-4-1–F-4-5 | Desktop first-screen fit, Install focus, history scroll restoration, sample heading, and connectivity terminology passed. |
| Review 5 | Reported no findings; its full claim and browser evidence was reproduced. |
| F-6-1 | Fixed at the cause and proved with the downloaded live installer in a `shasum`-only Darwin path. |

## Privacy, billing, and applicability

The product remains a static, local-first CLI and documentation site. It has no backend, tenant storage, shared database, account, analytics, or live product API, so backend persistence, tenant isolation, health, and 429 checks do not apply. No AI feature is warranted for the deterministic local comparison job.

There is no advertised paid offer or existing paid deliverable in this checkout. No billing behavior was removed or changed, and no `billing-offer.json` was invented.

## Remaining limits

No physical Android phone or separate macOS host was available in this worker. Fake authorized ADB tests cover collection and redaction, and the macOS installer path runs with the real `shasum` executable in an isolated Darwin-shaped environment. A physical-device/OEM smoke test remains a recommended release check, not a reproduced product defect.

All repair evidence is under `/work/.evidence/android-compat-scout-repair-3/`.
