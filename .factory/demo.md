# Demo sandbox

Run `compat-scout demo` from any directory after installation, or visit `/demo` on the site. The binary embeds the invented snapshots and requirements, so it does not depend on a source checkout. It writes `compat-report.json` and `compat-check.json` to a newly created persistent temporary directory and prints that directory. Pass `--out-dir <folder>` to choose a location. The demo never invokes adb.

The web demo is a visual reading of the bundled sample. It has no real-data storage or outbound request path. Its banner labels the sample mode, offers Reset demo, and offers Start for real. `/demo` is the direct verifier URL.
