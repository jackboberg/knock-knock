const FS = require('fs')
const Mkdirp = require('mkdirp')
const Path = require('path')
const PkgFixture = require('./fixtures/package.json')
const TmpDir = require('temporary-directory')
const { expect } = require('code')
const { test: describe } = require('tap')

const { project } = require('../lib')

describe('lib.project', ({ afterEach, beforeEach, plan, test }) => {
  let path, pkgPath, cleanup

  plan(4)

  beforeEach((done) => {
    TmpDir((err, dir, fn) => {
      if (err) return done(err)

      path = dir
      pkgPath = Path.join(path, 'package.json')
      cleanup = fn

      FS.writeFile(pkgPath, JSON.stringify(PkgFixture), done)
    })
  })

  afterEach((done) => cleanup(done))

  test('yields name and version', (t) => {
    const expected = { name: PkgFixture.name, version: PkgFixture.version }

    project(path, (err, result) => {
      expect(err).to.not.exist()
      expect(result).to.equal(expected)
      t.end()
    })
  })

  test('yields an empty object if package not found', (t) => {
    FS.unlink(pkgPath, (err) => {
      if (err) return t.fail(err.toString())

      project(path, (err, result) => {
        expect(err).to.not.exist()
        expect(result).to.be.an.object()
        expect(result).to.be.empty()
        t.end()
      })
    })
  })

  test('yields an empty object if package.json is malformed', (t) => {
    FS.writeFile(pkgPath, 'invalid', (err) => {
      if (err) return t.fail(err.toString())

      project(path, (err, result) => {
        expect(err).to.not.exist()
        expect(result).to.be.an.object()
        expect(result).to.be.empty()
        t.end()
      })
    })
  })

  test('finds the nearest package.json', (t) => {
    const nested = Path.join(path, 'some', 'nested', 'path')

    Mkdirp(nested, (err) => {
      if (err) return t.fail(err.toString())

      project(nested, (err, result) => {
        expect(err).to.not.exist()
        expect(result).to.not.be.empty()
        t.end()
      })
    })
  })
})
