const Child = require('child_process');
const Fs = require('fs');
const Path = require('path');

var packagePath = Path.join(process.cwd(), 'package.json');
var out = Object.prototype;

module.exports = function (done) {
  Fs.readFile(packagePath, 'utf8', function (err, packageJson) {
    if (err) return done(err);

    packageJson = JSON.parse(packageJson);

    return Child.exec('node -v && npm -v', function (err, stdout) {
      if (err) return done(err);

      stdout = stdout.split('\n');

      out = {
        name: packageJson.name,
        version: packageJson.version,
        env: process.env.NODE_ENV, // eslint-disable-line no-process-env
        node: stdout[0],
        npm: stdout[1]
      };

      return done(null, out); // who's there?
    });
  });
};
