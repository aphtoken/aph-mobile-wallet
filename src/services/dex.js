import { MARKETS, HISTORY } from '../../sample_api/dex_sample.js';

export default {
  fetchMarkets() {
    return new Promise((resolve, reject) => {
      try {
        // Will add line below once API is live
        // const currentNetwork = network.getSelectedNetwork();
        resolve(MARKETS);
      } catch (error) {
        reject(error);
      }
    });
  },

  fetchTradeHistory() {
    return new Promise((resolve, reject) => {
      try {
        // Will add line below once API is live
        // const currentNetwork = network.getSelectedNetwork();
        resolve(HISTORY);
      } catch (error) {
        reject(error);
      }
    });
  },
};
