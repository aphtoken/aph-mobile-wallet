<template>
  <section id="dex--pair">
    <div class="body">
      <market-pair-chart></market-pair-chart>
      <base-selector v-model="baseCurrency" v-bind="{baseCurrencies}"></base-selector>
      <aph-search-bar v-model="searchBy"></aph-search-bar>
      <aph-simple-table v-bind="{ columns, data: tableData, formatEntry, injectStyling: getRelativeChange, handleRowClick: handleMarketSelection }">
        <div class="cell-price" slot="price" slot-scope="slotProps">
          <div>
            {{ slotProps.value }}
          </div>
          <div class="price-conversion">
            $137.99
          </div>
        </div>
      </aph-simple-table>
    </div>
  </section>
</template>

<script>

import MarketPairChart from './MarketPairChart';
import BaseSelector from './BaseSelector';

const TABLE_COLUMNS = ['asset', 'price', 'volume', '24H change'];

export default {
  components: {
    MarketPairChart,
    BaseSelector,
  },

  computed: {
    baseCurrencies() {
      return _.uniq(_.map(this.$store.state.markets, 'baseCurrency'));
    },

    tableData() {
      return this.filteredMarkets().map(({ quoteCurrency, minimumSize, buyFee, sellFee }) => {
        return { asset: quoteCurrency, price: minimumSize, volume: buyFee, '24H change': sellFee };
      });
    },
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
      this.$store.commit('setCurrentMarket', this.filteredMarkets().find((market) => {
        return market.quoteCurrency === asset;
      }));
    },
  },

  mounted() {
    this.baseCurrency = _.first(this.baseCurrencies);
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
    }

    > div {
      background: $dark-purple;
      margin: $space;
    }
  }
}
</style>
