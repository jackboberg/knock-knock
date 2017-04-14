const Assert = require('assert')
const Child = require('child_process')
const Fs = require('fs')
const Path = require('path')

const packagePath = Path.join(process.cwd(), 'package.json')

let keys = []
let out = {}

module.exports = (options, done) => {
  if (typeof options === 'function') {
    done = options
    options = {}
  }

  Assert.equal(typeof options, 'object', 'Options must be an object')
  Assert.equal(typeof done, 'function', 'Must pass in a callback function')

  options = Object.assign({ node: 'node -v', npm: 'npm -v' }, options)
  keys = Object.keys(options)

  Fs.readFile(packagePath, 'utf8', (err, packageJson) => {
    if (err) return done(err)

    packageJson = JSON.parse(packageJson)
    out = {
      name: packageJson.name,
      version: packageJson.version,
      env: process.env.NODE_ENV
    }

    return execute(options, done)
  })
}

const execute = (options, done) => {
  var key = keys.shift()

  if (!key) return done(null, out)

  Child.exec(options[key], function (err, stdout) {
    out[key] = err ? err.toString() : stdout.replace(/\n/g, '')
    return execute(options, done)
  })
}
