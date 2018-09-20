import { BigNumber } from 'bignumber.js';
import { MARKETS, HISTORY } from '../../sample_api/dex_sample.js';
import { toBigNumber } from './formatting.js';

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
