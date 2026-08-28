import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
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
});
