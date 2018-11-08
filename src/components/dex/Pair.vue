<template>
  <section id="dex--pair">
    <div class="body">
      <market-pair-chart v-bind="{ marketData, baseCurrencyUnitPrice }"></market-pair-chart>
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

    baseCurrencyUnitPrice() {
      return this.$store.state.currentMarket && this.$store.state.holdings.length ?
        this.$services.neo.getHolding(this.$store.state.currentMarket.baseAssetId).unitValue : 0;
    },

    currentTickerData() {
      return _.get(this.tickerDataByMarket, this.currentMarketName, {});
    },

    percentChangeAbsolute() {
      return this.$formatNumber(
        _.get(this.currentTickerData, 'percentChangeAbsolute', 0) * this.baseCurrencyUnitPrice,
      );
    },

    quoteVolume() {
      return this.$formatNumber(_.get(this.currentTickerData, 'quoteVolume', 0));
    },

    tableData() {
      return this.filteredMarkets().map(({ quoteCurrency, marketName }) => {
        const tradeHistory = _.get(this.$store.state.tradeHistory, marketName, {});
        const hasTradeHistory = tradeHistory && tradeHistory.trades && tradeHistory.trades.length > 0;
        const price = {
          price: this.$formatTokenAmount(hasTradeHistory ? tradeHistory.close24Hour : 0),
          priceConverted: this.$formatMoney((hasTradeHistory ? tradeHistory.close24Hour : 0) * this.baseCurrencyUnitPrice),
        };
        return { asset: quoteCurrency, price, volume: this.quoteVolume, '24H change': this.percentChangeAbsolute };
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

    getClose24Hour(marketName) {
      const tradeHistory = this.$store.state.tradeHistory;
      return tradeHistory[marketName] &&
        tradeHistory[marketName].trades &&
        tradeHistory[marketName].trades.length ?
        tradeHistory[marketName].trades[0].price : 0;
    },

    filteredMarkets() {
      return this.$store.state.markets.filter((market) => {
        if (this.searchBy.length > 0) {
          const isSearchMatch = _.includes(market.quoteCurrency, this.searchBy.toUpperCase());
          return market.baseCurrency === this.baseCurrency && isSearchMatch;
        }
        return market.baseCurrency === this.baseCurrency;
      });
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
        const change24Hour = this.getChange24Hour(close24Hour, market.open24hr);

        marketData[ticker] = {
          close24Hour,
          change24Hour,
          percentChangeAbsolute: this.getPercentChangeAbsolute(change24Hour, market.open24hr),
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
    }
  },

  watch: {
    currentMarket(newVal, oldVal) {
      if (newVal && !oldVal) {
        this.baseCurrency = newVal.baseCurrency;
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
