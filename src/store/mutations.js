/* eslint-disable no-use-before-define */
import Vue from 'vue';
import moment from 'moment';

import { requests } from '../constants';
import { alerts, dex, neo } from '../services';

export {
  addToOrderHistory,
  clearActiveTransaction,
  clearRecentTransactions,
  clearSearchTransactions,
  endRequest,
  failRequest,
  handleLogout,
  handleNetworkChange,
  orderBookSnapshotReceived,
  orderBookUpdateReceived,
  putBlockDetails,
  putTransactionDetail,
  resetRequests,
  setActiveTransaction,
  setCommitState,
  setContacts,
  setCurrency,
  setCurrencySymbol,
  setCurrentMarket,
  setCurrentNetwork,
  setCurrentWallet,
  setCommitChangeInProgress,
  setFractureGasModalModel,
  setGasClaim,
  setGasFracture,
  setHoldings,
  setLastReceivedBlock,
  setLastSuccessfulRequest,
  setLatestVersion,
  setMarkets,
  setOrderHistory,
  setOrderPrice,
  setOrderQuantity,
  setOrderToConfirm,
  setOrdersToShow,
  setPortfolio,
  setRecentTransactions,
  setSearchTransactionFromDate,
  setSearchTransactionToDate,
  setSearchTransactions,
  setSendInProgress,
  setShowClaimGasStatus,
  setShowOrderConfirmationModal,
  setShowPortfolioHeader,
  setShowSendRequestLedgerSignature,
  setSocketOrderCreated,
  setSocketOrderCreationFailed,
  setSocketOrderMatched,
  setSocketOrderMatchFailed,
  setStatsToken,
  setSystemWithdraw,
  setSystemWithdrawMergeState,
  setTickerDataByMarket,
  setTradeHistory,
  setWalletToBackup,
  setWallets,
  setWithdrawInProgressModalModel,
  startRequest,
  startSilentRequest,
  SOCKET_ONOPEN,
  SOCKET_ONCLOSE,
  SOCKET_ONMESSAGE,
  SOCKET_RECONNECT,
  SOCKET_RECONNECT_ERROR,
};

// local constants
const TRADE_MSG_LENGTH = 3;

function addToOrderHistory(state, newOrders) {
  if (!state.orderHistory) {
    state.orderHistory = [];
  }

  for (let i = 0; i < newOrders.length; i += 1) {
    const existingOrderIndex = _.findIndex(state.orderHistory, (order) => {
      return order.orderId === newOrders[i].orderId;
    });

    if (existingOrderIndex > -1) {
      // this order is already in our cache, must be an update
      // remove the existing order and add the updated version to the top
      state.orderHistory.splice(existingOrderIndex, 1);
    }

    state.orderHistory.unshift(newOrders[i]);
  }
  // TODO: Fix this last code. We don't have 'db'.
  // const orderHistoryStorageKey
  //   = `orderhistory.${state.currentWallet.address}.${state.currentNetwork.net}.${state.currentNetwork.dex_hash}`;
  // db.upsert(orderHistoryStorageKey, JSON.stringify(state.orderHistory));
}

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
  state.orderHistory = null;
  state.sendInProgress = false;
}

function handleNetworkChange(state) {
  state.holdings = [];
  state.recentTransactions = [];
  state.searchTransactions = [];
  state.nep5Balances = {};
  state.orderHistory = null;
  state.sendInProgress = false;
  neo.fetchNEP5Tokens(() => {
    // Fetch holdings for user assets first for best UX
    this.dispatch('fetchHoldings');
    this.dispatch('fetchRecentTransactions');
  });
}

function orderBookSnapshotReceived(state, res) {
  const orderBook = dex.formOrderBook(res.asks, res.bids);
  orderBook.pair = res.pair;

  state.orderBook = orderBook;
}

function orderBookUpdateReceived(state, res) {
  if (!state.orderBook || state.orderBook.pair !== res.pair) {
    return;
  }

  const orderBook = dex.updateOrderBook(state.orderBook, res.side, res.changes);
  const side = res.side === 'ask' ? orderBook.asks : orderBook.bids;
  Vue.set(state.orderBook, res.side, side);
}

function putTransactionDetail(state, transactionDetail) {
  const details = state.transactionDetails;
  _.set(details, transactionDetail.txid.replace('0x', ''), transactionDetail);
}

function putBlockDetails(state, blockDetails) {
  _.set(state.blockDetails, blockDetails.hash, blockDetails);
}

function resetRequests(state) {
  state.requests = {};
}

function setActiveTransaction(state, transaction) {
  state.activeTransaction = transaction;
  state.showPriceTile = false;
}

function setCommitChangeInProgress(state, value) {
  state.commitChangeInProgress = value;
}

function setCommitState(state, commitState) {
  if (!state.currentWallet || !state.currentNetwork) {
    return;
  }

  state.commitState = commitState;
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
  if (state.currentMarket) {
    if (!market || state.currentMarket.marketName !== market.marketName) {
      this.dispatch('unsubscribeFromMarket', {
        market: state.currentMarket,
      });
    }
  }

  state.currentMarket = market;
  state.ordersToShow = market.marketName;

  if (state.currentMarket) {
    this.dispatch('subscribeToMarket', {
      market: state.currentMarket,
    });
  }
}

function setCurrentNetwork(state, network) {
  if (state.currentNetwork && state.currentNetwork.net !== network.net) {
    clearLocalNetworkState(state);
  }

  state.currentNetwork = network;
}

function setFractureGasModalModel(state, model) {
  state.fractureGasModalModel = model;
}

function setGasClaim(state, value) {
  state.gasClaim = value;
}

function setGasFracture(state, facture) {
  state.gasFracture = facture;
}

function setHoldings(state, holdings) {
  if (!_.isEmpty(holdings)) {
    state.holdings = holdings;
  }

  if (!state.statsToken && !_.isEmpty(holdings)) {
    state.statsToken = holdings[0];
  } else if (state.statsToken) {
    state.statsToken = _.find(state.holdings, { symbol: state.statsToken.symbol });
  }
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

function setOrderHistory(state, orders) {
  state.orderHistory = orders;

  // NOTE: This code requires ipc-promise which isn't applicable for this app. Not sure what the alternative is.
  // const orderHistoryStorageKey
  //   = `orderhistory.${state.currentWallet.address}.${state.currentNetwork.net}.${assets.DEX_SCRIPT_HASH}`;
  // db.upsert(orderHistoryStorageKey, JSON.stringify(state.orderHistory));
}

function setOrderPrice(state, price) {
  state.orderPrice = price;
}

function setOrderQuantity(state, quantity) {
  state.orderQuantity = quantity;
}

function setOrderToConfirm(state, order) {
  state.orderToConfirm = order;
  state.showOrderConfirmationModal = !!order;
}

function setShowOrderConfirmationModal(state, value) {
  state.showOrderConfirmationModal = value;
}

function setPortfolio(state, portfolio) {
  if (portfolio) {
    state.portfolio = portfolio;
  }
}

function setRecentTransactions(state, transactions) {
  const existingIsEmpty = !state.recentTransactions || state.recentTransactions.length === 0;

  _.sortBy(transactions, 'block_index').forEach((transaction) => {
    const existingTransaction = _.find(state.recentTransactions, ({ hash, symbol }) => {
      return transaction.hash === hash && transaction.symbol === symbol;
    });
    if (existingTransaction) {
      return;
    }
    state.recentTransactions.unshift(transaction);
    if (existingIsEmpty === false) {
      alerts.success(`New Transaction Found. TX: ${transaction.hash}`);
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

function setShowPortfolioHeader(state, value) {
  state.showPortfolioHeader = value;
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


function setSocketOrderCreated(state, value) {
  state.socket.orderCreated = value;
}

function setSocketOrderMatched(state, value) {
  state.socket.orderMatched = value;
}

function setSocketOrderCreationFailed(state, value) {
  state.socket.orderCreationFailed = value;
}

function setSocketOrderMatchFailed(state, value) {
  state.socket.orderMatchFailed = value;
}

function setStatsToken(state, token) {
  state.statsToken = token;
  state.showPriceTile = true;
  state.activeTransaction = null;
}

function setTickerDataByMarket(state, tickerDataByMarket) {
  state.tickerDataByMarket = tickerDataByMarket;
}

function setWallets(state, wallets) {
  state.wallets = wallets;
}

function setWithdrawInProgressModalModel(state, model) {
  state.withdrawInProgressModalModel = model;
}

function setOrdersToShow(state, value) {
  state.ordersToShow = value;
}

function setSystemWithdraw(state, value) {
  state.systemWithdraw = value;
}

function setSystemWithdrawMergeState(state, value) {
  if (state.systemWithdraw && typeof state.systemWithdraw === 'object') {
    state.systemWithdraw = _.merge(_.cloneDeep(state.systemWithdraw), value);
  }
}

function startRequest(state, payload) {
  updateRequest(state, payload, requests.PENDING);
}

function startSilentRequest(state, payload) {
  updateRequest(state, Object.assign(payload, { isSilent: true }), requests.PENDING);
}

function setTradeHistory(state, tradeHistory) {
  state.tradeHistory = tradeHistory;
}

function SOCKET_ONCLOSE(state) {
  state.socket.client = null;
  state.socket.isConnected = false;
  if (!state.socket.connectionClosed) {
    state.socket.connectionClosed = moment().utc();
  }
}

function SOCKET_ONOPEN(state, event) {
  state.socket.client = event.target;
  state.socket.isConnected = true;
  state.socket.connectionClosed = null;
  if (state.socket.opened) {
    state.socket.opened();
  }
  if (state.needsWsReconnectHandling) {
    state.needsWsReconnectHandling = false;
    if (state.currentMarket) {
      this.dispatch('subscribeToMarket', {
        market: state.currentMarket,
        isRequestSilent: true,
      });

      // Ensure trade history is up-to-date on reconnect. (may have dropped some trades during disconnect)
      this.dispatch('fetchMarkets');
    }
  }
}

function SOCKET_ONMESSAGE(state, message) {
  state.socket.lastMessage = message;

  if (message.subscribe && message.subscribe.indexOf('orderBook') > -1) {
    state.socket.subscribedMarket = message.subscribe.substring(message.subscribe.indexOf(':') + 1);
  } else if (message.unsubscribe && message.unsubscribe.indexOf('orderBook') > -1) {
    state.socket.subscribedMarket = null;
  } else if (message.type === 'bookSnapshot') {
    orderBookSnapshotReceived(state, message);
  } else if (message.type === 'bookUpdate') {
    orderBookUpdateReceived(state, message);
  } else if (message.type === 'orderCreated') {
    if (state.socket.orderCreated) {
      state.socket.orderCreated(message);
    }
  } else if (message.type === 'orderMatched') {
    if (state.socket.orderMatched) {
      state.socket.orderMatched(message);
    }
  } else if (message.type === 'orderCreationFailed') {
    if (state.socket.orderCreationFailed) {
      state.socket.orderCreationFailed(message);
    }
  } else if (message.type === 'orderMatchFailed') {
    if (state.socket.orderMatchFailed) {
      state.socket.orderMatchFailed(message);
    }
  } else if (message.type === 'trades') {
    tradeUpdateReceived(state, message);
  } else if (message.type) {
    // unknown message type
    // console.log(message);
  }
}

function SOCKET_RECONNECT_ERROR(state) {
  state.socket.reconnectError = true;
}

function SOCKET_RECONNECT(state) {
  // Note: at this point SOCKET_ONOPEN will not have been called yet, state.socket.client will still be null
  // So we cannot actually send any messages out the websocket here. We can set a flag so that SOCKET_ONOPEN will know
  // that has opened as a result of a RECONNECT.
  state.needsWsReconnectHandling = true;
}

function tradeUpdateReceived(state, tradeUpdateMsg) {
  if (!state.tradeHistory || !state.tradeHistory.trades) {
    return;
  }

  tradeUpdateMsg.trades.forEach((trade) => {
    if (trade.length !== TRADE_MSG_LENGTH) {
      return;
    }

    state.tradeHistory.trades.unshift({
      // Trade executing in ask side means a Buy executed.
      side: tradeUpdateMsg.side === 'ask' ? 'Buy' : 'Sell',
      price: trade[0],
      quantity: trade[1],
      tradeTime: moment(trade[2]).unix(),
    });
  });
}

// Local functions

function updateRequest(state, { identifier, message }, status) {
  Vue.set(state.requests, identifier, { status, message });
}
