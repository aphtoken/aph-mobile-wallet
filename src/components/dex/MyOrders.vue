<template>
  <section id="dex--my-orders">
    <orders-table></orders-table>
  </section>
</template>

<script>
import OrdersTable from './OrdersTable';

export default {
  components: {
    OrdersTable,
  },
};

</script>

<style lang="scss">
#dex--my-orders {
  display: flex;
  flex-direction: column;
  flex: 1;

  .aph-simple-table .error-message {
    margin-top: $space;
  }
}
</style>
