# Landing copy audit

| Sentence or label | Words | Result |
| --- | ---: | --- |
| Find what broke your Android setup | 6 | pass |
| For owners of customized Android phones and vehicle dongles after an update, it turns device facts into a clear report. | 18 | pass |
| Try it with sample data | 5 | pass |
| See a sample upgrade report first. | 6 | pass |
| Runs on your computer | 4 | registered: local-installed-release |
| Leaves out serials and Wi-Fi names | 6 | registered: redacted-export |
| Release downloads include checksums | 4 | registered: release-download-checksums |
| The report lists each changed Android setting and app requirement. | 10 | pass |
| Sort changes by what to check | 6 | pass |
| A report marks the update, permission, connection, and missing app separately. | 11 | registered: sample-report |
| Demo report written to a temporary compat-scout-demo-<timestamp> folder | 7 | matches CLI demo output pattern |
| Compare Android setup snapshots | 5 | pass |
| Connect your phone and accept its USB-debugging prompt. | 8 | pass |
| List the local app, permissions, and device roles it needs. | 10 | pass |
| Save a report that names each meaningful difference. | 8 | registered: sample-report |
| It reports facts. It does not change your phone. | 9 | registered: read-only-diagnosis |
| Snapshots omit serial numbers, Wi-Fi names, and MAC addresses. | 9 | registered: redacted-export |
| Install a verified release, then run the bundled sample from any folder. | 12 | registered: local-installed-release |

No audited sentence exceeds 22 words or uses a banned marketing word. The terminal path uses the CLI's documented `compat-scout-demo-<timestamp>` pattern. Pro billing language was removed because no registered checkout or corresponding CLI feature is available.

## Terminology

| Concept | One word used |
| --- | --- |
| Collected device record | snapshot |
| Output explaining differences | report |
| Declared app/device needs | requirements |
| Bundled isolated example | demo |
| Installed command | Compat Scout |
