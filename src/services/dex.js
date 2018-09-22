import assets from './assets';
import network from './network';

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
};
