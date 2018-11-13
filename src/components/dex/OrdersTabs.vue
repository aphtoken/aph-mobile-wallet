<template>
  <section id="dex--orders-tabs">
    <button v-for="option in tabOptions"
      :class="['btn', option.key, { active: selectedTab === option.key }]"
      @click="$emit('updateSelectedTab', option.key)">
      {{ option.label }}
    </button>
  </section>
</template>

<script>

export default {
  data() {
    return {
      tabOptions: [
        { key: 'my-orders', label: 'My Orders' },
        { key: 'order-book', label: 'Order Book' },
        { key: 'trade-history', label: 'History' },
      ],
    };
  },

  props: {
    selectedTab: {
      default: '',
      type: String,
    },
  },
};

</script>

<style lang="scss">
#dex--orders-tabs {
  display: flex;
  flex-direction: row;
  flex: none;
  overflow: scroll;
  white-space: nowrap;

  > .btn {
    @extend %btn-outline;

    border-radius: 0;
    flex: 1;
    width: auto;

    &.active {
      @extend %btn;

      border-radius: 0;
      width: auto;
    }

    & + .btn {
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
