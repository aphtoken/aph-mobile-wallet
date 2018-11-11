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

    flex: none;
    padding: 0 $space-lg;
    width: auto;

    &.active {
      @extend %btn;

      padding: 0 $space-lg;
      width: auto;
    }

    & + .btn {
      margin-left: $space;
      padding: 0 $space;
    }
  }
}
</style>
