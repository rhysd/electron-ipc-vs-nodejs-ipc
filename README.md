Electron IPC v.s. Node.js IPC
=============================

## Introduction

As you know, JavaScript can't run on multi threads.  So, if we want to run Electron application without spoiling user experience on heavy work load, we must spawn another process.

In multi-process program, we can't avoid to use interprocess communication (IPC).  There are 2 ways to use it.

- Use main process as worker with Electron's `ipcMain` and `ipcRenderer` APIs.
- Fork renderer process and use Node.js IPC APIs (e.g. `process.send` and `'message'` event).

I want to know which one is better.

## Precondition

- OS X
  - MacBook Pro 2015 Mid
  - CPU: 2.7 GHz Intel Core i5
  - Memory: 8 GB 1867 MHz DDR3
  - Node.js 5.10.1
  - Electron 0.37.4

## How to Test

1. **Large Objects** Send 98 tweets full JSON from sender to receiver and receiver will return the ACK.  Measure each spent time.  Send them in serial.
2. **Small Objects** Send 98 tweets ids from sender to receiver and receiver will return the ACK.  Get each spent time.  Send them in serial.

Measure 10 times per each case.

## Result

### Average (nanosec)

|       | Node.js              | Electron           |
|-------|----------------------|--------------------|
| Large | 938029.1246169561 ms | 779345.2921348314  |
| Small | 832760.226762002 ms  | 406117.63636363635 |

### Variance

|       | Node.js        | Electron     |
|-------|----------------|--------------|
| Large | 45081610954226 | 110908047760 |
| Small | 43818214306282 | 72026021464  |

