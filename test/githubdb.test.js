/* eslint-disable no-console, no-unused-expressions, no-unused-vars */
import chai from 'chai';
import spies from 'chai-spies';
import assert from 'assert';
import chaiAsPromised from 'chai-as-promised';

import GithubDB from '../lib/githubdb';

chai.use(chaiAsPromised);

const githubDB = new GithubDB();
const expect = chai.expect;
const should = chai.should();

const personalAccessToken = process.env.TOKEN;

const userObject = {
  "email_address": "gonzalo" + Math.random().toString() + "@cibc.com",
  "name": "gonzalo vazquez",
  "invited": false,
  "github_username": "gonzalovazquez"+ Math.random().toString()
};

describe('githubDB module', () => {

  it('should failed authentication if not credentials are provided', (done) => {
    expect(githubDB.auth()).to.be.false;
    done();
  });

  it('should return authenticated client', (done) => {
    expect(githubDB.auth(personalAccessToken)).to.be.true;
    done();
  });

  it('should return the reference of the connected path', (done) => {
    expect(githubDB.connectToRepo('cibc-api', 'marketplace-admin')).eventually.to.be.an('object').notify(done);
  });

  it('should create a blob in Github', (done) => {
    /**
     * Wrap in timeout block to avoid collision with other test
     */
    setTimeout(() => {
      expect(githubDB.updateBlob('cibc-api', 'marketplace-admin', 'users.json', JSON.stringify(userObject))).eventually.to.be.an('object').notify(done);
    }, 1000);
  });

});
/* eslint-disable no-console, no-unused-expressions, no-unused-vars */