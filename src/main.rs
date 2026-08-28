use anyhow::{bail, Context, Result};
use chrono::{DateTime, Utc};
use clap::{Parser, Subcommand};
use serde::{Deserialize, Serialize};
use std::{
    collections::BTreeMap,
    fs,
    path::{Path, PathBuf},
    process::Command,
};

const DEMO_BEFORE: &str = include_str!("../examples/before-android-14.json");
const DEMO_AFTER: &str = include_str!("../examples/after-android-15.json");
const DEMO_REQUIREMENTS: &str = include_str!("../examples/fermata-requirements.json");

#[derive(Parser)]
#[command(
    name = "compat-scout",
    version,
    about = "Private Android compatibility snapshots and reports"
)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}
#[derive(Subcommand)]
enum Commands {
    /// Collect a consented, redacted snapshot through adb.
    Snapshot {
        #[arg(long, default_value = "compat-snapshot.json")]
        out: PathBuf,
        #[arg(long, default_value = "adb")]
        adb: String,
        #[arg(long)]
        json: bool,
    },
    /// Compare two snapshots and write a compatibility report.
    Compare {
        before: PathBuf,
        after: PathBuf,
        #[arg(long, default_value = "compat-report.json")]
        out: PathBuf,
        #[arg(long)]
        json: bool,
    },
    /// Check a snapshot against app and device prerequisites.
    Check {
        snapshot: PathBuf,
        requirements: PathBuf,
        #[arg(long, default_value = "compat-check.json")]
        out: PathBuf,
        #[arg(long)]
        json: bool,
    },
    /// Run the bundled sample in a persistent temporary folder. Nothing touches a connected device.
    Demo {
        #[arg(long)]
        out_dir: Option<PathBuf>,
        #[arg(long)]
        json: bool,
    },
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
struct Snapshot {
    format: String,
    captured_at: DateTime<Utc>,
    source: String,
    device: Device,
    connectivity: Connectivity,
    apps: Vec<App>,
    notes: Vec<String>,
}
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
struct Device {
    manufacturer: String,
    model: String,
    android_release: String,
    sdk: String,
    build_fingerprint: String,
    adb_state: String,
}
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
struct Connectivity {
    usb_mode: String,
    wifi_state: String,
    wifi_ssid_present: bool,
    adb_transport: String,
}
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, PartialOrd, Ord)]
struct App {
    package: String,
    version: String,
    installed: bool,
    permissions: BTreeMap<String, String>,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
struct RequirementFile {
    name: Option<String>,
    min_sdk: Option<u32>,
    apps: Vec<AppRequirement>,
    needs_wifi: Option<bool>,
    needs_usb_accessory: Option<bool>,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
struct AppRequirement {
    package: String,
    min_version: Option<String>,
    permissions: Vec<String>,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
struct Finding {
    category: String,
    severity: String,
    title: String,
    detail: String,
    next_step: String,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
struct Report {
    format: String,
    created_at: DateTime<Utc>,
    before: String,
    after: String,
    summary: String,
    findings: Vec<Finding>,
}

fn main() -> Result<()> {
    let cli = Cli::parse();
    match cli.command {
        Commands::Snapshot { out, adb, json } => {
            let snap = collect(&adb)?;
            write_json(&out, &snap)?;
            emit(json, &format!("Snapshot saved to {}", out.display()), &snap)?;
        }
        Commands::Compare {
            before,
            after,
            out,
            json,
        } => {
            let left: Snapshot = read_json(&before)?;
            let right: Snapshot = read_json(&after)?;
            let report = compare(&left, &right, &before, &after);
            write_json(&out, &report)?;
            emit(json, &format!("Report saved to {}", out.display()), &report)?;
        }
        Commands::Check {
            snapshot,
            requirements,
            out,
            json,
        } => {
            let snap: Snapshot = read_json(&snapshot)?;
            let req: RequirementFile = read_json(&requirements)?;
            let report = check(&snap, &req, &snapshot);
            write_json(&out, &report)?;
            emit(json, &format!("Check saved to {}", out.display()), &report)?;
        }
        Commands::Demo { out_dir, json } => demo(out_dir, json)?,
    }
    Ok(())
}

fn demo(out_dir: Option<PathBuf>, json: bool) -> Result<()> {
    let base = out_dir.unwrap_or_else(|| {
        std::env::temp_dir().join(format!(
            "compat-scout-demo-{}",
            Utc::now().timestamp_millis()
        ))
    });
    fs::create_dir_all(&base)?;
    let before: Snapshot =
        serde_json::from_str(DEMO_BEFORE).context("Bundled before snapshot is not valid JSON")?;
    let after: Snapshot =
        serde_json::from_str(DEMO_AFTER).context("Bundled after snapshot is not valid JSON")?;
    let req: RequirementFile = serde_json::from_str(DEMO_REQUIREMENTS)
        .context("Bundled requirements are not valid JSON")?;
    let report = compare(
        &before,
        &after,
        Path::new("before-android-14.json"),
        Path::new("after-android-15.json"),
    );
    let check_report = check(&after, &req, Path::new("after-android-15.json"));
    write_json(&base.join("compat-report.json"), &report)?;
    write_json(&base.join("compat-check.json"), &check_report)?;
    let message = format!(
        "Demo report written to {}\n{}",
        base.display(),
        report.summary
    );
    if json {
        println!(
            "{}",
            serde_json::to_string_pretty(
                &serde_json::json!({"out_dir":base,"report":report,"check":check_report})
            )?
        );
    } else {
        println!("{message}");
        for f in report.findings {
            println!("- [{}] {} — {}", f.category, f.title, f.next_step);
        }
    }
    Ok(())
}

fn collect(adb: &str) -> Result<Snapshot> {
    let devices = adb_output(adb, &["devices"])?;
    let state = devices
        .lines()
        .skip(1)
        .find_map(|l| l.split_whitespace().nth(1))
        .unwrap_or("no device")
        .to_string();
    if state != "device" {
        bail!("No authorized Android device found. Enable USB debugging, accept the phone prompt, then run `compat-scout snapshot` again.");
    }
    let get = |key: &str| adb_output(adb, &["shell", "getprop", key]).map(|s| clean(&s));
    let packages = adb_output(adb, &["shell", "pm", "list", "packages", "-3"])?;
    let mut apps = Vec::new();
    for line in packages.lines().take(250) {
        if let Some(package) = line.strip_prefix("package:") {
            apps.push(app_from_adb(adb, package.trim())?);
        }
    }
    apps.sort();
    let usb = adb_output(adb, &["shell", "dumpsys", "usb"]).unwrap_or_default();
    let wifi = adb_output(adb, &["shell", "dumpsys", "wifi"]).unwrap_or_default();
    Ok(Snapshot {
        format: "android-compat-scout/snapshot-1".into(),
        captured_at: Utc::now(),
        source: "adb (consented USB debugging)".into(),
        device: Device {
            manufacturer: get("ro.product.manufacturer")?,
            model: get("ro.product.model")?,
            android_release: get("ro.build.version.release")?,
            sdk: get("ro.build.version.sdk")?,
            build_fingerprint: redact_fingerprint(&get("ro.build.fingerprint")?),
            adb_state: state.clone(),
        },
        connectivity: Connectivity {
            usb_mode: pick_line(&usb, &["mCurrentFunctions", "currentFunctions"])
                .unwrap_or_else(|| "not reported".into()),
            wifi_state: if wifi.contains("enabled") || wifi.contains("Enabled") {
                "enabled".into()
            } else {
                "not reported".into()
            },
            wifi_ssid_present: wifi.contains("SSID:"),
            adb_transport: "USB debugging (authorized)".into(),
        },
        apps,
        notes: vec![
            "Serial numbers, account names, Wi-Fi names, and MAC addresses are not collected."
                .into(),
        ],
    })
}
fn app_from_adb(adb: &str, package: &str) -> Result<App> {
    let output = adb_output(adb, &["shell", "dumpsys", "package", package])?;
    let version = output
        .lines()
        .find_map(|x| x.trim().strip_prefix("versionName="))
        .unwrap_or("unknown")
        .to_string();
    let mut permissions = BTreeMap::new();
    for line in output.lines() {
        let t = line.trim();
        if let Some((name, state)) = t.split_once(": granted=") {
            if name.contains('.') {
                permissions.insert(
                    name.trim().to_string(),
                    if state.starts_with("true") {
                        "granted".into()
                    } else {
                        "denied".into()
                    },
                );
            }
        }
    }
    Ok(App {
        package: package.into(),
        version,
        installed: true,
        permissions,
    })
}
fn adb_output(adb: &str, args: &[&str]) -> Result<String> {
    let out = Command::new(adb).args(args).output().with_context(|| {
        format!(
            "Could not run `{adb}`. Install Android platform-tools and make adb available on PATH."
        )
    })?;
    if !out.status.success() {
        bail!(
            "adb failed: {}",
            String::from_utf8_lossy(&out.stderr).trim()
        )
    }
    Ok(String::from_utf8_lossy(&out.stdout).to_string())
}
fn compare(before: &Snapshot, after: &Snapshot, before_path: &Path, after_path: &Path) -> Report {
    let mut findings = Vec::new();
    if before.device.android_release != after.device.android_release
        || before.device.sdk != after.device.sdk
    {
        findings.push(finding(
            "OS version",
            "attention",
            format!(
                "Android changed from {} to {}",
                before.device.android_release, after.device.android_release
            ),
            "OS and SDK changed between snapshots.",
            "Check the affected app's Android-version support notes.",
        ));
    }
    if before.connectivity.usb_mode != after.connectivity.usb_mode {
        findings.push(finding(
            "Connectivity",
            "attention",
            "USB role changed",
            format!(
                "Before: {}. After: {}.",
                before.connectivity.usb_mode, after.connectivity.usb_mode
            ),
            "Reconnect the accessory and confirm its required USB role.",
        ));
    }
    if before.connectivity.wifi_state != after.connectivity.wifi_state
        || before.connectivity.wifi_ssid_present != after.connectivity.wifi_ssid_present
    {
        findings.push(finding(
            "Connectivity",
            "attention",
            "Wi-Fi state changed",
            "The availability of a Wi-Fi connection changed.",
            "Check Wi-Fi, hotspot, and wireless-dongle pairing settings.",
        ));
    }
    let old: BTreeMap<_, _> = before.apps.iter().map(|a| (&a.package, a)).collect();
    let new: BTreeMap<_, _> = after.apps.iter().map(|a| (&a.package, a)).collect();
    for (id, a) in &old {
        match new.get(id) {
            None => findings.push(finding(
                "Missing component",
                "blocking",
                format!("{} is no longer installed", id),
                format!("It was present at version {} before the change.", a.version),
                "Reinstall the trusted app or restore it from your backup.",
            )),
            Some(b) => {
                if a.version != b.version {
                    findings.push(finding(
                        "App version",
                        "attention",
                        format!("{} changed version", id),
                        format!("Before: {}. After: {}.", a.version, b.version),
                        "Compare the app's release notes with the Android update date.",
                    ));
                }
                for (permission, state) in &a.permissions {
                    if state == "granted"
                        && b.permissions.get(permission).map(String::as_str) != Some("granted")
                    {
                        findings.push(finding("Permission","blocking",format!("{} permission changed for {}",short_permission(permission),id),"It was granted before and is no longer granted.","Open the app's permission page and grant it only if you trust the app."));
                    }
                }
            }
        }
    }
    let summary = if findings.is_empty() {
        "No material compatibility differences found in this snapshot pair.".into()
    } else {
        format!(
            "Found {} compatibility signal{}.",
            findings.len(),
            if findings.len() == 1 { "" } else { "s" }
        )
    };
    Report {
        format: "android-compat-scout/report-1".into(),
        created_at: Utc::now(),
        before: before_path.display().to_string(),
        after: after_path.display().to_string(),
        summary,
        findings,
    }
}
fn check(snapshot: &Snapshot, requirements: &RequirementFile, path: &Path) -> Report {
    let mut findings = Vec::new();
    if let Some(min) = requirements.min_sdk {
        if snapshot.device.sdk.parse::<u32>().unwrap_or(0) < min {
            findings.push(finding(
                "OS version",
                "blocking",
                "Android version is too old",
                format!(
                    "This setup needs SDK {min}; snapshot shows {}.",
                    snapshot.device.sdk
                ),
                "Update Android only if your device vendor supports it.",
            ));
        }
    }
    if requirements.needs_wifi == Some(true) && snapshot.connectivity.wifi_state != "enabled" {
        findings.push(finding(
            "Connectivity",
            "blocking",
            "Wi-Fi is not enabled",
            "This setup declares a Wi-Fi requirement.",
            "Turn on Wi-Fi, then retake the snapshot.",
        ));
    }
    if requirements.needs_usb_accessory == Some(true)
        && snapshot.connectivity.usb_mode == "not reported"
    {
        findings.push(finding(
            "Connectivity",
            "attention",
            "USB role was not reported",
            "The setup declares an accessory requirement.",
            "Connect the accessory and retake the snapshot.",
        ));
    }
    let installed: BTreeMap<_, _> = snapshot.apps.iter().map(|a| (&a.package, a)).collect();
    for app in &requirements.apps {
        match installed.get(&app.package) {
            None => findings.push(finding(
                "Missing component",
                "blocking",
                format!("{} is not installed", app.package),
                "A declared required app was not found.",
                "Install the trusted app, then retake the snapshot.",
            )),
            Some(actual) => {
                if let Some(min) = &app.min_version {
                    if version_less(&actual.version, min) {
                        findings.push(finding(
                            "App version",
                            "attention",
                            format!("{} may be too old", app.package),
                            format!("Found {}; declared minimum is {min}.", actual.version),
                            "Update the app from its trusted source.",
                        ));
                    }
                }
                for perm in &app.permissions {
                    if actual.permissions.get(perm).map(String::as_str) != Some("granted") {
                        findings.push(finding(
                            "Permission",
                            "blocking",
                            format!("{} is not granted", short_permission(perm)),
                            format!("{} needs this permission.", app.package),
                            "Review and grant the permission only if you trust the app.",
                        ));
                    }
                }
            }
        }
    }
    let summary = if findings.is_empty() {
        "Declared prerequisites are present in this snapshot.".into()
    } else {
        format!(
            "Found {} prerequisite issue{}.",
            findings.len(),
            if findings.len() == 1 { "" } else { "s" }
        )
    };
    Report {
        format: "android-compat-scout/check-1".into(),
        created_at: Utc::now(),
        before: path.display().to_string(),
        after: "declared requirements".into(),
        summary,
        findings,
    }
}
fn finding(
    category: &str,
    severity: &str,
    title: impl Into<String>,
    detail: impl Into<String>,
    next: impl Into<String>,
) -> Finding {
    Finding {
        category: category.into(),
        severity: severity.into(),
        title: title.into(),
        detail: detail.into(),
        next_step: next.into(),
    }
}
fn version_less(found: &str, min: &str) -> bool {
    fn nums(s: &str) -> Vec<u32> {
        s.split(|c: char| !c.is_ascii_digit())
            .filter_map(|x| x.parse().ok())
            .collect()
    }
    nums(found) < nums(min)
}
fn clean(s: &str) -> String {
    s.trim().replace('\n', " ")
}
fn redact_fingerprint(s: &str) -> String {
    format!("{}/…", s.split('/').next().unwrap_or("unknown"))
}
fn pick_line(s: &str, need: &[&str]) -> Option<String> {
    s.lines()
        .find(|line| need.iter().any(|n| line.contains(n)))
        .map(clean)
}
fn short_permission(s: &str) -> String {
    s.rsplit('.').next().unwrap_or(s).replace('_', " ")
}
fn read_json<T: for<'a> Deserialize<'a>>(path: &Path) -> Result<T> {
    let raw =
        fs::read_to_string(path).with_context(|| format!("Could not read {}", path.display()))?;
    serde_json::from_str(&raw).with_context(|| format!("{} is not valid JSON", path.display()))
}
fn write_json<T: Serialize>(path: &Path, value: &T) -> Result<()> {
    let json = serde_json::to_string_pretty(value)?;
    fs::write(path, format!("{json}\n"))
        .with_context(|| format!("Could not write {}", path.display()))
}
fn emit<T: Serialize>(json: bool, text: &str, value: &T) -> Result<()> {
    if json {
        println!("{}", serde_json::to_string_pretty(value)?)
    } else {
        println!("{text}")
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn detects_demo_regressions() {
        let a: Snapshot = serde_json::from_str(DEMO_BEFORE).unwrap();
        let b: Snapshot = serde_json::from_str(DEMO_AFTER).unwrap();
        let report = compare(&a, &b, Path::new("a"), Path::new("b"));
        assert!(report
            .findings
            .iter()
            .any(|finding| finding.category == "Permission"));
        assert!(report
            .findings
            .iter()
            .any(|finding| finding.category == "Missing component"));
    }

    #[test]
    fn requirement_check_finds_permission() {
        let snapshot: Snapshot = serde_json::from_str(DEMO_AFTER).unwrap();
        let requirements: RequirementFile = serde_json::from_str(DEMO_REQUIREMENTS).unwrap();
        assert!(
            check(&snapshot, &requirements, Path::new("x"))
                .findings
                .len()
                >= 2
        );
    }

    #[test]
    fn export_redaction_drops_build_detail() {
        assert_eq!(redact_fingerprint("maker/device/secret:15/abc"), "maker/…");
    }

    #[cfg(unix)]
    #[test]
    fn collector_redacts_sensitive_adb_values() {
        use std::os::unix::fs::PermissionsExt;

        let temp = tempfile::tempdir().unwrap();
        let adb = temp.path().join("fake-adb");
        fs::write(
            &adb,
            r#"#!/bin/sh
case "$*" in
  devices) printf 'List of devices attached\nabc device\n' ;;
  *'getprop ro.product.manufacturer') printf 'Maker\n' ;;
  *'getprop ro.product.model') printf 'Model\n' ;;
  *'getprop ro.build.version.release') printf '15\n' ;;
  *'getprop ro.build.version.sdk') printf '35\n' ;;
  *'getprop ro.build.fingerprint') printf 'maker/device/secret-build-value\n' ;;
  *'pm list packages -3') printf 'package:example.app\n' ;;
  *'dumpsys package example.app') printf 'versionName=1.0\nandroid.permission.CAMERA: granted=true\n' ;;
  *'dumpsys usb') printf 'mCurrentFunctions: mtp\n' ;;
  *'dumpsys wifi') printf 'Wi-Fi enabled SSID: ExampleWifi 00:11:22:33:44:55\n' ;;
esac
"#,
        )
        .unwrap();
        let mut permissions = fs::metadata(&adb).unwrap().permissions();
        permissions.set_mode(0o755);
        fs::set_permissions(&adb, permissions).unwrap();

        let snapshot = collect(adb.to_str().unwrap()).unwrap();
        let exported = serde_json::to_string(&snapshot).unwrap();
        for sensitive in [
            "secret-build-value",
            "ExampleWifi",
            "00:11:22:33:44:55",
            "abc",
        ] {
            assert!(!exported.contains(sensitive));
        }
    }

    #[test]
    fn demo_default_output_persists() {
        demo(None, true).unwrap();
        let newest = fs::read_dir(std::env::temp_dir())
            .unwrap()
            .filter_map(Result::ok)
            .filter(|entry| {
                entry
                    .file_name()
                    .to_string_lossy()
                    .starts_with("compat-scout-demo-")
            })
            .max_by_key(|entry| {
                entry
                    .metadata()
                    .and_then(|metadata| metadata.modified())
                    .ok()
            })
            .unwrap()
            .path();
        assert!(newest.join("compat-report.json").is_file());
        fs::remove_dir_all(newest).unwrap();
    }
}
