# Demo sandbox

Run `compat-scout demo` from the repository, or visit `/demo` on the site.
The command reads the invented snapshots in `examples/` and writes
`compat-report.json` plus `compat-check.json` into a temporary directory. Pass
`--out-dir <folder>` to inspect a named temporary folder. It never invokes adb.

The web demo uses a `demo:compat-scout` session-storage namespace. Reset demo
clears that namespace. The web page is a visual reading of the same bundled
sample and does not read local reports or write real data.
