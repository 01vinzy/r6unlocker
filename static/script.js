/* eslint-disable no-unused-vars */
const { ipcRenderer } = require('electron')

const statusProcess = ipcRenderer.sendSync('processOpen')
if (statusProcess) {
  setGameStatus('yes')
}

function setGameStatus (running) {
  const runs = { yes: { n: 'Running', c: 'green' }, no: { n: 'Not Running', c: 'red' } }
  const isRunning = runs[running]
  document.getElementById('processstatus').innerHTML = 'Game Status: <b style="color:' + isRunning.c + ';">' + isRunning.n + '</b>'
  if (running === 'yes' && !document.getElementById('injectorStart').disabled) {
    document.getElementById('injectorStart').disabled = true
  };
};

function unlockAll () {
  const res = ipcRenderer.sendSync('injector', 'unlock')
  setMessageBox(res, 'unlock')
};

function normal () {
  const res = ipcRenderer.sendSync('injector', 'normal')
  setMessageBox(res, 'normal')
};

function startGame () {
  const res = ipcRenderer.sendSync('injector', 'start')
  setMessageBox(res, 'start')
};

function resetButtons () {
  document.getElementById('injectorNormal').disabled = true
  document.getElementById('injectorUnlock').disabled = false
  document.getElementById('injectorLock').disabled = false
  document.getElementById('injectorStart').disabled = false
};

function setMessageBox (result, type) {
  let disable = false
  if (result.type === 'success' || result.type === 'warning') { disable = true };
  if (type === 'normal') {
    document.getElementById('injectorNormal').disabled = disable
    if (disable) { document.getElementById('injectorLock').disabled = false; document.getElementById('injectorUnlock').disabled = false }
  };
  if (type === 'unlock') {
    document.getElementById('injectorUnlock').disabled = disable
    if (disable) { document.getElementById('injectorLock').disabled = false; document.getElementById('injectorNormal').disabled = false }
  };
  if (type === 'start') document.getElementById('injectorStart').disabled = disable

  if (result.type === 'success') {
    setGameStatus('yes')
    document.getElementById('messagebx').className = 'success'
    document.getElementById('messagebx').innerHTML = result.message
  }
  if (result.type === 'warning') {
    setGameStatus('yes')
    document.getElementById('messagebx').className = 'warning'
    document.getElementById('messagebx').innerHTML = '<strong>Warning:</strong> ' + result.message
  };
  if (result.type === 'error') {
    if (result.message.startsWith('Could not find process')) resetButtons()
    setGameStatus('no')
    document.getElementById('messagebx').className = 'alert'
    document.getElementById('messagebx').innerHTML = '<strong>Error:</strong> ' + result.message
  };
};

function openInfoWindow () {
  const data = ipcRenderer.sendSync('info')
  alert('Version ' + data.version + '\nBy ' + data.owner + '\nGitHub: ' + data.repository)
};
