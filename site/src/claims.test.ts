import { execFileSync } from 'node:child_process';
import { chmodSync, existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

const releaseVersion = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8')).version as string;
const releaseTag = `v${releaseVersion}`;
const releaseApi = `https://api.github.com/repos/B-Divyesh/sf-android-compat-scout/releases/tags/${releaseTag}`;
const releaseBase = `https://github.com/B-Divyesh/sf-android-compat-scout/releases/download/${releaseTag}`;
const installableAssets = [
  `android-compat-scout-${releaseVersion}-1.x86_64.rpm`,
  'android-compat-scout-aarch64-apple-darwin.pkg',
  'android-compat-scout-x86_64-apple-darwin.pkg',
  `android-compat-scout_${releaseVersion}_amd64.deb`,
  'compat-scout',
  'compat-scout-aarch64-apple-darwin.tar.gz',
  'compat-scout-aarch64-unknown-linux-musl.tar.gz',
  'compat-scout-x86_64-apple-darwin.tar.gz',
  'compat-scout-x86_64-pc-windows-msvc.zip',
  'compat-scout-x86_64-unknown-linux-musl.tar.gz',
  'compat-scout.exe',
] as const;

function fakeAdb(sandbox: string) {
  const adb = join(sandbox, 'fake-adb');
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
  return adb;
}

function powershell(): string {
  try {
    execFileSync('pwsh', ['-NoLogo', '-NoProfile', '-Command', '$PSVersionTable.PSVersion.ToString()'], { stdio: 'pipe' });
    return 'pwsh';
  } catch {
    const root = join(tmpdir(), 'compat-scout-powershell-7.5.2');
    const binary = join(root, 'pwsh');
    if (!existsSync(binary)) {
      const archive = join(tmpdir(), 'compat-scout-powershell-7.5.2.tar.gz');
      mkdirSync(root, { recursive: true });
      execFileSync('curl', ['-fsSL', 'https://github.com/PowerShell/PowerShell/releases/download/v7.5.2/powershell-7.5.2-linux-x64.tar.gz', '-o', archive]);
      execFileSync('tar', ['-xzf', archive, '-C', root]);
      chmodSync(binary, 0o755);
      rmSync(archive, { force: true });
    }
    return binary;
  }
}

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
    const adb = fakeAdb(sandbox);
    const output = join(sandbox, 'snapshot.json');
    try {
      execFileSync('cargo', ['run', '--quiet', '--', 'snapshot', '--adb', adb, '--out', output, '--json'], { cwd: process.cwd() });
      const serialized = readFileSync(output, 'utf8');
      for (const sensitive of ['serial-should-not-export', 'secret-build-value', 'PrivateWifi', '00:11:22:33:44:55']) expect(serialized).not.toContain(sensitive);
    } finally {
      rmSync(sandbox, { recursive: true, force: true });
    }
  });

  test('@claim:snapshot-json approved fake ADB facts are saved as JSON', () => {
    const sandbox = mkdtempSync(join(tmpdir(), 'compat-scout-snapshot-'));
    const output = join(sandbox, 'snapshot.json');
    try {
      const stdout = execFileSync('cargo', ['run', '--quiet', '--', 'snapshot', '--adb', fakeAdb(sandbox), '--out', output, '--json'], { cwd: process.cwd(), encoding: 'utf8' });
      const saved = JSON.parse(readFileSync(output, 'utf8'));
      expect(JSON.parse(stdout)).toEqual(saved);
      expect(saved.format).toBe('android-compat-scout/snapshot-1');
      expect(saved.device).toMatchObject({ manufacturer: 'Fixture', model: 'Phone', android_release: '15', sdk: '35' });
      expect(saved.apps).toEqual(expect.arrayContaining([expect.objectContaining({ package: 'fixture.app', version: '1.0' })]));
    } finally {
      rmSync(sandbox, { recursive: true, force: true });
    }
  });

  test('@claim:compare-json compares before and after snapshots into a JSON report', () => {
    const sandbox = mkdtempSync(join(tmpdir(), 'compat-scout-compare-'));
    const output = join(sandbox, 'report.json');
    try {
      const stdout = execFileSync('cargo', ['run', '--quiet', '--', 'compare', 'examples/before-android-14.json', 'examples/after-android-15.json', '--out', output, '--json'], { cwd: process.cwd(), encoding: 'utf8' });
      const saved = JSON.parse(readFileSync(output, 'utf8'));
      expect(JSON.parse(stdout)).toEqual(saved);
      expect(saved.format).toBe('android-compat-scout/report-1');
      expect(saved.findings).toHaveLength(6);
      expect(saved.findings.map((item: { category: string }) => item.category)).toEqual(expect.arrayContaining(['OS version', 'Connectivity', 'Missing component', 'App version', 'Permission']));
    } finally {
      rmSync(sandbox, { recursive: true, force: true });
    }
  });

  test('@claim:requirements-check checks a snapshot against declared setup needs', () => {
    const sandbox = mkdtempSync(join(tmpdir(), 'compat-scout-check-'));
    const output = join(sandbox, 'check.json');
    try {
      const stdout = execFileSync('cargo', ['run', '--quiet', '--', 'check', 'examples/after-android-15.json', 'examples/fermata-requirements.json', '--out', output, '--json'], { cwd: process.cwd(), encoding: 'utf8' });
      const saved = JSON.parse(readFileSync(output, 'utf8'));
      expect(JSON.parse(stdout)).toEqual(saved);
      expect(saved.format).toBe('android-compat-scout/check-1');
      expect(saved.findings.map((item: { category: string }) => item.category)).toEqual(expect.arrayContaining(['Permission', 'Missing component']));
    } finally {
      rmSync(sandbox, { recursive: true, force: true });
    }
  });

  test('@claim:sample-six-changes bundled sample contains exactly six changes', () => {
    const sandbox = mkdtempSync(join(tmpdir(), 'compat-scout-six-'));
    try {
      const stdout = execFileSync('cargo', ['run', '--quiet', '--', 'demo', '--out-dir', sandbox, '--json'], { cwd: process.cwd(), encoding: 'utf8' });
      const result = JSON.parse(stdout);
      expect(result.report.findings).toHaveLength(6);
      expect(result.report.summary).toBe('Found 6 changes.');
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

  test('@claim:local-installed-release downloaded public Linux release runs its bundled demo from a consumer folder', () => {
    const work = mkdtempSync(join(tmpdir(), 'compat-scout-public-release-'));
    const asset = 'compat-scout-x86_64-unknown-linux-musl.tar.gz';
    try {
      execFileSync('curl', ['-fsSL', `${releaseBase}/SHA256SUMS`, '-o', join(work, 'SHA256SUMS')]);
      execFileSync('curl', ['-fsSL', `${releaseBase}/${asset}`, '-o', join(work, asset)]);
      const sums = readFileSync(join(work, 'SHA256SUMS'), 'utf8');
      const expected = sums.match(new RegExp(`^([a-f0-9]{64})  ${asset.replace(/[.]/g, '\\.')}$`, 'm'))?.[1];
      expect(expected).toBeTruthy();
      expect(createHash('sha256').update(readFileSync(join(work, asset))).digest('hex')).toBe(expected);
      execFileSync('tar', ['-xzf', join(work, asset), '-C', work]);
      const consumer = join(work, 'consumer');
      mkdirSync(consumer);
      const output = execFileSync(join(work, 'compat-scout'), ['demo', '--json'], { cwd: consumer, encoding: 'utf8' });
      const result = JSON.parse(output);
      expect(existsSync(join(result.out_dir, 'compat-report.json'))).toBe(true);
      expect(existsSync(join(result.out_dir, 'compat-check.json'))).toBe(true);
      rmSync(result.out_dir, { recursive: true, force: true });
    } finally {
      rmSync(work, { recursive: true, force: true });
    }
  }, 60_000);

  test('@claim:release-download-checksums every installable release asset matches SHA256SUMS', () => {
    const work = mkdtempSync(join(tmpdir(), 'compat-scout-release-checksum-'));
    try {
      execFileSync('curl', ['-fsSL', `${releaseBase}/SHA256SUMS`, '-o', join(work, 'SHA256SUMS')]);
      const checksumEntries = new Map(readFileSync(join(work, 'SHA256SUMS'), 'utf8').trim().split('\n').map((line) => {
        const match = line.match(/^([a-f0-9]{64})\s+(.+)$/);
        if (!match) throw new Error(`Invalid SHA256SUMS line: ${line}`);
        return [match[2], match[1]];
      }));
      expect([...checksumEntries.keys()].sort()).toEqual([...installableAssets].sort());
      for (const asset of installableAssets) {
        execFileSync('curl', ['-fsSL', `${releaseBase}/${asset}`, '-o', join(work, asset)]);
        expect(createHash('sha256').update(readFileSync(join(work, asset))).digest('hex'), asset).toBe(checksumEntries.get(asset));
      }
    } finally {
      rmSync(work, { recursive: true, force: true });
    }
  }, 120_000);

  test('@claim:release-distribution public release publishes the documented assets, tap formula, and Scoop manifest', () => {
    const release = JSON.parse(execFileSync('curl', ['-fsSL', releaseApi], { encoding: 'utf8' }));
    const latestRelease = JSON.parse(execFileSync('curl', ['-fsSL', 'https://api.github.com/repos/B-Divyesh/sf-android-compat-scout/releases/latest'], { encoding: 'utf8' }));
    expect(latestRelease.tag_name).toBe(releaseTag);
    const names = release.assets.map((asset: { name: string }) => asset.name);
    const expectedAssets = [...installableAssets, 'SHA256SUMS', 'latest.json', 'android-compat-scout.json', 'android-compat-scout.rb'];
    expect(names.sort()).toEqual(expectedAssets.sort());
    const latest = JSON.parse(execFileSync('curl', ['-fsSL', `${releaseBase}/latest.json`], { encoding: 'utf8' }));
    expect(latest.version).toBe(releaseVersion);
    const expectedLatest = {
      aarch64_apple_darwin: `${releaseBase}/compat-scout-aarch64-apple-darwin.tar.gz`,
      aarch64_unknown_linux_musl: `${releaseBase}/compat-scout-aarch64-unknown-linux-musl.tar.gz`,
      x86_64_apple_darwin: `${releaseBase}/compat-scout-x86_64-apple-darwin.tar.gz`,
      x86_64_pc_windows_msvc: `${releaseBase}/compat-scout-x86_64-pc-windows-msvc.zip`,
      x86_64_unknown_linux_musl: `${releaseBase}/compat-scout-x86_64-unknown-linux-musl.tar.gz`,
    };
    expect(latest.assets).toEqual(expectedLatest);
    const publicSums = new Map(execFileSync('curl', ['-fsSL', `${releaseBase}/SHA256SUMS`], { encoding: 'utf8' }).trim().split('\n').map((line: string) => {
      const match = line.match(/^([a-f0-9]{64})\s+(.+)$/)!;
      return [match[2], match[1]];
    }));
    const formula = execFileSync('curl', ['-fsSL', 'https://raw.githubusercontent.com/B-Divyesh/homebrew-android-compat-scout/main/Formula/android-compat-scout.rb'], { encoding: 'utf8' });
    expect(formula).toContain('class AndroidCompatScout < Formula');
    expect(formula).toContain(`releases/download/${releaseTag}`);
    expect(formula).toContain(publicSums.get('compat-scout-aarch64-apple-darwin.tar.gz'));
    expect(formula).toContain(publicSums.get('compat-scout-x86_64-apple-darwin.tar.gz'));
    const scoop = execFileSync('curl', ['-fsSL', `${releaseBase}/android-compat-scout.json`], { encoding: 'utf8' });
    const scoopManifest = JSON.parse(scoop);
    expect(scoopManifest.version).toBe(releaseVersion);
    expect(scoopManifest.architecture['64bit']).toEqual({
      url: `${releaseBase}/compat-scout-x86_64-pc-windows-msvc.zip`,
      bin: 'compat-scout.exe',
      hash: publicSums.get('compat-scout-x86_64-pc-windows-msvc.zip'),
    });
    expect(JSON.parse(readFileSync(join(process.cwd(), 'scoop-bucket', 'android-compat-scout.json'), 'utf8'))).toEqual(scoopManifest);
    const wingetRoot = join(process.cwd(), 'winget', 'android-compat-scout', releaseVersion);
    const wingetInstaller = readFileSync(join(wingetRoot, 'Sociobot.AndroidCompatScout.installer.yaml'), 'utf8');
    expect(wingetInstaller).toContain(`PackageVersion: ${releaseVersion}`);
    expect(wingetInstaller).toContain(`InstallerUrl: ${releaseBase}/compat-scout-x86_64-pc-windows-msvc.zip`);
    expect(wingetInstaller).toContain(`InstallerSha256: ${publicSums.get('compat-scout-x86_64-pc-windows-msvc.zip')?.toUpperCase()}`);
    for (const file of ['Sociobot.AndroidCompatScout.yaml', 'Sociobot.AndroidCompatScout.locale.en-US.yaml']) {
      expect(readFileSync(join(wingetRoot, file), 'utf8')).toContain(`PackageVersion: ${releaseVersion}`);
    }
    const workflow = readFileSync(join(process.cwd(), '.github', 'workflows', 'release.yml'), 'utf8');
    expect(workflow).toContain('pkgbuild --root');
    expect(workflow).not.toMatch(/codesign|signtool|WINDOWS_CERT_PFX|APPLE_CERTIFICATE/);
  }, 60_000);

  test('@claim:checksum-unix-installer Unix installer rejects a bad checksum before placement', () => {
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
    } finally {
      rmSync(sandbox, { recursive: true, force: true });
    }
  });

  test('@claim:checksum-windows-installer PowerShell installer rejects a bad checksum before placement', () => {
    const sandbox = mkdtempSync(join(tmpdir(), 'compat-scout-windows-installer-'));
    const release = join(sandbox, 'release');
    const localAppData = join(sandbox, 'local-app-data');
    const temp = join(sandbox, 'temp');
    const fixtureBinary = join(sandbox, 'compat-scout.exe');
    const asset = 'compat-scout-x86_64-pc-windows-msvc.zip';
    const wrapper = join(sandbox, 'run-installer.ps1');
    mkdirSync(release); mkdirSync(localAppData); mkdirSync(temp);
    writeFileSync(fixtureBinary, 'behavioral PowerShell installer fixture\n');
    execFileSync('zip', ['-j', join(release, asset), fixtureBinary]);
    const hash = createHash('sha256').update(readFileSync(join(release, asset))).digest('hex');
    writeFileSync(join(release, 'SHA256SUMS'), `${hash}  ${asset}\n`);
    const psPath = (value: string) => value.replaceAll("'", "''");
    writeFileSync(wrapper, `$env:TEMP = '${psPath(temp)}'
$env:LOCALAPPDATA = '${psPath(localAppData)}'
$fixtureRelease = '${psPath(release)}'
function Invoke-WebRequest {
  param([Parameter(Position=0)][string]$Uri, [string]$OutFile)
  Copy-Item (Join-Path $fixtureRelease (Split-Path $Uri -Leaf)) $OutFile
}
& '${psPath(join(process.cwd(), 'site', 'public', 'install.ps1'))}'
`);
    const destination = join(localAppData, 'CompatScout', 'bin', 'compat-scout.exe');
    try {
      const pwsh = powershell();
      execFileSync(pwsh, ['-NoLogo', '-NoProfile', '-File', wrapper], { stdio: 'pipe' });
      expect(existsSync(destination)).toBe(true);
      rmSync(join(localAppData, 'CompatScout'), { recursive: true, force: true });
      writeFileSync(join(release, 'SHA256SUMS'), `00${hash.slice(2)}  ${asset}\n`);
      expect(() => execFileSync(pwsh, ['-NoLogo', '-NoProfile', '-File', wrapper], { stdio: 'pipe' })).toThrow();
      expect(existsSync(destination)).toBe(false);
    } finally {
      rmSync(sandbox, { recursive: true, force: true });
    }
  }, 120_000);

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

  test('@claim:cli-interface-options documented commands provide help and accept --json', () => {
    for (const command of ['snapshot', 'compare', 'check', 'demo']) {
      const help = execFileSync('cargo', ['run', '--quiet', '--', command, '--help'], { cwd: process.cwd(), encoding: 'utf8' });
      expect(help).toContain('--json');
    }
    const rootHelp = execFileSync('cargo', ['run', '--quiet', '--', '--help'], { cwd: process.cwd(), encoding: 'utf8' });
    expect(rootHelp).toContain('snapshot');
    expect(rootHelp).toContain('compare');
    expect(rootHelp).toContain('check');
    expect(rootHelp).toContain('demo');
  });
});
