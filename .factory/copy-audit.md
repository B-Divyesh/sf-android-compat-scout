# Copy audit — polish 3

Whitespace-delimited counts cover every visitor-facing sentence, heading, label, image description, and terminal line. Code commands are listed but not judged as prose. No prose exceeds 22 words. No banned marketing word appears.

## Metadata

| Copy | Words | Result |
| --- | ---: | --- |
| Android Compat Scout — Find Android setup changes | 8 | pass; home title and social title |
| Find Android setup changes after an update for a customized phone or vehicle dongle. | 14 | pass; home description and social description |
| Demo — Android Compat Scout | 4 | pass; demo title |
| See a sample Android upgrade report without connecting a phone or saving data. | 13 | pass; demo description |
| Privacy — Android Compat Scout | 4 | pass; privacy title |
| Learn which Android device facts Compat Scout reads and which identifiers it omits. | 13 | pass; privacy description |
| Terms — Android Compat Scout | 4 | pass; terms title |
| Read the safe-use terms for Android Compat Scout. | 8 | pass; terms description |
| Page not found — Android Compat Scout | 6 | pass; 404 title |
| This Android Compat Scout page does not exist. | 8 | pass; 404 description |

## Shared navigation and footer

| Copy | Words | Result |
| --- | ---: | --- |
| Android Compat Scout | 3 | pass |
| Demo | 1 | pass |
| Install | 1 | pass |
| Privacy | 1 | pass |
| A command-line report for Android setup changes. | 7 | pass |
| Terms | 1 | pass |
| Built by Param Factory | 4 | pass |
| v0.1.3 | 1 | pass |

## Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Find Android setup changes after an update | 7 | pass; `compare-json` describes grouping changes, not causal diagnosis |
| For owners of customized Android phones and vehicle dongles after an update, it groups setup changes into a JSON report. | 20 | pass; `compare-json` |
| Try it with sample data | 5 | pass |
| See a sample upgrade report first. | 6 | pass |
| Free under the MIT License | 5 | pass; `mit-license` |
| Run the bundled sample offline after installation | 7 | pass; `offline-bundled-demo` |
| Leaves out serials and Wi-Fi names | 6 | pass; `redacted-export` |
| Blueprint illustration of a phone, USB cable, and vehicle dongle used for compatibility inspection. | 14 | pass; image alt |
| The sample report lists changed Android settings and app requirements. | 10 | pass; `sample-report` |
| Sample report / Android 14 → 15 | 7 | pass |
| Sort changes by what to check | 6 | pass |
| A report marks the update, permission, connection, and missing app separately. | 11 | pass; `sample-report` |
| compat-scout demo | 2 | command |
| Demo report written to /tmp/compat-scout-demo-&lt;timestamp&gt; | 5 | pass; `installed-demo` |
| Found 6 changes. | 3 | pass; `sample-six-changes` |
| ACCESS FINE LOCATION permission changed | 5 | sample output |
| Wireless bridge is no longer installed | 6 | sample output |
| cat /tmp/compat-scout-demo-&lt;timestamp&gt;/compat-report.json | 2 | command |
| Compare Android setup snapshots | 4 | pass |
| Capture a snapshot. | 3 | pass; `snapshot-json` |
| Connect your phone and accept its USB-debugging prompt. | 8 | pass |
| List what your setup needs. | 5 | pass; `requirements-check` |
| List the local app, permissions, and device roles it needs. | 10 | pass |
| Compare after changes. | 3 | pass; `compare-json` |
| Save a JSON report that lists each detected change. | 9 | pass; `compare-json` |
| Compat Scout reads device information without changing it. | 8 | pass; `read-only-diagnosis` |
| Compat Scout never roots a device, bypasses Android Auto restrictions, changes installed apps, or encourages driving interaction. | 17 | pass; `read-only-diagnosis` |
| Snapshots omit serial numbers, Wi-Fi names, and MAC addresses. | 9 | pass; `redacted-export` |
| Snapshots contain app package names, Android version, and a redacted build fingerprint. | 11 | pass; `retained-snapshot-fields` |
| Store snapshots and reports as private files. | 7 | pass |
| Install the command-line tool | 4 | pass |
| Install a verified release, then run the bundled sample from any folder. | 12 | pass; `local-installed-release` |
| Choose a platform and processor | 5 | pass |
| Windows · x64 | 2 | pass |
| macOS · Apple silicon | 3 | pass |
| macOS · Intel | 2 | pass |
| Linux · x64 | 2 | pass |
| Linux · ARM64 | 2 | pass |
| Open install options on a computer | 6 | pass; phone copy |
| Downloads are available for Windows, macOS, and Linux. | 8 | pass; `release-distribution` |
| Linux / macOS installer | 4 | pass; `checksum-unix-installer` |
| Windows installer | 2 | pass; `checksum-windows-installer` |
| Release page (opens GitHub) | 4 | pass |

## Demo, legal, and 404 routes

| Copy | Words | Result |
| --- | ---: | --- |
| Demo — sample data, nothing is saved | 7 | pass; `demo-storage-isolation` |
| Reset demo | 2 | pass |
| Start for real | 3 | pass |
| Sample data / Android 14 → 15 | 7 | pass |
| See an Android upgrade report | 5 | pass |
| This sample compares an invented Android 14 setup with its Android 15 snapshot. | 13 | pass |
| Changes to check | 3 | pass |
| Android changed from 14 to 15 | 6 | sample output |
| Check app support notes. | 4 | pass |
| ACCESS FINE LOCATION changed | 4 | sample output |
| Review the trusted app's permission page. | 6 | pass |
| Wireless bridge is no longer installed | 6 | sample output |
| Restore it from a trusted backup. | 6 | pass |
| Run the same bundled demo | 5 | pass |
| Privacy for Android Compat Scout | 5 | pass |
| Before you collect a snapshot | 5 | pass |
| Enable USB debugging and approve the phone prompt before the command-line tool reads device facts. | 15 | pass |
| What a snapshot omits | 4 | pass |
| Exports exclude serial numbers, Wi-Fi names, and MAC addresses. | 9 | pass; `redacted-export` |
| What a snapshot keeps | 5 | pass |
| Snapshots contain app package names, Android version, and a redacted build fingerprint. | 11 | pass; `retained-snapshot-fields` |
| Store snapshots and reports as private files. | 7 | pass |
| Terms for Android Compat Scout | 5 | pass |
| Inspect only devices you manage | 5 | pass |
| Compat Scout compares information you are allowed to inspect. | 9 | pass; `read-only-diagnosis` |
| It does not root devices, bypass restrictions, or modify apps. | 10 | pass; `read-only-diagnosis` |
| Safe use while driving | 4 | pass |
| Do not use the tool while driving. | 7 | pass |
| Follow local laws and only connect devices you own or manage. | 11 | pass |
| This inspection page is missing | 5 | pass |
| Return to the overview and inspect a sample compatibility report. | 10 | pass |
| Go to overview | 3 | pass |

The terminal copy already listed under the landing page is reused unchanged on the demo route.

## README prose

| Copy | Words | Result |
| --- | ---: | --- |
| Find Android setup changes after an update. | 7 | pass; `compare-json` describes grouping changes, not causal diagnosis |
| Android Compat Scout is for owners of customized Android phones and vehicle dongles. | 13 | pass |
| With USB-debugging approval, Compat Scout saves device facts as JSON. | 9 | pass; `snapshot-json` |
| It checks what your setup needs and compares snapshots taken before and after a change. | 15 | pass; `requirements-check`, `compare-json` |
| Download a release from GitHub Releases, or use an installer. | 10 | pass |
| Both scripts check the downloaded binary against the release SHA256SUMS file before installation. | 13 | pass; both installer claims |
| macOS and Windows builds are unsigned. | 6 | pass; `release-distribution` |
| On macOS, use right-click → Open after downloading the package. | 10 | pass |
| The release includes Linux archives, .deb, .rpm, macOS archives and .pkg files, a Windows zip, checksums, and latest.json metadata. | 19 | pass; `release-distribution` |
| Homebrew users can install the published tap. | 7 | pass; `release-distribution` |
| The release also includes a Scoop manifest. | 7 | pass; `release-distribution` |
| Winget manifests under winget/ are ready for owner submission and are checked with winget validate in the release workflow. | 19 | pass; `release-distribution` |
| For local development only, install from the checkout with cargo install --path . | 13 | pass |
| Capture and compare snapshots | 4 | pass |
| Install Android platform-tools, enable USB debugging, and accept the phone's prompt. | 11 | pass |
| Take another snapshot after an update or configuration change. | 9 | pass |
| Use a requirement file when you know which app, permissions, and device roles matter. | 14 | pass |
| compat-scout --help lists each command. | 5 | pass; `cli-interface-options` |
| The snapshot, compare, check, and demo commands accept --json for scripting. | 11 | pass; `cli-interface-options` |
| Try the bundled sample | 4 | pass |
| No phone is needed. | 4 | pass; `installed-demo` |
| The binary embeds the invented snapshots and requirement file, so this works after installation from any directory. | 17 | pass; `installed-demo` |
| The bundled sample runs without an account or network after installation. | 10 | pass; `offline-bundled-demo` |
| It prints a persistent temporary output directory containing compat-report.json and compat-check.json. | 11 | pass; `installed-demo` |
| The browser demo is at /?demo=1 (also /demo); it uses only sample data. | 13 | pass; `demo-storage-isolation` |
| See .factory/demo.md for the sample files, reset behavior, and storage checks. | 12 | pass |
| Compatibility benchmark | 2 | pass |
| The bundled test data covers 15 named phone and setup cases. | 11 | pass; `benchmark-12-of-15` |
| It invokes the public compare and check commands across OS, connectivity, app, and permission changes. | 15 | pass; `benchmark-12-of-15` |
| Automated tests must detect at least 12 cases; they currently detect all 15. | 13 | pass; `benchmark-12-of-15` |
| The collector intentionally avoids serial numbers, Wi-Fi names, and MAC addresses. | 11 | pass; `redacted-export` |
| Snapshots contain app package names, Android version, and a redacted build fingerprint. | 11 | pass; `retained-snapshot-fields` |
| Store snapshots and reports as private files. | 7 | pass |
| Compat Scout does not root a device, bypass restrictions, or modify installed apps. | 13 | pass; `read-only-diagnosis` |
| Do not inspect or operate a device while driving. | 9 | pass |
| Requirements: Rust stable and Node 22+. | 6 | pass |
| The static deployment output is dist/site. | 6 | pass |
| The release workflow runs for v* tags and publishes the installable artifacts. | 12 | pass; `release-distribution` |
| Do not publish from a workstation; push a tested tag and let GitHub Actions create the release. | 17 | pass |
| Free under the MIT License. | 5 | pass; `mit-license` |
| See LICENSE. | 2 | pass |

## Terminology

| Concept | One term |
| --- | --- |
| Collected device record | snapshot |
| Detected difference | change |
| Output explaining changes | report |
| Declared app and device needs | requirements |
| Bundled isolated example | demo |
| Installed command | Compat Scout |
