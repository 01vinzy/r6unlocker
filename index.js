/* eslint-disable no-case-declarations */
const fs = require('fs')

const Config = require('./structures/Config.js')
const Electron = require('./structures/Electron.js')
const Injector = require('./structures/Injector.js')
const pkgfile = require('./package.json')

global.owner = pkgfile.author
global.version = pkgfile.version
global.repository = pkgfile.repository.url.split('git+')[1].split('.git')[0]

Electron.start()

Electron.ipcMain.on('injector', (event, arg) => {
  if (arg === 'start') {
    const config = Config.read()
    if (!config) {
      event.returnValue = { type: 'error', message: 'No path configured. You must start the game manually at least once to create the path configuration.' }
    } else {
      if (!fs.existsSync(config.path)) {
        event.returnValue = { type: 'error', message: 'The path in the config is invalid. You must start the game manually at least once to create the path configuration.' }
      } else {
        if (Injector.openProcess() === 'OK') event.returnValue = { type: 'warning', message: 'Game already started' }
        require('child_process').exec('"' + config.path + '" /belaunch -be')
        event.returnValue = { type: 'success', message: 'Starting the game without BattleEye...' }
      };
    }
  };
  if (arg === 'unlock') {
    const unlock = Injector.unlockAll()
    if (unlock !== 'OK') { event.returnValue = { type: 'error', message: unlock } } else { event.returnValue = { type: 'success', message: 'Successfully unlocked everything.' } }
  };
  if (arg === 'lock') {
    const lock = Injector.lock()
    if (lock !== 'OK') { event.returnValue = { type: 'error', message: lock } } else { event.returnValue = { type: 'success', message: 'Successfully locked everything.' } }
  };
  if (arg === 'normal') {
    const normal = Injector.normal()
    if (normal !== 'OK') { event.returnValue = { type: 'error', message: normal } } else { event.returnValue = { type: 'success', message: 'Successfully normalized.' } }
  };
})

Electron.ipcMain.on('info', (event, arg) => {
  event.returnValue = { owner: global.owner, version: global.version, repository: global.repository }
})

Electron.ipcMain.on('processOpen', (event) => {
  const open = Injector.openProcess()
  if (open === 'OK') {
    event.returnValue = true
  } else {
    event.returnValue = false
  }
})
