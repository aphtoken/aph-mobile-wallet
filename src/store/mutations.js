/* eslint-disable no-use-before-define */
import Vue from 'vue';
import moment from 'moment';

import { requests } from '../constants';
import { alerts, dex, neo } from '../services';

export {
  clearActiveTransaction,
  clearRecentTransactions,
  clearSearchTransactions,
  endRequest,
  failRequest,
  handleLogout,
  handleNetworkChange,
  orderBookSnapshotReceived,
  putBlockDetails,
  putTransactionDetail,
  removeAssetHoldingsNeedRefresh,
  resetRequests,
  setActiveTransaction,
  setAssetHoldingsNeedRefresh,
  setContacts,
  setCurrency,
  setCurrencySymbol,
  setCurrentMarket,
  setCurrentNetwork,
  setCurrentWallet,
  setGasClaim,
  setHoldings,
  setLastReceivedBlock,
  setLastSuccessfulRequest,
  setLatestVersion,
  setMarkets,
  setOrderPrice,
  setOrderQuantity,
  setPortfolio,
  setRecentTransactions,
  setSearchTransactionFromDate,
  setSearchTransactionToDate,
  setSearchTransactions,
  setSendInProgress,
  setShowClaimGasStatus,
  setShowSendRequestLedgerSignature,
  setStatsToken,
  setTradeHistory,
  setWalletToBackup,
  setWallets,
  startRequest,
};

function clearActiveTransaction(state) {
  state.showPriceTile = true;
}

function clearLocalNetworkState(state) {
  state.holdings = [];
  state.statsToken = null;
  state.portfolio = {};
  state.recentTransactions = [];
}

function clearRecentTransactions(state) {
  state.recentTransactions = [];
}

function clearSearchTransactions(state) {
  state.searchTransactions = [];
}

function endRequest(state, payload) {
  updateRequest(state, payload, requests.SUCCESS);
}

function failRequest(state, payload) {
  updateRequest(state, payload, requests.FAILED);

  if (payload.message) {
    alerts.error(payload.message);
  }
}

function handleLogout(state) {
  state.holdings = [];
  state.recentTransactions = [];
  state.searchTransactions = [];
  state.nep5Balances = {};
  state.sendInProgress = false;
}

function handleNetworkChange(state) {
  state.holdings = [];
  state.recentTransactions = [];
  state.searchTransactions = [];
  state.nep5Balances = {};
  state.sendInProgress = false;
  neo.fetchNEP5Tokens(() => {
    // Fetch holdings for user assets first for best UX
    this.dispatch('fetchHoldings', {
      // Then fetch all assets
      done: () => { this.dispatch('fetchHoldings', { done: null, forceRefreshAll: true }); },
      onlyFetchUserAssets: true });
    this.dispatch('fetchRecentTransactions');
  });
}

function orderBookSnapshotReceived(state, res) {
  const orderBook = dex.formOrderBook(res.asks, res.bids);
  orderBook.pair = res.pair;

  state.orderBook = orderBook;
}

function putTransactionDetail(state, transactionDetail) {
  const details = state.transactionDetails;
  _.set(details, transactionDetail.txid, transactionDetail);
}

function putBlockDetails(state, blockDetails) {
  _.set(state.blockDetails, blockDetails.hash, blockDetails);
}

function removeAssetHoldingsNeedRefresh(state, assetIds) {
  if (state.assetsThatNeedRefresh.length > 0) {
    assetIds.forEach((assetId) => {
      _.remove(state.assetsThatNeedRefresh, refreshId => assetId === refreshId);
    });
  }
}

function resetRequests(state) {
  state.requests = {};
}

function setActiveTransaction(state, transaction) {
  state.activeTransaction = transaction;
  state.showPriceTile = false;
}

function setWalletToBackup(state, wallet) {
  state.walletToBackup = wallet;
}

function setContacts(state, contacts) {
  state.contacts = contacts;
}

function setCurrency(state, currency) {
  state.currency = currency;
}

function setCurrencySymbol(state, currencySymbol) {
  state.currencySymbol = currencySymbol;
}

function setCurrentWallet(state, currentWallet) {
  state.holdings = [];
  state.statsToken = null;
  state.portfolio = {};
  state.recentTransactions = [];

  state.currentWallet = currentWallet;
}

function setCurrentMarket(state, market) {
  // Add lines below when API is live
  // if (state.currentMarket) {
  //   if (!market || state.currentMarket.marketName !== market.marketName) {
  //     this.dispatch('unsubscribeFromMarket', {
  //       market: state.currentMarket,
  //     });
  //   }
  // }
  state.currentMarket = market;
  state.ordersToShow = market.marketName;
  // Add lines below when API is live
  // if (state.currentMarket) {
  //   this.dispatch('subscribeToMarket', {
  //     market: state.currentMarket,
  //   });
  // }
}

function setCurrentNetwork(state, network) {
  if (state.currentNetwork && state.currentNetwork.net !== network.net) {
    clearLocalNetworkState(state);
  }

  state.currentNetwork = network;
}

async function setHoldings(state, holdings) {
  if (!_.isEmpty(holdings)) {
    state.holdings = holdings;
  }

  if (!state.statsToken && !_.isEmpty(holdings)) {
    state.statsToken = holdings[0];
  } else if (state.statsToken) {
    state.statsToken = _.find(state.holdings, (o) => {
      return o.symbol === state.statsToken.symbol;
    });
  }
}

function setAssetHoldingsNeedRefresh(state, assetIds) {
  assetIds.forEach((assetId) => {
    if (assetId) {
      state.assetsThatNeedRefresh.push(assetId);
    }
  });
}

function setLastReceivedBlock(state) {
  state.lastReceivedBlock = moment().unix();
}

function setLastSuccessfulRequest(state) {
  state.lastSuccessfulRequest = moment().unix();
}

function setMarkets(state, markets) {
  state.markets = markets;
}

function setOrderPrice(state, price) {
  state.orderPrice = price;
}

function setOrderQuantity(state, quantity) {
  state.orderQuantity = quantity;
}

function setPortfolio(state, portfolio) {
  if (portfolio) {
    state.portfolio = portfolio;
  }
}

function setRecentTransactions(state, transactions) {
  const existingIsEmpty = !state.recentTransactions || state.recentTransactions.length === 0;

  _.sortBy(transactions, 'block_index').forEach((t) => {
    const existingTransaction = _.find(state.recentTransactions, (o) => {
      return o.hash === t.hash && o.symbol === t.symbol;
    });
    if (existingTransaction) {
      return;
    }
    state.recentTransactions.unshift(t);
    if (existingIsEmpty === false) {
      alerts.success(`New Transaction Found. TX: ${t.hash}`);
    }
  });
}

function setLatestVersion(state, version) {
  state.latestVersion = version;
}

function setSearchTransactionFromDate(state, fromDate) {
  state.searchTransactionFromDate = fromDate;
}

function setSearchTransactionToDate(state, toDate) {
  state.searchTransactionToDate = toDate;
}

function setSearchTransactions(state, transactions) {
  state.searchTransactions = transactions;
}

function setShowSendRequestLedgerSignature(state, value) {
  state.showSendRequestLedgerSignature = value;
}

function setSendInProgress(state, value) {
  state.sendInProgress = value;
}

function setShowClaimGasStatus(state, value) {
  state.showClaimGasStatus = value;
}

function setStatsToken(state, token) {
  state.statsToken = token;
  state.showPriceTile = true;
  state.activeTransaction = null;
}

function setWallets(state, wallets) {
  state.wallets = wallets;
}

function setGasClaim(state, value) {
  state.gasClaim = value;
}

function setTradeHistory(state, tradeHistory) {
  state.tradeHistory = tradeHistory;
}

function startRequest(state, payload) {
  updateRequest(state, payload, requests.PENDING);
}


// Local functions

function updateRequest(state, { identifier, message }, status) {
  Vue.set(state.requests, identifier, { status, message });
}
