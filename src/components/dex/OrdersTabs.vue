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
  margin-bottom: $space;
  overflow: scroll;
  white-space: nowrap;

  > .btn {
    @extend %btn;

    border-color: transparent;
    border-radius: 0;
    flex: 1;
    width: auto;

    &:not(.active) {
      background-color: $dark-purple;
      border-color: $dark-purple;
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
