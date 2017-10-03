# githubDB
[![Build Status](https://travis-ci.org/usmakestwo/githubDB.svg?branch=master)](https://travis-ci.org/usmakestwo/githubDB)

A Lightweight Cloud based JSON Database with a MongoDB like API for Node.

_You will never know that you are interacting with a Github_

## Contents

* [Introduction](#introduction)
  * [Prerequisites](#prerequisites)
  * [Getting Started](#getting-started)
* [Documentation](#documentation)
  * [Connect](#connect-to-db)
  * [Load Collections](#load-collections)
  * [Write/Save](#writesave-to-collection)
  * [Read](#read-from-collection)
  * [Update](#update-collection)
  * [Remove](#remove-collection)
  * [Count](#count)
* [Examples](#examples)
* [Performance](#performance)
* [Contributing](#contributing)
* [Release History](#release-history)

## Introduction

Ever wanted to use Github as your private database, now you can.

Why would I want to use Github as my database?

Good question. Developers have many choices of different databases, GithubDB however leverages
all the features you have come to love from Github.

- Logging (With Github, you can quicky look at your commits and see the write and updates for your request).
- Visualization (Github offers amazing tools to visualize the incoming number of read/writes).
- Persistance (With Github you can rollback to early stages of your data and see how it has evolved).
- Security (Using Github, your database inherits the same standards from Github).
- Availability (Github has known to be down, but let's be honest, it is good enough unless you are Facebook).

### Prerequisites

In order to sucessfully use Github, you are going to need two things.

1) Personal Access Token

Create a new [personal access token](https://github.com/settings/tokens/new) from Github. The only permission you need
are **repo**.

Write it down and store it somewhere same.

2) An repository that you have access to with an file that has the extension .json.

Inside that file (let's say you called it database.json), you are going to create an empty array.


### Getting Starteed

Install the module locally :
```bash
$ npm install github-db
```

```js
/**
* We are going to authenticate with Github and
* specify our repo name and file we just created.
*/
var options = {
  host: 'private-github-api.com', // <-- Private github api url. If not passed, defaults to 'api.github.com'
  pathPrefix: 'prefix-for-enterprise-instance', // <-- Private github api url prefix. If not passed, defaults to null.
  protocol: 'https', // <-- http protocol 'https' or 'http'. If not passed, defaults to 'https'
  user: 'github-username', // <-- Your Github username
  repo: 'github-repo', // <-- Your repository to be used a db
  remoteFilename: 'filename-with-extension-json' // <- File with extension .json
};

// Require GithubDB
var GithubDB = require('..').default;
// Initialize it with the options from above.
var githubDB = new GithubDB(options);

// Authenticate Github DB -> grab a token from here https://github.com/settings/tokens
githubDB.auth(personalAccessToken);

// Connect to repository
githubDB.connectToRepo();

// You are now authenticated with Github and you are ready to use it as your database.
githubDB.save({"message": "wooohoo"});
```

## Documentation

### Authenticating with Github

```js
githubDB.auth(personalAccessToken)
```
In order to use Github DB, you will require a personal access token. You can request one
from (Github)[https://github.com/settings/tokens]. It is recommended that you set your token
as an enviroment variable. Never commit your token!

```js
var personalAccessToken = process.env.TOKEN; // Set the variable here
```

Start the server with the token
```bash
$ TOKEN=xxxx node app.js
```

Once you are authenticated to you connect to your new Github Database.
```js
githubDB.connectToRepo();
```

**Note** : Please make sure the file on Github you are using as your database contains a valid JSON array, otherwise githubDB
will return an empty array.

```js
[]
```
Else it will throw an error like

```bash
undefined:0

^
SyntaxError: Unexpected end of input
```
---

### Write/Save to Collection

With githubDb you can easily save an object. Since you are making a call to a network.
This method is asynchronous. 

```js
githubDB.save(users).then((res) => {
    // The result from the same
    console.log(res);
});
```

You can also save multiple objects at once like

```js

var article1 = {
    title : 'githubDB rocks',
    published : 'today',
    rating : '5 stars'
}

var article2 = {
    title : 'githubDB rocks',
    published : 'yesterday',
    rating : '5 stars'
}

var article3 = {
    title : 'githubDB rocks',
    published : 'today',
    rating : '4 stars'
}

githubDB.save([article1, article2, article3]).then((res) => {
    // The result from the same
    console.log(res);
});
```
And this will return the inserted objects

```js
[ { title: 'githubDB rocks',
    published: 'today',
    rating: '4 stars',
    _id: 'b1cdbb3525b84e8c822fc78896d0ca7b' },
  { title: 'githubDB rocks',
    published: 'yesterday',
    rating: '5 stars',
    _id: '42997c62e1714e9f9d88bf3b87901f3b' },
  { title: 'githubDB rocks',
    published: 'today',
    rating: '5 stars',
    _id: '4ca1c1597ddc4020bc41b4418e7a568e' } ]
```
---

### Read from Collection
There are 3 methods available for reading the JSON collection
* db.collectionName.find(query)
* db.collectionName.findExact(query)
* db.collectionName.findOne(query)

#### githubDB.find()
```js
githubDB.find().then((results) => {
    // Results here
    console.log(results);
});
```
This will return all the records
```js
[{
    title: 'githubDB rocks',
    published: 'today',
    rating: '5 stars',
    _id: '0f6047c6c69149f0be0c8f5943be91be'
}]
```
You can also query with a criteria like
```js
githubDB.find({rating : "5 stars"}).then((results)=> {
    console.log(results);
});
```
This will return all the articles which have a rating of 5.

Find can take multiple criteria
```js
githubDB.find({rating : "5 stars", published: "yesterday"}).then((results) => {
    console.log(results);  
});
```
This will return all the articles with a rating of 5, published yesterday.

#### githubDB.findExact(query)
This method returns exact match of records from the collection. 
```js
githubDB.findExact({
        title: 'githubDB rocks', 
        rating: '4 stars'
    }).then((results)=> {
    console.log(results);
});
```
This will return all the records
```js
[{
    title: 'githubDB rocks',
    published: 'today',
    rating: '4 stars',
    _id: 'b1cdbb3525b84e8c822fc78896d0ca7b' 
}]
```
#### githubDB.findOne(query)
```js
githubDB.findOne().then((results)=> {
    console.log(results);
});
```

If you do not pass a query, githubDB will return the first article in the collection. If you pass a query, it will return first article in the filtered data.

```js
githubDB.findOne({_id: '0f6047c6c69149f0be0c8f5943be91be'}).then((results)=> {
    console.log(results);
});
```
---
### Update Collection
```js
githubDB.update(query, data, options).then((updated)=> {
    console.log(updated);  // { updated: 1, inserted: 0 }
});;
```

You can also update one or many objects in the collection
```js
options = {
    multi: false, // update multiple - default false
    upsert: false // if object is not found, add it (update-insert) - default false
}
```
Usage
```js
var query = {
  title : 'githubDB rocks'
};

var dataToBeUpdate = {
  title : 'githubDB rocks again!',
};

var options = {
   multi: false,
   upsert: false
};

var updated = githubDB.update(query, dataToBeUpdate, options).then((results) => {
  console.log(updated); // { updated: 1, inserted: 0 }  
});
```
---
### Remove Collection
```js
githubDB.removeAll();
githubDB.remove(query, multi);
```
You can remove the entire collection (including the file) or you can remove the matched objects by passing in a query. When you pass a query, you can either delete all the matched objects or only the first one by passing `multi` as `false`. The default value of `multi` is `true`.

```js
githubDB.remove({rating : "5 stars"});
```
```js
githubDB.remove({rating : "5 stars"}, true); // remove all matched. Default - multi = true
```

```js
githubDB.remove({rating : "5 stars"}, false); // remove only the first match
```

To delete the file simple use removeAll();
```js
githubDB.removeAll();
```


## Contributing
See the [CONTRIBUTING Guidelines](https://github.com/usmakestwo/githubDB/blob/master/CONTRIBUTING.md)

## Release History

- 1.1.3
  - Add findExact method which returns exact match of objects from the collection

- 1.1.2
  - Allow to pass a path prefix when connecting to Enterprise Github

- 1.1.1
  - Compiled dist to update with previous version

- 1.1.0
  - Parameterized github API host url
  - Added eslint
  - Fixed test cases

- 1.0.0
  - Working version

## License
Copyright (c) 2017 UsMakesTwo. Licensed under the MIT license.
