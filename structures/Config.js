const fs = require('fs')

exports.read = function () {
  const configPath = process.cwd() + '/config.json'
  if (!fs.existsSync(configPath)) { return undefined };
  return JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8' }))
}

exports.write = function (data) {
  const configPath = process.cwd() + '/config.json'
  return fs.writeFileSync(configPath, JSON.stringify(data))
}
