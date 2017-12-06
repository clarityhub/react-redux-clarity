import { CACHE } from '../constants/types';

export default (state = {}, action) => {
  switch (action.type) {
    case CACHE:
      return {
        ...state,
        [action.payload.hash]: {
          ...action.payload,
        },
      };
    default:
      return state;
  }
};
