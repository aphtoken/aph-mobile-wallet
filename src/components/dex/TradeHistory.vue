<template>
  <section id="dex--trade-history">
    <div class="trade-history-table">
      <div class="table-header">
        <div class="cell price">price ({{ $store.state.currentMarket ? $store.state.currentMarket.baseCurrency : '' }})</div>
        <div class="cell volume">volume</div>
        <div class="cell time">time</div>
      </div>
      <div class="table-body">
        <div class="row" v-for="(trade, index) in trades" :key="index">
          <div :class="['cell', 'price', {green: trade.side === 'Buy', red: trade.side === 'Sell'}]">
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
};

</script>

<style lang="scss">
#dex--trade-history {
  display: flex;
  flex: 1;

  .trade-history-table {
    background-color: $dark-purple;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;

    .table-header {
      display: flex;
      flex-direction: row;
      flex: none;
      justify-content: space-between;
      margin: $space $space 0;

    .cell {
      color: $darker-grey;
      text-transform: uppercase;
      }
    }

    .table-body {
      display: flex;
      flex-direction: column;
      flex: 1;
      margin: $space;

      .row {
        display: flex;
        flex-direction: row;
        flex: none;
        justify-content: space-between;
        margin-top: $space-sm;

        .cell {
          font-family: FreeMono;

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

      &.time {
        flex: 3;
      }

      &.volume {
        flex: 1;
      }

      &.price {
        flex: 2;
      }

      &:last-child {
        justify-content: flex-end;
      }
    }
  }
}
</style>
