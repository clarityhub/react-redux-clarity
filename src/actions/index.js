import { CACHE } from '../constants/types';

export const cacheRequest = (hash, callback, props) => {
  return {
    type: CACHE,
    payload: {
      hash,
      callback,
      callbackName: callback.name || callback.toString(),
      props,
      createdAt: +new Date(),
    },
  };
};
