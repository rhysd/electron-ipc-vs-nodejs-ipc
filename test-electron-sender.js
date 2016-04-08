'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
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

app.on('ready', () => {
    const win = new BrowserWindow({show: false});
    const wc = win.webContents;

    function send_one() {
        const tw = tweets[index];
        start_time = process.hrtime();
        wc.send('ipc-test', full_json ? tw : tw.id);
    }

    wc.on('dom-ready', () => {
        ipc.on('ipc-ack', () => {
            const diff = spent_nano_sec();
            fs.appendFileSync('electron_result.txt', `${diff}\n`);
            if (index >= tweets.length) {
                app.quit();
                return;
            }

            send_one();
            ++index;
        });

        send_one();
    });
    win.loadURL('file://' + __dirname + '/test-electron-receiver.html');
});

