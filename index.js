const Assert = require('assert')
const Child = require('child_process')
const FS = require('fs')
const Parallel = require('run-parallel')
const Path = require('path')

// get details about package and environment
module.exports = (options, done) => {
  if (typeof options === 'function') {
    done = options
    options = {}
  }

  Assert.equal(typeof options, 'object', 'Options must be an object')
  Assert.equal(typeof done, 'function', 'Must pass in a callback function')

  Parallel([
    packageDetails,
    (next) => process.nextTick(next, null, { env: process.env.NODE_ENV }),
    (next) => {
      const cmds = Object.assign({ node: 'node -v', npm: 'npm -v' }, options)

      commandDetails(cmds, next)
    }
  ], (err, results) => {
    if (err) done(err)
    else done(null, Object.assign({}, ...results))
  })
}

// get name and version from package
const packageDetails = (done) => {
  const packagePath = Path.join(process.cwd(), 'package.json')

  FS.readFile(packagePath, 'utf8', (err, data) => {
    if (err) return done(err)

    const { name, version } = JSON.parse(data)

    done(null, { name, version })
  })
}

// execute all passed commands and yield results
const commandDetails = (cmds, done) => {
  const tasks = Object.keys(cmds)
    .reduce((acc, key) => Object.assign(acc, { [key]: proc(cmds[key]) }), {})

  Parallel(tasks, done)
}

// curry command, return function that yields error string or result
const proc = (cmd) => (done) => {
  Child.exec(cmd, (err, stdout) => {
    if (err) done(null, err.toString())
    else done(null, stdout.replace(/\n/g, ''))
  })
}
