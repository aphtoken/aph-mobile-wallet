import storage from './storage';
import assets from './assets';

const TOKENS_STORAGE_KEY = 'aph.tokens';

export default {

  putInternal(existingTokens, token) {
    if (!token.isCustom) {
      const existingToken = _.get(existingTokens, `${token.assetId}_${token.network}`);
      if (existingToken && existingToken.isCustom === true) {
        token.isCustom = true;
      }
    }
    _.set(existingTokens, `${token.assetId}_${token.network}`, token);
  },

  add(token) {
    const existingTokens = this.getAll();

    this.putInternal(existingTokens, token);
    storage.set(TOKENS_STORAGE_KEY, existingTokens);
  },

  putAll(tokens) {
    const existingTokens = this.getAll();

    tokens.forEach((token) => {
      this.putInternal(existingTokens, token);
    });
    storage.set(TOKENS_STORAGE_KEY, existingTokens);
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

  removeAll(tokens) {
    const existingTokens = this.getAll();

    tokens.forEach((token) => {
      this.removeInternal(existingTokens, token);
    });

    if (Object.keys(existingTokens).length === 0) {
      storage.delete(TOKENS_STORAGE_KEY);
    } else {
      storage.set(TOKENS_STORAGE_KEY, existingTokens);
    }
  },

  removeInternal(existingTokens, token) {
    _.unset(existingTokens, `${token.assetId}_${token.network}`);
  },

  migrateToAssets(network) {
    const oldTokens = this.getAll();
    if (Object.keys(oldTokens).length > 0) {
      // console.log(`Had ${Object.keys(oldTokens).length} existing token keys`);
      const toRemove = [];
      _.values(oldTokens).forEach((token) => {
        if (network.net === token.network) {
          const asset = {
            symbol: token.symbol,
            assetId: token.assetId,
            name: token.name,
            decimals: token.decimals,
          };
          toRemove.push(_.merge(_.cloneDeep(token, { network: token.network })));
          assets.addNetworkAsset(asset, token.isCustom);
          // console.log(`Added previous asset: ${token.symbol} ${token.network}`);
        }
      });
      this.removeAll(toRemove);
      // console.log(`Removed ${toRemove.length} legacy tokens for network: ${network.net}`);
    }
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
    return !!this.getOne(assetId, network);
  },

};
