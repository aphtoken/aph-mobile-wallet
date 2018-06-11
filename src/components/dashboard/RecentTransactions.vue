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
  data() {
    return {
      showTransactionDetail: false,
      transactionDetail: {},
      transactions: [
        {
          address: 'adfg3asdfaw4rasdvq4asdfasdfasd34rafsdf',
          amount: 34.56,
          block_time: 1516356847,
          symbol: 'APH',
          txid: 'adfg3asdfaw4rasdvq4asdfasdfasd34rafsdf',
        },
        {
          address: '345dafgasdfaw4rasdvq4asdfasdfasd34rafsdf',
          amount: 4432.56,
          block_time: 1516356847,
          symbol: 'NEO',
          txid: '345dafgasdfaw4rasdvq4asdfasdfasd34rafsdf',
        },
        {
          address: 'cvbe5tadfasdfaw4rasdvq4asdfasdfasd34rafsdf',
          amount: -12.56,
          block_time: 1516356847,
          symbol: 'APH',
          txid: 'cvbe5tadfasdfaw4rasdvq4asdfasdfasd34rafsdf',
        },
        {
          address: 'sadfasf4asdfaw4rasdvq4asdfasdfasd34rafsdf',
          amount: -453.56,
          block_time: 1516356847,
          symbol: 'NEO',
          txid: 'sadfasf4asdfaw4rasdvq4asdfasdfasd34rafsdf',
        },
      ],
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

