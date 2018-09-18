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

    asks.forEach((l) => {
      l.price = toBigNumber(l[0]);
      l.quantity = toBigNumber(l[1]);
      book.asks.push(l);
    });
    bids.forEach((l) => {
      l.price = toBigNumber(l[0]);
      l.quantity = toBigNumber(l[1]);
      book.bids.push(l);
    });

    this.setOrderBookMeta(book);
    return book;
  },

  setOrderBookMeta(book) {
    let totalAsk = new BigNumber(0);

    book.asks = _.sortBy(book.asks, [level => level.price.toNumber()]);
    book.bids = _.sortBy(book.bids, [level => level.price.toNumber()]).reverse();

    book.asks.forEach((l) => {
      totalAsk = totalAsk.plus(l.quantity);
    });
    let totalBid = new BigNumber(0);
    book.bids.forEach((l) => {
      totalBid = totalBid.plus(l.quantity);
    });

    if (book.asks.length > 0 && book.bids.length > 0) {
      book.spread = book.asks[0].price - book.bids[0].price;
      book.spreadPercentage = Math.round((book.spread / book.asks[0].price) * 10000) / 100;
    }

    let runningAsks = new BigNumber(0);
    book.asks.forEach((l) => {
      runningAsks = runningAsks.plus(l.quantity);
      l.quantityTotalRatio = runningAsks.dividedBy(totalAsk);
      l.quantityRatio = l.quantity.dividedBy(totalAsk);
    });
    let runningBids = new BigNumber(0);
    book.bids.forEach((l) => {
      runningBids = runningBids.plus(l.quantity);
      l.quantityTotalRatio = runningBids.dividedBy(totalBid);
      l.quantityRatio = l.quantity.dividedBy(totalBid);
    });

    return book;
  },
};
