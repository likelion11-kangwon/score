#!/usr/bin/env node
import { $, cd, stdin } from 'zx';

$.verbose = false;

/**
 * @type {Input}
 */
const input = await stdin().then(input => JSON.parse(input));

const repositoryName = `team-${input.request.team.id}-second`

let result = await $`git clone https://github.com/likelion11-kangwon/${repositoryName}`.nothrow();

if (result.exitCode !== 0) {
    console.log(`ERROR: 레포지터리(likelion11-kangwon/${repositoryName})를 클론할 수 없습니다.`);
    process.exit(0);
}

cd(repositoryName);

result = await $`git rev-parse --verify origin/${input.request.user.githubUsername}`.nothrow();

if (result.exitCode !== 0) {
    console.log(`ERROR: 브랜치(${input.request.user.githubUsername})를 확인 할 수 없습니다.`);
    process.exit(0);
}

const lastCommitInBranch = result.stdout.trim();

result = await $`git log origin/main --pretty=format:'%H'`;
const commitsInMain = result.stdout.trim().split('\n').map(e => e.trim());

if (!commitsInMain.includes(lastCommitInBranch)) {
    console.log(`ERROR: '${input.request.user.githubUsername}'의 커밋이 main 브랜치에 병합되지 않았습니다.`);
    process.exit(0);
}

console.log('OK'); 
