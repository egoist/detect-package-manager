const path = require('path')
const execa = require('execa')
const pathExists = require('path-exists')

const cache = new Map()

function hasGlobalYarn() {
  if (cache.has('hasGlobalYarn')) {
    return Promise.resolve(cache.get('hasGlobalYarn'))
  }

  return execa('yarn', ['--version']).then(res => {
    return /^\d+.\d+.\d+$/.test(res.stdout)
  }).then(value => {
    cache.set('hasGlobalYarn', value)
    return value
  })
}

function getTypeofLockFile(cwd = '.') {
  return Promise.all([
    pathExists(path.resolve(cwd, 'yarn.lock')),
    pathExists(path.resolve(cwd, 'package-lock.json'))
  ]).then(([isYarn, isNpm]) => {
    return isYarn ? 'yarn' : isNpm ? 'npm' : null
  })
}

module.exports = ({ cwd } = {}) => {
  return getTypeofLockFile(cwd).then(typeofLockFile => {
    if (typeofLockFile) {
      return typeofLockFile
    }

    return hasGlobalYarn().then(has => {
      return has ? 'yarn' : 'npm'
    })
  })
}

module.exports.npmVersion = () => {
  return execa('npm', ['--version'])
    .then(res => res.stdout)
}
