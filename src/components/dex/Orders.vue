<template>
  <section id="dex--orders">
    <orders-tabs v-bind="{ selectedTab }" v-on:updateSelectedTab="handleTabUpdate"></orders-tabs>
    <div class="body">
      <my-orders v-if="selectedTab === 'my-orders'"></my-orders>
      <order-book v-if="selectedTab === 'order-book'"></order-book>
      <trade-history v-if="selectedTab === 'trade-history'"></trade-history>
    </div>
  </section>
</template>

<script>

import OrdersTabs from './OrdersTabs';
import MyOrders from './MyOrders';
import OrderBook from './OrderBook';
import TradeHistory from './TradeHistory';

const MY_ORDERS = 'my-orders';

export default {
  components: {
    MyOrders,
    OrdersTabs,
    OrderBook,
    TradeHistory,
  },

  computed: {
  },

  data() {
    return {
      selectedTab: MY_ORDERS,
    };
  },

  methods: {
    handleTabUpdate(tab) {
      this.selectedTab = tab;
    },
  },

  mounted() {
  },

  watch: {
  },
};

</script>

<style lang="scss">
#dex--orders {
  background: $dark-purple*1.25;
  display: flex;
  flex-direction: column;
  flex: 1;

  .body {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin: 0 $space $space;
  }
}
</style>
