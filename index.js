const Assert = require('assert')
const Child = require('child_process')
const Fs = require('fs')
const Path = require('path')
const Parallel = require('run-parallel')

module.exports = (options, done) => {
  if (typeof options === 'function') {
    done = options
    options = {}
  }

  Assert.equal(typeof options, 'object', 'Options must be an object')
  Assert.equal(typeof done, 'function', 'Must pass in a callback function')

  let out = { env: process.env.NODE_ENV }

  packageDetails((err, data) => {
    if (err) return done(err)

    Object.assign(out, data)

    const cmds = Object.assign({ node: 'node -v', npm: 'npm -v' }, options)

    // eslint-disable-next-line handle-callback-err
    commandDetails(cmds, (err, data) => { // never yields error
      Object.assign(out, data)

      done(null, out)
    })
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

const commandDetails = (cmds, done) => {
  const tasks = Object.keys(cmds)
    .reduce((acc, key) => {
      acc[key] = (next) => proc(cmds[key], next)
      return acc
    }, {})

  Parallel(tasks, done)
}

const proc = (cmd, done) => {
  Child.exec(cmd, (err, stdout) => {
    if (err) done(null, err.toString())
    else done(null, stdout.replace(/\n/g, ''))
  })
}
