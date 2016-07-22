const Child = require('child_process');
const Code = require('code');
const Fs = require('fs');
const Lab = require('lab');
const Path = require('path');
const Sinon = require('sinon');

var lab = exports.lab = Lab.script();

var describe = lab.describe;
var after = lab.after;
var afterEach = lab.afterEach;
var beforeEach = lab.beforeEach;
var expect = Code.expect;
var it = lab.it;

const KnockKnock = require('../../lib/knock-knock');

var packagePath = Path.join(process.cwd(), 'package.json');
var out = Object.prototype;
var temp = process.env.NODE_ENV; // eslint-disable-line no-process-env

describe('lib/knock-knock', function () {
  beforeEach(function (done) {
    process.env.NODE_ENV = 'testenv'; // eslint-disable-line no-process-env

    out = {
      name: 'test',
      version: '0.1.0',
      env: process.env.NODE_ENV, // eslint-disable-line no-process-env
      node: '4.2.1',
      npm: '2.14.7'
    };
    out = JSON.stringify(out);

    Sinon.stub(Child, 'exec').yields(new Error('exec'));
    Sinon.stub(Fs, 'readFile').yields(new Error('readFile'));
    done();
  });

  afterEach(function (done) {
    Child.exec.restore();
    Fs.readFile.restore();

    done();
  });

  after(function (done) {
    process.env.NODE_ENV = temp; // eslint-disable-line no-process-env
    done();
  });

  describe('when called', function () {
    beforeEach(function (done) {
      Child.exec.onFirstCall().yields(null, '4.2.1')
                .onSecondCall().yields(null, '2.14.7');
      Fs.readFile.yields(null, out);
      done();
    });

    it('yields an object', function (done) {
      KnockKnock(function (err, results) {
        expect(err).to.be.null();
        expect(Fs.readFile.calledWith(packagePath)).to.be.true();
        expect(results).to.be.an.object();
        done();
      });
    });

    describe('the object', function () {
      it('has a key called name', function (done) {
        KnockKnock(function (err, results) {
          expect(err).to.be.null();
          expect(results.name).to.equal('test');
          done();
        });
      });

      it('has a key called version', function (done) {
        KnockKnock(function (err, results) {
          expect(err).to.be.null();
          expect(results.version).to.equal('0.1.0');
          done();
        });
      });

      it('has a key called env', function (done) {
        KnockKnock(function (err, results) {
          expect(err).to.be.null();
          expect(results.env).to.equal('testenv');
          done();
        });
      });

      it('has a key called node', function (done) {
        KnockKnock(function (err, results) {
          expect(err).to.be.null();
          expect(results.node).to.equal('4.2.1');
          done();
        });
      });

      it('has a key called npm', function (done) {
        KnockKnock(function (err, results) {
          expect(err).to.be.null();
          expect(results.npm).to.equal('2.14.7');
          done();
        });
      });
    });
  });

  describe('when options are passed in', function () {
    beforeEach(function (done) {
      Child.exec.onFirstCall().yields(null, '4.2.1')
                .onSecondCall().yields(null, '2.14.7')
                .onThirdCall().yields(null, 'value');
      Fs.readFile.yields(null, out);
      done();
    });

    it('executes all commands', function (done) {
      KnockKnock({ key: 'value -v' }, function (err, results) {
        expect(err).to.be.null();
        expect(results.key).to.equal('value');
        done();
      });
    });
  });

  describe('when package.json is not found', function () {
    it('yields an error', function (done) {
      KnockKnock(function (err, results) {
        expect(err).to.be.instanceof(Error);
        expect(err.message).to.equal('readFile');
        expect(results).to.be.undefined();
        done();
      });
    });
  });

  describe('when executing a command fails', function () {
    beforeEach(function (done) {
      Child.exec.onFirstCall().yields(new Error('exec error').toString())
                .onSecondCall().yields(new Error('exec error').toString());
      Fs.readFile.yields(null, out);
      done();
    });

    it('stringifies the err', function (done) {
      KnockKnock(function (err, results) {
        expect(err).to.be.null();
        expect(results.node).to.equal('Error: exec error');
        expect(results.npm).to.equal('Error: exec error');
        done();
      });
    });
  });

  describe('when options is not an object', function () {
    it('throws an error', function (done) {
      expect(function () {
        return KnockKnock('string', function () {
          return;
        });
      }).to.throw();
      done();
    });
  });

  describe('when no callback passed', function () {
    it('throws an error', function (done) {
      expect(function () {
        return KnockKnock({});
      }).to.throw();
      done();
    });
  });
});
