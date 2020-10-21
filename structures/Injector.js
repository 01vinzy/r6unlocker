const memoryjs = require('memoryjs')

const Config = require('./Config.js')

let RainbowProcess
let lastPath

const offsets = {
  base: 59007044,

  unlock: Buffer.from([0x41, 0xC6, 0x46, 0x51, 0x00, 0x90]),
  normal: Buffer.from([0x34, 0x01, 0x41, 0x88, 0x46, 0x51]),
  lock: Buffer.from([0x41, 0xC6, 0x46, 0x51, 0x01, 0x90])
}

exports.openProcess = function () {
  try {
    const process = memoryjs.openProcess('RainbowSix.exe')
    const module = memoryjs.findModule('RainbowSix.exe', process.th32ProcessID)
    if (process) RainbowProcess = process
    if (module && module.szExePath && (!lastPath || lastPath !== module.szExePath)) {
      Config.write({ path: module.szExePath })
    };
    return 'OK'
  } catch (error) {
    return 'Could not find process. Make sure that you are not using TTS or Vulcan.'
  };
}

exports.unlockAll = function () {
  const open = exports.openProcess()
  if (open !== 'OK') { return open };
  try {
    memoryjs.writeBuffer(RainbowProcess.handle, RainbowProcess.modBaseAddr + offsets.base, offsets.unlock)
    return 'OK'
  } catch (error) {
    return 'Could not write values.'
  }
}

exports.lock = function () {
  const open = exports.openProcess()
  if (open !== 'OK') { return open };
  try {
    memoryjs.writeBuffer(RainbowProcess.handle, RainbowProcess.modBaseAddr + offsets.base, offsets.lock)
    return 'OK'
  } catch (error) {
    return 'Could not write values.'
  }
}

exports.normal = function () {
  const open = exports.openProcess()
  if (open !== 'OK') { return open };
  try {
    memoryjs.writeBuffer(RainbowProcess.handle, RainbowProcess.modBaseAddr + offsets.base, offsets.normal)
    return 'OK'
  } catch (error) {
    return 'Could not write values.'
  }
}
