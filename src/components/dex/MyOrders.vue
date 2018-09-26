<template>
  <section id="dex--my-orders">
    <div class="refine">
      Refine
    </div>
    <orders-table></orders-table>
  </section>
</template>

<script>

import OrdersTable from './OrdersTable';
  
export default {
  components: {
    OrdersTable,
  },

  computed: {
  },

  data() {
    return {
    };
  },

  methods: {
  },

  mounted() {
  },

  watch: {
  },
};

</script>

<style lang="scss">
#dex--my-orders {
  background: $dark-purple*1.25;
  display: flex;
  flex: 1;
  flex-direction: column;
  
  .refine {
    background: $dark-purple;
    font-size: toRem(16px);
    flex: none;
    padding: $space;
    text-align: center;
    border-radius: $border-radius;
    margin-bottom: $space;
  }
}
</style>