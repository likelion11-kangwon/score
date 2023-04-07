#!/usr/bin/env node
import { $, cd, stdin } from 'zx';
import fs from 'fs';
import { fileTypeFromBuffer } from 'file-type';
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

if(await fileTypeFromBuffer(imageFile).then(result => result === undefined || !result.mime.startsWith('image/'))) {
    console.log('ERROR: 업로드 한 파일이 이미지가 아닙니다.');
    process.exit(0);
}

const repositoryName = `team-${input.request.team.id}-third`

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

const files = await glob('**/*');
const filesWithSizes = await Promise.all(files.map(async file => fs.promises.stat(file).then(s => ({path: file, size: s.size}))))

/**
 * @param {Buffer} compareTo 
 * @returns {Promise<boolean>}
 */
async function hasFile(compareTo) {
    let sameSizeFiles = filesWithSizes.filter(({size}) => size === compareTo.length);
    return await Promise.all(
        sameSizeFiles.map(f => fs.promises.readFile(f.path).then(buffer => buffer.compare(compareTo) === 0))
    ).then(l => l.some(same => same));
}

if(await hasFile(imageFile)) {
    console.log('ERROR: 파일 중 이미지가 포함돼있습니다.');
    process.exit(0);
}

await $`echo -n ${input.request.user.name}`.pipe($`python crypto/generate_password.py`);
const passwordFile = await fs.promises.readFile(`${input.request.user.name}-password`)

if(await hasFile(passwordFile)) {
    console.log('ERROR: 파일 중 비밀번호가 포함돼있습니다.');
    process.exit(0);
}

await fs.promises.writeFile('tempImageFile', imageFile);
await $`echo -n ${input.request.user.name}`.pipe($`python crypto/encrypt.py tempImageFile`);

const encrypted = await fs.promises.readFile(await glob('tempImageFile-*').then(files => files[0]));
if(!await hasFile(encrypted)) {
    console.log('ERROR: 암호화 된 이미지 파일이 없습니다.');
    process.exit(0);
}

console.log('OK');
