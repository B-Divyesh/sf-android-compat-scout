# Demo sandbox

Run `compat-scout demo` from any directory after installation, or visit `/?demo=1` (also `/demo`) on the site. The binary embeds the invented snapshots and requirements, so it does not depend on a source checkout. It writes `compat-report.json` and `compat-check.json` to a newly created persistent temporary directory named `compat-scout-demo-<timestamp>` and prints that directory. Pass `--out-dir <folder>` to choose a location. The demo never invokes adb.

The web demo is a visual reading of the bundled sample. It creates no localStorage, sessionStorage, IndexedDB, Cache Storage entries, cookies, or downloads. Because it writes nothing, it cannot read or alter the visitor's real data. Its persistent banner labels the sample mode, offers Reset demo, and offers Start for real. `/?demo=1` is the direct verifier URL.

The `@claim:demo-storage-isolation` browser test seeds real sentinels in every browser store above, enters the direct demo URL, changes the rendered sample, resets it, and exits. It asserts that the sentinels are unchanged, no sample data remains, no download starts, and every request stays on the site origin.
