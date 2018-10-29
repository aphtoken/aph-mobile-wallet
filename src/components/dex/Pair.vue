<template>
  <section id="dex--pair">
    <div class="body">
      <market-pair-chart v-bind="{ percentChangeAbsolute, tickerData, change24Hour, close24Hour, baseCurrencyUnitPrice }"></market-pair-chart>
      <base-selector v-model="baseCurrency" v-bind="{ baseCurrencies }"></base-selector>
      <aph-search-bar v-model="searchBy"></aph-search-bar>
      <aph-simple-table v-bind="{ columns, data: tableData, formatEntry, injectCellStyling: getRelativeChange, injectRowStyling, handleRowClick: handleMarketSelection }">
        <div class="cell-price" slot="price" slot-scope="slotProps">
          <div>
            {{ slotProps.value }}
          </div>
          <div class="price-conversion">
            {{ $formatMoney(close24Hour * baseCurrencyUnitPrice) }}
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
let storeUnwatch;

export default {
  beforeDestroy() {
    storeUnwatch();
  },

  components: {
    BaseSelector,
    MarketPairChart,
  },

  computed: {
    baseCurrencies() {
      return _.uniq(_.map(this.$store.state.markets, 'baseCurrency'));
    },

    baseCurrencyUnitPrice() {
      return this.$store.state.currentMarket && this.$store.state.holdings.length ?
        this.$services.neo.getHolding(this.$store.state.currentMarket.baseAssetId).unitValue : 0;
    },

    change24Hour() {
      return new BigNumber(String(this.close24Hour))
        .minus(new BigNumber(String(this.tickerData.open24hr)));
    },

    close24Hour() {
      const tradeHistory = this.$store.state.tradeHistory;
      const marketName = this.$store.state.currentMarket.marketName;
      return tradeHistory[marketName] &&
        tradeHistory[marketName].trades &&
        tradeHistory[marketName].trades.length ?
        tradeHistory[marketName].trades[0].price : 0;
    },

    percentChangeAbsolute() {
      return Math.round(((this.change24Hour)
        / this.tickerData.open24hr) * 10000) / 100;
    },

    tableData() {
      return this.filteredMarkets().map(({ quoteCurrency, marketName }) => {
        const tradeHistory = this.$store.state.tradeHistory[marketName];
        const hasTradeHistory = tradeHistory && tradeHistory.trades && tradeHistory.trades.length > 0;
        const price = this.$formatTokenAmount(hasTradeHistory ? tradeHistory.close24Hour : 0);
        const vol = this.$formatNumber(hasTradeHistory ? tradeHistory.volume24Hour : 0);
        const change = this.$formatNumber(this.percentChangeAbsolute);
        return { asset: quoteCurrency, price, volume: vol, '24H change': change };
      });
    },

    ...mapGetters([
      'tickerData',
    ]),
  },

  data() {
    return {
      baseCurrency: '',
      columns: TABLE_COLUMNS,
      searchBy: '',
    };
  },

  methods: {
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
  },

  mounted() {
    this.baseCurrency = _.first(this.baseCurrencies);

    storeUnwatch = this.$store.watch(
      () => {
        return this.$store.state.currentMarket;
      });
  },

  watch: {
    //
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
    background: $dark-purple*1.25;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;

    .aph-search-bar {
      margin-top: $space;

      .search-bar-wrapper {
        background: $dark-purple;

        input {
          color: $grey;
        }
      }
    }

    .aph-simple-table {
      background: $dark-purple;
      margin: $space;

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
