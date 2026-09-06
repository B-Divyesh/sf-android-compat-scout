# Find Android setup changes after an update — review 6

Review date: 2026-09-06  
Live URL: <https://android-compat-scout.sociobot.in>  
Implementation candidate: `056154783698b109a254f605111c2c3dd8cda65a`  
Documentation checkout: `42b8596b91c9d8fd65fb9fc5eba8aac7069dd05c`

## Verdict

**FAIL.** One blocking finding remains, and one public claim is not fully tested. The public Linux/macOS installer uses a checksum command that a clean macOS installation does not provide. PASS requires zero findings and zero untested claims.

Finding count: **1**. Untested claim count: **1**.

## First screen

Fresh 1440×900 desktop and Pixel 7 browser contexts showed the same information before scrolling:

- Job: find Android setup changes after an update.
- Audience: owners of customized Android phones and vehicle dongles after an update.
- First action: **Try it with sample data**. The adjacent sentence says it opens a sample upgrade report.
- Facts: free under MIT, the installed sample runs offline, and exports omit serials and Wi-Fi names.

The job, audience, action, result sentence, and three facts fit in the tested 390×844 first screen. The page had one h1, the expected landmarks, no browser storage, and no console error.

## Finding

### F-6-1 — BLOCKING — the advertised macOS installer requires a command that macOS does not include

The landing page labels `/install.sh` as the **Linux / macOS installer**, and the README publishes it as the one-line Unix install path. The live script is byte-identical to the candidate script. It selects a macOS archive for `Darwin`, then always runs:

```sh
grep " $asset$" SHA256SUMS | sha256sum -c -
```

A standard macOS installation provides `shasum`, not GNU `sha256sum`. In an isolated consumer shell that reported `Darwin` and `x86_64`, included the standard `shasum` command, and omitted `sha256sum`, the live candidate script exited 127:

```text
/site/public/install.sh: 12: sha256sum: not found
```

The declared `@claim:checksum-unix-installer` command passes, but its sandbox executes only the Linux branch on this Linux worker. It never selects `Darwin` or proves checksum verification with macOS tools. This makes the public Linux/macOS installer claim incomplete and leaves the advertised macOS one-line path broken on a clean system.

Required repair: use `sha256sum` when available and `shasum -a 256` on macOS, fail clearly if neither exists, and add a test that runs the Darwin branch with only standard macOS checksum tooling. Redeploy `/install.sh` and rerun the exact claim command.

Evidence: `/work/.evidence/review-6/macos-installer-reproduction.log`, `/work/.evidence/review-6/live-install.sh`.

## Sample and privacy checks

From fresh desktop and phone contexts, one click opened `/?demo=1`. The first demo screen contained an invented Android 14→15 comparison with OS, permission, and missing-component results. The terminal preview reported six changes.

The banner remained visible while scrolling and said **Demo — sample data, nothing is saved**. Reset restored an altered sample and returned focus to Reset demo. Start for real returned to `/`. No download occurred. Local storage, session storage, cookies, IndexedDB, and Cache Storage sentinels were preserved by the declared test. All requests during the manual demo flow were same-origin.

The CLI demo wrote only to its new temporary output directory and did not invoke ADB. The product has no backend, accounts, tenants, shared database, server persistence, health endpoint, or rate-limited live API. Backend isolation, restart, health, and 429 checks therefore do not apply.

## Installed command checks

The public Linux x64 v0.1.3 archive was downloaded in a fresh consumer directory and matched `SHA256SUMS`. The extracted command passed these checks outside the repository:

- normal demo: wrote both JSON reports and listed six changes;
- JSON mode: emitted valid JSON with six report findings;
- boundary: comparing a snapshot with itself produced zero findings;
- invalid input: malformed JSON exited 1 and created no report;
- missing prerequisite: a missing ADB executable exited 1, explained how to install platform-tools, and created no snapshot;
- recovery: a valid comparison after the malformed input succeeded with six changes;
- interface: `--version`, root help, and command help worked.

Evidence: `/work/.evidence/review-6/cli-consumer.log`.

## Claims

All 19 exact commands from `.factory/claims.json` were run separately after `npm ci` in a clean detached checkout. Every declared command exited successfully. The macOS gap above is a coverage failure in one passing command, so the review still has one untested claim.

| Claim | Declared command | Review result |
| --- | --- | --- |
| `sample-report` | pass | proved |
| `sample-six-changes` | pass | proved |
| `snapshot-json` | pass | proved with authorized fake ADB |
| `requirements-check` | pass | proved |
| `compare-json` | pass | proved |
| `redacted-export` | pass | proved |
| `installed-demo` | pass | proved |
| `local-installed-release` | pass | proved with public Linux release |
| `checksum-unix-installer` | pass | **incomplete: macOS branch untested and broken** |
| `checksum-windows-installer` | pass | proved with good and bad hashes |
| `release-download-checksums` | pass | proved for every installable v0.1.3 asset |
| `release-distribution` | pass | proved for release assets and package metadata |
| `mit-license` | pass | proved |
| `offline-bundled-demo` | pass | proved with blocked network syscalls |
| `retained-snapshot-fields` | pass | proved |
| `benchmark-12-of-15` | pass | public CLI detected all 15 cases |
| `read-only-diagnosis` | pass | proved against the ADB command allow-list |
| `demo-storage-isolation` | pass | proved in a fresh browser context |
| `cli-interface-options` | pass | proved |

No other visitor-facing claim on the live routes, README, command help, or installer pages lacked a matching claim entry and observable test.

## Browser, accessibility, and routes

- Local Playwright: 12/12 passed.
- Live Playwright: 12/12 passed.
- Factory URL check: HTTP 200, 629 ms load, zero console errors, `lang=en`, one h1, main landmark, image alt text present, and no unlabeled button.
- Standalone Axe CLI 4.10.3: zero violations on the live landing page. The repository Axe suite found zero violations on home, demo, privacy, terms, and 404 at phone and desktop sizes.
- Keyboard: the skip link is visible when focused and reaches the main heading; Enter opens the sample; Space opens the platform chooser and resets the demo; reset focus returns to its button; no trap was found.
- Focus rings use a visible 3 px cyan outline. All tested links, buttons, and summaries meet the 44 px minimum.
- Reduced motion matched the browser setting and reduced animation and transition durations to 0.01 ms.
- Every route reflowed at 390 px with 200% text and no page-level horizontal scrolling.
- `/`, `/demo`, `/privacy`, `/terms`, both installer files, robots, sitemap, the release page, and all five platform downloads returned 200 after redirects.
- An unknown route deliberately returned HTTP 404 with the designed page, its own title and h1, legal links, and a working overview action. The expected 404 is not a defect.
- Route titles, descriptions, canonicals, social metadata, route focus, install-anchor focus, and Back/Forward scroll restoration passed.
- The live CSP, no-sniff, and referrer-policy headers were present. No third-party font, script, analytics, or tracking request was observed.

## Performance and live comparison

Mobile Lighthouse 13.0.1 scored 100 for Performance, Accessibility, Best Practices, and SEO. LCP was 1,126 ms, total blocking time was 60 ms, CLS was 0, and transfer size was 64,779 bytes. Built assets were 11,315 bytes of JavaScript, 7,384 bytes of CSS, and a 56,660-byte hero image.

The live HTML, hashed JavaScript, hashed CSS, hero image, and installer match the clean build byte for byte. Commits after `0561547` change only factory reports and handoff files, so `0561547` is the implementation candidate and `42b8596` is the documentation checkout reviewed.

## Earlier findings

Every finding from reviews 1–4 was checked against current live behavior or the relevant source and test. The original issue is closed where shown; F-6-1 is a new macOS-specific installer failure.

| Earlier finding | Current disposition and evidence |
| --- | --- |
| F-1-1 | Original checkout-only public install issue remains fixed; live uses release installers. F-6-1 covers the separate macOS tool failure. |
| F-1-2 | Fixed; runtime wording remains narrowed to tested download availability. |
| F-1-3 | Fixed; every v0.1.3 installable asset was downloaded and checksum-verified. |
| F-1-4 | Fixed; complete release, Homebrew, Scoop, and validated Winget metadata checks passed. |
| F-1-5 | Fixed; all browser stores, cookies, requests, reset, exit, and downloads are covered. |
| F-1-6 | Fixed; terminal and CLI use `compat-scout-demo-<timestamp>`. |
| F-1-7 | Fixed; route metadata and titles passed live. |
| F-1-8 | Fixed; the report uses “changes” and plain category names. |
| F-1-9 | Fixed; the cited slogans and mood labels remain absent. |
| F-1-10 | Fixed; root and four subcommand help surfaces expose `--json` as documented. |
| F-1-11 | Fixed; landing and README name the same audience. |
| F-2-1 | Fixed; phones show a computer-install note and desktops require an explicit platform and processor choice. |
| F-2-2 | Fixed; the Windows installer behavior passed with matching and mismatching checksums. |
| F-2-3 | Fixed; snapshot, requirement, comparison, and JSON outcomes have separate behavior tests. |
| F-2-4 | Fixed; the sample contains exactly six changes. |
| F-2-5 | Fixed; the home title is plain and route-specific. |
| F-2-6 | Fixed; decorative numbered and sandbox labels remain absent. |
| F-2-7 | Fixed; retained and omitted snapshot fields are stated consistently and tested. |
| F-2-8 | Fixed; the README section names snapshot capture and comparison. |
| F-2-9 | Fixed; README uses “test data” and “automated tests.” |
| F-2-10 | Fixed; the demo documentation link describes its contents. |
| F-3-1 | Fixed; the headline promises change comparison, not causal diagnosis. |
| F-3-2 | Fixed; every route and the open chooser pass 390 px and 200% reflow. |
| F-3-3 | Fixed; persistent controls meet the 44 px target check. |
| F-3-4 | Fixed; free, offline, and privacy facts remain above the fold. |
| F-3-5 | Fixed; workflow and safety text is concrete. |
| F-4-1 | Fixed; the desktop action, result sentence, and facts fit before scrolling. |
| F-4-2 | Fixed; Install scrolls, announces, and focuses its heading from home and subroutes. |
| F-4-3 | Fixed; Back and Forward restore saved route scroll and heading focus. |
| F-4-4 | Fixed; “Sample report categories” does not imply a missing control. |
| F-4-5 | Fixed; visitor copy consistently uses “connectivity.” |

Review 5 reported no findings. Its evidence remains reproducible except for the newly identified macOS installer coverage gap.

## Commands and evidence

Clean checkout: `/tmp/android-compat-scout-review-6.4ES1Zz/repo` at documentation commit `42b8596`.

```sh
npm ci
# Each of the 19 exact commands from .factory/claims.json, run separately
npm test
npm run typecheck
npm run build
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo package --allow-dirty
npm run test:browser
PLAYWRIGHT_BASE_URL=https://android-compat-scout.sociobot.in npm run test:browser
/opt/fleet/lib/verify-url.sh https://android-compat-scout.sociobot.in /work/.evidence/review-6
npx @axe-core/cli https://android-compat-scout.sociobot.in
```

Detailed logs, screenshots, browser results, the clean consumer run, and Lighthouse JSON are under `/work/.evidence/review-6/`.
