# Android Compat Scout

Find what broke your Android setup.

Android Compat Scout is for owners of customized Android phones, vehicle dongles, and local apps. It collects a consented ADB snapshot, checks declared requirements, and compares a before/after pair into a private JSON report. It does not root devices, bypass restrictions, or modify installed apps.

## Quick start

Install Android platform-tools, enable USB debugging, and accept the phone's prompt.

```sh
cargo build --release
./target/release/compat-scout snapshot --out before.json
# Take another snapshot after an update or configuration change.
./target/release/compat-scout snapshot --out after.json
./target/release/compat-scout compare before.json after.json --out report.json
```

Use a declared requirement file when you know which app, permissions, and device roles matter:

```sh
./target/release/compat-scout check after.json examples/fermata-requirements.json
```

`compat-scout --help` documents every command. All commands can print JSON for scripting. A missing or unauthorized device produces a clear ADB consent error.

## Try the offline sample

No phone is needed for the sample.

```sh
cargo run -- demo
```

It reads invented snapshots in `examples/` and writes a report to a temporary directory. The site demo is available at `/demo`; its sample does not access real reports or devices. See [.factory/demo.md](.factory/demo.md).

## Install

When a release is published, use:

```sh
curl -fsSL https://android-compat-scout.sociobot.in/install.sh | sh
```

On Windows:

```powershell
irm https://android-compat-scout.sociobot.in/install.ps1 | iex
```

Both installers verify SHA-256 before placing the binary on your path. The macOS package and Windows build are unsigned. On macOS, use right-click → Open after downloading a package. Scoop and winget manifests are included for release submission.

## Develop and verify

Requirements: Rust stable and Node 22+.

```sh
npm install
npm test
npm run build
```

The exact static deployment output is `dist/site` (`index.html` is at its root). `npm test -- --grep @claim` runs the claims listed in `.factory/claims.json`. The release workflow runs for `v*` tags and publishes macOS (arm64 and x64), Linux, and Windows archives with checksums.

## Privacy and safety

Snapshots are local JSON files. The collector intentionally does not request serial numbers, accounts, Wi-Fi names, or MAC addresses. Reports may still reveal installed package names and Android build information, so store them carefully. Do not inspect or operate a device while driving.

The browser documentation site has an optional $12 Pro license check. It stores the pasted license in this browser and sends it to Sociobot only for verification. Read the site’s `/privacy` and `/terms` pages before purchase.

## License

MIT. See [LICENSE](LICENSE).
