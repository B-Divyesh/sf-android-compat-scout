# Independent product verification — FAIL

Verified on 2026-08-28 UTC.

- Candidate: `1de70ef9ae0f3aef2b12e61ca8112aa4c0ad5ed6`
- Live URL: `https://android-compat-scout.sociobot.in`
- Contract: supplied researched brief, work order, repository `AGENTS.md`, and attached factory skills
- Verdict: **FAIL — do not release or sell this candidate**

The live web artifact is the candidate, not a stale deployment: local production-build `index.html`, hashed JavaScript, hashed CSS, hero WebP, both installer scripts, `robots.txt`, and `sitemap.xml` matched the live bytes. The failures below therefore apply to the nominated commit and deployment.

## Mandatory gates

| Gate | Result | Evidence |
| --- | --- | --- |
| Claim manifest exists | PASS | `.factory/claims.json` contains two claims. |
| `@claim:sample-report` | PASS | Exact command `npm test -- --grep @claim:sample-report`: 3 Rust tests passed; tagged Vitest claim passed. |
| `@claim:redacted-export` | PASS | Exact command `npm test -- --grep @claim:redacted-export`: 3 Rust tests passed; tagged Vitest claim passed. |
| Cold first read | PASS | At 1440×900 and 390×844, the first screen says “Find what broke your Android setup,” names custom-phone and dongle owners after an update, and makes “Try it with sample data” the primary action. |
| One-click web demo | PASS | The primary action opened `/demo` in one click. The page immediately showed three representative findings and the persistent “Demo — sample data, nothing is saved” banner. Reload retained the demo route; Reset and Start for real were present. |
| Clean install | FAIL | The public installer returned exit 22/HTTP 404. `cargo install android-compat-scout` returned exit 101 because the crate is not published. No release assets exist. |
| Installed CLI demo | FAIL | A clean `cargo install --path /work/repo --root <temp> --locked` succeeded, but running `<temp>/bin/compat-scout demo --json` from another empty directory exited 1: `Could not read examples/before-android-14.json`. |
| Full repository tests | PASS | After `npm ci`, `npm test` passed 3 Rust tests and 2 Vitest tests. `npm audit` reported 0 vulnerabilities. |
| Exact production build | PASS | `npm run build` produced `dist/site` and the release Rust binary. |
| Available formatting/lint checks | FAIL | `cargo fmt --check` reported a whole-file formatting diff. `cargo clippy --all-targets -- -D warnings` failed with two `possible_missing_else` findings and one `redundant_closure`. |
| Accessibility | FAIL | Axe found one serious `scrollable-region-focusable` violation on `/demo` at 390×844. See accessibility evidence below. |
| No browser console errors | FAIL | The factory `verify-url.sh` exited nonzero because `/releases/latest` returned 404 and Chromium logged `Failed to load resource`. Lighthouse failed the console-errors audit too. |

## Release-blocking findings

### Critical — no installable release, and the release workflow cannot parse

This `cli-installers` product cannot currently be obtained by a user.

- GitHub REST returned no releases and no tags. `/releases/latest` returned 404.
- The only Actions run for this commit, [run 33191649927](https://github.com/B-Divyesh/sf-android-compat-scout/actions/runs/33191649927), concluded `failure` with zero jobs.
- YAML lint failed at `.github/workflows/release.yml:30`: `with: { targets: ${{ matrix.target }} }` is an invalid flow mapping. A second expression of the same form exists at line 65.
- The documented one-line Linux installer, `curl -fsSL https://android-compat-scout.sociobot.in/install.sh | sh`, exited 22 when `SHA256SUMS` returned 404.
- The landing-page command `cargo install android-compat-scout` exited 101: the crate does not exist in crates.io.
- Consequently there are no macOS, Windows, Linux, deb, rpm, checksum, or `latest.json` release assets to verify.
- Packaging is not publication-ready even after fixing YAML: no Homebrew formula/tap exists; Scoop contains `REPLACE_WITH_RELEASE_SHA256`; the winget directory contains only a `defaultLocale` file rather than a complete manifest set; Linux arm64 is referenced by `install.sh` but absent from the build matrix; generated `latest.json` has only one release-page URL instead of per-platform asset URLs.

This alone fails the artifact-class contract and real job-to-be-done.

### Critical — the advertised paid product is unavailable and not implemented

- `GET https://api.sociobot.in/api/v1/products/android-compat-scout/checkout` returned HTTP 404, so “Buy Pro for $12” is a dead purchase action.
- The CLI has no license handling, saved setup collection, or inspection index. The only Pro implementation is landing-page copy and a browser token-verification form, so the advertised paid capability does not exist.
- Opening `/?license=qa-return-token` left the token in the address bar and stored nothing. The required paid-return flow must store the token and remove it from the URL.
- Pasting an invalid token stored it in `sb_license:android-compat-scout` before validation. Reload neither displayed cached status nor reverified it. There is no daily verdict cache or first-paint reconciliation.

### High — the required CLI demo is broken in both normal distribution modes

- Installed binary: the demo depends on source-tree-relative `examples/...` paths (`src/main.rs:64-66`), so it fails in a clean consumer directory.
- Source-tree default: `compat-scout demo` reported `/tmp/.tmpDkgqYT`, exited 0, and then deleted that directory as `tempfile::TempDir` dropped. The printed output location did not exist after the command.
- The passing claim test hides both defects by supplying `--out-dir` and running in the repository root.

This violates the CLI demo requirement that bundled data work after installation and that the command print a usable output location.

### High — claim coverage is incomplete

Only two claims are registered. The live site and README make additional reliance claims with no `@claim:` entry, including:

- “Runs on your computer” and “nothing is saved.”
- General snapshot redaction and “It does not send snapshots to us.” The registered redaction test inspects only one hand-written sample, not collector output.
- “Both installers verify SHA-256,” “All commands can print JSON,” and the claimed platform release workflow.
- The $12 one-time Pro behavior and saved requirement/index capability.

The claims contract says an unlisted claim fails review. Several are also contradicted by the install, demo, and checkout evidence above.

### High — the brief's outcome benchmark is not demonstrated

The success measure requires differentiation in at least 12 of 15 device cases. The repository has one before/after pair, one requirements file, three unit tests, and no 15-case fixture or result set. The one sample does detect OS, connectivity, app-version, permission, and missing-component changes, but there is no evidence for the required 12/15 threshold.

### High — accessibility has a serious axe finding

Playwright 1.58.2 with `@axe-core/playwright` 4.10.2 found:

- `/demo` at 390×844: `scrollable-region-focusable` (serious, WCAG 2.1.1/2.1.3) on the horizontally scrollable `<pre>` containing the demo command. It has neither a focusable child nor its own keyboard focus.

Home, privacy, terms, and the rendered not-found view had no axe violations. The serious demo finding still fails the non-negotiable gate.

### High — every normal page load logs a failed-resource console error

The home page calls GitHub's missing latest-release API. Each render or route visit produces HTTP 404 and a Chromium console error. The catch/default UI does not prevent the failed-resource entry. The factory `verify-url.sh` and Lighthouse both detect it.

## Other defects

### Medium — route focus and touch targets fail the interaction baseline

- After keyboard activation of “Try it with sample data,” the URL became `/demo`, but focus was on `<body>`, not the new `<h1>`. `render()` calls `focus()` on an `<h1>` without `tabindex`, so the call cannot move focus.
- At 390px, the header links measure only 22px high, installer links 19px, and footer links 16px. The required touch target is 44×44px.
- The skip link itself is reachable, visible on focus, and correctly moves focus to `<main>`.

### Medium — deployment routing and cache policy are incomplete

- `/definitely-missing` returned HTTP 200 rather than a real 404, although it rendered the designed missing-page view.
- Hashed JS, CSS, and image assets all use `Cache-Control: public, must-revalidate, max-age=30`, not long-lived immutable caching.
- The header's Install link is `#install` on every route. On `/privacy` it navigates to `/privacy#install`, where no `#install` element exists.

### Medium — Rust quality checks fail

`cargo fmt --check` and strict Clippy fail as described in the gate table. The repository exposes no separate TypeScript typecheck or lint command.

## Functional evidence

The local release binary did perform the core algorithms on repository fixtures:

- `demo --out-dir <temp> --json`: exit 0; wrote valid `compat-report.json` and `compat-check.json`; reported 6 compatibility signals.
- `compare before-android-14.json after-android-15.json`: exit 0; categories were OS version, Connectivity (two), Missing component, App version, and Permission.
- Identical before/after boundary: exit 0; zero findings and “No material compatibility differences.”
- `check` against declared Fermata requirements: exit 0; Permission and Missing component findings.
- Empty JSON input: exit 1 with file-specific parse recovery text.
- Missing adb executable: exit 1 with platform-tools guidance.
- Present adb command with no device: exit 1 with USB-debugging/phone-consent guidance.
- Missing compare arguments: exit 2 with required arguments and usage.
- `cargo package --allow-dirty`: pass; 45 files, 2.8 MiB unpacked. Clean `cargo install --path` and `--version` passed before the demo failure.

A physical Android device was not available, so the real ADB collection path could not be validated. There is also no mock-ADB integration suite for it.

## Web, privacy, security, and performance evidence

- Desktop 1440×900 and mobile 390×844: no horizontal page overflow; primary demo action was within the initial mobile viewport.
- Demo and legal deep links loaded and set distinct titles. Every rendered route had `lang=en`, one `<h1>`, and a `<main>`.
- Keyboard: skip link, navigation, demo action, installer links, paid action, form, and footer were reachable; Enter activated the demo action; visible primary-action focus was a 3px cyan outline.
- Reduced motion: computed `scroll-behavior: auto`; animation and transition durations were reduced to `0.01ms`.
- No analytics, CDN fonts/scripts, or third-party media were observed. Automatic outbound traffic was limited to the GitHub latest-release request. Sociobot verification ran only after explicit form submission.
- The live site sends HSTS, CSP, `Referrer-Policy`, and `X-Content-Type-Options`. CSP matches the observed GitHub and Sociobot connections.
- Invalid license verification returned JSON with `valid:false`, `reason:"invalid"`, and `Cache-Control: no-store`.
- Rate-limit burst: requests 1–30 to the Sociobot verify endpoint returned 200; request 31 returned 429 with `Retry-After: 4`. **Pass.**
- No product sign-in exists, so Entra authority checks are not applicable. This is static/CLI software, so backend concurrency and persistence checks are not applicable. It is not a PWA and makes no web-offline claim, so service-worker checks are not applicable.
- Production sizes: JS 9,886 bytes raw / 4,192 gzip; CSS 5,703 / 1,935 gzip; hero WebP 56,660 bytes; HTML 1,209 bytes. These pass the budgets.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 96, SEO 100; FCP 0.8s, LCP 1.1s, TBT 80ms, CLS 0. Lighthouse's failed audit was browser console errors; it also suggested about 40 KiB image savings.
- OG image is 1200×630; apple-touch icon is 180×180; hero is 1200×800. Alt text is present.

## Commands used

```text
npm test -- --grep @claim:sample-report
npm test -- --grep @claim:redacted-export
npm ci
cargo fmt --check
cargo clippy --all-targets -- -D warnings
npm test
npm run build
cargo package --allow-dirty
cargo install --path /work/repo --root <temp> --locked
/opt/fleet/lib/verify-url.sh https://android-compat-scout.sociobot.in <evidence-dir>
Playwright 1.58.2 + @axe-core/playwright 4.10.2 route/mobile/keyboard checks
Lighthouse 13.0.1 mobile
```

## Release decision

**FAIL.** Do not ship or take payment. At minimum, create a valid multi-platform release and checksum manifest, make both documented install paths work, bundle the demo into the installed binary, persist its default output, remove or implement and register Pro, complete claim coverage, clear the serious axe and console errors, and add evidence for the 12/15 success threshold.
