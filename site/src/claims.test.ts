import { execFileSync } from 'node:child_process';
import { chmodSync, existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

describe('sandbox claims', () => {
  test('@claim:sample-report bundled demo writes a categorized report', () => {
    const out = mkdtempSync(join(tmpdir(), 'compat-scout-'));
    try {
      execFileSync('cargo', ['run', '--quiet', '--', 'demo', '--out-dir', out, '--json'], { cwd: process.cwd() });
      const report = JSON.parse(readFileSync(join(out, 'compat-report.json'), 'utf8'));
      expect(existsSync(join(out, 'compat-check.json'))).toBe(true);
      expect(report.findings.map((x: { category: string }) => x.category)).toEqual(expect.arrayContaining(['OS version', 'Permission', 'Missing component', 'Connectivity']));
    } finally {
      rmSync(out, { recursive: true, force: true });
    }
  });

  test('@claim:redacted-export fake ADB output is redacted before serialization', () => {
    const sandbox = mkdtempSync(join(tmpdir(), 'compat-scout-adb-'));
    const adb = join(sandbox, 'fake-adb');
    const output = join(sandbox, 'snapshot.json');
    writeFileSync(adb, `#!/bin/sh
case "$*" in
  devices) printf 'List of devices attached\\nserial-should-not-export device\\n' ;;
  *'getprop ro.product.manufacturer') printf 'Fixture\\n' ;;
  *'getprop ro.product.model') printf 'Phone\\n' ;;
  *'getprop ro.build.version.release') printf '15\\n' ;;
  *'getprop ro.build.version.sdk') printf '35\\n' ;;
  *'getprop ro.build.fingerprint') printf 'fixture/phone/secret-build-value\\n' ;;
  *'pm list packages -3') printf 'package:fixture.app\\n' ;;
  *'dumpsys package fixture.app') printf 'versionName=1.0\\nandroid.permission.CAMERA: granted=true\\n' ;;
  *'dumpsys usb') printf 'mCurrentFunctions: mtp\\n' ;;
  *'dumpsys wifi') printf 'Wi-Fi enabled SSID: PrivateWifi 00:11:22:33:44:55\\n' ;;
esac
`);
    chmodSync(adb, 0o755);
    try {
      execFileSync('cargo', ['run', '--quiet', '--', 'snapshot', '--adb', adb, '--out', output, '--json'], { cwd: process.cwd() });
      const serialized = readFileSync(output, 'utf8');
      for (const sensitive of ['serial-should-not-export', 'secret-build-value', 'PrivateWifi', '00:11:22:33:44:55']) expect(serialized).not.toContain(sensitive);
    } finally {
      rmSync(sandbox, { recursive: true, force: true });
    }
  });

  test('@claim:installed-demo installed command runs outside the repository', () => {
    const work = mkdtempSync(join(tmpdir(), 'compat-scout-consumer-'));
    const root = join(work, 'installed');
    try {
      execFileSync('cargo', ['install', '--path', process.cwd(), '--root', root, '--locked'], { cwd: work, stdio: 'pipe' });
      const output = execFileSync(join(root, 'bin', 'compat-scout'), ['demo', '--json'], { cwd: work, encoding: 'utf8' });
      const result = JSON.parse(output);
      expect(existsSync(join(result.out_dir, 'compat-report.json'))).toBe(true);
      expect(existsSync(join(result.out_dir, 'compat-check.json'))).toBe(true);
      rmSync(result.out_dir, { recursive: true, force: true });
    } finally {
      rmSync(work, { recursive: true, force: true });
    }
  }, 60_000);

  test('@claim:checksum-installers Unix installer rejects a bad checksum before placement', () => {
    const sandbox = mkdtempSync(join(tmpdir(), 'compat-scout-installer-'));
    const release = join(sandbox, 'release');
    const mockBin = join(sandbox, 'mock-bin');
    const asset = 'compat-scout-x86_64-unknown-linux-musl.tar.gz';
    const home = join(sandbox, 'home');
    mkdirSync(release); mkdirSync(mockBin); mkdirSync(home);
    writeFileSync(join(sandbox, 'compat-scout'), '#!/bin/sh\necho fixture\n');
    chmodSync(join(sandbox, 'compat-scout'), 0o755);
    execFileSync('tar', ['-czf', join(release, asset), '-C', sandbox, 'compat-scout']);
    const hash = createHash('sha256').update(readFileSync(join(release, asset))).digest('hex');
    writeFileSync(join(release, 'SHA256SUMS'), `${hash}  ${asset}\n`);
    writeFileSync(join(mockBin, 'curl'), `#!/bin/sh
url=''; out=''; next=0
for arg in "$@"; do
  if [ "$next" = 1 ]; then out="$arg"; next=0; continue; fi
  [ "$arg" = '-o' ] && next=1 || url="$arg"
done
cp "$FIXTURE_RELEASE/$(basename "$url")" "$out"
`);
    chmodSync(join(mockBin, 'curl'), 0o755);
    const env = { ...process.env, PATH: `${mockBin}:${process.env.PATH}`, FIXTURE_RELEASE: release, HOME: home };
    try {
      execFileSync('sh', [join(process.cwd(), 'site', 'public', 'install.sh')], { env, stdio: 'pipe' });
      expect(existsSync(join(home, '.local', 'bin', 'compat-scout'))).toBe(true);
      rmSync(join(home, '.local'), { recursive: true, force: true });
      writeFileSync(join(release, 'SHA256SUMS'), `00${hash.slice(2)}  ${asset}\n`);
      expect(() => execFileSync('sh', [join(process.cwd(), 'site', 'public', 'install.sh')], { env, stdio: 'pipe' })).toThrow();
      expect(existsSync(join(home, '.local', 'bin', 'compat-scout'))).toBe(false);
      const windows = readFileSync(join(process.cwd(), 'site', 'public', 'install.ps1'), 'utf8');
      expect(windows).toContain('Get-FileHash');
      expect(windows).toContain('Checksum did not match');
    } finally {
      rmSync(sandbox, { recursive: true, force: true });
    }
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
