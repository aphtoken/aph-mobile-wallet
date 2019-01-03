<template>
  <section id="dex--pair">
    <div class="body">
      <market-pair-chart v-bind="{ marketData }"></market-pair-chart>
      <base-selector v-model="baseCurrency" v-bind="{ baseCurrencies }"></base-selector>
      <aph-search-bar v-model="searchBy"></aph-search-bar>
      <aph-simple-table v-bind="{ columns, data: tableData, formatEntry, injectCellStyling: getRelativeChange, injectRowStyling, handleRowClick: handleMarketSelection }">
        <div class="cell-price" slot="price" slot-scope="slotProps">
          <div>
            {{ slotProps.value.price }}
          </div>
          <div class="price-conversion">
            {{ slotProps.value.priceConverted }}
          </div>
        </div>
      </aph-simple-table>
    </div>
  </section>
</template>

<script>
import { BigNumber } from 'bignumber.js';
import { mapGetters } from 'vuex';
import MarketPairChart from './MarketPairChart';
import BaseSelector from './BaseSelector';

const TABLE_COLUMNS = ['asset', 'price', 'volume', '24H change'];

export default {
  components: {
    BaseSelector,
    MarketPairChart,
  },

  computed: {
    ...mapGetters([
      'currentMarket',
      'currentMarketName',
      'tickerDataByMarket',
    ]),

    baseCurrencies() {
      return _.uniq(_.map(this.$store.state.markets, 'baseCurrency'));
    },

    currentTickerData() {
      return _.get(this.tickerDataByMarket, this.currentMarketName, {});
    },

    tableData() {
      return this.filteredMarkets().map(({ baseAssetId, quoteCurrency, marketName }) => {
        const tickerData = this.tickerDataByMarket[marketName];
        let price;
        let baseVolume;
        let percentChange;
        const baseAssetHolding = this.$services.neo.getHolding(baseAssetId);
        const baseCurrencyUnitPrice = baseAssetHolding && baseAssetHolding.unitValue ? baseAssetHolding.unitValue : 0;
        /* NOTE: this doesn't load immediately, just use tickerData
        if (marketName === this.currentMarket.marketName) {
          const tradeHistory = this.$store.state.tradeHistory;
          const hasTradeHistory = tradeHistory && tradeHistory.trades && tradeHistory.trades.length > 0;

          price = {
            price: this.$formatTokenAmount(hasTradeHistory ? tradeHistory.close24Hour : tickerData.last),
            priceConverted: this.$formatMoney((hasTradeHistory ? tradeHistory.close24Hour : tickerData.last)
              * baseCurrencyUnitPrice),
          };
          quoteVolume = tickerData.quoteVolume;
        } else */ if (tickerData && tickerData.last) {
          price = {
            price: tickerData.last,
            priceConverted: this.$formatMoney(tickerData.last * baseCurrencyUnitPrice),
          };
          baseVolume = tickerData.baseVolume;
          percentChange = tickerData.change24hrPercent;
        } else {
          price = {
            price: 0,
            priceConverted: this.$formatMoney(0),
          };
          baseVolume = 0;
          percentChange = 0;
        }

        percentChange = Math.round(percentChange * 10000) / 100;
        return { asset: quoteCurrency,
          price,
          volume: this.$formatMoney(baseVolume * baseCurrencyUnitPrice),
          '24H change': this.$formatNumber(percentChange) };
      });
    },
  },

  data() {
    return {
      baseCurrency: '',
      columns: TABLE_COLUMNS,
      marketData: {},
      searchBy: '',
    };
  },

  methods: {
    getChange24Hour(close24Hour, open24hr) {
      return new BigNumber(String(close24Hour))
        .minus(new BigNumber(String(open24hr)));
    },

    getClose24Hour(tickerData) {
      const tradeHistory = this.$store.state.tradeHistory;
      return tradeHistory &&
        tradeHistory.trades &&
        tradeHistory.trades.length ?
        tradeHistory.trades[0].price : tickerData.last;
    },

    filteredMarkets() {
      let markets = this.$store.state.markets.filter((market) => {
        if (this.searchBy.length > 0) {
          const isSearchMatch = _.includes(market.quoteCurrency, this.searchBy.toUpperCase());
          return market.baseCurrency === this.baseCurrency && isSearchMatch;
        }
        return market.baseCurrency === this.baseCurrency;
      });

      if (!markets || !markets.length) return markets;

      let nonZeroVolumeItems = 0;
      markets.forEach((market) => {
        const baseAsset = this.$services.neo.getHolding(market.baseAssetId);
        const unitValue = baseAsset && baseAsset.unitValue ? baseAsset.unitValue : 0;
        market.baseVolume = _.get(this.$store.state.tickerDataByMarket, `${market.marketName}.baseVolume`);
        market.volume = market.baseVolume * unitValue;
        if (market.volume > 0) {
          nonZeroVolumeItems += 1;
        }
      });

      const aphMarket = _.remove(markets, { quoteCurrency: 'APH' });
      markets = aphMarket.concat(_.orderBy(markets, 'volume', 'desc'));
      const marketsToShowByVolume = nonZeroVolumeItems > 10 ? 10 : nonZeroVolumeItems;
      markets = markets.slice(0, marketsToShowByVolume).concat(
        _.orderBy(markets.slice(marketsToShowByVolume), 'quoteCurrency', 'asc'));

      return markets;
    },

    formatEntry(value, entry, key) {
      if (key === '24H change') {
        return `${this.$services.formatting.formatNumber(value)}%`;
      }
      return value;
    },

    setMarketData() {
      this.marketData = _.reduce(this.tickerDataByMarket, (marketData, market, ticker) => {
        const close24Hour = this.getClose24Hour(ticker);
        const change24Hour = this.getChange24Hour(close24Hour, ticker.open24hr);

        marketData[ticker] = {
          close24Hour,
          change24Hour,
          percentChangeAbsolute: ticker.open24hr > 0 ? this.getPercentChangeAbsolute(change24Hour, ticker.open24hr) : 0,
        };
        return marketData;
      }, {});
    },

    getRelativeChange(value, entry, key) {
      if (key === '24H change') {
        return value > 0 ? 'increase' : 'decrease';
      }
      return null;
    },

    handleMarketSelection({ asset }) {
      const market = _.find(this.filteredMarkets(), { quoteCurrency: asset });
      this.$store.commit('setCurrentMarket', market);
    },

    injectRowStyling({ asset }) {
      if (asset === this.$store.state.currentMarket.quoteCurrency &&
        this.baseCurrency === this.$store.state.currentMarket.baseCurrency) {
        return 'active';
      }

      return '';
    },

    getPercentChangeAbsolute(change24Hour, open24hr) {
      return Math.round(((change24Hour) / open24hr) * 10000) / 100 || 0;
    },
  },

  mounted() {
    if (this.currentMarket) {
      this.baseCurrency = this.currentMarket.baseCurrency;
      this.setMarketData();
    }
  },

  watch: {
    currentMarket(newVal, oldVal) {
      if (newVal && !oldVal) {
        this.baseCurrency = newVal.baseCurrency;
        this.setMarketData();
      }
    },
  },
};
</script>

<style lang="scss">
#dex--pair {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  overflow: hidden;

   > .body {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;

    .aph-search-bar {
      margin-top: $space;
      padding: 0;

      .search-bar-wrapper {
        background: $dark-purple;

        input {
          color: $grey;
        }
      }
    }

    .aph-simple-table {
      @extend %tile-dark;

      padding: $space;

      .cell-price {
        display: flex;
        flex-direction: column;

        .price-conversion {
          color: $darker-grey;
          font-size: toRem(10px);
          padding-top: toRem(4px);
        }
      }

      .change {
        font-size: toRem(12px);

        &.increase {
          color: $green;

          &:before {
            content: "+";
          }
        }

        &.decrease {
          color: $red;
        }
      }

      .row.active {
        background: lighten($dark-purple, 10%);

        .cell {
          border-color: transparent;
        }
      }
    }

    > div {
      background: $dark-purple;
      margin: $space;
    }
  }
}
</style>
