<template>
  <section id="dex--order-book">
    <div class="book" v-if="$store.state.orderBook && $store.state.currentMarket">
      <div class="order-book-table asks">
        <div class="header">
          <div class="cell">price ({{ $store.state.currentMarket.baseCurrency }})</div>
          <div class="cell">volume</div>
          <div class="cell">&nbsp;</div>
        </div>
        <div class="table-data">
          <div class="row" v-for="(ask, index) in $store.state.orderBook.asks" :key="index">
            <div class="cell price red" @click="setPrice(ask.price)">{{ $formatNumber(ask.price) }}</div>
            <div class="cell quantity" @click="setQuantity(index, $store.state.orderBook.asks)">{{ $formatNumber(ask.quantity) }}</div>
            <div class="cell graph">
              <span class="size-bar size-total red" :style="{ width: (ask.quantityTotalRatio * 100) + '%' }"></span>
              <span class="size-bar red" :style="{ width: (ask.quantityRatio * 100) + '%' }"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="spread-divider">
        <div class="label">{{$t('spread')}}</div>
        <div class="value">{{ $formatNumber($store.state.orderBook.spread) }}</div>
        <div>&nbsp;</div>
      </div>
      <div class="order-book-table bids">
        <div class="table-data">
          <div class="row" v-for="(bid, index) in $store.state.orderBook.bids" :key="index">
            <div class="cell price green" @click="setPrice(bid.price)">{{ $formatNumber(bid.price) }}</div>
            <div class="cell quantity" @click="setQuantity(index, $store.state.orderBook.bids)">{{ $formatNumber(bid.quantity) }}</div>
            <div class="cell graph" >
              <span class="size-bar size-total green" :style="{ width: (bid.quantityTotalRatio * 100) + '%' }"></span>
              <span class="size-bar green" :style="{ width: (bid.quantityRatio * 100) + '%', 'border-right-width': (bid.quantityTotalRatio * 100) + '%' }"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>

export default {
  components: {
  },

  computed: {
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
#dex--order-book {
  background: $dark-purple*1.25;
  display: flex;
  flex: 1;
  
  .book {
    background-color: $dark-purple;
    display: flex;
    flex-direction: column;
    flex: 1;

    .order-book-table {
      display: flex;
      flex-direction: column;
      flex: 1;
      margin: $space;

      .header {
        color: $darker-grey;
        display: flex;
        flex-direction: row;
        flex: none;
        justify-content: space-between;
        text-transform: uppercase;

        .cell {
          flex: 1;
          font-size: toRem(11px);
        }
      }

      .table-data {
        display: flex;
        flex-direction: column;
        flex: 1;
        margin-top: $space;
        justify-content: flex-start;

        .row {
          display: flex;
          flex-direction: row;
          justify-content: space-between;

          .cell {
            flex: 1;

            &.graph {
              font-size: 0;
              position: relative;
              text-align: right;

              .size-bar {
                display: inline-block;
                height: toRem(12px);
                position: absolute;
                right: 0px;

                &.green {
                  background-color: $green;
                }

                &.red {
                  background-color: $red;
                }
                
                &.size-total {
                  &.green {
                    opacity: 0.2;
                  }

                  &.red {
                    opacity: 0.2;
                  }
                }
              }
            }
          }
        }
      }

      &.asks {
        .table-data {
          flex-direction: column-reverse;
        }
      }
    }

    .spread-divider {
      border-bottom: 1px solid $darker-grey/2;
      border-top: 1px solid $darker-grey/2;
      display: flex;
      flex-direction: row;
      flex: none;
      justify-content: space-between;
      margin: $space;
      padding: $space-sm;

      > div {
        flex: 1;
        margin: auto 0;
        text-transform: uppercase;

        &.label {
          color: $darker-grey;
          font-size: toRem(11px);
        }
      }
    }
  }
}
</style>
