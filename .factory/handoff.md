# Android Compat Scout — review 3 handoff

## Outcome

FAIL. `.factory/review-3.md` records eight findings: four blocking, one high, two medium, and one minor. Product code was not modified.

The blocking issues are an unsupported causal headline, an under-tested cross-platform runtime statement, an invalid/incomplete winget manifest set described as submission-ready, and an unregistered sensitive-report-content claim. The live landing page also overflows to 532 px at a 390 px viewport, and three persistent mobile controls are below 44 px.

## Verification performed

- Reviewed production at 390×844, with an Android user agent, and at 1440×900.
- Entered `/?demo=1` in one click, changed and reset the sample, exited, and confirmed seeded localStorage, sessionStorage, IndexedDB, Cache Storage, and cookies were unchanged.
- Confirmed the full demo request log was same-origin, with no downloads or console errors.
- Ran every exact command in `.factory/claims.json` from clean clone `/tmp/android-compat-review3.ipaSQq/repo` at `49ad29d84d33f7cf147ad3514d4ab74150c4d9a2`: 16/16 returned zero.
- Ran the production Playwright suite: 8/8 passed.
- Ran `npm run typecheck`, `npm run build`, `cargo fmt --check`, and `cargo clippy --all-targets -- -D warnings`: all passed; `dist/site` was produced.
- Ran `/opt/fleet/lib/verify-url.sh`: HTTP 200, 600 ms observed load, no console errors, valid title/lang/main/h1/alt/button basics.
- Crawled every rendered site link and every README link: no dead link found. Confirmed an unknown route returns the designed page with HTTP 404.
- Verified SPA route focus and Back restoration. Axe reported zero automated violations on all tested routes at mobile and desktop sizes.

## Evidence

- Review: `.factory/review-3.md`
- Cold screenshots: `/tmp/review3-390.png`, `/tmp/review3-mobile-cold.png`, `/tmp/review3-desktop-cold.png`
- Verify output: `/tmp/android-compat-verify3.haiP1I/verify.json`
- Clean clone: `/tmp/android-compat-review3.ipaSQq/repo`

## Next steps

Address findings in severity order and rerun the entire review, not only changed checks. In particular, add horizontal-overflow and exhaustive touch-target assertions because the current browser suite misses both defects. Validate winget with the official schema/tool rather than string matching, and make each public claim match an observable tagged test exactly.
