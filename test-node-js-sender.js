'use strict';

const fs = require('fs');
const cp = require('child_process');

const full_json = process.env.TEST_TYPE === 'case1';
console.error(full_json ? 'Start case1' : 'Start case2');

let start_time;
let index = 0;
const tweets = JSON.parse(fs.readFileSync('data.json', 'utf8'));

function spent_nano_sec() {
    const end_time = process.hrtime();
    const s = start_time[0] * 1e9 + start_time[1];
    const e = end_time[0] * 1e9 + end_time[1];
    return e - s;
}

const c = cp.fork('test-node-js-receiver.js');
function send_one() {
    const tw = tweets[index];
    start_time = process.hrtime();
    c.send({
        channel: 'ipc-send',
        arg: full_json ? tw : tw.id,
    });
}

c.on('message', () => {
    const diff = spent_nano_sec();
    fs.appendFileSync('node_js_result.txt', `${diff}\n`);
    if (index >= tweets.length) {
        process.exit(0);
        return;
    }

    send_one();
    ++index;
});

send_one();
