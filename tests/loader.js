import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { loader, reducer } from '../src';

const middleware = applyMiddleware(thunk);

const store = createStore(combineReducers({
  requests: reducer,
}), compose(middleware));

describe('react-redux-clarity loader', () => {
  it('calls the given action', () => {
    const get = () => (dispatch) => ({
      response: Promise.resolve({
        res: {
          statusCode: 200,
        },
      }),
    });
    const spy = sinon.spy(get);
    expect(loader(spy)).to.be.a('function');

    const Component = loader(spy)()(() => {
      return <div />;
    });

    mount(<Provider store={store}><Component /></Provider>);
    expect(spy).to.have.been.calledOnce;
  });
});
