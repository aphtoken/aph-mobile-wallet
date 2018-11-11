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
  commitChangeInProgress: null,
  commitState: null,
  contacts: [],
  currency: null,
  currencySymbol: null,
  currentEditContact: null,
  currentLoginToWallet: null,
  currentMarket: null,
  currentNetwork: null,
  currentWallet: null,
  depositWithdrawModalModel: null,
  gasClaim: null,
  gasFracture: null,
  holdings: [],
  lastReceivedBlock: null,
  lastSuccessfulRequest: null,
  latestVersion: null,
  markets: [],
  needsWsReconnectHandling: false,
  nep5Balances: {},
  orderBook: null,
  orderHistory: null,
  orderPrice: '',
  orderQuantity: '',
  orderToConfirm: false,
  ordersToShow: '',
  portfolio: null,
  recentTransactions: [],
  requests: {},
  searchTransactionFromDate: null,
  searchTransactionToDate: null,
  searchTransactions: [],
  sendInProgress: false,
  showClaimGasStatus: false,
  showOrderConfirmationModal: false,
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
  systemWithdraw: null,
  tickerDataByMarket: {},
  tradeHistory: null,
  transactionDetails: {},
  version: pjson.version,
  walletToBackup: null,
  wallets: [],
  withdrawInProgressModalModel: false,
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
