import Vue from 'vue';
import Vuex from 'vuex';

import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';

Vue.use(Vuex);

const pjson = require('../../package.json');

const state = {
  activeTransaction: null,
  blockDetails: {},
  commitState: null,
  contacts: [],
  currency: null,
  currencySymbol: null,
  currentEditContact: null,
  currentLoginToWallet: null,
  currentMarket: null,
  currentNetwork: null,
  currentWallet: null,
  gasClaim: null,
  holdings: [],
  lastReceivedBlock: null,
  lastSuccessfulRequest: null,
  latestVersion: null,
  nep5Balances: {},
  orderBook: null,
  orderHistory: null,
  orderPrice: '',
  orderQuantity: '',
  portfolio: null,
  recentTransactions: [],
  requests: {},
  searchTransactionFromDate: null,
  searchTransactionToDate: null,
  searchTransactions: [],
  sendInProgress: false,
  showClaimGasStatus: false,
  showPortfolioHeader: true,
  showPriceTile: true,
  showSendRequestLedgerSignature: false,
  socket: {
    lastMessage: null,
    isConnected: false,
    client: null,
    reconnectError: false,
  },
  statsToken: null,
  tradeHistory: null,
  transactionDetails: {},
  version: pjson.version,
  walletToBackup: null,
  wallets: [],
};

const store = new Vuex.Store({
  actions,
  getters,
  mutations,
  state,
});

export {
  actions,
  getters,
  mutations,
  state,
  store,
};
