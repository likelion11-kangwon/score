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

/**
 * @type {string[]}
 */
const lastCommits = await Promise.all(
    input.request.team.users.map(user => user.githubUsername).map(async (username) => {
        let result = await $`git rev-parse --verify origin/${username}`.nothrow();

        if (result.exitCode !== 0) {
            return undefined;
        }

        return result.stdout.trim();
    })
).then(result => result.filter((e) => e !== undefined));


function nToS(n) {
    return ['영', '한', '두', '세', '네', '다섯'][n];
}

const minimumCommits = 2;
if (lastCommits.length < minimumCommits) {
    console.log(`ERROR: ${nToS(minimumCommits)} 명 이상의 팀원의 브랜치가 필요합니다. (현재 ${lastCommits.length}개)`);
    process.exit(0);
}

/**
 * @type {boolean[]}
 */
const authorAndCommits = await Promise.all(lastCommits.map(async (commit) => {
    const result = await $`git branch --contains ${commit}`.nothrow();

    if (result.exitCode !== 0) {
        return undefined;
    }

    return result.stdout.trim().split('\n').some(line => line.trim().slice(2) === 'main');
})).then(l => l.filter(e => e));

if (authorAndCommits.length < minimumCommits) {
    console.log(`ERROR: ${nToS(minimumCommits)} 개 이상의 브랜치를 병합해야 합니다. (현재 ${authorAndCommits.length}개)`);
    process.exit(0);
}

console.log('OK'); 
