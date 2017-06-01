/*
 * diskDB
 * http://arvindr21.github.io/diskDB
 *
 * Copyright (c) 2014 Arvind Ravulavaru
 * Licensed under the MIT license.
 */

'use strict';

// global modules
import { red as e, green as s } from 'chalk';

// import github client
import GitHubApi from 'github';

// Initialize connectivity with Github
const github = new GitHubApi({
  // optional
  debug: false,
  protocol: 'https',
  host: 'api.github.com', // should be api.github.com for GitHub
  headers: {
    'user-agent': 'Json DB' // GitHub is happy with a unique user agent
  },
  Promise: require('bluebird'),
  timeout: 5000
});

const timestamp = () => {
  const timestamped = new Date().toUTCString();
  return timestamped;
};

const getCurrentFile = (owner, repo, path) => {
  return new Promise((resolve) => {
    github.repos.getContent({
      owner,
      repo,
      path
    }).then(res => {
      console.log(s('File located'));
      resolve(res.data);
    });
  });
};

export default class jsonDB {

  auth(token) {
    if (!token) {
      console.log(e('\nMissing Personal access token!'));
      return false;
    }

    github.authenticate({
      type: 'token',
      token,
    });

    console.log(s('User has been authenticated successfully!'));
    return true;
  }

  connectToRepo(owner, repo) {
    return new Promise((resolve) => {
      github.repos.get({ owner, repo }).then(res => {
        console.log(s('Connected to cloud file database.'));
        resolve(res.data);
      });
    });
  }

  updateBlob(owner, repo, path, content) {
    return getCurrentFile(owner, repo, path).then(res =>{
      return new Promise((resolve) => {
        github.repos.updateFile({
          owner,
          repo,
          path,
          message: `File updated at ${timestamp()}`,
          content: new Buffer(content).toString('base64'),
          sha: res.sha,
        }).then(res => {
          console.log(s('File updated successfully'));
          resolve(res.data);
        });
      });
    });
  }

}
