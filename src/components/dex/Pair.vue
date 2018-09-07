<template>
  <section id="dex--pair">
    <div class="body">
      <market-pair-chart></market-pair-chart>
      <div>
        Ticker Component?
      </div>
      <div>
        Search Component
      </div>
      <div>
        Table Component <br>
        Ticker <br>
        Another Ticker <br>
        Another One
      </div>
    </div>
  </section>
</template>

<script>

import MarketPairChart from './MarketPairChart';

export default {
  mounted() {
    this.loadTrades();
  },

  components: {
    MarketPairChart,
  },

  computed: {
    //
  },

  data() {
    return {
      //
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
  flex: 1;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

   > .body {
    background: $dark-purple*1.25;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;

    > div {
      margin: $space;
      background: $dark-purple;
    }
  }
}
</style>
