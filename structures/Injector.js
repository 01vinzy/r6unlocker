const memoryjs = require('memoryjs')

const Config = require('./Config.js')

let RainbowProcess
let lastPath

const offsets = {
  base: 58994772,

  unlock: {
    xor: Buffer.from([0x41, 0x80, 0xF4, 0x01, 0x45, 0x08, 0xE7, 0x74, 0x14]),
    cmp: Buffer.from([0x83, 0x78, 0x0C, 0x01, 0x0F, 0x95, 0xC0, 0x0C]),
    mov: Buffer.from([0xBA, 0x33, 0x03, 0x00, 0x00, 0xFF])
  },
  reset: {
    xor: Buffer.from([0x41, 0x80, 0xF4, 0x00, 0x45, 0x08, 0xE7, 0x74, 0x14]),
    cmp: Buffer.from([0x83, 0x78, 0x0C, 0x00, 0x0F, 0x95, 0xC0, 0x0C]),
    mov: Buffer.from([0xBA, 0x11, 0x01, 0x00, 0x00, 0xFF])
  },

  xor: 45040223,
  cmp: 45040232,
  mov: 45040162
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
    memoryjs.writeBuffer(RainbowProcess.handle, RainbowProcess.modBaseAddr + offsets.xor, offsets.unlock.xor)
    memoryjs.writeBuffer(RainbowProcess.handle, RainbowProcess.modBaseAddr + offsets.cmp, offsets.unlock.cmp)
    memoryjs.writeBuffer(RainbowProcess.handle, RainbowProcess.modBaseAddr + offsets.mov, offsets.unlock.mov)
    return 'OK'
  } catch (error) {
    return 'Could not write values.'
  }
}

exports.normal = function () {
  const open = exports.openProcess()
  if (open !== 'OK') { return open };
  try {
    memoryjs.writeBuffer(RainbowProcess.handle, RainbowProcess.modBaseAddr + offsets.xor, offsets.reset.xor)
    memoryjs.writeBuffer(RainbowProcess.handle, RainbowProcess.modBaseAddr + offsets.cmp, offsets.reset.cmp)
    memoryjs.writeBuffer(RainbowProcess.handle, RainbowProcess.modBaseAddr + offsets.mov, offsets.reset.mov)
    return 'OK'
  } catch (error) {
    return 'Could not write values.'
  }
}
