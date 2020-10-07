const memoryjs = require('memoryjs')

let RainbowProcess

const offsets = {
  base: 58944820,

  unlock: Buffer.from([0x41, 0xC6, 0x46, 0x51, 0x00, 0x90]),
  normal: Buffer.from([0x34, 0x01, 0x41, 0x88, 0x46, 0x51]),
  lock: Buffer.from([0x41, 0xC6, 0x46, 0x51, 0x01, 0x90])
}

exports.openProcess = function () {
  try {
    const process = memoryjs.openProcess('RainbowSix.exe')
    if (process) RainbowProcess = process
    return 'OK'
  } catch (error) {
    return 'Couldn\'t find process. Make sure that you are not using TTS or Vulcan.'
  };
}

exports.unlockAll = function () {
  if (!RainbowProcess) {
    const open = exports.openProcess()
    if (open !== 'OK') { return open };
  };
  try {
    memoryjs.writeBuffer(RainbowProcess.handle, RainbowProcess.modBaseAddr + offsets.base, offsets.unlock)
    return 'OK'
  } catch (error) {
    return 'Could not write values.'
  }
}

exports.lock = function () {
  if (!RainbowProcess) {
    const open = exports.openProcess()
    if (open !== 'OK') { return open };
  };
  try {
    memoryjs.writeBuffer(RainbowProcess.handle, RainbowProcess.modBaseAddr + offsets.base, offsets.lock)
    return 'OK'
  } catch (error) {
    return 'Could not write values.'
  }
}

exports.normal = function () {
  if (!RainbowProcess) {
    const open = exports.openProcess()
    if (open !== 'OK') { return open };
  };
  try {
    memoryjs.writeBuffer(RainbowProcess.handle, RainbowProcess.modBaseAddr + offsets.base, offsets.normal)
    return 'OK'
  } catch (error) {
    return 'Could not write values.'
  }
}
