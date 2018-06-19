<template>
  <div class="tile transaction-history">
    <div class="inner">
      <div class="header">
        <div :class="['tab', {active: activeTransactionHistoryTab === 'sent'}]" @click="activeTransactionHistoryTab = 'sent'">Sent</div>
        <div :class="['tab', {active: activeTransactionHistoryTab === 'received'}]" @click="activeTransactionHistoryTab = 'received'">Received</div>
      </div>
      <div class="body">
        <div class="sent" v-if="activeTransactionHistoryTab === 'sent'">
          <aph-simple-transactions :transactions="sent" :on-click="showTransaction"></aph-simple-transactions>
        </div>
        <div class="received" v-if="activeTransactionHistoryTab === 'received'">
          <aph-simple-transactions :transactions="received" :on-click="showTransaction"></aph-simple-transactions>
        </div>
      </div>
    </div>
    <aph-transaction-detail :on-hide="hideTransactionDetail" :show="showTransactionDetail" :transaction="transactionDetail"></aph-transaction-detail>
  </div>
</template>

<script>
export default {
  computed: {
    received() {
      return this.$store.state.recentTransactions.filter(({ value, symbol }) => {
        return value > 0 && this.symbol === symbol;
      });
    },

    sent() {
      return this.$store.state.recentTransactions.filter(({ value, symbol }) => {
        return value < 0 && this.symbol === symbol;
      });
    },
  },

  data() {
    return {
      activeTransactionHistoryTab: 'sent',
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

