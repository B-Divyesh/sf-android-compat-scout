# Independent product verification 2 — FAIL

Verified 2026-08-28 UTC against candidate `4db26c809f0167fcb17ac98921939205064922f2` and `https://android-compat-scout.sociobot.in`.

## Verdict

**FAIL — do not accept this candidate yet.** The core CLI, sample demo, web deployment, published Linux archive, quality checks, accessibility scan, and privacy request log pass. The candidate nevertheless misses mandatory acceptance-contract requirements: visitor-facing privacy/demo copy has no matching claim test, the claim tests do not exercise several declared sandboxes or observable promises, the required Homebrew tap does not exist, and the claimed 15-device success measure is not demonstrated by real fixture snapshots.

## First-read result

Cold at 1440×900 and 390×844, the live page plainly says it **finds what broke an Android setup**. It says it is for **custom-phone and dongle owners after an update**. The obvious first click is **“Try it with sample data”**, with the adjacent explanation “See a private upgrade report first.” One click opens `/demo`, immediately displays representative OS/permission/missing-component findings, and shows the persistent “Demo — sample data, nothing is saved” banner with Reset demo and Start for real.

This satisfies the explicit first-read and one-click-demo gate.

## Mandatory claims — fresh clone

I cloned the candidate into `/tmp/android-compat-scout-verify.ZrOqV7`, confirmed its SHA was the nominated SHA, ran `npm ci` (0 vulnerabilities), then ran every exact command in `.factory/claims.json`.

| Claim | Exact command result |
| --- | --- |
| `sample-report` | PASS — `npm test -- --grep @claim:sample-report` |
| `redacted-export` | PASS — `npm test -- --grep @claim:redacted-export` |
| `installed-demo` | PASS — `npm test -- --grep @claim:installed-demo` |
| `checksum-installers` | PASS — `npm test -- --grep @claim:checksum-installers` |
| `benchmark-12-of-15` | PASS — `npm test -- --grep @claim:benchmark-12-of-15` |
| `read-only-diagnosis` | PASS — `npm test -- --grep @claim:read-only-diagnosis` |

All six commands ran six Rust tests plus the one matching Vitest test successfully. There was no missing manifest or failing declared claim test.

## Release-blocking findings

### High — the demo privacy assurance is an unlisted, unproved claim

The live demo persistently states **“Demo — sample data, nothing is saved.”** No entry in `.factory/claims.json` claims or tests that promise. The only browser privacy test records that requests remain same-origin; it does not assert storage isolation/no persistence. The `demo-sandbox` and `claims` contracts require the sample-data/nothing-saved promise to be testable from a clean demo entry point, and explicitly make unlisted reliance claims a review failure.

Add a distinct claim and test from `/demo` which exercises Reset/Start-for-real and asserts that demo storage uses only the documented `demo:` namespace (or, here, that it is empty), and that no real-data storage is read or written.

### High — required Homebrew distribution does not exist

The installer contract requires a tap at `B-Divyesh/homebrew-android-compat-scout` and documentation for `brew install B-Divyesh/android-compat-scout/android-compat-scout`. GitHub API returned **404** for that required repository; the owner’s public repository list contains no such tap. A formula is attached to the GitHub Release, but it is not installable via the required one-step tap and no Homebrew installation instruction exists in the README.

The release does contain the formula asset, a valid Scoop manifest, and three complete winget manifest files, but those do not replace the missing tap.

### High — the 15-device success measure is not demonstrated

`examples/compatibility-benchmark.json` contains case labels only. The test creates all 15 changes by mutating one in-memory demo snapshot and calls private Rust functions directly; it does not ship 15 before/after snapshots nor run the public CLI over them. Therefore the evidence does not establish the researched brief’s success measure: differentiation of at least 12 cases from a 15-device test set.

Ship representative, redacted before/after inputs for the 15 cases and one integration test that invokes the public `compare`/`check` commands and asserts the expected classification for at least 12.

### Medium — claim tests do not match their declared sandbox or observable behaviour

The claimed tests pass, but three do not meet the claims-test contract’s required proof level:

- `@claim:redacted-export` scans bundled sample JSON; its declared sandbox says fake ADB collection and serialized collector output. The fake-ADB Rust unit test does exist, but it is not the tagged claim assertion.
- `@claim:installed-demo` uses `cargo run --manifest-path` rather than an installed/packed consumer binary, despite the declared installed-command sandbox.
- `@claim:checksum-installers` searches script text. It does not run either installer against a good and bad checksum to prove that installation is prevented before PATH placement.

The full `npm test` preamble happens to run the useful Rust unit tests, but the contract requires each tagged claim test itself to assert the observable claim in its documented sandbox.

### Medium — unknown URLs return HTTP 200 rather than a real 404

`GET /definitely-missing` returns 200 with the SPA index, despite `staticwebapp.config.json` declaring a 404 response override. The browser renders the designed not-found view, but the HTTP status violates the required real 404 route and risks search/indexing errors. `/404.html` itself also returns 200, as a static file normally does.

## Passing functional evidence

- Fresh clone: `npm test`, `npm run typecheck`, `npm run test:browser`, `npm run build`, `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, and `cargo package --allow-dirty` all passed. `npm run build` created `dist/site`.
- Installed consumer: `cargo install --path . --root <temp> --locked` succeeded. From a separate empty directory, `compat-scout demo --json` created persistent `compat-report.json` and `compat-check.json`, reporting 6 comparison findings and 2 requirement findings.
- Public release: GitHub release `v0.1.2` exists with Linux x64/arm64, macOS x64/arm64 archives and unsigned packages, a Windows zip, `.deb`, `.rpm`, `SHA256SUMS`, `latest.json`, Scoop and formula assets. The downloaded x64 Linux archive SHA-256 was `c4d2875a850ed6f64387259ddde3f2ca7687a0e967878b854d85eb0706156e4c`, matching `SHA256SUMS`; its extracted binary reports `compat-scout 0.1.2` and its bundled demo succeeds from an empty directory.
- Core paths: sample comparison reports OS version, USB/Wi-Fi connectivity, missing component, app version, and permission changes; identical snapshots report zero findings; requirements report the expected permission and missing-component findings. Missing input, missing `adb`, and missing required arguments exit nonzero with actionable error text.
- No physical Android device was available. The real USB authorization/OEM-output path therefore remains untested; fake-ADB coverage passes.

## Live deployment, privacy, accessibility, and performance

- Live `index.html`, JS, CSS, hero WebP, `install.sh`, `install.ps1`, `robots.txt`, and `sitemap.xml` have byte-identical SHA-256 values to the candidate’s fresh `dist/site` build. The release tag `v0.1.2` is `f522e456007ed3b87fa1e7eb6a860e79fcfc0889`; candidate differences are only handoff/Scoop/winget metadata, not product source.
- `/`, `/demo`, `/privacy`, and `/terms` return 200 and render their intended route. `verify-url.sh` passed: HTTP 200, 751 ms load, zero console errors, `lang=en`, one h1, main landmark, title, and no missing image alt text.
- Independent Playwright desktop and 390px-mobile runs found no console or page errors. The cold home/demo flow made only same-origin document, JS, CSS, and hero-image requests. No analytics, third-party font/script/media, or runtime external connection was observed. The static CSP uses `connect-src 'self'`; HSTS, `Referrer-Policy: strict-origin-when-cross-origin`, and `X-Content-Type-Options: nosniff` are present.
- Axe (`@axe-core/playwright` 4.10.2) found **zero serious or critical violations** on desktop and mobile `/demo`. Keyboard Enter on the sample link changes route and focuses the new h1. The skip link works, focus is a visible 3px cyan outline, all sampled mobile navigation/install/footer links are at least 44px high, and reduced motion computes to near-zero animation/transition durations.
- Build sizes: JS 8.00 KB raw / 3.37 KB gzip; CSS 5.99 KB raw / 1.97 KB gzip; hero WebP 56.66 KB. Hashed assets return `Cache-Control: public, max-age=31536000, immutable`.
- This is a static CLI landing page with no product server endpoint, sign-in, product-unlock call, service worker/PWA, or runtime API. Rate-limit, Entra, backend concurrency, and offline-reload checks are not applicable.

## Release decision

**FAIL.** Repair the claim contract and storage proof, publish the required Homebrew tap and documented command, replace the synthetic benchmark with CLI-level representative fixture evidence, and make unknown live URLs return 404. Re-run independent verification afterwards.
