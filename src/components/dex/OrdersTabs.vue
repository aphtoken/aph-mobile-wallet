<template>
  <section id="dex--orders-tabs">
    <div v-for="option in tabOptions"
      :class="[option.key, { active: selectedTab === option.key }]"
      @click="$emit('updateSelectedTab', option.key)">
      {{ option.label }}
    </div>
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
  margin: $space $space 0;
  overflow: scroll;
  white-space: nowrap;

  > div {
    background-color: $dark-purple;
    border-radius: $border-radius;
    font-size: toRem(16px);
    margin: 0 $space;
    padding: $space;

    &:first-child, &:last-child {
      margin: 0;
    }

    &.active {
      background-color: $purple;
    }
  }
}
</style>
