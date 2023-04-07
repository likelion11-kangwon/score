#!/usr/bin/env node
import { $, cd, stdin } from 'zx';

$.verbose = false;

/**
 * @type {Input}
 */
const input = await stdin().then(input => JSON.parse(input));

const repositoryName = `team-${input.request.team.id}-first`

let result = await $`git clone https://github.com/likelion11-kangwon/${repositoryName}`.nothrow();

if (result.exitCode !== 0) {
    console.log(`ERROR: 레포지터리(likelion11-kangwon/${repositoryName})를 클론할 수 없습니다.`);
    process.exit(0);
}

cd(repositoryName);

result = await $`git rev-parse --verify origin/main`;
const main = result.stdout.trim();
result = await $`git rev-parse --verify origin/${input.request.user.githubUsername}`
const user = result.stdout.trim();

if (main !== user) {
    console.log(`ERROR: 'main' 브랜치와 '${input.request.user.githubUsername}' 브랜치가 동일하지 않습니다.`);
    process.exit(0);
}

console.log('OK');