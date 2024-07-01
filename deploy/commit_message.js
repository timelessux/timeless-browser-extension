import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const packageJsonPath = resolve(process.cwd(), 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

const { version } = packageJson;

const commitMessage = `version to ${version}`;

execSync(`git add -A && git commit -a -m "${commitMessage}" && git push`, { stdio: 'inherit' });
