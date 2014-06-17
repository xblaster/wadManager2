'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
  root: rootPath,
  port: 9876,
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  }
};