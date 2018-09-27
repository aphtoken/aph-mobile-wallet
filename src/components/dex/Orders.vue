<template>
  <section id="dex--orders">
    <orders-tabs v-bind="{ selectedTab }" v-on:updateSelectedTab="handleTabUpdate"></orders-tabs>
    <div class="body">
      <my-orders v-if="selectedTab === 'my-orders'"></my-orders>
    </div>
  </section>
</template>

<script>

import OrdersTabs from './OrdersTabs';
import MyOrders from './MyOrders';

const MY_ORDERS = 'my-orders';
const ORDER_BOOK = 'order-book';
const TRADE_HISTORY = 'trade-history';
  
export default {
  components: {
    MyOrders,
    OrdersTabs,
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
    }
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