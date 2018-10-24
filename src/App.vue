<template>
  <div id="app">
    <router-view></router-view>
    <flash-message class="vue-flash-container"></flash-message>
    <div class="preload" v-images-loaded.on.done="onAllLoaded">
      <img src="~@/assets/img/Bg.png">
      <img src="~@/assets/img/Blurred_Bg.png">
      <img src="~@/assets/img/Blurred_Bg_Wallets.png">
    </div>
  </div>
</template>

<script>
import imagesLoaded from 'vue-images-loaded';

let fetchLatestVersionIntervalId;

export default {
  name: 'aph-mobile-wallet',

  beforeDestroy() {
    clearInterval(fetchLatestVersionIntervalId);
  },

  beforeMount() {
    this.fetchLatestVersion();
    fetchLatestVersionIntervalId = setInterval(() => {
      this.fetchLatestVersion();
    }, this.$constants.intervals.WALLET_VERSION_CHECK);
  },

  directives: {
    imagesLoaded,
  },

  methods: {
    fetchLatestVersion() {
      this.$store.dispatch('fetchLatestVersion');
    },
    
    onAllLoaded() {
      this.$router.push('/login');
    },
  },
};
</script>

<style lang="scss">
@import 'assets/scss/base';

#app {
  height: 100%;
  overflow: hidden;
  position: relative;

  .preload {
    height: 0;
    overflow: hidden;
    visibility: hidden;
    width: 0;
  }
}
</style>
