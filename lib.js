const { exec } = require('child_process')
const ReadPkgUp = require('read-pkg-up')

// yield name and version from closest package.json, or empty object
exports.project = (cwd, done) => {
  const resolved = ({ pkg }) => {
    if (!pkg) return done(null, {})

    const { name, version } = pkg

    done(null, { name, version })
  }
  const rejected = () => done(null, {})

  ReadPkgUp({ cwd }).then(resolved, rejected)
}

// execute command and yield trimmed output
exports.command = (cmd, done) => {
  exec(cmd, (err, stdout, stderr) => {
    if (err || stderr) done(null, err ? err.toString() : stderr.trim())
    else done(null, stdout ? stdout.trim() : '')
  })
}
