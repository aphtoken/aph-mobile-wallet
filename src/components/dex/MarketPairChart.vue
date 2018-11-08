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
            <div class="value">{{ quoteVolume }}</div>
          </div>
          <div class="row">
            <div class="label">OPEN</div>
            <div class="value">{{ open24hr }}</div>
          </div>
          <div class="row">
            <div class="label">HIGH</div>
            <div class="value">{{ high24hr }}</div>
          </div>
          <div class="row">
            <div class="label">LOW</div>
            <div class="value">{{ low24hr }}</div>
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
            {{ change24Hour }}
            ({{ percentChangeAbsolute }}%)
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
    currentTickerData() {
      return _.get(this.tickerDataByMarket, this.currentMarketName, {});
    },

    basePrice() {
      const tradeHistory = _.get(this.$store.state, `tradeHistory.${this.currentMarketName}`, {});
      const hasTradeHistory = tradeHistory.trades && tradeHistory.trades.length > 0;
      return this.$formatTokenAmount(hasTradeHistory ? tradeHistory.close24Hour : 0);
    },

    change24Hour() {
      return this.$formatNumber(_.get(this.currentTickerData, 'change24Hour', 0));
    },

    close24Hour() {
      return _.get(this.currentTickerData, 'close24Hour', 0);
    },

    high24hr() {
      return this.$formatMoney(_.get(this.currentTickerData, 'high24hr', 0));
    },

    low24hr() {
      return this.$formatMoney(_.get(this.currentTickerData, 'low24hr', 0));
    },

    open24hr() {
      return this.$formatMoney(_.get(this.currentTickerData, 'open24hr', 0));
    },

    percentChangeAbsolute() {
      return this.$formatNumber(_.get(this.currentTickerData, 'percentChangeAbsolute', 0));
    },

    quoteVolume() {
      return _.get(this.currentTickerData, 'quoteVolume', 0);
    },
    
    ...mapGetters([
      'tickerData',
      'currentMarketName',
      'tickerDataByMarket',
    ]),
  },

  props: {
    baseCurrencyUnitPrice: {
      default: 0,
      type: Number,
    },

    marketData: {
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
