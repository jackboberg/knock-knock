knock-knock
===========
An npm module that returns basic information about the current project.

[![NPM version](https://badge.fury.io/js/knock-knock.svg)](http://badge.fury.io/js/knock-knock) [![Build Status](https://travis-ci.org/onmodulus/knock-knock.svg?branch=master)](https://travis-ci.org/onmodulus/knock-knock)

## Install
`npm install knock-knock`

## Usage
##### Without options
```
const KnockKnock = require('knock-knock');

KnockKnock(function (err, results) {
  if (err) throw err;
  console.log(results);
});
```

Logs:
```
{
  name: 'some-name',
  version: '1.2.3',
  env: 'production',
  node: 'v4.2.1',
  npm: '3.3.3'
}
```

##### With options
```
const KnockKnock = require('knock-knock');

KnockKnock({ docker: 'docker -v' }, function (err, results) {
  if (err) throw err;
  console.log(results);
});
```

Logs:
```
{
  name: 'some-name',
  version: '1.2.3',
  env: 'production',
  node: 'v4.2.1',
  npm: '3.3.3',
  docker: 'Docker version 1.6.2, build 7c8fca2'
}
```

### Examples
##### Hapi
```
const Hapi = require('hapi');
const KnockKnock = require('knock-knock');

var server = new Hapi.Server();

function ping(request, reply) {
  KnockKnock(reply);
}

server.route([
  { method: 'GET', path: '/ping', handler: ping }
]);
```

##### Express
```
var express = require('express');
var knockKnock = require('knock-knock');

var app = express();

app.get('/ping', function (req, res) {
  knockKnock(function (err, output) {
    res.send(err || output);
  });
});
```
