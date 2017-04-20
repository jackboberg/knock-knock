const Assert = require('assert')
const Path = require('path')
const Parallel = require('run-parallel')
const { command, project } = require('./lib')

// get details about package and environment
module.exports = (commands, done) => {
  if (isFunction(commands)) [ commands, done ] = [ {}, commands ]

  Assert(isObject(commands), '`commands` must be an object')
  Assert(isFunction(done), 'Must pass in a callback function')

  Parallel([
    (next) => process.nextTick(next, null, { env: process.env.NODE_ENV }),
    (next) => project(Path.dirname(require.main.filename), next),
    (next) => commandDetails(commands, next)
  ], (err, results) => {
    done(err, Object.assign({}, ...results))
  })
}

const isObject = (value) => typeof value === 'object' && !Array.isArray(value)

const isFunction = (value) => typeof value === 'function'

// execute all passed commands and yield results
const commandDetails = (commands, done) => {
  const cmds = Object.assign({ node: 'node -v', npm: 'npm -v' }, commands)
  const tasks = Object.keys(cmds)
    .reduce((acc, key) => Object.assign(acc, {
      [key]: (next) => command(cmds[key], next)
    }), {})

  Parallel(tasks, done)
}
