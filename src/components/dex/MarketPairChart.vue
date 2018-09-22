<template>
  <section id="dex--market-pair-chart">
    <div class="header">
      {{ debug() }}
      {{ $store.state.currentMarket ? $store.state.currentMarket.marketName : '' }}
    </div>
    <div class="body">
      <div class="chart-header">
        <div class="add-button">
          Heart/Add
        </div>
        <aph-token-icon class="icon" v-if="$store.state.currentMarket && $store.state.currentMarket.quoteCurrency" :symbol="$store.state.currentMarket.quoteCurrency"></aph-token-icon>
      </div>
      <div class="chart">
        <div class="day-values">
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
      console.log('currentMarket in dbug', this.$store.state.currentMarket);
    },

    loadTrades() {
      console.log('currentMarket?', this.$store.state.currentMarket);
      if (!this.$store.state.currentMarket) {
        return;
      }

      this.$store.dispatch('fetchTradeHistory', {
        marketName: this.$store.state.currentMarket.marketName,
      });
    },
  },

  mounted() {
    this.loadTrades();
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
  flex-direction: column;
  background: $dark-purple;
  margin: $space;
  max-height: toRem(180px); // Can probably remove this once other components are added

  > .header {
    height: $space;
    padding: $space;
  }

  > .body {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: space-between;
    padding: 0 $space $space;

    .chart-header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    .chart {
      display: flex;
      flex-direction: row;

      .day-values {
        display: flex;
        flex-direction: column;
        flex: 1;
        justify-content: flex-end;

        .row {
          display: flex;
          margin-top: $space-sm;

          .label {
            @extend %small-uppercase-grey-label-dark;

            flex: 1;
          }

          .value {
            font-family: GilroySemibold;
            font-size: toRem(12px);
            flex: 2;
          }
        }
      }

      .token-details {
        display: flex;
        flex-direction: column;
        flex: none;
        justify-content: flex-end;

        > div {
          margin-top: $space-sm;
          text-align: right;
        }

        .label {
          @extend %small-uppercase-grey-label-dark;
        }

        .base-price {
          font-family: GilroySemibold;
          font-size: toRem(16px);
        }

        .base-price-converted {
          font-family: GilroySemibold;
          font-size: toRem(12px);
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
    }
  }
}
</style>
