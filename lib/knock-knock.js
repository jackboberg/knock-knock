const Assert = require('assert');
const Child = require('child_process');
const Fs = require('fs');
const Path = require('path');

var packagePath = Path.join(process.cwd(), 'package.json');
var out = Object.prototype, keys = [];

function execute(options, done) {
  var key = keys.shift();

  if (!key) return done(null, out);

  Child.exec(options[key], function (err, stdout) {
    out[key] = err ? err.toString() : stdout;
    return execute(options, done);
  });
}

module.exports = function (options, done) {
  if (typeof options === 'function') {
    done = options;
    options = {};
  }

  Assert.equal(typeof options, 'object', 'Options must be an object');

  options = Object.assign({ node: 'node -v', npm: 'npm -v' }, options);
  keys = Object.keys(options);

  Fs.readFile(packagePath, 'utf8', function (err, packageJson) {
    if (err) return done(err);

    packageJson = JSON.parse(packageJson);
    out = {
      name: packageJson.name,
      version: packageJson.version,
      env: process.env.NODE_ENV // eslint-disable-line no-process-env
    };

    return execute(options, done);
  });
};
