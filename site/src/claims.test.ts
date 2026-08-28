import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

describe('sandbox claims', () => {
  test('@claim:sample-report bundled demo writes a categorized report', () => {
    const out = mkdtempSync(join(tmpdir(), 'compat-scout-'));
    execFileSync('cargo', ['run', '--quiet', '--', 'demo', '--out-dir', out, '--json'], { cwd: process.cwd() });
    const report = JSON.parse(readFileSync(join(out, 'compat-report.json'), 'utf8'));
    expect(existsSync(join(out, 'compat-check.json'))).toBe(true);
    expect(report.findings.map((x: { category: string }) => x.category)).toEqual(expect.arrayContaining(['OS version', 'Permission', 'Missing component', 'Connectivity']));
  });

  test('@claim:redacted-export sample snapshots contain no identifiers', () => {
    const sample = JSON.parse(readFileSync(join(process.cwd(), 'examples', 'after-android-15.json'), 'utf8'));
    expect(sample.device).not.toHaveProperty('serial');
    expect(sample).not.toHaveProperty('accounts');
    expect(sample.connectivity).not.toHaveProperty('wifi_ssid');
    expect(sample.connectivity).not.toHaveProperty('mac_address');
  });

  test('@claim:installed-demo bundled samples run outside the repository', () => {
    const work = mkdtempSync(join(tmpdir(), 'compat-scout-consumer-'));
    const manifest = join(process.cwd(), 'Cargo.toml');
    const output = execFileSync('cargo', ['run', '--quiet', '--manifest-path', manifest, '--', 'demo', '--json'], { cwd: work, encoding: 'utf8' });
    const result = JSON.parse(output);
    expect(existsSync(join(result.out_dir, 'compat-report.json'))).toBe(true);
    expect(existsSync(join(result.out_dir, 'compat-check.json'))).toBe(true);
    rmSync(result.out_dir, { recursive: true, force: true });
    rmSync(work, { recursive: true, force: true });
  });

  test('@claim:checksum-installers verify a downloaded checksum before installation', () => {
    const unix = readFileSync(join(process.cwd(), 'site', 'public', 'install.sh'), 'utf8');
    const windows = readFileSync(join(process.cwd(), 'site', 'public', 'install.ps1'), 'utf8');
    expect(unix).toContain('SHA256SUMS');
    expect(unix).toMatch(/sha256sum -c/);
    expect(windows).toContain('Get-FileHash');
    expect(windows).toContain('Checksum did not match');
  });

  test('@claim:benchmark-12-of-15 ships a 15-case compatibility benchmark', () => {
    const benchmark = JSON.parse(readFileSync(join(process.cwd(), 'examples', 'compatibility-benchmark.json'), 'utf8'));
    expect(benchmark.threshold).toBe(12);
    expect(benchmark.cases).toHaveLength(15);
  });

  test('@claim:read-only-diagnosis collector contains no device-changing adb operation', () => {
    const source = readFileSync(join(process.cwd(), 'src', 'main.rs'), 'utf8');
    expect(source).not.toMatch(/\b(root|install|uninstall|disable-user|enable|setprop)\b/);
    expect(source).toContain('dumpsys');
    expect(source).toContain('getprop');
  });
});
