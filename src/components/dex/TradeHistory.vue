<template>
  <section id="dex--trade-history">
    <div class="trade-history-table">
      <div class="table-header">
        <div class="cell">price ({{ $store.state.currentMarket ? $store.state.currentMarket.baseCurrency : '' }})</div>
        <div class="cell volume">volume</div>
        <div class="cell time">time</div>
      </div>
      <div class="table-body">
        <div class="row" v-for="(trade, index) in trades" :key="index">
          <div :class="['cell', {green: trade.side === 'Buy', red: trade.side === 'Sell'}]">
            <aph-icon :name="trade.side === 'Buy' ? 'chevron-up' : 'chevron-down'"></aph-icon>
            {{ $formatNumber(trade.price) }}
          </div>
          <div class="cell volume">{{ $formatNumber(trade.quantity) }}</div>
          <div class="cell time">{{ $formatTime(trade.tradeTime) }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>

export default {

  computed: {
    trades() {
      return this.$store.state.tradeHistory && this.$store.state.tradeHistory.trades
        && this.$store.state.tradeHistory.trades.length ? this.$store.state.tradeHistory.trades : [];
    },
  },

  data() {
    return {
    };
  },

  methods: {

  },

  mounted() {
  },

  watch: {
  },
};

</script>

<style lang="scss">
#dex--trade-history {
  background: $dark-purple*1.25;
  display: flex;
  flex: 1;

  .trade-history-table {
    display: flex;
    flex: 1;
    flex-direction: column;
    margin: $space;
    background-color: $dark-purple;
    overflow: auto;

    .table-header {
      display: flex;
      flex: none;
      flex-direction: row;
      justify-content: space-between;

    .cell {
      text-transform: uppercase;
      color: $darker-grey;
      margin: $space;
      }
    }

    .table-body {
      display: flex;
      flex: 1;
      flex-direction: column;

      .row {
        display: flex;
        flex: none;
        flex-direction: row;
        justify-content: space-between;

        .cell {
          margin: $space-xs $space;

          &.green {
            color: $green;

            .fill {
              fill: $green;
            }
          }

          &.red {
            color: $red;

            .fill {
              fill: $red;
            }
          }

          .aph-icon {
            margin: auto 0;

            svg {
              height: toRem(6px);
              margin-right: $space-xs;
            }
          }
        }
      }
    }

    .cell {
      display: flex;
      flex: 1;
      font-size: toRem(11px);

      &.volume {
        padding-left: toRem(30px);
      }

      &:last-child {
        justify-content: flex-end;
      }
    }
  }
}
</style>