import storage from './storage';

const TOKENS_STORAGE_KEY = 'aph.tokens';

export default {

  add(data) {
    if (!data.isCustom) {
      const existing = this.getOne(data.assetId, data.network);
      if (existing && existing.isCustom === true) {
        data.isCustom = true;
      }
    }

    const tokens = this.getAll();
    storage.set(TOKENS_STORAGE_KEY, _.set(tokens, `${data.assetId}_${data.network}`, data));
    return this;
  },

  remove(assetId, network) {
    const tokens = this.getAll();
    const token = this.getOne(assetId, network);
    if (!token) {
      return this;
    }
    token.isCustom = false;
    storage.set(TOKENS_STORAGE_KEY, _.set(tokens, `${assetId}_${network}`, token));

    return this;
  },

  getAll() {
    return storage.get(TOKENS_STORAGE_KEY, {});
  },

  getAllAsArray() {
    return _.sortBy(_.values(this.getAll()), [token => token.symbol.toLowerCase()], ['symbol']);
  },

  getOne(assetId, network) {
    return _.get(this.getAll(), `${assetId}_${network}`);
  },

  tokenExists(assetId, network) {
    return !!this.getOne(`${assetId}_${network}`);
  },

};
