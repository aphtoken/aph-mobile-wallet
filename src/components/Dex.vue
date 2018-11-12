<template>
  <section id="dex">
    <div class="background">
      <img src="~@/assets/img/Blurred_Bg_Wallets.png">
    </div>
    <div class="header">
      <div class="title">
        {{ currentTab }} ({{ currentMarketName }})
      </div>
    </div>
    <div class="body">
      <router-view></router-view>
    </div>
    <div class="footer">
      <router-link v-for="tab in tabs" :key="tab" :to="`/authenticated/dex/${tab}`">
        <div @click="setTab">
          {{ tab }}
        </div>
      </router-link>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import assets from '../services/assets';

export default {
  beforeDestroy() {
    this.$store.commit('setShowPortfolioHeader', true);
    clearInterval(this.connectionStatusInterval);
    clearInterval(this.marketsRefreshInterval);
    clearInterval(this.completeSystemAssetWithdrawalsInterval);
    clearInterval(this.tickerRefreshInterval);
  },

  data() {
    return {
      connected: false,
      currentTab: 'Pairs',
      tabs: ['pair', 'trade', 'orders', 'charts'],
    };
  },

  mounted() {
    const services = this.$services;
    const store = this.$store;

    this.$store.commit('setShowPortfolioHeader', false);
    this.loadMarkets();
    this.loadTickerData();
    this.$services.dex.completeSystemAssetWithdrawals();

    this.$store.commit('setSocketOrderCreated', (message) => {
      /* eslint-disable max-len */
      this.$services.alerts.success(`${(message.side === 'bid' ? 'Buy' : 'Sell')} Order Created. x${message.data.quantity} @${message.data.price}`);
      this.$store.dispatch('fetchHoldings');
      // resetSystemAssetBalanceCache is disabled for some reason.
      // this.$services.neo.resetSystemAssetBalanceCache();
    });

    this.$store.commit('setSocketOrderMatched', (message) => {
      /* eslint-disable max-len */
      services.alerts.success(`${(message.side === 'bid' ? 'Buy' : 'Sell')} Order Filled. x${message.data.quantity} @${message.data.price}`);
      // If the asset purchased is not a user asset, we must add it as one.
      // Note: Since this runs from a mutation it is safe to add it directly)

      const market = _.find(store.state.markets, { marketName: message.pair });

      const userAssets = assets.getUserAssets();
      let addedToken = false;
      if (!_.has(userAssets, market.baseAssetId)) {
        store.dispatch('addToken', {
          hashOrSymbol: market.baseAssetId,
        });
        addedToken = true;
      }
      if (!_.has(userAssets, market.quoteAssetId)) {
        store.dispatch('addToken', {
          hashOrSymbol: market.quoteAssetId,
        });
        addedToken = true;
      }

      if (!addedToken) {
        this.$store.dispatch('fetchHoldings');
      }
      // this.$services.neo.resetSystemAssetBalanceCache();
    });

    this.$store.commit('setSocketOrderCreationFailed', (message) => {
      services.alerts.error(`Failed to Create ${(message.side === 'bid' ? 'Buy' : 'Sell')} Order. ${message.data.errorMessage}`);
      // services.neo.resetSystemAssetBalanceCache();
    });

    this.$store.commit('setSocketOrderMatchFailed', (message) => {
      services.alerts.error(`Failed to Match ${(message.side === 'bid' ? 'Buy' : 'Sell')} x${message.data.quantity}. ${message.data.errorMessage}`);
      // services.neo.resetSystemAssetBalanceCache();
    });


    this.loadTrades();
    this.$services.neo.promptGASFractureIfNecessary();
  },

  created() {
    this.setConnected();

    this.connectionStatusInterval = setInterval(() => {
      this.setConnected();
    }, 1000);

    this.marketsRefreshInterval = setInterval(() => {
      this.loadMarkets();
    }, this.$constants.intervals.MARKETS_POLLING);

    this.completeSystemAssetWithdrawalsInterval = setInterval(() => {
      this.$services.dex.completeSystemAssetWithdrawals();
    }, this.$constants.intervals.COMPLETE_SYSTEM_WITHDRAWALS);

    this.tickerRefreshInterval = setInterval(() => {
      this.loadTickerData();
    }, this.$constants.intervals.TICKER_POLLING);
  },

  computed: {
    ...mapGetters([
      'currentMarketName',
      'currentMarket',
    ]),
  },

  methods: {
    setConnected() {
      if (!this.$store.state.socket || this.$store.state.socket.isConnected !== true) {
        if (moment().utc().diff(this.$store.state.socket.connectionClosed, 'milliseconds')
          > this.$constants.timeouts.WEBSOCKET_CONNECTION) {
          this.connected = false;
          return;
        }
      }

      if (this.$store.state.currentMarket) {
        if (!this.$store.state.socket.subscribedMarket
          || this.$store.state.socket.subscribedMarket !== this.$store.state.currentMarket.marketName) {
          this.$store.dispatch('subscribeToMarket', {
            market: this.$store.state.currentMarket,
          });
        }
      }

      this.connected = true;
    },

    loadMarkets() {
      this.$store.dispatch('fetchMarkets');
    },

    loadTickerData() {
      this.$store.dispatch('fetchTickerData');
    },

    loadTrades() {
      if (!this.$store.state.currentMarket) {
        return;
      }

      this.$store.dispatch('fetchTradeHistory', {
        marketName: this.$store.state.currentMarket.marketName,
      });
    },

    setTab(event) {
      this.currentTab = event.target.innerText;
    },
  },
  watch: {
    currentMarket() {
      this.loadTrades();
    },
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
      text-transform: capitalize;
    }
  }

  > .body {
    background: lighten($dark-purple, 4%);
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
    padding: $space;
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

      div {
        text-transform: capitalize;
      }

      &.router-link-active {
        border-bottom-color: $purple;

      }
    }
  }
}
</style>
