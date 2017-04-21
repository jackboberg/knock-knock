const PkgFixture = require('./fixtures/package.json')
const TD = require('testdouble')
const { command, project } = TD.replace('../lib')
const { expect } = require('code')
const { test: describe } = require('tap')

const KnockKnock = require('..')

describe('knock-knock', ({ afterEach, beforeEach, plan, test }) => {
  const pkgData = { name: PkgFixture.name, version: PkgFixture.version }
  const nodeVersion = 'v1.2.3'
  const npmVersion = 'v4.5.6'

  plan(4)

  beforeEach((done) => {
    TD.when(command('node -v')).thenCallback(null, nodeVersion)
    TD.when(command('npm -v')).thenCallback(null, npmVersion)
    TD.when(project(__dirname)).thenCallback(null, pkgData)

    done()
  })

  afterEach((done) => {
    TD.reset()

    done()
  })

  test('yeilds an object', (t) => {
    const expected = {
      name: PkgFixture.name,
      version: PkgFixture.version,
      node: nodeVersion,
      npm: npmVersion,
      env: process.env.NODE_ENV
    }

    KnockKnock((err, result) => {
      expect(err).to.not.exist()
      expect(result).to.equal(expected)

      t.end()
    })
  })

  test('accepts commands map', (t) => {
    const commands = { 'test': 'someBin' }
    const output = 'some output'

    TD.when(command(commands.test)).thenCallback(null, output)

    KnockKnock(commands, (err, result) => {
      expect(err).to.not.exist()
      expect(result.test).to.equal(output)

      t.end()
    })
  })

  test('throws when not passed a callback', (t) => {
    const fns = [
      KnockKnock,
      () => KnockKnock({})
    ]

    fns.forEach((fn) => expect(fn).to.throw())

    t.end()
  })

  test('throws when commands is not an object', (t) => {
    const invalid = ['', 1, [], false]
    const fns = invalid.map((param) => () => KnockKnock(param, () => {}))

    fns.forEach((fn) => expect(fn).to.throw())

    t.end()
  })
})
