<template>
  <section id="dex--orders-table">
    <div class="header">
      <div v-for="status in orderStatus"
        :class="[status, { active: selectedStatus === status }]"
        @click="handleStatusChange(status)">
        {{ status }} {{ orderVolumeByStatus(status) }}
      </div>
    </div>
    <aph-simple-table v-bind="{ data: formatTableData(filteredOrders), columns: openOrderColumns, hasHeader: false }">
      <div slot="pairAndSide" slot-scope="{value}" class="pair-and-side-cell">
        <div class="pair">
          {{ value.marketName }}
        </div>
        <div class="side" :class="value.side">
          {{ value.side }}
        </div>
      </div>
      <div slot="details" slot-scope="{value}" class="details-cell">
        <div class="trade-details">
          <div class="size-base">
            <div class="trade-size">
              {{ value.quantity }}
            </div>
            <div class="quote-currency">
              {{ value.quoteSymbol }}
            </div>
          </div>
          <div class="price-cost">
            <div class="price">
              {{ value.price }}
            </div>
            <div class="cost">
              {{ value.cost }}
            </div>
          </div>
        </div>
        <div v-if="selectedStatus === 'open'" class="cancel-btn" @click="cancelOrder(value)">
          X
        </div>
      </div>
    </aph-simple-table>
  </section>
</template>

<script>
let loadOrdersIntervalId;
let cancelledOrders = {};

const COMPLETED = 'completed';
const OPEN = 'open';
const OPEN_ORDER_COLUMNS = ['pairAndSide', 'details'];

export default {
  beforeDestroy() {
    clearInterval(loadOrdersIntervalId);
  },

  components: {
  },

  computed: {
    allOrders() {
      if (!this.$store.state.orderHistory) {
        return [];
      }

      const orders = this.$store.state.orderHistory.map((order) => {
        // if the order comes back from the api as still open or partially filled,
        // but we know we recently cancelled it, still show as cancelling
        if (_.has(cancelledOrders, order.orderId)) {
          if (_.includes(['Open', 'PartiallyFilled', 'Cancelling'], order.status)
            && moment.utc().diff(_.get(cancelledOrders, order.orderId), 'milliseconds')
              < this.$constants.timeouts.CANCEL_ORDER) {
            order.status = 'Cancelling';
          } else {
            cancelledOrders = _.omit(cancelledOrders, order.orderId);
          }
        }

        return order;
      });

      return orders;
    },

    baseCurrencyUnitPrice() {
      return this.$store.state.currentMarket && this.$store.state.holdings && this.$store.state.holdings.length ?
        this.$services.neo.getHolding(this.$store.state.currentMarket.baseAssetId).unitValue : 0;
    },

    completedOrders() {
      return _.filter(this.allOrders, (order) => {
        return order.status !== 'Open' && order.status !== 'PartiallyFilled';
      });
    },

    filteredOrders() {
      // TODO: reinstate when we show all orders vs. orders of selected market only.
      // if (this.$store.state.ordersToShow === this.$constants.orders.ALL_SWITCH) {
      //   return this.ordersForTable;
      // }

      return this.ordersForTable.filter((order) => {
        return order.marketName === this.$store.state.currentMarket.marketName;
      });
    },

    openOrders() {
      return _.filter(this.allOrders, (order) => {
        return order.status === 'Open' || order.status === 'PartiallyFilled' || order.status === 'Cancelling';
      });
    },

    ordersForTable() {
      switch (this.selectedStatus) {
        case OPEN:
          return this.openOrders;
        case COMPLETED:
          return this.completedOrders;
        default:
          return this.openOrders;
      }
    },
  },

  data() {
    return {
      openOrderColumns: OPEN_ORDER_COLUMNS,
      orderStatus: [OPEN, COMPLETED],
      selectedStatus: OPEN,
    };
  },

  methods: {
    cancelOrder(order) {
      this.$services.dex.cancelOrder(order)
        .then((res) => {
          this.$services.alerts.success(res);
          order.status = 'Cancelling';
          _.set(cancelledOrders, order.orderId, moment.utc());
        })
        .catch((e) => {
          this.$services.alerts.exception(e);
        });
    },

    formatTableData(tableData) {
      const quoteSymbol = _.get(this.$store.state, 'currentMarket.quoteCurrency');

      return tableData.map(({ marketName, offerId, price, quantity, side }) => {
        return {
          pairAndSide: {
            marketName,
            side: side.toLowerCase(),
          },
          details: {
            quantity,
            quoteSymbol,
            price,
            cost: this.$formatNumber(price * this.baseCurrencyUnitPrice),
            // These last two are needed here for order cancellation.
            offerId,
            marketName,
          },
        };
      });
    },

    handleStatusChange(newStatus) {
      this.selectedStatus = newStatus;
    },

    loadOrders() {
      this.$store.dispatch('fetchOrderHistory', { isRequestSilent: false });
    },

    loadOrdersSilently() {
      this.$store.dispatch('fetchOrderHistory', { isRequestSilent: true });
    },

    orderVolumeByStatus(status) {
      const volume = this[`${status}Orders`].filter(order => order.marketName === this.$store.state.ordersToShow).length;
      return volume ? `(${volume})` : '';
    },
  },

  mounted() {
    this.loadOrders();

    loadOrdersIntervalId = setInterval(() => {
      this.loadOrdersSilently();
    }, this.$constants.intervals.TRANSACTIONS_POLLING);
  },

  watch: {
  },
};

</script>

<style lang="scss">
#dex--orders-table {
  background: $dark-purple;
  display: flex;
  flex-direction: column;
  flex: 1;

  .header {
    display: flex;
    flex-direction: row;
    flex: none;
    justify-content: space-between;

    > div {
      flex: 1;
      padding: $space;
      text-align: center;
      text-transform: capitalize;

      &.active {
        border-bottom: $border;
      }
    }
  }

  .pair-and-side-cell {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .pair-and-side-cell {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: flex-start;

    .side {
      margin-top: $space-sm;
      text-transform: capitalize;

      &.buy {
        color: $green;

        &:before {
          content: "+";
        }
      }

      &.sell {
        color: $red;

        &:before {
          content: "-";
        }
      }
    }
  }

  .details-cell {
    display: flex;
    flex-direction: row;
    flex: 1;
    justify-content: flex-end;

    .trade-details {
      display: flex;
      flex: 1;
      flex-direction: column;

      > div {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;

        &:last-child {
          margin-top: $space-sm;
        }

        > div, &:last-child {
          margin-left: $space-sm;
        }

        .cost {
          color: $darker-grey;
        }
      }
    }

    .cancel-btn {
      border-radius: 50%;
      border: 1px $darker-grey solid;
      margin: auto 0 auto $space;
      padding: $space-sm
    }
  }
}
</style>
