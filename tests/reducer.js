import { expect } from 'chai';
import clarity from '../src';

describe('react-redux-clarity reducer', () => {
  let reducer = null;

  before(() => {
    reducer = clarity.listen([
      'NON_CLARITY_CUSTOM_ACTION',
      'CUSTOM_ACTION',
    ]).reducer((state = {
      myCustomState: 'an inital value',
    }, action) => {
      switch (action.type) {
        case 'NON_CLARITY_CUSTOM_ACTION':
          return {
            state: action.state,
          };
        case 'CUSTOM_ACTION':
          return {
            myCustomState: action.payload,
          };
        default:
          return state;
      }
    });
  });

  it('sets the store to the initial data', () => {
    const before = undefined;
    const action = { type: '@@INIT' };
    const after = {
      myCustomState: 'an inital value',
      error: null,
      state: 'INITIAL',
    };

    expect(reducer(before, action)).to.be.deep.equal(after);
  });

  it('updates the store with a loading event', () => {
    const before = {
      myCustomState: 'an initial value',
      error: null,
      state: 'INITIAL',
    };
    const action = {
      type: 'CUSTOM_ACTION',
      state: 'LOADING',
      _clarity: 0,
    };
    const after = {
      myCustomState: 'an initial value',
      error: null,
      state: 'FETCHING',
    };

    expect(reducer(before, action)).to.be.deep.equal(after);
  });

  it('does not update the store with a loading event for another action', () => {
    const before = {
      myCustomState: 'an initial value',
      error: null,
      state: 'INITIAL',
    };
    const action = {
      type: 'CUSTOM_OTHER_ACTION',
      state: 'LOADING',
      _clarity: 0,
    };
    const after = {
      myCustomState: 'an initial value',
      error: null,
      state: 'INITIAL',
    };

    expect(reducer(before, action)).to.be.deep.equal(after);
  });

  it('updates the store with a failure event', () => {
    const before = {
      myCustomState: 'an initial value',
      error: null,
      state: 'INITIAL',
    };
    const action = {
      type: 'CUSTOM_ACTION',
      state: 'FAILURE',
      _clarity: 0,
      payload: {
        res: {},
        body: {},
      },
    };
    const after = {
      myCustomState: 'an initial value',
      error: 'Something bad happened',
      state: 'ERROR',
    };

    expect(reducer(before, action)).to.be.deep.equal(after);
  });

  it('does not update the store with a failure event for another action', () => {
    const before = {
      myCustomState: 'an initial value',
      error: null,
      state: 'INITIAL',
    };
    const action = {
      type: 'CUSTOM_OTHER_ACTION',
      state: 'FAILURE',
      _clarity: 0,
      payload: {
        res: {},
        body: {},
      },
    };
    const after = {
      myCustomState: 'an initial value',
      error: null,
      state: 'INITIAL',
    };

    expect(reducer(before, action)).to.be.deep.equal(after);
  });

  it('updates the store with a success event', () => {
    const before = {
      myCustomState: 'an initial value',
      error: null,
      state: 'INITIAL',
    };
    const action = {
      type: 'CUSTOM_ACTION',
      state: 'SUCCESS',
      _clarity: 0,
      payload: 'new value',
    };
    const after = {
      myCustomState: 'new value',
      error: null,
      state: 'LOADED',
    };

    expect(reducer(before, action)).to.be.deep.equal(after);
  });

  it('does not update the store with a success event for another action', () => {
    const before = {
      myCustomState: 'an initial value',
      error: null,
      state: 'INITIAL',
    };
    const action = {
      type: 'CUSTOM_OTHER_ACTION',
      state: 'SUCCESS',
      _clarity: 0,
      payload: 'new value',
    };
    const after = {
      myCustomState: 'an initial value',
      error: null,
      state: 'INITIAL',
    };

    expect(reducer(before, action)).to.be.deep.equal(after);
  });

  it('passes through non-clarity actions', () => {
    const before = {
      myCustomState: 'an initial value',
      error: null,
      state: 'INITIAL',
    };
    const action = {
      type: 'NON_CLARITY_CUSTOM_ACTION',
      state: 'DIFFERENT_EVENT',
    };
    const after = {
      myCustomState: 'an initial value',
      error: null,
      state: 'DIFFERENT_EVENT',
    };

    expect(reducer(before, action)).to.be.deep.equal(after);
  });
});
