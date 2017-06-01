# githubDB

A Lightweight Cloud based JSON Database with a MongoDB like API for Node.

_You will never know that you are interacting with a Cloud Provider_

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

With githubDB you use Github as your private database.

Install the module locally :
```bash
$ npm install github-db
```

```js
var db = require('github-db');

// you can authenticate with the cloud provider here.
const credentials = {
  personalAccessToken: 'personal-access-token',
  user: 'github-username',
  repo: 'github-repo',
  remoteFilename: 'filename-with-extension'
};

db.connect('/path/to/db-folder', ['collection-name'], credentials);
// you can access the traditional JSON DB methods here
```

## Documentation
### Connect to DB
```js
db.connect('/path/to/db-folder', ['collection-name'], credentials);
```
Cloud provider is one of the supported clients. githubDB will take care of the authentication.
Filename will be the name of the JSON file. You can omit the extension, githubDB will take care of it for you.

```js
var db = require('github-db');
db.connect('/path/to/db-folder', ['collection-name'], credentials);
```

This will check for a directory at given path, if it does not exits, githubDB will throw an error and exit.

If the directory exists but the file/collection does not exist, githubDB will create it for you.

**Note** : If you have manually created a JSON file, please make sure it contains a valid JSON array, otherwise githubDB
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
### Load Collections
Alternatively you can also load collections like

```js
var db = require('github-db');
// this

db = db.connect('/examples/db', ['articles'], credentials);
db.loadCollections(['articles']);
//or
db.connect('/examples/db', ['articles'], credentials);
db.loadCollections(['articles']);
//or
db.connect('/examples/db', ['articles'], credentials)
  .loadCollections(['articles']);
//or
db.connect('/examples/db', ['articles'], credentials);
```
#### Load Multiple Collections

```js
var db = require('github-db');
db.connect('/examples/db', ['articles','comments','users'], credentials);
```
---
### Write/Save to Collection
```js
db.collectionName.save(object);
```
Once you have loaded a collection, you can access the collection's methods using the dot notation like

```js
db.[collectionName].[methodname]
```
To save the data, you can use
```js
var db = require('github-db');
db.connect('db', ['articles'], credentials);
var article = {
    title : "githubDB rocks",
    published : "today",
    rating : "5 stars"
}
db.articles.save(article);
// or
db.articles.save([article]);
```
The saved data will be
```js
[
    {
        "title": "githubDB rocks",
        "published": "today",
        "rating": "5 stars",
        "_id": "0f6047c6c69149f0be0c8f5943be91be"
    }
]
```
You can also save multiple objects at once like

```js
var db = require('github-db');
db.connect('db', ['articles'], credentials);
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
db.articles.save([article1, article2, article3]);
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


#### db.collectionName.find()
```js
var db = require('github-db');
db.connect('/examples/db', ['articles'], credentials);
db.articles.find();
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
var db = require('github-db');
db.connect('/examples/db', ['articles'], credentials);
db.articles.find({rating : "5 stars"});
```
This will return all the articles which have a rating of 5.

Find can take multiple criteria
```js
var db = require('github-db');
db.connect('/examples/db', ['articles'], credentials);
db.articles.find({rating : "5 stars", published: "yesterday"});
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
var savedArticle = db.articles.save([articleComments);
foundArticles = db.articles.find({rating : 2});
```
Since githubDB is mostly for light weight data storage, avoid nested structures and huge datasets.

#### db.collectionName.findOne(query)
```js
var db = require('github-db');
db.connect('/examples/db', ['articles'], credentials);
db.articles.findOne();
```

If you do not pass a query, githubDB will return the first article in the collection. If you pass a query, it will return first article in the filtered data.

```js
var db = require('github-db');
db.connect('/examples/db', ['articles'], credentials);
db.articles.findOne({_id: '0f6047c6c69149f0be0c8f5943be91be'});
```
---
### Update Collection
```js
db.collectionName.update(query, data, options);
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
var db = require('github-db');
db.connect('/examples/db', ['articles'], credentials);

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

var updated = db.articles.update(query, dataToBeUpdate, options);
console.log(updated); // { updated: 1, inserted: 0 }
```
---
### Remove Collection
```js
db.collectionName.remove(query, multi);
```
You can remove the entire collection (including the file) or you can remove the matched objects by passing in a query. When you pass a query, you can either delete all the matched objects or only the first one by passing `multi` as `false`. The default value of `multi` is `true`.

```js
var db = require('github-db');
db.connect('/examples/db', ['articles'], credentials);
db.articles.remove({rating : "5 stars"});
```
```js
var db = require('github-db');
db.connect('/examples/db', ['articles'], credentials);
db.articles.remove({rating : "5 stars"}, true); // remove all matched. Default - multi = true
```

```js
var db = require('github-db');
db.connect('/examples/db', ['articles'], credentials);
db.articles.remove({rating : "5 stars"}, false); // remove only the first match
```
Using remove without any params will delete the file and will remove the db instance.
```js
var db = require('github-db');
db.connect('/examples/db', ['articles'], credentials);
db.articles.remove();
```
After the above operation `db.articles` is `undefined`.

---
### Count
```js
db.collectionName.count();
```
Will return the count of objects in the Collection
```js
var db = require('github-db');
db.connect('/examples/db', ['articles'], credentials);
db.articles.count(); // will give the count
```

## Examples
Refer to the [examples](https://github.com/usmakestwo/githubDB/tree/master/examples) folder.


## Contributing
See the [CONTRIBUTING Guidelines](https://github.com/usmakestwo/githubDB/blob/master/CONTRIBUTING.md)

## Release History
* 0.1.x
  - Connect to Github

## License
Copyright (c) 2017 UsMakesTwo. Licensed under the MIT license.
