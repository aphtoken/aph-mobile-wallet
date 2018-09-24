<template>
  <section id="dashboard--holdings">
    <div class="background">
      <img src="~@/assets/img/Blurred_Bg_Wallets.png">
    </div>
    <div class="header">
      <div class="title">{{ $t('myHoldings') }}</div>
      <aph-portfolio-header></aph-portfolio-header>
    </div>
    <div class="body">
      <aph-holding :holding="holding" v-for="(holding, index) in holdings" :key="index" :on-click="viewTokenStats"></aph-holding>
    </div>
  </section>
</template>

<script>
export default {
  computed: {
    holdings() {
      return this.$store.state.holdings.filter(({ name, symbol }) => {
        return !!name && !!symbol;
      });
    },
  },

  data() {
    return {
      //
    };
  },

  methods: {
    viewTokenStats(holding) {
      this.$store.commit('setStatsToken', holding);
      this.$router.push(`/authenticated/dashboard/token-stats/${holding.symbol}`);
    },
  },
};
</script>

<style lang="scss">
#dashboard--holdings {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
  z-index: 1;

  > .background {
    display: block;
    height: 100%;
    left: 0;
    opacity: .5;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: -1;

    img {
      width: 100%;
    }
  }

  > .header {
    align-items: center;
    display: flex;
    flex-direction: column;
    flex: none;
    padding: $space 0;

    .title {
      color: white;
      font-size: toRem(18px);
    }
  }

  > .body {
    background: $background;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    flex: 1;
    overflow: auto;
    padding: $space;

    .holding + .holding {
      margin-top: $space;
    }
  }
}
</style>

