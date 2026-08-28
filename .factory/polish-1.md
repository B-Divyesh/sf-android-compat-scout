# Polish 1 — review closure

Repair target: `0af7b52c43a2924e49357a03728198de89325053`; cumulative review source: `9ef198d73ad554c72e843e1e75de55813ba7e88b`. No earlier `.factory/review-*.md` or `.factory/polish-*.md` existed when the review was written.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Replaced the public checkout-only `cargo install --path .` landing instruction with the tested Unix installer and `compat-scout demo`. Kept `cargo install --path .` only under the README's explicitly local-development instruction. | Browser test `desktop landing has no console errors and detects a release asset link`; clean-clone `@claim:local-installed-release`; live `/` check. |
| F-1-2 | Registered the hero's “Runs on your computer” statement as `local-installed-release`. The test downloads, hashes, extracts, and runs the public Linux archive from an empty consumer folder. | `npm test -- --grep @claim:local-installed-release` in clean clone: pass. |
| F-1-3 | Registered “Release downloads include checksums” as `release-download-checksums` and hash-checks the public archive against public `SHA256SUMS`. | `npm test -- --grep @claim:release-download-checksums` in clean clone: pass. |
| F-1-4 | Registered the README release/package/tap/Scoop/winget/unsigned statements as `release-distribution`; test queries the GitHub release API, downloads the public formula and Scoop manifest, checks the repository winget manifest, and checks the unsigned workflow. | `npm test -- --grep @claim:release-distribution` in clean clone: pass. |
| F-1-5 | Added README to `demo-storage-isolation` locations and made `?demo=1` the direct documented demo path. | `npm test -- --grep @claim:demo-storage-isolation` in clean clone: pass; live `/?demo=1` storage/cookie check: empty before and after Reset/Start for real. |
| F-1-6 | Changed the terminal recording to the real `/tmp/compat-scout-demo-<timestamp>` output pattern and matching report path. Documented the same pattern in `.factory/demo.md` and copy audit. | `@claim:sample-report` plus `@claim:local-installed-release`: pass; live `/` terminal check. |
| F-1-7 | Added route metadata records and updates for title, canonical, description, Open Graph, and Twitter fields; rebuilt the standalone 404 with matching metadata and no inline-style CSP violation. | Browser test `each real route supplies its own canonical, description, and social metadata`: pass; live `/`, `/demo`, `/privacy`, `/terms` canonical and description check: pass; live unknown route: HTTP 404. |
| F-1-8 | Renamed the demo heading from “Compatibility signals” to “Changes to check.” | Live `/?demo=1` check and mobile screenshot. |
| F-1-9 | Replaced slogan-like hero, workflow, and footer copy with concrete product statements. Updated `.factory/copy-audit.md`; all audited sentences are within 22 words. | Copy audit and live `/` screenshot. |
| F-1-10 | Registered README CLI interface wording as `cli-interface-options`; test invokes root help and all four advertised command helps to prove `--json`. | `npm test -- --grep @claim:cli-interface-options` in clean clone: pass. |
| F-1-11 | Standardized the audience phrase to “owners of customized Android phones and vehicle dongles” on the landing page and README. | Live `/` check and README review. |

## Evidence bundle

- Clean clone: `/tmp/tmp.h3l48LDCFi/repo`, commit `14028e659bb1a79f2a7caafdd2cb7ba9e2861b32`; `npm ci`, `npm test`, `npm run typecheck`, `npm run test:browser`, `npm run build`, `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, `cargo package --allow-dirty`, and every exact claim command passed.
- Production deployment: `0134216f-2b51-4b27-aa3b-0318a653d09c` to `https://android-compat-scout.sociobot.in`.
- Cold production screenshots: `/tmp/tmp.xG5SDtAQIV/screenshot-desktop.png` and `/tmp/tmp.xG5SDtAQIV/screenshot-mobile.png`; `verify-url.sh` recorded 200, 2056 ms, zero console errors, `lang=en`, one h1, main landmark, and no missing alt text.
- Live route/demo/Axe check: `/`, `/demo`, `/privacy`, `/terms` all had their expected canonical and description, `?demo=1` stayed storage/cookie-free through reset/exit, no third-party requests or console errors, Axe serious/critical count was zero, and `/not-a-real-page` returned 404.
- Live mobile Lighthouse: Performance 100, Accessibility 100, SEO 100, LCP 1055 ms, CLS 0 (`/tmp/tmp.ogFmF4f35E.json`).
