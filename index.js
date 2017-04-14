const Assert = require('assert')
const Child = require('child_process')
const Fs = require('fs')
const Path = require('path')

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

  out = { env: process.env.NODE_ENV }

  packageDetails((err, data) => {
    if (err) return done(err)

    Object.assign(out, data)

    return execute(options, done)
  })
}

const packageDetails = (done) => {
  const packagePath = Path.join(process.cwd(), 'package.json')

  Fs.readFile(packagePath, 'utf8', (err, data) => {
    if (err) return done(err)

    const { name, version } = JSON.parse(data)

    done(null, { name, version })
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
