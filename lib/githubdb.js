/*
 * githubdb
 * https://github.com/usmakestwo/githubDB
 *
 * Copyright (c) 2017 UsMakesTwo
 * Licensed under the MIT license.
 */

'use strict';

// global modules
import { red as e, green as s, yellow as w } from 'chalk';

// import github client
import GitHubApi from 'github';

/**
 * Initialize connectivity with Github
 */
const github = new GitHubApi({
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

/**
 * Returns a UTC timestamped.
 */
const timestamp = () => {
  const timestamped = new Date().toUTCString();
  return timestamped;
};

/**
 * Decodes base64 and returns a string
 * @param {string} file - Base64 encoded file.
 */
const decode = file => new Buffer (file, 'base64').toString('utf8');

/**
 * Encodes string to base64
 * @param {string} file  - String
 */
const encode = file => new Buffer(file).toString('base64');

/**
 * Gets current sha tree of passed Github repo
 * @param {object} options - Github options
 */
const getCurrentFile = (options) => {
  return new Promise((resolve) => {
    github.repos.getContent({
      owner: options.owner,
      repo: options.repo,
      path: options.path
    }).then(res => {
      console.log(s('File located'));
      resolve(res.data);
    });
  });
};

/**
 * Github class that provides functionality.
 * @class Githubdb
 */
export default class Githubdb {

  /**
   * {constructor}
   * @param {object} options - Github options
   */
  constructor(options) {
    this.options = options;
  }

  /**
   * Authenticates user based on access token
   * @param {string} token - Personal Github Token: https://github.com/settings/tokens
   */
  auth(token) {
    if (!token) {
      console.log(e('\nMissing Personal access token!'));
      return false;
    }
    github.authenticate({
      type: 'token',
      token,
    });
    console.log(w(JSON.stringify(this.options)));
    console.log(s('User has been authenticated successfully!'));
    return true;
  }

  /**
   * Connects to repo.
   */
  connectToRepo() {
    return new Promise((resolve) => {
      github.repos.get({
        owner: this.options.owner,
        repo: this.options.repo,
      }).then(res => {
        console.log(s('Connected to cloud file database.'));
        resolve(res.data);
      });
    });
  }

  /**
   * Uploads blobs to repo
   * @param {string} content - Content to upload
   */
  save(content) {
    return getCurrentFile(this.options).then(res =>{
      return new Promise((resolve) => {
        github.repos.updateFile({
          owner: this.options.owner,
          repo: this.options.repo,
          path: this.options.path,
          message: `File updated at ${timestamp()}`,
          content: encode(content),
          sha: res.sha,
        }).then(res => {
          console.log(s('File updated successfully'));
          resolve(res.data);
        });
      });
    });
  }

  /**
   * Returns decoded string from blob
   * @param {string} query - Return query string
   */
  find() {
    return getCurrentFile(this.options).then(res =>{
      return new Promise((resolve) => {
        resolve(decode(res.content));
      });
    });
  }


}
