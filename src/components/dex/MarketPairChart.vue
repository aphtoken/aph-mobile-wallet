<template>
  <section id="dex--market-pair-chart">
    <div class="header">
      <aph-token-icon class="icon" v-if="$store.state.currentMarket && $store.state.currentMarket.quoteCurrency" :symbol="$store.state.currentMarket.quoteCurrency"></aph-token-icon>
      <span>{{ currentMarketName }}</span>
    </div>
    <div class="body">
      <div class="chart">
        <div class="day-values">
          <div class="row">
            <div class="label">VOL.</div>
            <div class="value">{{ tickerData.quoteVolume }}</div>
          </div>
          <div class="row">
            <div class="label">OPEN</div>
            <div class="value">{{ $formatNumber(tickerData.open24hr) }}</div>
          </div>
          <div class="row">
            <div class="label">HIGH</div>
            <div class="value">{{ $formatNumber(tickerData.high24hr) }}</div>
          </div>
          <div class="row">
            <div class="label">LOW</div>
            <div class="value">{{ $formatNumber(tickerData.low24hr) }}</div>
          </div>
        </div>
        <div class="token-details">
          <div class="base-price">
            {{ basePrice }}
          </div>
          <div class="base-price-converted">
            {{ $formatMoney(close24Hour * baseCurrencyUnitPrice) }}
          </div>
          <div class="label">24H CHANGE ({{ $store.state.currentMarket ? $store.state.currentMarket.quoteCurrency : '' }})</div>
          <div :class="['change', {decrease: change24Hour < 0, increase: change24Hour > 0 }]">
            {{ $formatNumber(change24Hour) }}
            ({{ $formatNumber(percentChangeAbsolute) }}%)
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    basePrice() {
      const tradeHistory = _.get(this.$store.state, `tradeHistory.${this.currentMarketName}`, {});
      const hasTradeHistory = tradeHistory.trades && tradeHistory.trades.length > 0;
      return this.$formatTokenAmount(hasTradeHistory ? tradeHistory.close24Hour : 0);
    },

    ...mapGetters([
      'currentMarketName',
    ]),
  },

  props: {
    baseCurrencyUnitPrice: {
      default: 0,
      type: Number,
    },

    change24Hour: {
      default: 0,
      type: Object,
    },

    close24Hour: {
      default: 0,
      type: Number,
    },

    percentChangeAbsolute: {
      default: '',
      type: Number,
    },

    tickerData: {
      default: {},
      type: Object,
    },
  },
};

</script>

<style lang="scss">
#dex--market-pair-chart {
  @extend %tile-dark;

  display: flex;
  flex: none;
  flex-direction: column;
  padding: $space;

  > .header {
    align-items: center;
    display: flex;
    flex-direction: row;

    > * {
      flex: none;

      &.aph-token-icon {
        margin-right: $space;
      }
    }
  }

  > .body {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: space-between;
    margin-top: $space;

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
