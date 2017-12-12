import xhr from 'xhr';
import xhrToClarityRequest from './Request';
import ClarityReducer from './reducer';

const XhrClarityRequest = xhrToClarityRequest(xhr);

class Clarity {
  action(injectables, options) {
    let ClarityRequest = XhrClarityRequest;

    if (options && options.xhr) {
      ClarityRequest = xhrToClarityRequest(options.xhr);
    }

    return new ClarityRequest(injectables);
  }

  listen(constants) {
    return new ClarityReducer(constants);
  }
}

export default new Clarity();
export { default as reducer } from './reducers';
