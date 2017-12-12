import {
  LOADING,
  FAILURE,
  SUCCESS,
} from './constants/request';
import {
  INITIAL,
  FETCHING,
  LOADED,
  ERROR,
} from './constants/state';

export default class ClarityState {
  constructor(constants = []) {
    this.constants = constants;
  }

  reducer(callback) {
    return (state, action) => {
      if (typeof state === 'undefined') {
        state = {
          error: null,
          state: INITIAL,
          // eslint-disable-next-line
          ...callback(undefined, { type: '@@INIT' }),
        };
      }

      if (this.constants.indexOf(action.type) === -1) {
        return state;
      }

      // passthrough if not an clarity action, or the type is success
      const newData = typeof action._clarity === 'undefined' || action.state === SUCCESS ? callback(state, action) : {};

      const mergedData = {
        ...state,
        ...newData,
      };

      // Update the mergedData with annotations
      switch (action.state) {
        case LOADING:
          mergedData.state = FETCHING;
          mergedData.error = null;
          break;
        case SUCCESS:
          mergedData.state = LOADED;
          mergedData.error = null;
          break;
        case FAILURE:
          mergedData.state = ERROR;
          mergedData.error = action.payload.body.reason || 'Something bad happened';
          break;
        default:
          break;
      }

      return mergedData;
    };
  }
}
