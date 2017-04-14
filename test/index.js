const Child = require('child_process')
const Fs = require('fs')
const Lab = require('lab')
const Path = require('path')
const Sinon = require('sinon')
const { expect } = require('code')

const lab = exports.lab = Lab.script()
const { describe, after, afterEach, before, beforeEach, it } = lab

const KnockKnock = require('..')

describe('knock-knock', () => {
  const packagePath = Path.join(process.cwd(), 'package.json')
  const temp = process.env.NODE_ENV

  let nodeVersion = process.version
  let npmVersion
  let out = Object.prototype

  before((done) => {
    process.env.NODE_ENV = 'testenv'
    done()
  })

  after((done) => {
    process.env.NODE_ENV = temp
    done()
  })

  describe('mocking methods', () => {
    beforeEach((done) => {
      out = {
        name: 'test',
        version: '0.1.0',
        env: process.env.NODE_ENV,
        node: nodeVersion,
        npm: '2.14.7'
      }
      out = JSON.stringify(out)

      Sinon.stub(Child, 'exec').yields(new Error('exec'))
      Sinon.stub(Fs, 'readFile').yields(new Error('readFile'))
      done()
    })

    afterEach((done) => {
      Child.exec.restore()
      Fs.readFile.restore()

      done()
    })

    describe('when called', () => {
      beforeEach((done) => {
        Child.exec.onFirstCall().yields(null, nodeVersion)
                  .onSecondCall().yields(null, '2.14.7')
        Fs.readFile.yields(null, out)
        done()
      })

      it('yields an object', (done) => {
        KnockKnock((err, results) => {
          expect(err).to.be.null()
          expect(Fs.readFile.calledWith(packagePath)).to.be.true()
          expect(results).to.be.an.object()
          done()
        })
      })

      describe('the object', () => {
        it('has a key called name', (done) => {
          KnockKnock((err, results) => {
            expect(err).to.be.null()
            expect(results.name).to.equal('test')
            done()
          })
        })

        it('has a key called version', (done) => {
          KnockKnock((err, results) => {
            expect(err).to.be.null()
            expect(results.version).to.equal('0.1.0')
            done()
          })
        })

        it('has a key called env', (done) => {
          KnockKnock((err, results) => {
            expect(err).to.be.null()
            expect(results.env).to.equal('testenv')
            done()
          })
        })

        it('has a key called node', (done) => {
          KnockKnock((err, results) => {
            expect(err).to.be.null()
            expect(results.node).to.equal(nodeVersion)
            done()
          })
        })

        it('has a key called npm', (done) => {
          KnockKnock((err, results) => {
            expect(err).to.be.null()
            expect(results.npm).to.equal('2.14.7')
            done()
          })
        })
      })
    })

    describe('when options are passed in', () => {
      beforeEach((done) => {
        Child.exec.onFirstCall().yields(null, nodeVersion)
                  .onSecondCall().yields(null, '2.14.7')
                  .onThirdCall().yields(null, 'value')
        Fs.readFile.yields(null, out)
        done()
      })

      it('executes all commands', (done) => {
        KnockKnock({ key: 'value -v' }, (err, results) => {
          expect(err).to.be.null()
          expect(results.key).to.equal('value')
          done()
        })
      })
    })

    describe('when package.json is not found', () => {
      it('yields an error', (done) => {
        KnockKnock((err, results) => {
          expect(err).to.be.instanceof(Error)
          expect(err.message).to.equal('readFile')
          expect(results).to.be.undefined()
          done()
        })
      })
    })

    describe('when executing a command fails', () => {
      beforeEach((done) => {
        Child.exec.onFirstCall().yields(new Error('exec error').toString())
                  .onSecondCall().yields(new Error('exec error').toString())
        Fs.readFile.yields(null, out)
        done()
      })

      it('stringifies the err', (done) => {
        KnockKnock((err, results) => {
          expect(err).to.be.null()
          expect(results.node).to.equal('Error: exec error')
          expect(results.npm).to.equal('Error: exec error')
          done()
        })
      })
    })

    describe('when options is not an object', () => {
      it('throws an error', (done) => {
        expect(() => {
          return KnockKnock('string', () => {

          })
        }).to.throw()
        done()
      })
    })

    describe('when no callback passed', () => {
      it('throws an error', (done) => {
        expect(() => {
          return KnockKnock({})
        }).to.throw()
        done()
      })
    })
  })

  describe('handling newline characters', () => {
    before((done) => {
      // eslint-disable-next-line handle-callback-err
      Child.exec('npm -v', (err, stdout) => {
        npmVersion = stdout.replace(/\n/g, '')
        done()
      })
    })

    it('removes newline characters', (done) => {
      KnockKnock((err, results) => {
        expect(err).to.be.null()
        expect(results.node).to.equal(nodeVersion)
        expect(results.npm).to.equal(npmVersion)
        done()
      })
    })
  })
})
