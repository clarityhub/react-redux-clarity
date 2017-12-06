import { Component } from 'react';
import { connect } from 'react-redux';
import { func, node, number, shape } from 'prop-types';

import hash from './utilities/hash';
import { cacheRequest } from './actions';
import connectFactory from './connectFactory';

const TEN_MINUTES = 10 * 60 * 1000;

// use the store to cache requests
// if a request has been made within the last
// 10 minutes, don't make the request again,
// just say cache hit
class Loader extends Component {
  static propTypes = {
    cached: shape({
      createdAt: number,
    }),
    children: node,
    handleLoad: func.isRequired,
  }

  componentDidMount() {
    const { cached, handleCacheRequest, handleLoad } = this.props;

    if (!cached || +new Date() - cached.createdAt > TEN_MINUTES) {
      this.clarityRequest = handleLoad();
      this.clarityRequest.response.then((r) => {
        if (r.res.statusCode >= 200 && r.res.statusCode < 300) {
          handleCacheRequest();
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.clarityRequest) {
      this.clarityRequest.cancel();
    }
  }

  render() {
    return this.props.children;
  }
}

const defaultPropMapper = (...args) => {
  // Remove children prop
  return args.filter(a => !a.children);
};

export default (action, propMapper) => connectFactory(
  connect(
    (state, props) => {
      const rProps = propMapper ? propMapper(props) : defaultPropMapper(props);
      return {
        cached: state.requests[hash(action, rProps)],
      };
    },
    (dispatch, props) => {
      const rProps = propMapper ? propMapper(props) : defaultPropMapper(props);
      const hashed = hash(action, rProps);
      return {
        handleCacheRequest: () => dispatch(cacheRequest(hashed, action, rProps)),
        handleLoad: () => dispatch(action(...(
          propMapper ? propMapper(props) : defaultPropMapper(props)
        ))),
      };
    }
  )(Loader)
);
