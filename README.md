
# detect-package-manager

[![NPM version](https://img.shields.io/npm/v/detect-package-manager.svg?style=flat)](https://npmjs.com/package/detect-package-manager) [![NPM downloads](https://img.shields.io/npm/dm/detect-package-manager.svg?style=flat)](https://npmjs.com/package/detect-package-manager) [![CircleCI](https://circleci.com/gh/egoist/detect-package-manager/tree/master.svg?style=shield)](https://circleci.com/gh/egoist/detect-package-manager/tree/master)  [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/egoist/donate)

## How does this work?

1. When there's `yarn.lock` or `package-lock.json` in current working directory, it will skip other operations and directly resolves `yarn` or `npm`
2. When there's no lockfile was found, it checks if `yarn` command exists. If so it resolves `yarn` otherwise `npm`
3. Results are cached

## Install

```bash
yarn add detect-package-manager
```

## Usage

```js
const detectPackageManager = require('detect-package-manager')

detectPackageManager()
  .then(pm => {
    console.log(pm)
    //=> 'yarn' or 'npm'
  })
```

## API

### detectPackageManager([opts])

Return: `Promise<pm>`

It returns a Promise resolving the name of package manager, could be either `npm` or `yarn`.

#### opts

##### cwd

Type: `string`<br>
Default: `.`

The directory to look up `yarn.lock` or `package-lock.json`.

### detectPackageManager.npmVersion()

Return: `Promise<version>`

It returns a Promise resolving the version of npm.

### detectPackageManager.clearCache()

Clear cache.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## Author

**detect-package-manager** © [EGOIST](https://github.com/egoist), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by EGOIST with help from contributors ([list](https://github.com/egoist/detect-package-manager/contributors)).

> [github.com/egoist](https://github.com/egoist) · GitHub [@EGOIST](https://github.com/egoist) · Twitter [@_egoistlily](https://twitter.com/_egoistlily)
