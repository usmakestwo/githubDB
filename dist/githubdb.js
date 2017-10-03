/*
 * githubdb
 * https://github.com/usmakestwo/githubDB
 *
 * Copyright (c) 2017 UsMakesTwo
 * Licensed under the MIT license.
 */

'use strict';

// global modules

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

// local modules


// import github client


var _chalk = require('chalk');

var _uuid = require('uuid');

var _util = require('./util');

var util = _interopRequireWildcard(_util);

var _github = require('github');

var _github2 = _interopRequireDefault(_github);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Creates UUID
 */
var UUID = function UUID() {
  return (0, _uuid.v4)().replace(/-/g, '');
};

var github = '';

/**
 * Returns a UTC timestamped.
 */
var timestamp = function timestamp() {
  var timestamped = new Date().toUTCString();
  return timestamped;
};

/**
 * Decodes base64 and returns a string
 * @param {string} file - Base64 encoded file.
 */
var decode = function decode(file) {
  return new Buffer(file, 'base64').toString('utf8');
};

/**
 * Encodes string to base64
 * @param {string} file  - String
 */
var encode = function encode(file) {
  return new Buffer(JSON.stringify(file)).toString('base64');
};

/**
 * Gets current sha tree of passed Github repo
 * @param {object} options - Github options
 */
var getCurrentFile = function getCurrentFile(options) {
  return new Promise(function (resolve, reject) {
    github.repos.getContent({
      owner: options.owner,
      repo: options.repo,
      path: options.path
    }).then(function (res) {
      console.log((0, _chalk.green)('File located'));
      resolve(res.data);
    }).catch(function (err) {
      console.log((0, _chalk.red)(err));
      reject(err);
    });
  });
};

/**
 * Github class that provides functionality.
 * @class Githubdb
 */

var Githubdb = function () {

  /**
   * {constructor}
   * @param {object} options - Github options
   */
  function Githubdb(options) {
    _classCallCheck(this, Githubdb);

    this.options = options;
    /**
     * Initialize connectivity with Github
     */
    github = new _github2.default({
      // optional
      debug: false,
      protocol: options.protocol || 'https',
      host: options.host || 'api.github.com', // should be api.github.com for GitHub
      pathPrefix: options.pathPrefix || null, // for some GHEs; none for GitHub
      headers: {
        'user-agent': 'Github DB' // GitHub is happy with a unique user agent
      },
      Promise: require('bluebird'),
      timeout: 5000
    });
  }

  /**
   * Returns valid Json object from string
   * @param {string} content - Object to parse
   */


  _createClass(Githubdb, [{
    key: '_parse',
    value: function _parse(content) {
      try {
        return JSON.parse(content);
      } catch (err) {
        console.log((0, _chalk.red)('Not a valid object'));
      }
      return [];
    }

    /**
     * Updates Github collection.
     * @param {object} collection - object
     * @param {string} sha - SHA from reference
     */

  }, {
    key: '_update',
    value: function _update(collection, sha) {
      var _this = this;

      return new Promise(function (resolve) {
        github.repos.updateFile({
          owner: _this.options.owner,
          repo: _this.options.repo,
          path: _this.options.path,
          message: 'File updated at ' + timestamp(),
          content: encode(collection),
          sha: sha
        }).then(function (res) {
          console.log((0, _chalk.green)('File updated successfully'));
          resolve(res.data);
        });
      });
    }
    /**
     * Authenticates user based on access token
     * @param {string} token - Personal Github Token: https://github.com/settings/tokens
     */

  }, {
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

    /**
     * Connects to repo.
     */

  }, {
    key: 'connectToRepo',
    value: function connectToRepo() {
      var _this2 = this;

      return new Promise(function (resolve) {
        github.repos.get({
          owner: _this2.options.owner,
          repo: _this2.options.repo
        }).then(function (res) {
          console.log((0, _chalk.green)('Connected to cloud file database.'));
          resolve(res.data);
        });
      });
    }

    /**
     * Uploads blobs to repo
     * @param {string} data - Data to saved.
     */

  }, {
    key: 'save',
    value: function save(data) {
      var _this3 = this;

      return getCurrentFile(this.options).then(function (res) {
        var decoded = decode(res.content);
        var collection = _this3._parse(decoded);
        if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' && data.length) {
          if (data.length === 1) {
            if (data[0].length > 0) {
              data = data[0];
            }
          }
          for (var i = data.length - 1; i >= 0; i--) {
            var d = data[i];
            d._id = UUID().replace(/-/g, '');
            collection.push(d);
          }
          return _this3._update(collection, res.sha).then(function (res) {
            return res;
          });
        } else {
          data._id = UUID().replace(/-/g, '');
          collection.push(data);
          return _this3._update(collection, res.sha).then(function (res) {
            return res;
          });
        }
      });
    }

    /**
     * Returns all the records from the collection
     * @param {string} query - Return query string
     */

  }, {
    key: 'find',
    value: function find(query) {
      var _this4 = this;

      return getCurrentFile(this.options).then(function (res) {
        return new Promise(function (resolve) {
          var decoded = decode(res.content);
          if (!query || Object.keys(query).length === 0) {
            resolve(decoded);
          }
          var collection = _this4._parse(decoded);
          var searcher = new util.ObjectSearcher();
          resolve(searcher.findAllInObject(collection, query, true));
        });
      });
    }

    /**
     * Returns the first record in the filtered data.
     */

  }, {
    key: 'findOne',
    value: function findOne(query) {
      var _this5 = this;

      return getCurrentFile(this.options).then(function (res) {
        return new Promise(function (resolve) {
          var decoded = decode(res.content);
          if (!query || Object.keys(query).length === 0) {
            resolve(decoded);
          }
          var collection = _this5._parse(decoded);
          var searcher = new util.ObjectSearcher();
          resolve(searcher.findAllInObject(collection, query, false)[0]);
        });
      });
    }

    /**
     * Returns exact match of records from the collection
     * @param {string} query - Return query string
     */

  }, {
    key: 'findExact',
    value: function findExact(query) {
      var _this6 = this;

      return getCurrentFile(this.options).then(function (res) {
        return new Promise(function (resolve) {
          var decoded = decode(res.content);
          if (!query || Object.keys(query).length === 0) {
            resolve(decoded);
          }
          var collection = _this6._parse(decoded);
          var searchedResults = util.exactFind(collection, query);
          resolve(searchedResults);
        });
      });
    }

    /**
     * Fetches collection and removes record.
     * @param {string} query - Record to move
     * @param {boolean} multi - Delete multiple records
     */

  }, {
    key: 'remove',
    value: function remove(query, multi) {
      var _this7 = this;

      return getCurrentFile(this.options).then(function (res) {
        return new Promise(function (resolve, reject) {
          if (query) {
            var decoded = decode(res.content);
            var collection = _this7._parse(decoded);
            if (typeof multi === 'undefined') {
              multi = true;
            }
            collection = util.removeFiltered(collection, query, multi);
            return _this7._update(collection, res.sha).then(function (res) {
              resolve(res);
            });
          } else {
            reject('Query required');
          }
        });
      });
    }

    /**
    * Deletes file name from Github
    */

  }, {
    key: 'removeAll',
    value: function removeAll() {
      var _this8 = this;

      return getCurrentFile(this.options).then(function (res) {
        return new Promise(function (resolve, reject) {
          github.repos.deleteFile({
            owner: _this8.options.owner,
            repo: _this8.options.repo,
            path: _this8.options.path,
            sha: res.sha,
            message: 'Deleted file at ' + timestamp()
          }).then(function () {
            resolve(true);
          }).catch(function (err) {
            console.log((0, _chalk.red)(err));
            reject(false);
          });
        });
      });
    }

    /**
     * Updates one record
     * @param {string} query - Record to update.
     * @param {object} data - Data to update with.
     * @param {object} options update multiple - default false.
     */

  }, {
    key: 'update',
    value: function update(query, data, options) {
      var _this9 = this;

      return getCurrentFile(this.options).then(function (res) {
        return new Promise(function (resolve) {
          var ret = {};
          var decoded = decode(res.content);
          var collection = _this9._parse(decoded);
          var records = util.finder(collection, query, true);
          if (records.length) {
            if (options && options.multi) {
              collection = util.updateFiltered(collection, query, data, true);
              ret.updated = records.length;
              ret.inserted = 0;
            } else {
              collection = util.updateFiltered(collection, query, data, false);
              ret.updated = 1;
              ret.inserted = 0;
            }
          } else {
            if (options && options.upsert) {
              data._id = UUID().replace(/-/g, '');
              collection.push(data);
              ret.updated = 0;
              ret.inserted = 1;
            } else {
              ret.updated = 0;
              ret.inserted = 0;
            }
          }
          return _this9._update(collection, res.sha).then(function (res) {
            resolve(res);
          });
        });
      });
    }
  }]);

  return Githubdb;
}();

// NOTE: event name is camelCase as per node convention


exports.default = Githubdb;
process.on('unhandledRejection', function (reason, promise) {
  if (promise) {
    //console.log(e(JSON.stringify(promise)));
  }
});