# Polish 4 — cumulative review closure

Repair target: `056154783698b109a254f605111c2c3dd8cda65a`. Review source: `6d670586c4bd5629799bfe522320dec084f7f448`, plus every earlier `.factory/review-*.md` and `.factory/polish-*.md`.

Production evidence:

- Landing desktop: `/tmp/android-compat-scout-polish-4-evidence/live/screenshot-desktop.png`
- Landing mobile: `/tmp/android-compat-scout-polish-4-evidence/live/screenshot-mobile.png`
- Direct demo: `/tmp/android-compat-scout-polish-4-evidence/live/demo-mobile.png`
- Privacy: `/tmp/android-compat-scout-polish-4-evidence/live/privacy-desktop.png`
- Designed 404: `/tmp/android-compat-scout-polish-4-evidence/live/not-found-desktop.png`

All live URLs below were opened in cold contexts at `https://android-compat-scout.sociobot.in` after deployment `1f4a0178-4a88-49e7-b07c-c12926359f1c`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | The public install panel shows the tested Unix installer followed by `compat-scout demo`; checkout installation remains explicitly development-only. | Browser `desktop landing has no console errors and offers explicit release choices`; live `/` screenshot. |
| F-1-2 | The visitor wording now says downloads are available, not that every named platform binary has been run locally. | `@claim:release-distribution`; live `/`. |
| F-1-3 | Public release assets are checksum-verified against `SHA256SUMS`. | `@claim:release-download-checksums`; live `/`. |
| F-1-4 | The release matrix, tap, Scoop file, and complete validated Winget set remain documented and asserted. | `@claim:release-distribution`; live `/` and `README.md`. |
| F-1-5 | `?demo=1` and `/demo` remain isolated visual sample paths with persistent banner, Reset demo, and Start for real. | `@claim:demo-storage-isolation`; live `/?demo=1`, demo screenshot. |
| F-1-6 | The terminal, documentation, and CLI use `compat-scout-demo-<timestamp>` consistently. | `@claim:installed-demo`, `@claim:sample-report`; live `/`. |
| F-1-7 | Every route keeps its own title, description, canonical, Open Graph, and Twitter metadata. | Browser `each real route supplies its own canonical, description, and social metadata`; live `/`, `/demo`, `/privacy`, `/terms`. |
| F-1-8 | The demo report remains headed “Changes to check,” without unexplained jargon. | Browser `mobile demo is keyboard-focusable and has no serious axe findings`; live `/?demo=1`. |
| F-1-9 | Slogans and numbered mood labels remain removed; the copy audit is current and concrete. | `.factory/copy-audit.md`; landing screenshot. |
| F-1-10 | Public root and subcommand help plus `--json` behavior remain tested. | `@claim:cli-interface-options`; `README.md`. |
| F-1-11 | Landing and README use the same customized-Android-phone and vehicle-dongle audience phrase. | `.factory/copy-audit.md`; live `/`. |
| F-2-1 | Phone visitors get a computer-install note; desktop visitors choose an explicit platform and processor. | Browser `Android, iOS, macOS, and Linux visitors never receive a guessed binary`; live `/`. |
| F-2-2 | The actual PowerShell installer is exercised with matching and mismatching downloads. | `@claim:checksum-windows-installer`; live `/install.ps1`. |
| F-2-3 | Snapshot, requirements, comparison, and JSON results remain individually documented and behavior-tested. | `@claim:snapshot-json`, `@claim:requirements-check`, `@claim:compare-json`; live `/`. |
| F-2-4 | The bundled report remains exactly six changes and uses “changes” consistently. | `@claim:sample-six-changes`; live `/` and `/?demo=1`. |
| F-2-5 | The home and social title remains “Android Compat Scout — Find Android setup changes.” | Browser metadata test; live `/`. |
| F-2-6 | Decorative numbered/mood labels remain removed. | `.factory/copy-audit.md`; landing and demo screenshots. |
| F-2-7 | The retained snapshot disclosure uses exact fields and a single description. | `@claim:retained-snapshot-fields`; live `/privacy`. |
| F-2-8 | The README section remains “Capture and compare snapshots.” | `.factory/copy-audit.md`; `README.md`. |
| F-2-9 | README benchmark language remains plain: test data and automated tests. | `.factory/copy-audit.md`; `README.md`. |
| F-2-10 | The README demo-file link says what the file contains. | `.factory/copy-audit.md`; `README.md`. |
| F-3-1 | The headline and README describe setup changes, not causal diagnosis. | Browser first-screen test; live `/`. |
| F-3-2 | Every route, including an open chooser, stays within a 390 px viewport at 100% and 200% text. | Browser `every route reflows at 390px and 200% text without page-level horizontal scrolling`; live mobile screenshot. |
| F-3-3 | Every visible persistent link, button, and summary has a 44 px target. | Browser `demo has no third-party requests and every persistent control meets the touch-target minimum`; live mobile screenshot. |
| F-3-4 | The first screen keeps the free, offline, and redaction facts. | `@claim:mit-license`, `@claim:offline-bundled-demo`, `@claim:redacted-export`; live `/`. |
| F-3-5 | Concrete workflow and privacy language remains in place. | `.factory/copy-audit.md`; live `/`. |
| F-4-1 | Reduced desktop headline scale, widened the copy column, removed the oversized hero minimum, and added a 1440×900 bottom-edge assertion for the action, result sentence, and every fact. | Browser `desktop first screen keeps the sample action, result, and all facts in view`; live `/`, desktop screenshot. |
| F-4-2 | The header Install link now has explicit anchor navigation that renders home, scrolls to the install section, announces it, and focuses its heading from home or any subroute. | Browser `header Install reaches and focuses the install heading from home and a subroute`; live `/#install` and `/privacy → /#install`. |
| F-4-3 | Route navigation saves scroll coordinates into history entries; Back/Forward restores them after render while retaining destination-heading focus. | Browser `Back and Forward restore route focus and saved scroll positions`; live `/ → /privacy → Back → Forward`. |
| F-4-4 | Replaced the misleading “Sort changes by what to check” with “Sample report categories.” | `.factory/copy-audit.md`; live `/`, desktop and mobile screenshots. |
| F-4-5 | Standardized the visitor-facing report category as “connectivity” and updated the sample-report claim. | `@claim:sample-report`; `.factory/claims.json`, `README.md`, and live `/`. |

## Clean-clone claims and quality gates

Fresh clone: `/tmp/android-compat-scout-polish-4.8BpT0o/repo` at `056154783698b109a254f605111c2c3dd8cda65a`.

- `npm ci` completed with zero vulnerabilities.
- I ran every exact `test` command in all 19 `.factory/claims.json` entries: all passed.
- Aggregate `npm test -- --grep @claim` passed 18 Vitest claim tests and the Rust public-CLI benchmark test.
- `npm run typecheck`, `npm run test:browser` (12/12), `npm run build`, `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, and `cargo package --allow-dirty` passed.
- The production browser suite passed 12/12 with `PLAYWRIGHT_BASE_URL=https://android-compat-scout.sociobot.in npm run test:browser`.
- `verify-url.sh` passed locally and live. The live run recorded HTTP 200, 636 ms load time, no console errors, `lang=en`, one h1, one main landmark, no missing image alt text, and no unlabeled buttons.
- Live mobile Lighthouse: performance 100, accessibility 100, SEO 100, LCP 1061 ms, CLS 0. Report: `/tmp/android-compat-scout-polish-4-evidence/live/lighthouse-mobile.json`.
- Live `/`, `/demo`, `/privacy`, `/terms`, `/robots.txt`, `/sitemap.xml`, `/install.sh`, and `/install.ps1` returned 200. A cold `/not-a-real-page` returned 404. Response headers include CSP with response-header `frame-ancestors`, `X-Content-Type-Options: nosniff`, and strict referrer policy.

Every cumulative finding is closed. No stubs, TODOs, or deferred minor items remain.
