<template>
  <section id="dex--market-pair-chart">
    <div class="header">
      {{ debug() }}
      {{ $store.state.currentMarket ? $store.state.currentMarket.marketName : '' }}
    </div>
    <div class="body">
      <div class="day-values">
        <div class="add-button">
          Heart/Add
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
      <div class="token-details">
        <aph-token-icon v-if="$store.state.currentMarket && $store.state.currentMarket.quoteCurrency" :symbol="$store.state.currentMarket.quoteCurrency"></aph-token-icon>
        <div class="base-price">
          {{ $formatTokenAmount($store.state.tradeHistory ? $store.state.tradeHistory.close24Hour : 0) }}
        </div>
        <div class="base-price-converted">
          $11.41
        </div>
        <div class="label">24H CHANGE ({{ $store.state.currentMarket ? $store.state.currentMarket.quoteCurrency : '' }})</div>
        <div :class="['change', {decrease: $store.state.tradeHistory ? $store.state.tradeHistory.change24Hour < 0 : false, increase: $store.state.tradeHistory ? $store.state.tradeHistory.change24Hour > 0 : false}]">
          {{ $formatNumber($store.state.tradeHistory ? $store.state.tradeHistory.change24Hour : 0) }}
          ({{ $formatNumber(percentChangeAbsolute) }}%)
        </div>
      </div>
    </div>
  </section>
</template>

<script>

export default {

  computed: {
    percentChangeAbsolute() {
      return this.$store.state.tradeHistory ?
        Math.abs(this.$store.state.tradeHistory.change24HourPercent) : 0;
    },
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