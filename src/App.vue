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
import imagesLoaded from 'vue-images-loaded'

export default {
  name: 'aph-mobile-wallet',

  directives: {
      imagesLoaded,
  },

  methods: {
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
