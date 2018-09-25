<template>
  <section id="dex--base-selector">
    <div :class="['currency', {active: value === currency}]" @click="$emit('input', currency)"
      v-for="currency in baseCurrencies" :key="currency">{{ currency }}</div>
    <div>
      Favourites
    </div>
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
  justify-content: space-around;

  > div {
    background: $dark-purple;
    border-radius: $border-radius;
    font-size: toRem(16px);
    padding: $space;

    &.active {
      background: $purple;
    }
  }
}
</style>
