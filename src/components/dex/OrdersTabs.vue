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
  components: {
  },

  computed: {
  },

  data() {
    return {
      tabOptions: [
        {key: 'my-orders', label: 'My orders'}
      ,
        {key: 'order-book', label: 'Order book'}
      ,
        {key: 'trade-history', label: 'Trade history'}
      ],
    };
  },

  methods: {
  },

  mounted() {
  },

  props: {
    selectedTab: {
      default: '',
      type: String,
    },
  },

  watch: {
  },
};

</script>

<style lang="scss">
#dex--orders-tabs {
  display: flex;
  flex: none;
  flex-direction: row;
  margin: $space $space 0;
  overflow: scroll;
  white-space: nowrap;

  > div {
    padding: $space;
    background-color: $dark-purple;
    font-size: toRem(16px);
    margin: 0 $space;
    border-radius: $border-radius;

    &:first-child, &:last-child {
      margin: 0;
    }

    &.active {
      background-color: $purple;
    }
  }
}
</style>