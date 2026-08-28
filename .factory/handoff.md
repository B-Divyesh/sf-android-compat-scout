# Polish 1 repair handoff — PASS

## Completed repair

Repaired every finding in `.factory/review-1.md` for release candidate `0af7b52c43a2924e49357a03728198de89325053`. The repair commit is `14028e659bb1a79f2a7caafdd2cb7ba9e2861b32`, pushed to `origin/main`.

- The first screen now gives a runnable public installer command, not a source-checkout command. Its primary action opens isolated `/?demo=1`; demo mode has the persistent banner, Reset demo, and Start for real, while storing no browser data.
- Added all required public-claim contracts and executable tests: downloaded release demo, public checksums, distribution assets/tap/Scoop/winget/unsigned workflow, CLI help/`--json`, and README demo location coverage.
- Corrected the sample terminal's timestamped output path, jargon, audience terminology, slogan copy, and catalog description. `.factory/copy-audit.md` records the landing audit.
- Added per-route metadata updates and a fully semantic, CSP-safe static 404 page. Every real page has a distinct title, canonical URL, description, and social metadata.
- Kept the blueprint drafting-sheet visual system and static `dist/site` deployment / CLI installer artifact class.

Detailed finding-by-finding evidence is in `.factory/polish-1.md`.

## Verification

From a separate clean clone at `/tmp/tmp.h3l48LDCFi/repo` of the repair commit, all passed:

```sh
npm ci
npm test
npm run typecheck
npm run test:browser
npm run build
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo package --allow-dirty
```

Every exact command in `.factory/claims.json` passed from that clone: `sample-report`, `redacted-export`, `installed-demo`, `local-installed-release`, `checksum-installers`, `release-download-checksums`, `release-distribution`, `benchmark-12-of-15`, `read-only-diagnosis`, `demo-storage-isolation`, and `cli-interface-options`.

Deployed via the static work-order configuration as deployment `0134216f-2b51-4b27-aa3b-0318a653d09c`. Cold live verification at `https://android-compat-scout.sociobot.in` passed `verify-url.sh` (HTTP 200, 2056 ms, zero console errors, `lang=en`, one h1, main, and no missing alt text). Live mobile route/demo checks found zero third-party requests, zero serious/critical Axe findings, empty storage/cookies before and after demo reset/exit, correct route metadata, and HTTP 404 for an unknown path. Lighthouse mobile: Performance 100, Accessibility 100, SEO 100, LCP 1055 ms, CLS 0.

## Known gap

There are no unresolved review findings. A physical Android USB/OEM-output smoke test still requires hardware; fake-ADB redaction and command-sequencing coverage pass in this environment.

---

# Review 1 handoff — FAIL

Reviewed the live site and commit `38965241cc3f2b85b8396a71d7b6622305a7f6a5` without changing product code. Wrote `.factory/review-1.md` and committed this review documentation only.

Verified from a fresh clone: all seven exact claim commands, `npm run test:browser`, and `npm run build` passed. Fresh 390px and desktop Playwright checks confirmed the cold first-read answer, one-click sample flow, empty demo storage/cookies/caches, same-origin-only requests, working reset/start-for-real, real 404, links, route focus, and no serious/critical Axe findings.

The review verdict is **FAIL**. The blocking issue is that the public landing page instructs visitors to run `cargo install --path .`, which requires a source checkout. Remaining findings cover unregistered release/local-runtime claims, an inaccurate displayed demo output path, incomplete dynamic canonical/description metadata, and small copy issues. See `.factory/review-1.md` for exact quotes and fixes. Next step: repair every listed finding, then repeat the full review rather than a diff-only check.

---

# Independent verification 3 handoff — PASS

Verified 2026-08-28 UTC against candidate `0af7b52c43a2924e49357a03728198de89325053` and `https://android-compat-scout.sociobot.in`.

**PASS — accept this candidate.** Every declared claim command, full test/lint/typecheck/build/package suite, release-archive checksum, installed CLI demo, live privacy/accessibility/browser checks, and mobile Lighthouse audit passed. The live JS/CSS/hero assets hash-identically to a fresh candidate build; the public CLI release was exercised outside the checkout. Exact evidence and commands are in `.factory/verification-3.md`.

No critical, high, or medium defects remain. The only known limitation is that no physical Android device was available for a live USB/OEM-output smoke test; fake-ADB coverage passed. Historical verification and repair records follow.

---

# Independent verification 2 handoff — historical FAIL (repaired)

Verified on 2026-08-28 UTC against commit `4db26c809f0167fcb17ac98921939205064922f2` and `https://android-compat-scout.sociobot.in`.

Do **not** release/accept this candidate. Fresh-clone claims, tests, build, formatting/lint, package, installed CLI demo, public Linux release checksum/demo, live static-byte match, Playwright, Axe, and `verify-url.sh` passed. The candidate still fails the factory acceptance contract because the live “Demo — sample data, nothing is saved” assurance has no claim/storage-isolation proof; `B-Divyesh/homebrew-android-compat-scout` does not exist; the 15-case benchmark is synthetic private-function coverage rather than 15 representative CLI fixtures; and unknown deployed URLs return HTTP 200 rather than 404.

Exact evidence, commands, passing scope, and repair requirements are in `.factory/verification-2.md`.

---

# Android Compat Scout repair handoff

## Repair scope

Repaired every release-blocking finding from independent verification commit `ac26f1698966a252f1369321bdfe3984537f00d6` against candidate `1de70ef9ae0f3aef2b12e61ca8112aa4c0ad5ed6`.

- The CLI now embeds its sample snapshots and requirements. `compat-scout demo --json` works from an installed binary in an empty consumer directory and creates a persistent reported output directory.
- Added an executable 15-case benchmark fixture. The Rust regression test requires the brief’s 12/15 threshold and currently detects 15/15.
- The collector now has a fake-ADB regression test confirming sensitive serial, build-detail, Wi-Fi name, and MAC values do not enter the serialized snapshot.
- Replaced the unparsable release workflow with a tagged, multi-platform workflow for Linux x64/arm64, macOS x64/arm64, and Windows. It produces archives, deb, rpm, macOS pkg files, checksums, `latest.json`, a Scoop manifest, and a Homebrew formula as release assets.
- Removed unavailable $12 Pro checkout, license handling, and promised Pro capability. No billing or token request remains in the static site.
- Expanded `.factory/claims.json` to six test-backed claims; added exact consumer-demo, checksum-installer, benchmark, and read-only checks.
- Fixed mobile demo keyboard access by making command output focusable, fixed route-heading focus, increased link touch targets to 44px, and removed the automatic missing-GitHub-release fetch that logged a 404 console error.
- Added Playwright desktop/mobile/keyboard/privacy regression coverage with Axe serious/critical assertions.
- Added strict TypeScript checking, passed Rust formatting and Clippy, and configured immutable caching for hashed deployment assets.

## Verified locally

Run from a clean install:

```sh
npm ci
npm test
npm run typecheck
npm run test:browser
npm run build
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo package --allow-dirty
```

All commands passed on 2026-08-28 UTC. `npm run test:browser` uses Playwright 1.58.2 at desktop and 390×844 mobile, checks no console errors, keyboard route focus, 44px link targets, local-only demo requests, and Axe serious/critical issues. Production output is `dist/site`; the built JS is 8.00 KB raw / 3.37 KB gzip, CSS 5.99 KB raw / 1.97 KB gzip, and hero WebP 56.66 KB.

The exact claim commands in `.factory/claims.json` all passed after `npm ci`. A clean `cargo install --path /work/repo --root <temp> --locked`, followed by `compat-scout demo --json` from a separate empty directory, passed and produced both report files.

## Release and deployment

Tag `v0.1.2` completed successfully in GitHub Actions run `33198625222` on 2026-08-28 UTC. The public release contains 15 assets: Linux x64/arm64 archives, macOS x64/arm64 archives and unsigned pkg files, a Windows zip, `.deb`, `.rpm`, `SHA256SUMS`, `latest.json`, a Scoop manifest, and a Homebrew formula. `latest.json` names a per-platform direct download URL. The x64 Linux archive checksum is `c4d2875a850ed6f64387259ddde3f2ca7687a0e967878b854d85eb0706156e4c`, verified against the public `SHA256SUMS` release asset. The repository’s Scoop and complete winget 0.1.2 manifest set use the released Windows zip checksum.

The static deployment artifact remains `dist/site`, preserving the original `cli-installers` plus static-site deployment class. Main was pushed with the repaired static artifact and deployment configuration; no infrastructure or DNS was changed from this repository.

Deployment completed through the factory static work-order helper on 2026-08-28 UTC: deployment ID `1b2d031f-3487-44d1-87b5-6588f3f42ae3` to `sf-android-compat-scout` (Central US). `https://android-compat-scout.sociobot.in` now serves `index-9ku_4vao.js`, the repaired bundle. Post-deploy `/opt/fleet/lib/verify-url.sh` passed: HTTP 200, 823 ms load measurement, zero console errors, one h1, `lang=en`, a main landmark, and no missing image alt text.

## Known limits

No physical Android device was available in this worker. The ADB collector is covered with a fake executable for command sequencing and redaction; live USB authorization and OEM-specific output still need device smoke testing after release.

---

# Verification-2 repair handoff

## Scope repaired

This repair addresses every finding recorded in `.factory/verification-2.md`
for candidate `4db26c809f0167fcb17ac98921939205064922f2`.

- Added the missing `demo-storage-isolation` claim. Its Playwright test starts
  at `/demo`, confirms the banner, runs Reset demo, chooses Start for real,
  and asserts that both localStorage and sessionStorage remain empty throughout.
  `.factory/demo.md` now accurately documents that the browser demo uses no
  storage namespace and never reads or writes real data.
- Created `B-Divyesh/homebrew-android-compat-scout` as a public tap and
  published `Formula/android-compat-scout.rb` for release `v0.1.2`.
  The README now gives the exact `brew install
  B-Divyesh/android-compat-scout/android-compat-scout` command.
- Replaced the synthetic private-function benchmark with 15 shipped, redacted
  fixture cases under `examples/benchmark/`. The public compiled binary runs
  ten `compare` cases and five `check` cases in `tests/cli_benchmark.rs`; it
  detected all 15 expected categories, exceeding the required 12/15.
- Made the tagged redaction claim run the fake ADB collector and inspect its
  serialized output; made the installed-demo claim use `cargo install` and an
  empty consumer directory; made the installer claim execute the Unix
  installer against both matching and deliberately bad checksums before
  checking the target path.
- Removed the broad static-site navigation fallback. `/demo`, `/privacy`, and
  `/terms` explicitly rewrite to the SPA shell; unknown paths now flow through
  the configured 404 response override with status 404. A configuration
  regression test asserts this exact routing policy.

## Verification evidence — 2026-08-28 UTC

Fresh clean install: `npm ci` completed with 0 vulnerabilities. The following
all passed:

```text
npm test
npm run typecheck
npm run test:browser
npm run build
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo package --allow-dirty
```

Every command named by `.factory/claims.json` also passed exactly:
`sample-report`, `redacted-export`, `installed-demo`, `checksum-installers`,
`benchmark-12-of-15`, `read-only-diagnosis`, and `demo-storage-isolation`.
The browser suite covers desktop plus 390×844 mobile, keyboard route focus,
demo storage isolation, local-only demo requests, touch targets, and Axe
serious/critical findings (zero). Production build remains 8.00 KB raw / 3.37
KB gzip JavaScript, 5.99 KB raw / 1.97 KB gzip CSS, and 56.66 KB hero WebP.

## Deployment and remaining limit

The deployment class remains static `dist/site` plus the existing CLI release;
no infra, DNS, billing, or product behavior was changed. The factory static
work-order deployment helper uploaded `dist/site` to the existing Central US
`sf-android-compat-scout` static app on 2026-08-28 UTC. Live verification then
passed: `/definitely-missing` returns HTTP 404, `/demo` returns 200,
`verify-url.sh` reported HTTP 200 in 2363 ms with zero console errors, and
live 390px Axe found zero serious/critical issues. The live demo made only
same-origin requests and left localStorage and sessionStorage empty. Live
Lighthouse desktop scores were Performance 100, Accessibility 100, SEO 92,
with 326 ms LCP and CLS 0.

No physical Android device was available. Live USB authorization and OEM
output remain the only known manual smoke test.
