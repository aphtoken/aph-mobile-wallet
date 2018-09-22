<template>
  <section id="dex--pair">
    <div class="body">
      <market-pair-chart></market-pair-chart>
      <market-selector></market-selector>
      <aph-search-bar v-model="searchBy"></aph-search-bar>
      <aph-simple-table v-bind="{columns, data, formatEntry, injectStyling: getRelativeChange}">
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

import { TICKER_LIST } from '../../../sample_api/dex_sample.js';
import MarketPairChart from './MarketPairChart';
import MarketSelector from './MarketSelector';

export default {
  data() {
    return {
      columns: TICKER_LIST.COLUMNS,
      data: TICKER_LIST.DATA,
      searchBy: '',
    };
  },

  components: {
    MarketPairChart,
    MarketSelector,
  },

  computed: {
    //
  },

  methods: {
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
  },

  mounted() {
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
