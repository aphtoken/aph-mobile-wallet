<template>
  <section id="dex--market-selector">
    <div :class="['currency', {active: baseCurrency === currency}]" @click="baseCurrency = currency"
      v-for="currency in baseCurrencies" :key="currency">
      {{ currency }}
    </div>
    <div>
      Favourites
    </div>
  </section>
</template>

<script>
export default {
  computed: {
    baseCurrencies() {
      return _.uniq(_.map(this.$store.state.markets, 'baseCurrency'));
    },
  },

  data() {
    return {
      baseCurrency: '',
    };
  },

  mounted() {
    this.baseCurrency = _.first(this.baseCurrencies);
  },
};
</script>

<style lang="scss">
#dex--market-selector {
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;

  > div {
    background: $dark-purple;
    padding: $space;
    border-radius: $border-radius;
    font-size: toRem(16px);

    &.active {
      background: $purple;
    }
  }
}
</style>
