/* eslint-disable no-use-before-define */
import moment from 'moment';

import { alerts, assets, dex, neo, network, wallets, ledger } from '../services';
import { timeouts } from '../constants';
import router from '../router';

export {
  addToken,
  claimGas,
  createWallet,
  deleteWallet,
  fetchHoldings,
  fetchLatestVersion,
  fetchMarkets,
  fetchRecentTransactions,
  fetchBlockHeaderByHash,
  findTransactions,
  importWallet,
  openEncryptedKey,
  openLedger,
  openPrivateKey,
  openSavedWallet,
  verifyLedgerConnection,
};

function addToken({ commit, dispatch }, { done, hashOrSymbol }) {
  const networkAssets = assets.getNetworkAssets();
  const userAssets = assets.getUserAssets();
  const currentNetwork = network.getSelectedNetwork();
  let token;

  commit('startRequest', { identifier: 'addToken' });

  hashOrSymbol = hashOrSymbol.replace('0x', '');

  token = _.find(_.values(networkAssets), (o) => {
    return o.symbol === hashOrSymbol;
  });

  if (!token) {
    token = _.get(networkAssets, hashOrSymbol);
  }

  if (!token) {
    /* eslint-disable max-len */
    return commit('failRequest', { identifier: 'addToken', message: `Unable to find a token with the symbol or script hash of '${hashOrSymbol}' on ${currentNetwork.net}` });
    /* eslint-enable max-len */
  }

  if (_.has(userAssets, token.assetId)) {
    /* eslint-disable max-len */
    return commit('failRequest', { identifier: 'addToken', message: `'${hashOrSymbol}' is already in your token list ${currentNetwork.net}` });
    /* eslint-enable max-len */
  }

  assets.addUserAsset(token.assetId);

  dispatch('fetchHoldings', { done });

  return commit('endRequest', { identifier: 'addToken' });
}

function claimGas({ commit }) {
  commit('startRequest', { identifier: 'claimGas' });

  setTimeout(() => {
    neo.claimGas()
      .then(() => {
        commit('endRequest', { identifier: 'claimGas' });
      })
      .catch((message) => {
        alerts.exception(message);
        commit('failRequest', { identifier: 'claimGas', message });
      });
  }, timeouts.NEO_API_CALL);
}

function createWallet({ commit }, { name, passphrase, passphraseConfirm }) {
  commit('startRequest', { identifier: 'createWallet' });

  setTimeout(() => {
    neo
      .createWallet(name, passphrase, passphraseConfirm)
      .then(() => {
        commit('endRequest', { identifier: 'createWallet' });
        commit('setWalletToBackup', wallets.getCurrentWallet());
        router.replace('/authenticated');
      })
      .catch((message) => {
        commit('failRequest', { identifier: 'createWallet', message });
      });
  }, timeouts.NEO_API_CALL);
}

async function fetchBlockHeaderByHash({ state, commit }, { blockHash, done, failed }) {
  commit('startRequest', { identifier: 'fetchBlockHeaderByHash' });

  // Check if the block is in memory
  let blockHeader = _.get(state.blockDetails, blockHash);

  if (!blockHeader) {
    try {
      blockHeader = await new Promise((resolve, reject) => {
        const rpcClient = network.getRpcClient();
        rpcClient.query({
          method: 'getblockheader',
          params: [blockHash, true],
        })
          .then((res) => {
            resolve(res.result);
          })
          .catch(e => reject(e));
      });
    } catch (e) {
      console.log(e);
      if (failed) {
        failed(e);
        const message = e.toString();
        commit('failRequest', { identifier: 'fetchBlockHeaderByHash', message });
      }
      return;
    }
    // Make call to get the block
    commit('putBlockDetails', blockHeader);
  }

  if (done) {
    done(blockHeader);
  }
  commit('endRequest', { identifier: 'fetchBlockHeaderByHash' });
}

async function fetchHoldings({ commit }, { done, isRequestSilent }) {
  const currentWallet = wallets.getCurrentWallet();
  let holdings;

  commit(isRequestSilent ? 'startSilentRequest' : 'startRequest',
    { identifier: 'fetchHoldings' });

  try {
    holdings = await neo.fetchHoldings(currentWallet.address);

    commit('setHoldings', holdings.holdings);
    commit('endRequest', { identifier: 'fetchHoldings' });
    commit('setPortfolio', {
      balance: holdings.totalBalance,
      changePercent: holdings.change24hrPercent,
      changeValue: holdings.change24hrValue.toFixed(2),
    });
    if (done) {
      done();
    }
    commit('endRequest', { identifier: 'fetchHoldings' });
  } catch (message) {
    alerts.networkException(message);
    commit('failRequest', { identifier: 'fetchHoldings', message });
  }

  return holdings;
}

async function fetchMarkets({ commit }, { done }) {
  let markets;
  commit('startRequest', { identifier: 'fetchMarkets' });

  try {
    markets = await dex.fetchMarkets();
    commit('setMarkets', markets);
    done();
    commit('endRequest', { identifier: 'fetchMarkets' });
  } catch (message) {
    alerts.networkException(message);
    commit('failRequest', { identifier: 'fetchMarkets', message });
  }
}

async function fetchRecentTransactions({ commit }) {
  const currentWallet = wallets.getCurrentWallet();
  const lastBlockIndex = 0;
  let recentTransactions;

  commit('startRequest', { identifier: 'fetchRecentTransactions' });

  try {
    recentTransactions = await neo.fetchRecentTransactions(currentWallet.address, false, moment().subtract(30, 'days'), null, lastBlockIndex + 1); // eslint-disable-line
    commit('setRecentTransactions', recentTransactions);
    commit('endRequest', { identifier: 'fetchRecentTransactions' });
  } catch (message) {
    alerts.exception(message);
    commit('failRequest', { identifier: 'fetchRecentTransactions', message });
  }
}

function findTransactions({ state, commit }) {
  const currentWallet = wallets.getCurrentWallet();

  commit('startRequest', { identifier: 'findTransactions' });

  const fromDate = state.searchTransactionFromDate;
  const toDate = state.searchTransactionToDate ? moment(state.searchTransactionToDate).add(1, 'days') : null;
  neo
    .fetchRecentTransactions(currentWallet.address, true,
      fromDate, toDate)
    .then((data) => {
      commit('setSearchTransactions', data);
      commit('endRequest', { identifier: 'findTransactions' });
    })
    .catch((message) => {
      console.log(message);
      commit('failRequest', { identifier: 'findTransactions', message });
    });
}

function openEncryptedKey({ commit }, { encryptedKey, passphrase, done }) {
  commit('startRequest', { identifier: 'openEncryptedKey' });

  setTimeout(() => {
    wallets.openEncryptedKey(encryptedKey, passphrase)
      .then(() => {
        done();
        commit('endRequest', { identifier: 'openEncryptedKey' });
      })
      .catch((e) => {
        commit('failRequest', { identifier: 'openEncryptedKey', message: e });
      });
  }, timeouts.NEO_API_CALL);
}

function verifyLedgerConnection({ commit }, { done, failed }) {
  commit('startRequest', { identifier: 'verifyLedgerConnection' });

  ledger.open()
    .then(() => {
      done();
      commit('endRequest', { identifier: 'verifyLedgerConnection' });
    })
    .catch((e) => {
      failed(e);
      commit('failRequest', { identifier: 'verifyLedgerConnection', message: e });
    });
}

function openLedger({ commit }, { done, failed }) {
  commit('startRequest', { identifier: 'openLedger' });

  ledger.close()
    .then(() => {
      ledger.open()
        .then(() => {
          ledger.getPublicKey()
            .then((publicKey) => {
              wallets.openLedger(publicKey)
                .then(() => {
                  done();

                  setTimeout(() => {
                    ledger.close();
                  }, 5 * 1000);

                  commit('endRequest', { identifier: 'openLedger' });
                })
                .catch((e) => {
                  failed(e);
                  commit('failRequest', { identifier: 'openLedger', message: e });
                });
            })
            .catch((e) => {
              failed(e);
              commit('failRequest', { identifier: 'openLedger', message: e });
            });
        })
        .catch((e) => {
          failed(e);
          commit('failRequest', { identifier: 'openLedger', message: e });
        });
    })
    .catch((e) => {
      failed(e);
      commit('failRequest', { identifier: 'openLedger', message: e });
    });
}

function openPrivateKey({ commit }, { wif, done }) {
  commit('startRequest', { identifier: 'openPrivateKey' });

  setTimeout(() => {
    wallets.openWIF(wif)
      .then(() => {
        done();
        commit('endRequest', { identifier: 'openPrivateKey' });
      })
      .catch((e) => {
        commit('failRequest', { identifier: 'openPrivateKey', message: e });
      });
  }, timeouts.NEO_API_CALL);
}

function openSavedWallet({ commit }, { walletToOpen, passphrase, done }) {
  commit('startRequest', { identifier: 'openSavedWallet' });

  setTimeout(() => {
    wallets.openSavedWallet(walletToOpen, passphrase)
      .then(() => {
        done();
        commit('clearActiveTransaction');
        commit('endRequest', { identifier: 'openSavedWallet' });
      })
      .catch((e) => {
        commit('failRequest', { identifier: 'openSavedWallet', message: e });
      });
  }, timeouts.NEO_API_CALL);
}

function importWallet({ commit }, { name, wif, passphrase, done }) {
  commit('startRequest', { identifier: 'importWallet' });

  setTimeout(() => {
    wallets.importWIF(name, wif, passphrase)
      .then(() => {
        wallets.sync();
        done();
        commit('endRequest', { identifier: 'importWallet' });
      })
      .catch((e) => {
        commit('failRequest', { identifier: 'importWallet', message: e });
      });
  }, timeouts.NEO_API_CALL);
}

function deleteWallet({ commit }, { name, done }) {
  commit('startRequest', { identifier: 'deleteWallet' });

  setTimeout(() => {
    wallets.remove(name)
      .then(() => {
        wallets.sync();
        done();
        commit('endRequest', { identifier: 'deleteWallet' });
      })
      .catch((e) => {
        alerts.exception(e);
        commit('failRequest', { identifier: 'deleteWallet', message: e });
      });
  }, timeouts.NEO_API_CALL);
}

function fetchLatestVersion({ commit }) {
  commit('startRequest', { identifier: 'fetchLatestVersion' });

  return axios.get(`${network.getSelectedNetwork().aph}/LatestWalletInfo`)
    .then(({ data }) => {
      commit('setLatestVersion', data);
      commit('endRequest', { identifier: 'fetchLatestVersion' });
    })
    .catch((e) => {
      console.log(e);
      commit('failRequest', { identifier: 'fetchLatestVersion', message: e });
    });
}
