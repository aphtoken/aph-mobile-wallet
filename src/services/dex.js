import assets from './assets';
import network from './network';
import { BigNumber } from 'bignumber.js';
import { MARKETS, HISTORY } from '../../sample_api/dex_sample.js';
import { toBigNumber } from './formatting.js';

export default {
  fetchMarkets() {
    return new Promise((resolve, reject) => {
      try {
        const currentNetwork = network.getSelectedNetwork();
        axios.get(`${currentNetwork.aph}/markets?contractScriptHash=${assets.DEX_SCRIPT_HASH}`)
          .then((res) => {
            resolve(res.data.markets);
          })
          .catch((e) => {
            alerts.exception(`APH API Error: ${e.message}`);
          });
      } catch (e) {
        reject(e);
      }
    });
  },

  fetchTradeHistory(marketName) {
    return new Promise((resolve, reject) => {
      try {
        const currentNetwork = network.getSelectedNetwork();
        axios.get(`${currentNetwork.aph}/trades/${marketName}?contractScriptHash=${assets.DEX_SCRIPT_HASH}`)
          .then((res) => {
            if (!res || !res.data || !res.data.trades) {
              resolve({
                date: moment().unix(),
                trades: [],
                getBars: () => {
                },
              });
              return;
            }

            const history = {
              date: res.data.timestamp,
              marketName,
              trades: res.data.trades,
              getBars: this.getTradeHistoryBars,
            };
            const todayCutoff = moment().startOf('day').unix();
            const todayTrades = _.filter(history.trades, (trade) => {
              return trade.tradeTime >= todayCutoff;
            });
            if (todayTrades.length > 0) {
              history.close24Hour = todayTrades[0].price;
              history.open24Hour = todayTrades[todayTrades.length - 1].price;
              history.low24Hour = _.minBy(todayTrades, (trade) => { return trade.price; }).price;
              history.volume24Hour = _.sumBy(todayTrades, (trade) => { return t.quantity; });
              history.change24HourPercent = Math.round(((history.close24Hour - history.open24Hour)
                / history.open24Hour) * 10000) / 100;
              history.change24Hour = history.close24Hour - history.open24Hour;
            } else {
              if (history.trades.length > 0) {
                history.close24Hour = history.trades[0].price;
                history.open24Hour = history.trades[0].price;
                history.low24Hour = history.trades[0].price;
                history.high24Hour = history.trades[0].price;
              }
              history.volume24Hour = 0;
              history.change24Hour = 0;
              history.change24HourPercent = 0;
            }
            resolve(history);
          })
          .catch((e) => {
            alerts.exception(`APH API Error: ${e.message}`);
          });
      } catch (e) {
        reject(e);
      }
    });
  },

  formOrderBook(asks, bids) {
    const book = {
      asks: [],
      bids: [],
    };

    asks.forEach((ask) => {
      ask.price = toBigNumber(ask[0]);
      ask.quantity = toBigNumber(ask[1]);
      book.asks.push(ask);
    });
    bids.forEach((bid) => {
      bid.price = toBigNumber(bid[0]);
      bid.quantity = toBigNumber(bid[1]);
      book.bids.push(bid);
    });

    this.setOrderBookMeta(book);
    return book;
  },

  setOrderBookMeta(book) {
    let totalAsk = new BigNumber(0);

    book.asks = _.sortBy(book.asks, [level => level.price.toNumber()]);
    book.bids = _.sortBy(book.bids, [level => level.price.toNumber()]).reverse();

    book.asks.forEach((ask) => {
      totalAsk = totalAsk.plus(ask.quantity);
    });
    let totalBid = new BigNumber(0);
    book.bids.forEach((bid) => {
      totalBid = totalBid.plus(bid.quantity);
    });

    if (book.asks.length > 0 && book.bids.length > 0) {
      book.spread = book.asks[0].price - book.bids[0].price;
      book.spreadPercentage = Math.round((book.spread / book.asks[0].price) * 10000) / 100;
    }

    let runningAsks = new BigNumber(0);
    book.asks.forEach((ask) => {
      runningAsks = runningAsks.plus(ask.quantity);
      ask.quantityTotalRatio = runningAsks.dividedBy(totalAsk);
      ask.quantityRatio = ask.quantity.dividedBy(totalAsk);
    });
    let runningBids = new BigNumber(0);
    book.bids.forEach((bid) => {
      runningBids = runningBids.plus(bid.quantity);
      bid.quantityTotalRatio = runningBids.dividedBy(totalBid);
      bid.quantityRatio = bid.quantity.dividedBy(totalBid);
    });

    return book;
  },
};
