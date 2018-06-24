/* eslint-disable */
import store from 'lockr';

export default {

  delete(key) {
    store.rm(key);

    return this;
  },

  get(key, defaultValue = null) {
    return store.get(key, defaultValue);
  },

  set(key, value) {
    store.set(key, value);

    return this;
  },
};
