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
  margin-top: $space;

  > .currency {
    @extend %btn;

    border-color: transparent;
    border-radius: 0;
    flex: 1;
    width: auto;

    &:not(.active) {
      background-color: $dark-purple;
      border-color: $dark-purple;
    }

    & + button {
      border-left: none;
    }

    &:first-child {
      border-bottom-left-radius: $border-radius;
      border-top-left-radius: $border-radius;
    }

    &:last-child {
      border-bottom-right-radius: $border-radius;
      border-top-right-radius: $border-radius;
    }

    @include lowRes() {
      font-size: toRem(12px);
    }
  }
}
</style>
