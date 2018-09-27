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
  flex-direction: column;
  flex: 1;
  
  .refine {
    background: $dark-purple;
    border-radius: $border-radius;
    flex: none;
    font-size: toRem(16px);
    margin-bottom: $space;
    padding: $space;
    text-align: center;
  }
}
</style>