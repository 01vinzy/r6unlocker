const { app, BrowserWindow, ipcMain } = require('electron')
const pkgfile = require('./package.json')

const Injector = require('./structures/Injector.js')
const { Updater } = require('./structures/Updater.js')

ipcMain.on('injector', (event, arg) => {
  switch (arg) {
    case 'unlock':
      event.returnValue = Injector.unlockAll()
      break
    case 'normal':
      event.returnValue = Injector.normal()
      break
    case 'lock':
      event.returnValue = Injector.lock()
      break
  }
})

function createWindow () {
  const win = new BrowserWindow({
    title: 'Rainbow Six Injector v' + pkgfile.version,
    autoHideMenuBar: true,
    fullscreenable: false,
    width: 400,
    height: 400,
    webPreferences: {
      devTools: false,
      nodeIntegration: true
    }
  })
  win.loadFile('./static/index.html')
  Injector.openProcess()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', () => {
  Updater.checkForUpdatesAndNotify()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  };
})
