const { autoUpdater } = require('electron-updater')
const log = require('electron-log')

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'

log.info('App starting...')

autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...')
})

autoUpdater.on('update-available', (info) => {
  log.info('Update available.')
})
autoUpdater.on('update-not-available', (info) => {
  log.info('Update not available.')
})
autoUpdater.on('error', (err) => {
  log.info('Error in auto-updater. ' + err)
})
autoUpdater.on('download-progress', (progressObj) => {
  log.info('Download speed: ' + progressObj.bytesPerSecond + ' - Downloaded ' + progressObj.percent + '% (' + progressObj.transferred + '/' + progressObj.total + ')')
})
autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded')
})

exports.Updater = autoUpdater
