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
        { key: 'my-orders', label: 'My orders' },
        { key: 'order-book', label: 'Order book' },
        { key: 'trade-history', label: 'Trade history' },
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
  // margin: $space $space 0;
  overflow: scroll;
  white-space: nowrap;

  > .btn {
    @extend %btn-outline;

    flex: none;
    width: percentage(2/5);

    &.active {
      @extend %btn;

      width: percentage(2/5);
    }

    & + .btn {
      margin-left: $space;
    }
  }
}
</style>
