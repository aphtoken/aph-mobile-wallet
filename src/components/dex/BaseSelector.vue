<template>
  <section id="dex--base-selector">
    <button :class="['currency', {active: value === currency}]" @click="$emit('input', currency)" v-for="currency in baseCurrencies" :key="currency">
      {{ currency }}
    </button>
  </section>
</template>

<script>
export default {
  props: {
    baseCurrencies: {
      default: [],
      type: Array,
    },
    value: {
      default: '',
      type: String,
    },
  },
};
</script>

<style lang="scss">
#dex--base-selector {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin: 0 $space;

  > .currency {
    @extend %btn-outline;

    flex: 1;

    &.active {
      @extend %btn;
    }

    & + .currency {
      margin-left: $space;
    }
  }
}
</style>
