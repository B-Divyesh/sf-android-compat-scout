# Demo sandbox

Run `compat-scout demo` from any directory after installation, or visit `/?demo=1` (also `/demo`) on the site. The binary embeds the invented snapshots and requirements, so it does not depend on a source checkout. It writes `compat-report.json` and `compat-check.json` to a newly created persistent temporary directory named `compat-scout-demo-<timestamp>` and prints that directory. Pass `--out-dir <folder>` to choose a location. The demo never invokes adb.

The web demo is a visual reading of the bundled sample. It creates no localStorage, sessionStorage, IndexedDB, or files, so it has no demo or real-data namespace to read or write. Its banner labels the sample mode, offers Reset demo, and offers Start for real. `/?demo=1` is the direct verifier URL.
