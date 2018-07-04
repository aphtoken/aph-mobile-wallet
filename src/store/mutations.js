/* eslint-disable no-use-before-define */
import Vue from 'vue';
import moment from 'moment';

import { requests } from '../constants';
import { alerts, neo } from '../services';

export {
  clearActiveTransaction,
  clearRecentTransactions,
  clearSearchTransactions,
  endRequest,
  failRequest,
  handleLogout,
  handleNetworkChange,
  putAllNep5Balances,
  putTransactionDetail,
  resetRequests,
  setActiveTransaction,
  setContacts,
  setCurrency,
  setCurrencySymbol,
  setCurrentNetwork,
  setCurrentWallet,
  setGasClaim,
  setHoldings,
  setLastReceivedBlock,
  setLastSuccessfulRequest,
  setLatestVersion,
  setPortfolio,
  setRecentTransactions,
  setSearchTransactionFromDate,
  setSearchTransactionToDate,
  setSearchTransactions,
  setSendInProgress,
  setShowClaimGasStatus,
  setShowSendRequestLedgerSignature,
  setStatsToken,
  setWalletToBackup,
  setWallets,
  startRequest,
};

function clearActiveTransaction(state) {
  state.showPriceTile = true;
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
  neo.fetchNEP5Tokens(() => {});
}

function putAllNep5Balances(state, nep5balances) {
  const balances = state.nep5Balances;
  nep5balances.forEach((nep5balance) => {
    _.set(balances, nep5balance.assetId, nep5balance);
  });
}

function putTransactionDetail(state, transactionDetail) {
  const details = state.transactionDetails;
  _.set(details, transactionDetail.txid, transactionDetail);
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

function setLastReceivedBlock(state) {
  state.lastReceivedBlock = moment().unix();
}

function setLastSuccessfulRequest(state) {
  state.lastSuccessfulRequest = moment().unix();
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

function clearLocalNetworkState(state) {
  state.holdings = [];
  state.statsToken = null;
  state.portfolio = {};
  state.recentTransactions = [];
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

function startRequest(state, payload) {
  updateRequest(state, payload, requests.PENDING);
}


// Local functions

function updateRequest(state, { identifier, message }, status) {
  Vue.set(state.requests, identifier, { status, message });
}
