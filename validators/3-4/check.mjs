#!/usr/bin/env node
import { $, cd, stdin } from 'zx';
import fs from 'fs';
import glob from 'glob';

$.verbose = false;

/**
 * @type {Input}
 */
const input = await stdin().then(input => JSON.parse(input));

if(input.imageFile === undefined) {
    console.log('ERROR: 파일이 주어져야 합니다.');
    process.exit(0);
}


const imageFile = Buffer.from(input.imageFile, 'base64');

const repositoryName = `team-${input.request.team.id}-third`

let result = await $`git clone https://github.com/likelion11-kangwon/${repositoryName}`.nothrow();

if (result.exitCode !== 0) {
    console.log(`ERROR: 레포지터리(likelion11-kangwon/${repositoryName})를 클론할 수 없습니다.`);
    process.exit(0);
}

const secret = await fs.promises.readFile('secret.png');
cd(repositoryName);


if(imageFile.compare(secret) !== 0) {
    console.log('ERROR: 이상엽의 파일이 아닙니다.');
    process.exit(0);
}

console.log('OK');