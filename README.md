# React Redux Clarity

[![NPM](https://nodei.co/npm/react-redux-clarity.png)](https://nodei.co/npm/react-redux-clarity/)

[![CircleCI](https://circleci.com/gh/clarityhub/react-redux-clarity/tree/master.svg?style=svg&circle-token=bb12ad3dce1b089d3cfec99839a2bbd0eda5b322)](https://circleci.com/gh/clarityhub/react-redux-clarity/tree/master)

React-redux-clarity provides helper utilities to standardize your reducers so that every action automatically has loading states and error handling.

## Usage

```sh
yarn add react-redux-clarity \
  prop-types react-redux xhr
```

### actions.js

We assume you are using `redux-thunk` to dispatch actions. Here in this
example we use `react-redux-clarity` to do a get. It will take care of
dispatching the `fetching`, `success`, and `error` states for us.

```js
import clarity from 'react-redux-clarity';
import { READ } from './constants';

export const get = ({ id }) => (dispatch, getState) => clarity.action({
  dispatch,
  headers: {
    jwt: getState().auth.jwt,
  },
}).passthrough({
  customData: 'value',
}).get(`https://api.clarityhub.io/accounts/users/${id}`, {}, READ);
```

We support `get`, `put`, `patch`, `post`, and `delete` actions.

### reducers.js

Here we'll use `react-redux-clarity` to handle the state and error for us. All we have to handle is the case where the request is successful. We'll also use the `customData` attribute that was `passthrough`'d above.

Note the `.listen` call in the chain. Since `react-redux-clarity` takes care of managing the request state for you, it needs to know which events you are explicitly listening for.

```js
import clarity from 'react-redux-clarity';
import { READ } from './constants';

export default clarity.listen([
  READ,
]).reducer((state = {
  items: [],
}, action) => {
  switch(action.type) {
    case READ:
      return {
        customData: action.customData,
        items: action.payload,
      };
    default:
      return state;
  }
});
```

The `.reducer()` will pass passthrough the redux action with type `@@INIT` to your reducer.

You will also want to add our reducer to your store:

```js
import { reducer } from 'react-redux-clarity';

export default combineReducers({
  requests: reducer,
});
```

### component.js

We can use the `get` action we defined above in a helper Higher-Order Component called `loader`. Loader takes an action and an optional propMapper function (that maps props into an array). When you mount the wrapped `MyComponent` in the example below, the `loader` will take care of calling `get` for you.

`loader` also caches results so if many `MyComponent`s get mounted with the same call signatures, `get` will only be called once.

```jsx
import React from 'react';
import { loader } from 'react-redux-clarity';
import { get } from './actions';

const MyComponent = () => (<div />);

const propMapper = (props) => ([props.id]);
export default loader(get, propsMapper)()(MyComponent);
```

### enhancers

These are located in `react-redux-clarity/dist/enhancers`. They will be removed in a future release.
