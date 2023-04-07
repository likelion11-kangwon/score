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

result = await $`git rev-parse --verify origin/${input.request.user.githubUsername}`.nothrow();

if (result.exitCode !== 0) {
    console.log(`ERROR: 브랜치(${input.request.user.githubUsername})를 확인 할 수 없습니다.`);
    process.exit(0);
}

await $`git checkout ${input.request.user.githubUsername}`;

result = await $`git log -1 --pretty=format:'%an'`;
const lastAuthorName = result.stdout.trim();

if (lastAuthorName !== input.request.user.githubUsername) {
    console.log(`ERROR: 최근 커밋의 작성자가 '${input.request.user.githubUsername}'이 아닙니다.`);
    process.exit(0);
}

result = await $`[ -f ${input.request.user.name} ]`.nothrow();
if (result.exitCode !== 0) {
    console.log(`ERROR: '${input.request.user.name}' 파일이 없습니다.`);
    process.exit(0);
}

console.log('OK'); 
