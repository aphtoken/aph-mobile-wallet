<template>
  <section id="history">
    <div class="header">
      <div class="title">History</div>
      <div class="filters">
        <aph-date-picker placeholder="From" v-model="fromDate" ref="fromDate"></aph-date-picker>
        <aph-date-picker placeholder="To" v-model="toDate" ref="toDate"></aph-date-picker>
      </div>
    </div>
    <div class="body">
      <div class="inner">
        <div class="header">
          <div :class="['tab', {active: activeTab === 'all'}]" @click="activeTab = 'all'">All</div>
          <div :class="['tab', {active: activeTab === 'sent'}]" @click="activeTab = 'sent'">Sent</div>
          <div :class="['tab', {active: activeTab === 'received'}]" @click="activeTab = 'received'">Received</div>
        </div>
        <div class="history">
          <div class="all" v-if="activeTab === 'all'">
            <aph-simple-transactions :transactions="transactions" :on-click="showTransaction"></aph-simple-transactions>
          </div>
          <div class="sent" v-if="activeTab === 'sent'">
            <aph-simple-transactions :transactions="sent" :on-click="showTransaction"></aph-simple-transactions>
          </div>
          <div class="received" v-if="activeTab === 'received'">
            <aph-simple-transactions :transactions="received" :on-click="showTransaction"></aph-simple-transactions>
          </div>
        </div>
      </div>
    </div>
    <aph-transaction-detail :on-hide="hideTransactionDetail" :show="showTransactionDetail" :transaction="transactionDetail"></aph-transaction-detail>
  </section>
</template>

<script>
export default {
  mounted() {
    this.$refs.fromDate.setDay(this.fromDate);
    this.loadTransactions();
  },

  computed: {
    received() {
      return this.transactions.filter(({ value }) => value > 0);
    },

    sent() {
      return this.transactions.filter(({ value }) => value < 0);
    },

    transactions() {
      try {
        return _.filter(this.$store.state.searchTransactions, (t) => {
          const fromDate = this.$store.state.searchTransactionFromDate;
          const toDate = this.$store.state.searchTransactionToDate
            ? moment(this.$store.state.searchTransactionToDate).add(1, 'days') : null;

          if (fromDate
            && t.block_time < fromDate.unix()) {
            return false;
          }
          if (toDate
            && t.block_time > toDate.unix()) {
            return false;
          }

          return true;
        }).map((transaction) => {
          return _.merge(transaction, {
            address: transaction.hash,
          });
        });
      } catch (e) {
        console.log(e);
        return [];
      }
    },
  },

  data() {
    return {
      activeTab: 'all',
      fromDate: moment().startOf('day').subtract(7, 'days'),
      showTransactionDetail: false,
      toDate: null,
      transactionDetail: {},
    };
  },

  methods: {
    hideTransactionDetail() {
      this.showTransactionDetail = false;
    },

    loadTransactions() {
      this.$store.dispatch('findTransactions');
    },

    showTransaction(transaction) {
      this.transactionDetail = transaction;
      this.showTransactionDetail = true;
    },

    toggleTransaction({ details }) {
      this.activeTxid = this.activeTxid === details.txid ? null : details.txid;
    },
  },

  watch: {
    fromDate() {
      this.$store.commit('setSearchTransactionFromDate', this.fromDate);
      this.$store.dispatch('findTransactions');
    },

    selectedDateRange() {
      if (this.selectedDateRange === 'custom') {
        this.$refs.fromDate.setDay(this.fromDate);
        this.$refs.toDate.setDay(this.toDate);
        return;
      } else if (this.selectedDateRange === 'all') {
        this.fromDate = null;
        this.toDate = null;
        return;
      }

      const daysBack = Number.parseInt(this.selectedDateRange, 10);
      this.fromDate = moment().startOf('day').subtract(daysBack, 'days');
      this.toDate = moment().startOf('day');
    },

    toDate() {
      this.$store.commit('setSearchTransactionToDate', this.toDate);
      this.$store.dispatch('findTransactions');
    },
  },
};
</script>

<style lang="scss">
#history {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  > .header {
    align-items: center;
    display: flex;
    flex-direction: column;
    flex: none;
    padding: $space 0 0;

    .title {
      color: white;
      font-size: toRem(18px);
    }

    .filters {
      display: flex;
      flex-direction: row;
      margin: $space 0 toRem(-26px);
      padding: 0 $space;
      width: 100%;

      .aph-date-picker {
        flex: 1;

        &:first-child {
          margin-right: $space;
        }
      }
    }
  }

  > .body {
    background: $background;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    padding: toRem(26px) $space $space;

    > .inner {
      background: white;
      border-radius: $border-radius;
      display: flex;
      flex-direction: column;
      flex: 1;
      margin-top: $space;
      overflow: hidden;

      .header {
        align-items: center;
        color: $dark;
        display: flex;
        flex-direction: row;
        flex: none;

        .tab {
          @include transition(all);

          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: $space;
          border-bottom: $border-width solid transparent;
          font-family: GilroyMedium;

          &.active {
            border-color: $purple;
            color: $purple;
          }
        }
      }

      .history {
        @extend %tile-grid-light;

        flex: 1;
        overflow: auto;
      }
    }
  }
}
</style>


