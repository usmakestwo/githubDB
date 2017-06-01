/*
 * diskDB
 * http://arvindr21.github.io/diskDB
 *
 * Copyright (c) 2014 Arvind Ravulavaru
 * Licensed under the MIT license.
 */

'use strict';

// global modules

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

// import github client


var _chalk = require('chalk');

var _github = require('github');

var _github2 = _interopRequireDefault(_github);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Initialize connectivity with Github
var github = new _github2.default({
  // optional
  debug: false,
  protocol: 'https',
  host: 'api.github.com', // should be api.github.com for GitHub
  headers: {
    'user-agent': 'Github DB' // GitHub is happy with a unique user agent
  },
  Promise: require('bluebird'),
  timeout: 5000
});

var timestamp = function timestamp() {
  var timestamped = new Date().toUTCString();
  return timestamped;
};

var getCurrentFile = function getCurrentFile(owner, repo, path) {
  return new Promise(function (resolve) {
    github.repos.getContent({
      owner: owner,
      repo: repo,
      path: path
    }).then(function (res) {
      console.log((0, _chalk.green)('File located'));
      resolve(res.data);
    });
  });
};

var githubdb = function () {
  function githubdb() {
    _classCallCheck(this, githubdb);
  }

  _createClass(githubdb, [{
    key: 'auth',
    value: function auth(token) {
      if (!token) {
        console.log((0, _chalk.red)('\nMissing Personal access token!'));
        return false;
      }

      github.authenticate({
        type: 'token',
        token: token
      });

      console.log((0, _chalk.green)('User has been authenticated successfully!'));
      return true;
    }
  }, {
    key: 'connectToRepo',
    value: function connectToRepo(owner, repo) {
      return new Promise(function (resolve) {
        github.repos.get({ owner: owner, repo: repo }).then(function (res) {
          console.log((0, _chalk.green)('Connected to cloud file database.'));
          resolve(res.data);
        });
      });
    }
  }, {
    key: 'updateBlob',
    value: function updateBlob(owner, repo, path, content) {
      return getCurrentFile(owner, repo, path).then(function (res) {
        return new Promise(function (resolve) {
          github.repos.updateFile({
            owner: owner,
            repo: repo,
            path: path,
            message: 'File updated at ' + timestamp(),
            content: new Buffer(content).toString('base64'),
            sha: res.sha
          }).then(function (res) {
            console.log((0, _chalk.green)('File updated successfully'));
            resolve(res.data);
          });
        });
      });
    }
  }]);

  return githubdb;
}();

exports.default = githubdb;