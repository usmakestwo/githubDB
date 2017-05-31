/* eslint-disable no-console, no-unused-expressions, no-unused-vars */
import chai from 'chai';
import spies from 'chai-spies';
import assert from 'assert';
import chaiAsPromised from 'chai-as-promised';

import JsonDB from '../lib/jsonDB';

chai.use(chaiAsPromised);

const jsonDB = new JsonDB();
const expect = chai.expect;
const should = chai.should();

const personalAccessToken = '9187059e4431a66447b3e123acd60637e741fae7';

const userObject = {
  "email_address": "gonzalo" + Math.random().toString() + "@cibc.com",
  "name": "gonzalo vazquez",
  "invited": false,
  "github_username": "gonzalovazquez"+ Math.random().toString()
};

describe('jsonDB module', () => {

  it('should failed authentication if not credentials are provided', (done) => {
    expect(jsonDB.auth()).to.be.false;
    done();
  });

  it('should return authenticated client', (done) => {
    expect(jsonDB.auth(personalAccessToken)).to.be.true;
    done();
  });

  it('should return the reference of the connected path', (done) => {
    expect(jsonDB.connectToRepo('cibc-api', 'marketplace-admin')).eventually.to.be.an('object').notify(done);
  });

  it.only('should create a blob in Github', (done) => {
    expect(jsonDB.auth(personalAccessToken));
    expect(jsonDB.updateBlob('cibc-api', 'marketplace-admin', 'users.json', JSON.stringify(userObject))).eventually.to.be.an('object').notify(done);
  });

});
/* eslint-disable no-console, no-unused-expressions, no-unused-vars */