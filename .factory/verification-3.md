# Independent product verification 3 — PASS

Verified 2026-08-28 UTC against candidate `0af7b52c43a2924e49357a03728198de89325053` and the live product at `https://android-compat-scout.sociobot.in`.

## Verdict

**PASS — accept this candidate.** The CLI, installers, one-click demo, release assets, static deployment, privacy behaviour, accessibility, and quality gates meet the researched brief and the factory acceptance contract. No release-blocking defects were found.

## First-read test

Cold on the live home page, the first screen says **“Find what broke your Android setup.”** It says this is for **custom-phone and dongle owners after an update**, and the first action is **“Try it with sample data”** with the adjacent plain explanation **“See a private upgrade report first.”** One click opens `/demo`, immediately shows a representative report, and displays the persistent **“Demo — sample data, nothing is saved”** banner with Reset demo and Start for real. This passes the plain-words and one-click-demo gates on desktop and 390px mobile.

## Claims — clean checkout

The nominated checkout was clean at the nominated SHA. `npm ci` completed with 0 vulnerabilities. Every exact command from `.factory/claims.json` passed:

| Claim | Exact command | Result |
| --- | --- | --- |
| `sample-report` | `npm test -- --grep @claim:sample-report` | PASS |
| `redacted-export` | `npm test -- --grep @claim:redacted-export` | PASS |
| `installed-demo` | `npm test -- --grep @claim:installed-demo` | PASS |
| `checksum-installers` | `npm test -- --grep @claim:checksum-installers` | PASS |
| `benchmark-12-of-15` | `npm test -- --grep @claim:benchmark-12-of-15` | PASS |
| `read-only-diagnosis` | `npm test -- --grep @claim:read-only-diagnosis` | PASS |
| `demo-storage-isolation` | `npm test -- --grep @claim:demo-storage-isolation` | PASS |

The tagged tests exercise the declared sandboxes: bundled demo output, fake-ADB serialization redaction, installed consumer execution, good/bad Unix-installer checksums, 15 shipped public-CLI fixture cases, read-only ADB allow-list, and browser storage isolation.

## Local quality and CLI evidence

All passed from this checkout:

```text
npm test
npm run typecheck
cargo fmt --check
cargo clippy --all-targets -- -D warnings
npm run build
npm run test:browser
cargo package --allow-dirty
```

`npm run build` produced `dist/site`. The production bundle is 8.00 KB JavaScript raw / 3.37 KB gzip, 5.99 KB CSS raw / 1.97 KB gzip, and a 56.66 KB WebP hero.

The downloaded public Linux x64 archive was SHA-256 `c4d2875a850ed6f64387259ddde3f2ca7687a0e967878b854d85eb0706156e4c`, matching the release `SHA256SUMS`. Its extracted `compat-scout 0.1.2` binary was exercised outside the repository:

- `demo --out-dir <temp> --json` wrote both reports and found six compatibility signals plus two prerequisite issues.
- `compare` on the bundled Android 14→15 samples found six signals across OS, connectivity, missing component, app version, and permission categories.
- `check` found two prerequisite issues; comparing a snapshot with itself returned zero findings.
- Invalid JSON and a missing `adb` executable both exited non-zero with actionable error text.

The public `v0.1.2` release has Linux x64/arm64, macOS x64/arm64 archives and unsigned packages, Windows zip, `.deb`, `.rpm`, checksums, `latest.json`, Scoop/winget metadata, and a public `B-Divyesh/homebrew-android-compat-scout` tap. All live-page links checked returned 200; the deliberately unknown route returned the designed page with HTTP 404.

## Live deployment, privacy, accessibility, and performance

- Fresh candidate build JS, CSS, and hero assets hash-identically to the live assets: `7f1e6643…35aa3`, `eacbedd0…b811`, and `ebd6b1b2…abd4` respectively. The candidate’s post-release CLI changes are test-only (`#[cfg(test)]`) and documentation/fixture work; runtime CLI behaviour was independently exercised from the public installer.
- The factory `verify-url.sh` passed: HTTP 200, 2146 ms load observation, title, `lang=en`, exactly one h1, main landmark, zero missing image alt attributes, zero unlabeled buttons, and no console errors.
- Independent Playwright runs on desktop and 390×844 mobile found no console or page errors. Axe 4.10.2 found zero serious or critical issues on the live demo. Keyboard Enter works for sample/demo navigation and Start for real; the destination h1 receives focus. Reset demo receives a visible cyan 3px focus outline. All sampled navigation, install, and footer targets were at least 44px tall. Reduced motion computes near-zero transition and animation durations; mobile has no horizontal overflow.
- The whole live demo flow made only same-origin document, JS, CSS, and image requests. Local storage, session storage, IndexedDB, Cache Storage, and cookies were empty before/after Reset demo and after Start for real. No analytics, third-party fonts/scripts, API calls, sign-in, payment, or product server endpoint exists.
- Response headers include HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a self-only CSP. Hashed assets use `Cache-Control: public, max-age=31536000, immutable`; the HTML has the expected short revalidation cache policy.
- Live Lighthouse mobile retry: Performance 96, Accessibility 100, Best Practices 100, SEO 100; LCP 1.3 s, CLS 0, TBT 220 ms.

No PWA/service worker, backend endpoint, rate-limit, sign-in, Entra, or paid-unlock checks apply to this static local-first CLI landing page.

## Defects by severity

- **Critical:** none.
- **High:** none.
- **Medium:** none.
- **Low / known test limitation:** no physical Android device was available, so real USB-debugging authorization and OEM-specific `adb` output were not exercised. Fake-ADB collection and redaction coverage passed; this is a recommended post-release device smoke test, not a release blocker.
