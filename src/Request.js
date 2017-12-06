import {
  LOADING,
  FAILURE,
  SUCCESS,
} from './constants/request';
import { DONE } from './constants/status';

/*
 * This class does not take care of throttling requests.
 * 
 * If you would like your requests throttled, use
 * the loader component
 */
export default (xhr) => class ClarityRequest {
  constructor({ dispatch, headers = {} }) {
    if (!dispatch) {
      throw new Error('Clarity required a `dispatch` parameter in order to make requests');
    }

    this.dispatch = dispatch;
    this.headers = headers || {};
    this.request = null;
    this.response = null;
    this.passthroughData = {};
  }

  passthrough(data) {
    this.passthroughData = data;

    return this;
  }

  call(method, url, data, type) {
    this.dispatch({
      type,
      _clarity: +new Date(),
      ...this.passthroughData,
      state: LOADING,
    });

    this.response = new Promise((resolve, reject) => {
      this.request = xhr({
        method: method,
        body: JSON.stringify(data),
        url,
        headers: {
          'Content-Type': 'application/json',
          ...this.headers,
        },
      }, (err, res, body) => {
        let b = body;

        if (res.responseType === 'application/json') {
          b = body ? JSON.parse(body) : {};
        }

        if (res.statusCode >= 200 && res.statusCode < 300) {
          this.dispatch({
            type,
            _clarity: +new Date(),
            ...this.passthroughData,
            state: SUCCESS,
            payload: b,
          });
          resolve({ res, body: b });
        } else {
          this.dispatch({
            type,
            _clarity: +new Date(),
            ...this.passthroughData,
            state: FAILURE,
            payload: {
              res,
              body: b,
            },
          });

          let rejectable = err;

          try {
            rejectable = JSON.parse(b.reason).reason;
          } catch (e) {
            try {
              rejectable = b.reason;
            } catch (e) {

            }
          }

          reject(new Error(rejectable));
        }
      });
    });

    return this;
  }

  cancel() {
    if (this.request && this.request.readyState !== DONE) {
      this.request.abort();
      return true;
    }

    return false;
  }

  post(url, data, type) {
    return this.call('POST', url, data, type);
  }

  get(url, data, type) {
    return this.call('GET', url, data, type);
  }

  put(url, data, type) {
    return this.call('PUT', url, data, type);
  }

  patch(url, data, type) {
    return this.call('PATCH', url, data, type);
  }

  delete(url, data, type) {
    return this.call('DELETE', url, data, type);
  }
};
