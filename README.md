# Android Compat Scout

Find what broke your Android setup.

Android Compat Scout is for owners of customized Android phones, vehicle dongles, and local apps. It collects a consented ADB snapshot, checks declared requirements, and compares a before/after pair into a JSON report.

## Install

Download a release from [GitHub Releases](https://github.com/B-Divyesh/sf-android-compat-scout/releases), or use an installer:

```sh
curl -fsSL https://android-compat-scout.sociobot.in/install.sh | sh
```

```powershell
irm https://android-compat-scout.sociobot.in/install.ps1 | iex
```

Both scripts check the downloaded binary against the release `SHA256SUMS` file before installation. macOS and Windows builds are unsigned. On macOS, use right-click → Open after downloading the package. The release includes Linux archives, `.deb`, `.rpm`, macOS archives and `.pkg` files, a Windows zip, checksums, and `latest.json` metadata. The release also includes a Homebrew formula and a Scoop manifest; winget manifests under `winget/` are ready for owner submission.

For local development only, install from the checkout with `cargo install --path .`.

## Use it

Install Android platform-tools, enable USB debugging, and accept the phone’s prompt.

```sh
compat-scout snapshot --out before.json
# Take another snapshot after an update or configuration change.
compat-scout snapshot --out after.json
compat-scout compare before.json after.json --out report.json
```

Use a requirement file when you know which app, permissions, and device roles matter:

```sh
compat-scout check after.json examples/fermata-requirements.json
```

`compat-scout --help` documents each command. The snapshot, compare, check, and demo commands accept `--json` for scripting.

## Try the bundled sample

No phone is needed:

```sh
compat-scout demo
```

The binary embeds the invented snapshots and requirement file, so this works after installation from any directory. It prints a persistent temporary output directory containing `compat-report.json` and `compat-check.json`. The browser demo is at `/demo`; it uses only sample data. See [.factory/demo.md](.factory/demo.md).

## Compatibility benchmark

The bundled [15-case fixture](examples/compatibility-benchmark.json) exercises OS, connectivity, app, and permission changes. The regression suite requires at least 12 detected cases and currently verifies all 15.

## Privacy and safety

The collector intentionally avoids serial numbers, Wi-Fi names, and MAC addresses. Reports can still reveal installed package names and Android build information, so store them carefully. Compat Scout does not root a device, bypass restrictions, or modify installed apps. Do not inspect or operate a device while driving.

## Develop and verify

Requirements: Rust stable and Node 22+.

```sh
npm ci
npm test
npm run typecheck
npm run build
cargo fmt --check
cargo clippy --all-targets -- -D warnings
```

The static deployment output is `dist/site`. The release workflow runs for `v*` tags and publishes the installable artifacts. Do not publish from a workstation; push a tested tag and let GitHub Actions create the release.

## License

MIT. See [LICENSE](LICENSE).
