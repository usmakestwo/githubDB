# githubDB

A Lightweight Cloud based JSON Database with a MongoDB like API for Node.

_You will never know that you are interacting with a Github_

## Contents

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

## Getting Started

Ever wanted to use Github as your private database, now you can.


Install the module locally :
```bash
$ npm install github-db
```

```js
// You can authenticate with the cloud provider here.
var options = {
  user: 'github-username', // <-- Your Github username
  repo: 'github-repo', // <-- Your repository to be used a db
  remoteFilename: 'filename-with-extension' // <- File with extension .json
};

// Require GithubDB
var GithubDB = require('..').default;
// Initialize it with the options from above.
var db = new GithubDB(options);

// Authenticate Github DB -> grab a token from here https://github.com/settings/tokens
githubDB.auth(personalAccessToken)
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
githubDB.connectToRepo()
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

With githubDb you can easily save an object.

```js
githubDB.save(users)
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
githubDB.save([article1, article2, article3]);
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
There are 2 methods available for reading the JSON collection
* db.collectionName.find(query)
* db.collectionName.findOne(query)


#### githubDB.find()
```js
githubDB.find()
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
githubDB.find({rating : "5 stars"});
```
This will return all the articles which have a rating of 5.

Find can take multiple criteria
```js
githubDB.find({rating : "5 stars", published: "yesterday"});
```
This will return all the articles with a rating of 5, published yesterday.

Nested JSON :

```js
var articleComments = {
    title: 'githubDB rocks',
    published: '2 days ago',
    comments: [{
        name: 'a user',
        comment: 'this is cool',
        rating: 2
    }, {
        name: 'b user',
        comment: 'this is ratchet',
        rating: 3
    }, {
        name: 'c user',
        comment: 'this is awesome',
        rating: 2
    }]
}
```
```js
var savedArticle = githubDB.find([articleComments);
foundArticles = githubDB.find({rating : 2});
```
Since githubDB is mostly for light weight data storage, avoid nested structures and huge datasets.

#### db.collectionName.findOne(query)
```js
githubDB.findOne();
```

If you do not pass a query, githubDB will return the first article in the collection. If you pass a query, it will return first article in the filtered data.

```js
githubDB.findOne({_id: '0f6047c6c69149f0be0c8f5943be91be'});
```
---
### Update Collection
```js
githubDB.update(query, data, options);
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

var updated = githubDB.update(query, dataToBeUpdate, options);
console.log(updated); // { updated: 1, inserted: 0 }
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
* 1.0.0
  - Working version

## License
Copyright (c) 2017 UsMakesTwo. Licensed under the MIT license.
