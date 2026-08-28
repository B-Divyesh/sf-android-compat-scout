use serde_json::Value;
use std::{fs, path::PathBuf, process::Command};

#[test]
fn claim_benchmark_12_of_15_uses_public_cli_with_shipped_fixtures() {
    let root = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    let benchmark: Value = serde_json::from_str(
        &fs::read_to_string(root.join("examples/compatibility-benchmark.json")).unwrap(),
    )
    .unwrap();
    let cases = benchmark["cases"].as_array().unwrap();
    let binary = env!("CARGO_BIN_EXE_compat-scout");
    let output_dir = tempfile::tempdir().unwrap();
    let mut detected = 0usize;

    for case in cases {
        let id = case["id"].as_str().unwrap();
        let expected = case["expected"].as_str().unwrap();
        let mut args = vec![case["command"].as_str().unwrap().to_string()];
        if case["command"] == "compare" {
            args.push(
                root.join("examples")
                    .join(case["before"].as_str().unwrap())
                    .display()
                    .to_string(),
            );
            args.push(
                root.join("examples")
                    .join(case["after"].as_str().unwrap())
                    .display()
                    .to_string(),
            );
        } else {
            args.push(
                root.join("examples")
                    .join(case["snapshot"].as_str().unwrap())
                    .display()
                    .to_string(),
            );
            args.push(
                root.join("examples")
                    .join(case["requirements"].as_str().unwrap())
                    .display()
                    .to_string(),
            );
        }
        args.extend([
            "--out".into(),
            output_dir
                .path()
                .join(format!("{id}.json"))
                .display()
                .to_string(),
            "--json".into(),
        ]);
        let result = Command::new(binary).args(&args).output().unwrap();
        assert!(
            result.status.success(),
            "{id} failed: {}",
            String::from_utf8_lossy(&result.stderr)
        );
        let report: Value = serde_json::from_slice(&result.stdout).unwrap();
        if report["findings"]
            .as_array()
            .unwrap()
            .iter()
            .any(|finding| finding["category"] == expected)
        {
            detected += 1;
        }
    }

    assert_eq!(cases.len(), 15);
    assert!(
        detected >= benchmark["threshold"].as_u64().unwrap() as usize,
        "detected {detected}/15 cases"
    );
}
