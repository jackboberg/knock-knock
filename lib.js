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
