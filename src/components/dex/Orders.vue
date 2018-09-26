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
    OrdersTabs,
    MyOrders,
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
  flex: 1;
  flex-direction: column;
  
  .body {
    margin: 0 $space $space;
    display: flex;
    flex: 1;
    flex-direction: column;
  }
}
</style>