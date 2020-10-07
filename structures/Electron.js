const { app, BrowserWindow, ipcMain } = require('electron')
const pkgfile = require('../package.json')
const { Updater } = require('./Updater.js')

exports.ipcMain = ipcMain

function createMainWindow () {
  const win = new BrowserWindow({
    title: 'Rainbow Six Injector v' + pkgfile.version,
    autoHideMenuBar: true,
    fullscreenable: false,
    resizable: false,
    darkTheme: true,
    width: 650,
    height: 250,
    webPreferences: {
      devTools: true,
      nodeIntegration: true
    }
  })
  win.loadFile('./static/index.html')
};

exports.start = function () {
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  app.on('ready', () => {
    createMainWindow()
    Updater.checkForUpdatesAndNotify()
  })
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    };
  })
}
