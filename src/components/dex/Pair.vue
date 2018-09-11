<template>
  <section id="dex--pair">
    <div class="body">
      <market-pair-chart></market-pair-chart>
      <market-selector></market-selector>
      <aph-search-bar v-model="searchBy"></aph-search-bar>
      <aph-simple-table v-bind:data=data v-bind:columns=columns></aph-simple-table>
    </div>
  </section>
</template>

<script>

import { TICKER_LIST } from '../../../sample_api/dex_sample.js';
import MarketPairChart from './MarketPairChart';
import MarketSelector from './MarketSelector';

export default {
  mounted() {
    this.loadTrades();
  },

  components: {
    MarketPairChart,
    MarketSelector,
  },

  computed: {
    //
  },

  data() {
    return {
      searchBy: '',
      data: TICKER_LIST.DATA,
      columns: TICKER_LIST.COLUMNS,
    };
  },

  methods: {
    loadTrades() {
      this.$store.dispatch('fetchTradeHistory', {
        marketName: this.$store.state.currentMarket.marketName,
      });
    },
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
      margin: $space;
      background: $dark-purple;
    }

    > div {
      background: $dark-purple;
      margin: $space;
    }
  }
}
</style>
