/* eslint-disable no-use-before-define */
import moment from 'moment';

import { alerts, neo, network, tokens, wallets, ledger } from '../services';
import { timeouts } from '../constants';
import router from '../router';

export {
  addToken,
  claimGas,
  createWallet,
  deleteWallet,
  fetchHoldings,
  fetchLatestVersion,
  fetchRecentTransactions,
  findTransactions,
  importWallet,
  openEncryptedKey,
  openLedger,
  openPrivateKey,
  openSavedWallet,
  verifyLedgerConnection,
};

function addToken({ commit, dispatch }, { done, hashOrSymbol }) {
  const allTokens = tokens.getAllAsArray();
  const currentNetwork = network.getSelectedNetwork();
  let token;

  commit('startRequest', { identifier: 'addToken' });

  hashOrSymbol = hashOrSymbol.replace('0x', '');

  token = _.find(allTokens, (o) => {
    return o.symbol === hashOrSymbol && o.network === currentNetwork.net;
  });

  if (!token) {
    token = _.find(allTokens, (o) => {
      return o.assetId === hashOrSymbol && o.network === currentNetwork.net;
    });
  }

  if (!token) {
    /* eslint-disable max-len */
    return commit('failRequest', { identifier: 'addToken', message: `Unable to find a token with the symbol or script hash of '${hashOrSymbol}' on ${currentNetwork.net}` });
    /* eslint-enable max-len */
  }

  if (token.isCustom) {
    /* eslint-disable max-len */
    return commit('failRequest', { identifier: 'addToken', message: `'${hashOrSymbol}' is already in your token list ${currentNetwork.net}` });
    /* eslint-enable max-len */
  }

  tokens.add({
    symbol: token.symbol,
    assetId: token.assetId.replace('0x', ''),
    isCustom: true,
    network: network.getSelectedNetwork().net,
  });

  dispatch('fetchHoldings');

  done();

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

async function fetchHoldings({ commit }) {
  const currentWallet = wallets.getCurrentWallet();
  let holdings;

  commit('startRequest', { identifier: 'fetchHoldings' });

  try {
    holdings = await neo.fetchHoldings(currentWallet.address);

    commit('setHoldings', holdings.holdings);
    commit('endRequest', { identifier: 'fetchHoldings' });
    commit('setPortfolio', {
      balance: holdings.totalBalance,
      changePercent: holdings.change24hrPercent,
      changeValue: holdings.change24hrValue.toFixed(2),
    });
  } catch (message) {
    alerts.networkException(message);
    commit('failRequest', { identifier: 'fetchHoldings', message });
  }

  return holdings;
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
