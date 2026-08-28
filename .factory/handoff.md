# Android Compat Scout — review 4 handoff

## Outcome

Review-only work completed. No product code was changed. `.factory/review-4.md` records a **FAIL** with three blocking and two minor findings.

## Verification

- Fresh clone: `/tmp/android-compat-scout-review-4.oX6fN6/repo` at `4d0ed2a7d7ec0ec3511015f5b1ae61822e8b38c8`.
- `npm ci` completed with zero reported vulnerabilities.
- Every exact command listed by the 19 entries in `.factory/claims.json` passed. Aggregate `npm test -- --grep @claim` passed 18 Vitest claim tests and the Rust CLI benchmark.
- `npm run typecheck`, `npm run build`, `cargo fmt --check`, and `cargo clippy --all-targets -- -D warnings` passed.
- Production `PLAYWRIGHT_BASE_URL=https://android-compat-scout.sociobot.in npm run test:browser` passed 9/9.
- Fresh production contexts at 390×844 and 1440×900, demo storage/request checks, route/metadata/404 checks, and prior-finding verification were completed.

## Known gaps / next steps

1. Keep “Try it with sample data,” its result sentence, and all three facts within the 1440×900 first viewport.
2. Make the header Install fragment link scroll to and focus the install section.
3. Restore saved scroll positions on Back/Forward while retaining h1 focus.
4. Apply the two documented copy fixes and add the corresponding regression tests.
