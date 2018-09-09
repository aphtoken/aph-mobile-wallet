<template>
  <section id="dex">
    <div class="background">
      <img src="~@/assets/img/Blurred_Bg_Wallets.png">
    </div>
    <div class="header">
      <div class="title">
        {{ currentTab }}
      </div>
    </div>
    <router-view></router-view>
    <div class="footer">
      <router-link to="/authenticated/dex/pair">
        <div @click="setTab">
          Pair
        </div>
      </router-link>
      <router-link to="/authenticated/dex/trade">
        <div @click="setTab">
          Trade
        </div>
      </router-link>
      <router-link to="/authenticated/dex/orders">
        <div @click="setTab">
          Orders
        </div>
      </router-link>
      <router-link to="/authenticated/dex/charts">
        <div @click="setTab">
          Charts
        </div>
      </router-link>
    </div>
  </section>
</template>

<script>
export default {
  mounted() {
    this.loadMarkets();
  },

  computed: {
    //
  },

  data() {
    return {
      currentTab: 'Pair',
    };
  },

  methods: {
    loadMarkets() {
      this.$store.dispatch('fetchMarkets', {
        done: () => {
          if (!this.$store.state.currentMarket) {
            this.$store.commit('setCurrentMarket', this.$store.state.markets[0]);
          }
        },
      });
    },

    setTab(event) {
      this.currentTab = event.target.innerText;
    },
  },

  watch: {
    //
  },
};
</script>

<style lang="scss">
#dex {
  display: flex;
  flex-direction: column;
  height: 100%;

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
    padding: $space;

     .title {
      color: white;
      font-size: toRem(18px);
    }
  }

  > .footer {
    background: $dark-purple;
    display: flex;
    flex: none;

    > a {
      align-items: center;
      border-bottom: $border-width solid transparent;
      border-top: $border-width solid transparent;
      color: white;
      display: flex;
      flex-direction: column;
      flex: 1;
      height: toRem(60px);
      justify-content: center;  

      &.router-link-active {
        border-bottom-color: $purple;
      }
    }
  }
}
</style>
