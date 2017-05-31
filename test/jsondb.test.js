/* eslint-disable no-console, no-unused-expressions, no-unused-vars */
import chai from 'chai';
import spies from 'chai-spies';
import assert from 'assert';
import chaiAsPromised from 'chai-as-promised';

import DiskDB from '../lib/diskdb';

chai.use(chaiAsPromised);

const diskdb = new DiskDB();
const expect = chai.expect;
const should = chai.should();

const personalAccessToken = '9187059e4431a66447b3e123acd60637e741fae7';

describe('jsonDB module', () => {

  it('should failed authentication if not credentials are provided', (done) => {
    expect(diskdb.auth()).to.be.false;
    done();
  });

  it('should return authenticated client', (done) => {
    expect(diskdb.auth(personalAccessToken)).to.be.true;
    done();
  });

  it('should return the reference of the connected path', (done) => {
    expect(diskdb.connectToRepo('cibc-api', 'marketplace-admin')).eventually.to.be.an('object').notify(done);
  });

});
/* eslint-disable no-console, no-unused-expressions, no-unused-vars */