import { expect } from 'chai';
import sinon from 'sinon';
import clarity from '../src';

describe('react-redux-clarity request', () => {
  let dispatch = null;
  let request = null;

  beforeEach(() => {
    dispatch = sinon.spy();
    const xhr = function (options, cb) {
      cb(null, { statusCode: 200 }, {});
    };

    request = clarity.action({ dispatch, headers: {} }, { xhr });
  });

  it('throws an error if dispatch is not provided', () => {
    expect(clarity.action.bind(this, {})).to.throw(Error);
  });

  it('makes a loading and success call for a get', (done) => {
    const req = request.get('https://api.clarityhub.io', {}, 'MY_CUSTOM_ACTION');
    req.response.then(() => {
      expect(dispatch).to.have.been.calledTwice;
      done();
    }).catch(done);
  });

  it('throws an error when get fails', (done) => {
    const xhr = function (options, cb) {
      // eslint-disable-next-line
      cb({ reason: 'Oh no' }, { statusCode: 500 }, {});
      return { };
    };

    request = clarity.action({ dispatch }, { xhr });

    const req = request.get('https://api.clarityhub.io', {}, 'MY_CUSTOM_ACTION');
    req.response.catch(() => {
      expect(dispatch).to.have.been.calledTwice;
      done();
    });
  });

  it('has functions for get, post, put, patch, delete', () => {
    const propertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(request));
    expect(propertyNames).to.include.members([
      'get',
      'post',
      'put',
      'patch',
      'delete',
    ]);
  });

  describe('calls the correct xhr type', () => {
    ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].forEach((type) => {
      it(type, (done) => {
        const xhr = function (options, cb) {
          expect(options.method).to.be.equal(type);
          cb(null, { statusCode: 200 }, {});
        };

        request = clarity.action({ dispatch }, { xhr });

        const req = request[type.toLowerCase()]('https://api.clarityhub.io', {}, 'MY_CUSTOM_ACTION');
        req.response.then(() => { done(); }).catch(done);
      });
    });
  });

  it('transforms json payloads', (done) => {
    const xhr = function (options, cb) {
      cb(null, { headers: {'content-type': 'application/json'}, responseType: 'application/json', statusCode: 200 }, '{ "data": "value" }');
    };

    request = clarity.action({ dispatch }, { xhr });

    const req = request.post('https://api.clarityhub.io', {}, 'MY_CUSTOM_ACTION');
    req.response.then(({ body }) => {
      expect(body.data).to.be.equal('value');
      done();
    }).catch(done);
  });

  it('can canel a request', () => {
    const abort = sinon.spy();
    const xhr = function (options, cb) {
      cb(null, { statusCode: 200 }, {});
      return { abort };
    };

    request = clarity.action({ dispatch }, { xhr });

    const req = request.post('https://api.clarityhub.io', {}, 'MY_CUSTOM_ACTION');

    expect(req.cancel()).to.be.true;
    expect(abort).to.have.been.calledOnce;
  });

  it('can\'t cancel a request if it has already been made', (done) => {
    const abort = sinon.spy();
    const xhr = function (options, cb) {
      cb(null, { statusCode: 200 }, {});
      return { abort, readyState: 4 };
    };

    request = clarity.action({ dispatch }, { xhr });

    const req = request.post('https://api.clarityhub.io', {}, 'MY_CUSTOM_ACTION');
    req.response.then(() => {
      expect(req.cancel()).to.be.false;
      expect(abort).to.not.have.been.called;
      done();
    }).catch(done);
  });

  it('passes threw custom data', (done) => {
    const req = request.passthrough({
      customData: 'value',
    }).post('https://api.clarityhub.io', {}, 'MY_CUSTOM_ACTION');
    req.response.then(() => {
      expect(dispatch).to.have.been.calledWithMatch({
        state: 'LOADING',
        customData: 'value',
      });
      done();
    }).catch(done);
  });
});
