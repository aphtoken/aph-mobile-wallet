<template>
  <section id="dex--orders-tabs">
    <div class="my-orders">
      My orders
    </div>
    <div class="order-book">
      Order book
    </div>
    <div class="trade-history">
      Trade history
    </div>
  </section>
</template>

<script>
  
export default {
  components: {
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
#dex--orders-tabs {
  display: flex;
  flex: none;
  flex-direction: row;
  margin: $space $space 0;
  overflow: scroll;
  white-space: nowrap;

  > div {
    padding: $space;
    background-color: $dark-purple;
    font-size: toRem(16px);
    margin: 0 $space;
    border-radius: $border-radius;


    &:first-child, &:last-child {
      margin: 0;
    }
  }
}
</style>