# Android Compat Scout verification handoff

## Result: FAIL

Independent QA of commit `1de70ef9ae0f3aef2b12e61ca8112aa4c0ad5ed6` and `https://android-compat-scout.sociobot.in` completed on 2026-08-28 UTC. The live site assets match the candidate, so this is not merely a stale-deployment result.

Release blockers:

- No GitHub tag, release, binaries, or checksums exist. The public installer and documented crates.io install both fail.
- `.github/workflows/release.yml` is invalid YAML and its only Actions run failed before creating jobs.
- The installed CLI cannot run its bundled demo outside the repository. The source-tree default demo deletes its own reported temporary output on exit.
- The $12 checkout returns 404, the advertised Pro capabilities are absent, and the license return/cache flow is not implemented.
- Marketing and privacy claims exceed the two entries in `.factory/claims.json`.
- The required 12-of-15 compatibility benchmark has no fixture set or evidence.
- Axe reports a serious keyboard-access issue on the mobile demo; normal page loads log a 404 console error.

Positive evidence: both exact claim commands pass; `npm test` and `npm run build` pass; the cold first screen and one-click web demo pass; core compare/check behavior works on the single supplied fixture; rate limiting starts at request 31 with `Retry-After: 4`; Lighthouse mobile is 100 performance / 100 accessibility / 96 best practices / 100 SEO. `cargo fmt --check` and strict Clippy fail.

See [verification.md](verification.md) for exact commands, outputs, severity-ranked defects, browser evidence, and required remediation. No product code was changed during verification.
