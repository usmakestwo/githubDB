/* eslint-disable no-console, no-unused-expressions, no-unused-vars */
import chai from 'chai';
import spies from 'chai-spies';
import assert from 'assert';

import DiskDB from '../lib/diskdb';

const diskdb = new DiskDB();
const expect = chai.expect;
const should = chai.should();


const github = {
  personalAccessToken: process.env.TOKEN,
  user: 'cibc-api',
  repo: 'marketplace-admin',
  remoteFilename: 'users.json'
};

var dbPath = 'test/testdb',
    collection = ['articles'],
    collections = ['comments', 'rating'],
    article = {
        title: 'diskDB rocks',
        published: 'today'
    },
    article2 = {
        title: 'diskDB rocks',
        published: 'yesterday'
    },
    article3 = {
        title: 'diskDB rocks',
        published: 'yesterday'
    },
    //nested objects
    articleComments = {
        title: 'diskDB rocks',
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
    },
    articleComments2 = {
        title: 'diskDB rocks again',
        published: '3 days ago',
        comments: [{
            name: 'a user',
            comment: 'this is cool',
            rating: 1
        }, {
            name: 'b user',
            comment: 'this is ratchet',
            rating: 1
        }, {
            name: 'c user',
            comment: 'this is awesome',
            rating: 2
        }]
    },
    articleCommentsL3 = {
        title: 'diskDB rocks again',
        published: '3 days ago',
        comments: [{
            name: 'a user',
            comment: 'this is cool',
            rating: 2,
            comments: [{
                name: 'd user',
                comment: 'A reply',
                rating: 1
            }]
        }, {
            name: 'b user',
            comment: 'this is ratchet',
            rating: 2
        }, {
            name: 'c user',
            comment: 'this is awesome',
            rating: 2
        }]
    };

describe('diskDB module', () => {

  before(() => {
    diskdb.connect(dbPath, collection, github);
  });

  it('should save multiple to Github', (done) => {
    expect(diskdb.articles.save([article, article2])).to.be.an('array');
    done();
  });

});
/* eslint-disable no-console, no-unused-expressions, no-unused-vars */