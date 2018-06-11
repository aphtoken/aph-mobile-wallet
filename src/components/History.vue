<template>
  <section id="history">
    <div class="header">
      <div class="title">History</div>
      <div class="filters">
        <aph-date-picker></aph-date-picker>
        <aph-date-picker></aph-date-picker>
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
  computed: {
    received() {
      return this.transactions.filter(({ amount }) => amount > 0);
    },

    sent() {
      return this.transactions.filter(({ amount }) => amount < 0);
    },
  },

  data() {
    return {
      activeTab: 'all',
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
      margin: $space-lg 0 toRem(-26px);
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
    padding: toRem(25px) $space $space;

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


