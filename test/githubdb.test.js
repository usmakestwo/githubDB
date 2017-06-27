/* eslint-disable no-console, no-unused-expressions, no-unused-vars */
import chai from 'chai';
import spies from 'chai-spies';
import assert from 'assert';
import chaiAsPromised from 'chai-as-promised';

import users from './db/users.json';
import GithubDB from '../lib/githubdb';

chai.use(chaiAsPromised);

const options = {
  owner: 'usmakestwo',
  repo: 'githubDB',
  path: 'test.json'
};

const newUser = {
  "email_address": "newUser",
  "name": "New User",
  "verified": false,
  "github_username": "newUser",
};

const githubDB = new GithubDB(options);
const expect = chai.expect;
const should = chai.should();

const personalAccessToken = process.env.TOKEN;

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
    expect(githubDB.connectToRepo()).eventually.to.be.an('object').notify(done);
  });

  it('should save information passed', (done) => {
    expect(githubDB.save(users)).eventually.to.be.an('object').notify(done);
  });

  it('should save one record and append to collection', (done) => {
    expect(githubDB.save(newUser)).eventually.to.be.an('object').notify(done);
  });

  it('should find all data if no query passed', (done) => {
    expect(githubDB.find()).eventually.to.contain('gonzalo').notify(done);
  });

  it('should find all object based on query', (done) => {
    expect(githubDB.find({name: 'Eric Broda'})).eventually.to.be.an('array').notify(done);
  })

  it('should find one object based on query', (done) => {
    expect(githubDB.findOne({name: 'Eric Broda'})).eventually.to.be.an('object').notify(done);
  })

  it('should update record based on query', (done) => {
    expect(githubDB.update({ github_username: 'gonzalovazquez' }, { verified: true })).eventually.to.be.an('object').notify(done);
  });

  it('should only delete one record from query', (done) => {
    expect(githubDB.remove({ name: 'Gonzalo Vazquez' })).eventually.to.not.contain('gonzalo').notify(done);
  });

  it('should return an error if no query is present', (done) => {
    expect(githubDB.remove()).eventually.to.be.rejected;
    done();
  });

  it('should delete a file if no query is passed', (done) => {
    expect(githubDB.removeAll()).eventually.to.be.true.notify(done);
  });

  it('should throw an error if file is not found', (done) => {
    expect(githubDB.removeAll()).eventually.to.be.rejected;
    done();
  });

});
/* eslint-disable no-console, no-unused-expressions, no-unused-vars */