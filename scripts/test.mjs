import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const grep = args.indexOf('--grep');
const pattern = grep >= 0 ? args[grep + 1] ?? '@claim' : undefined;
if (grep >= 0) args.splice(grep, 2, '-t', pattern);
const result = spawnSync('npx', ['vitest', 'run', ...args], { stdio: 'inherit' });
if (result.status !== 0) process.exit(result.status ?? 1);

if (pattern === '@claim:demo-storage-isolation') {
  const browser = spawnSync('npx', ['playwright', 'test', '--grep', pattern], { stdio: 'inherit' });
  process.exit(browser.status ?? 1);
}
