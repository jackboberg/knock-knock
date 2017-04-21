const TD = require('testdouble')
const { EOL } = require('os')
const { exec } = TD.replace('child_process')
const { expect } = require('code')
const { test: describe } = require('tap')

const { command } = require('../lib')

describe('lib.command', ({ afterEach, beforeEach, plan, test }) => {
  const cmd = 'test'
  const output = `\toutput${EOL}`

  plan(5)

  beforeEach((done) => {
    TD.when(exec(cmd)).thenCallback(null, output)
    done()
  })

  afterEach((done) => {
    TD.reset()
    done()
  })

  test('executes the given command', (t) => {
    command(cmd, () => {
      const { callCount, calls } = TD.explain(exec)

      expect(callCount).to.equal(1)
      expect(calls[0].args).to.include(cmd)
      t.end()
    })
  })

  test('yields trimmed stdout', (t) => {
    command(cmd, (err, out) => {
      expect(err).to.not.exist()
      expect(out).to.equal('output')
      t.end()
    })
  })

  test('yields trimmed stderr', (t) => {
    TD.when(exec(cmd)).thenCallback(null, null, output)
    command(cmd, (err, out) => {
      expect(err).to.not.exist()
      expect(out).to.equal('output')
      t.end()
    })
  })

  test('when errors yields the error string', (t) => {
    const error = new Error('fail')

    TD.when(exec(cmd)).thenCallback(error)
    command(cmd, (err, out) => {
      expect(err).to.not.exist()
      expect(out).to.equal('Error: fail')
      t.end()
    })
  })

  test('whithout output yields an empty string', (t) => {
    TD.when(exec(cmd)).thenCallback()
    command(cmd, (err, out) => {
      expect(err).to.not.exist()
      expect(out).to.equal('')
      t.end()
    })
  })
})
