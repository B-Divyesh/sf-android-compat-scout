import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const grep = args.indexOf('--grep');
if (grep >= 0) args.splice(grep, 2, '-t', args[grep + 1] ?? '@claim');
const result = spawnSync('npx', ['vitest', 'run', ...args], { stdio: 'inherit' });
process.exit(result.status ?? 1);
