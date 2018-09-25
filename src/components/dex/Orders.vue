<template>
  <section id="dex--orders">
    <orders-tabs></orders-tabs>
    <div class="body">
      REFINE
      <div>
        Open/Completed Chart
      </div>
    </div>
  </section>
</template>

<script>

import OrdersTabs from './OrdersTabs';
  
export default {
  components: {
    OrdersTabs,
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
#dex--orders {
  background: $dark-purple*1.25;
  display: flex;
  flex: 1;
  flex-direction: column;
  
  .body {
    margin: $space;
    display: flex;
    flex: 1;
    flex-direction: column;
  }
}
</style>