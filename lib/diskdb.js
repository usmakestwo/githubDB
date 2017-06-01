'use strict';

// global modules
import { join } from 'path';
import { red as e, green as s } from 'chalk';

//local modules
import { isValidPath, writeToFile } from './util';
import Collection from './collection';
import JsonDB from './jsonDB';

const jsonDB = new JsonDB();
const personalAccessToken = '9187059e4431a66447b3e123acd60637e741fae7';

export default class DiskDB {

  connect(path, collections) {
    if (isValidPath(path)) {
      this._db = { path };
      console.log(s('Successfully connected to : ' + path));
      if (collections) {
        this.loadCollections(collections);
      }
    } else {
      console.log(e('The DB Path [' + path + '] does not seem to be valid. Recheck the path and try again'));
      return false;
    }
    jsonDB.auth(personalAccessToken);
    return this;
  }

  loadCollections(collections) {
    if (!this._db) {
      console.log(e('Initialize the DB before you add collections. Use : ', 'db.connect(\'path-to-db\');'));
      return false;
    }
    if (Array.isArray(collections)) {
      collections.forEach(collection => {
        if (!collection.includes('.json')) {
          collection = `${collection}.json`;
        }
        const collectionFile = join(this._db.path, collection);
        if (!isValidPath(collectionFile)) {
          writeToFile(collectionFile);
        }
        const collectionName = collection.replace('.json', '');
        this[collectionName] = new Collection(this, collectionName);
      });
    } else {
      console.log(e('Invalid Collections Array.', 'Expected Format : ', '[\'collection1\',\'collection2\',\'collection3\']'));
    }
    return this;
  }

}