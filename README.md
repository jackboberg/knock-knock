# knock-knock

> basic information about the current project and environment

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![coverage][coverage-image]][coverage-url]
[![standard][standard-image]][standard-url]

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [License](#license)

## Install

    npm install knock-knock

## Usage

```js
const KnockKnock = require('knock-knock')

KnockKnock((err, results) => {
  if (err) throw err
  console.log(results)
})
```

Logs:

```json
{
  name: 'some-name',
  version: '1.2.3',
  env: 'production',
  node: 'v6.10.1',
  npm: '4.5.0'
}
```

### pass custom commands

```js
const KnockKnock = require('knock-knock')

KnockKnock({ docker: 'docker -v' }, (err, results) => {
  if (err) throw err
  console.log(results)
})
```

Logs:

```json
{
  name: 'some-name',
  version: '1.2.3',
  env: 'production',
  node: 'v6.10.1',
  npm: '4.5.0',
  docker: 'Docker version 17.03.1-ce, build c6d412e'
}
```

### use as an API endpoint

#### Hapi

```js
const Hapi = require('hapi')
const KnockKnock = require('knock-knock')

const server = new Hapi.Server()

const ping = (request, reply) => KnockKnock(reply)

server.route([
  { method: 'GET', path: '/ping', handler: ping }
])
```

#### Express

```js
const Express = require('express')
const KnockKnock = require('knock-knock')

const app = Express()

const ping = (req, res) => KnockKnock((err, output) => res.send(err || output))

app.get('/ping', ping)
```

## Contribute

PRs welcome! Please read the [contributing guidelines](contributing.md) and 
the [code of conduct](code-of-conduct.md).

## License

[MIT © Jack Boberg.](LICENSE)  

[npm-image]: https://img.shields.io/npm/v/knock-knock.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/knock-knock
[travis-image]: https://img.shields.io/travis/jackboberg/knock-knock.svg?style=flat-square
[travis-url]: https://travis-ci.com/jackboberg/knock-knock
[coverage-image]: https://img.shields.io/coveralls/jackboberg/knock-knock.svg?style=flat-square
[coverage-url]: https://coveralls.io/github/jackboberg/knock-knock
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard

