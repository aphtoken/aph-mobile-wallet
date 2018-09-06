<template>
  <section id="dex--market-pair-chart">
    <div class="header">
      {{ debug() }}
      {{ $store.state.currentMarket ? $store.state.currentMarket.marketName : '' }}
      }
    </div>
    <div class="body">
      <div class="day-values">
        <div class="add-button">
          Heart
        </div>
        <div class="row">
          <div class="label">VOL.</div>
          <div class="value">{{ $formatNumber($store.state.tradeHistory ? $store.state.tradeHistory.volume24Hour : 0) }}</div>
        </div>
        <div class="row">
          <div class="label">OPEN</div>
          <div class="value">{{ $formatNumber($store.state.tradeHistory ? $store.state.tradeHistory.open24Hour : 0) }}</div>
        </div>
        <div class="row">
          <div class="label">HIGH</div>
          <div class="value">{{ $formatNumber($store.state.tradeHistory ? $store.state.tradeHistory.high24Hour : 0) }}</div>
        </div>
        <div class="row">
          <div class="label">LOW</div>
          <div class="value">{{ $formatNumber($store.state.tradeHistory ? $store.state.tradeHistory.low24Hour : 0) }}</div>
        </div>
      </div>
      <div class="market-info">

      </div>
    </div>
  </section>
</template>

<script>

export default {

  computed: {
    //
  },

  data() {
    return {
      //
    };
  },

  methods: {
    debug() {
      console.log('tradeHistory', this.$store);
    },
  },

  watch: {
    //
  },
};
</script>

<style lang="scss">
#dex--market-pair-chart {
  display: flex;
  flex: 1;
  flex-direction: row;
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