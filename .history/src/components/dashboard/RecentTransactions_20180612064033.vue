<template>
  <section id="dashboard--recent-transactions" :class="{'show-transaction-detail': transactionDetail}">
    <div class="header">
      <div class="title">Recent Transactions</div>
      <aph-portfolio-header></aph-portfolio-header>
    </div>
    <div class="body">
      <aph-simple-transactions :transactions="transactions" :on-click="showTransaction"></aph-simple-transactions>
    </div>
    <aph-transaction-detail :on-hide="hideTransactionDetail" :show="showTransactionDetail" :transaction="transactionDetail"></aph-transaction-detail>
  </section>
</template>

<script>
export default {
  beforeMount() {
    this.$store.dispatch('fetchRecentTransactions');
  },

  computed: {
    transactions() {
      return this.$store.state.recentTransactions
        .map((transaction) => {
          return _.merge(transaction, {
            address: transaction.value >= 0 ? transaction.from : transaction.to,
          });
        });
    },
  },

  data() {
    return {
      showTransactionDetail: false,
      transactionDetail: {},
    };
  },

  methods: {
    hideTransactionDetail() {
      this.showTransactionDetail = false;
    },

    showTransaction(transaction) {
      this.transactionDetail = transaction;
      this.showTransactionDetail = true;
    },
  },
};
</script>

<style lang="scss">
#dashboard--recent-transactions {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  > .header {
    align-items: center;
    display: flex;
    flex-direction: column;
    flex: none;
    padding: $space 0;

    .title {
      color: white;
      font-size: toRem(18px);
    }
  }

  > .body {
    background: $background;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    flex: 1;
    overflow: auto;
    padding: $space;

    .transactions-table {
      background: white;
      border-radius: $border-radius;
    }
  }
}
</style>

