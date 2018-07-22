<template>
  <section id="dashboard--recent-transactions">
    <div class="background">
      <img src="~@/assets/img/Blurred_Bg_Wallets.png">
    </div>
    <div class="header">
      <div class="title">{{$t('recentTransactions')}}</div>
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
  position: relative;
  z-index: 1;

  > .background {
    display: block;
    height: 100%;
    left: 0;
    opacity: .5;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: -1;

    img {
      width: 100%;
    }
  }

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

