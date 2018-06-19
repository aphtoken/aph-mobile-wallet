<template>
  <div id="app">
    <video loop muted autoplay>
      <source src="~@/assets/video/login.mp4" type="video/mp4">
    </video>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'aph-mobile-wallet',
};
</script>

<style lang="scss">
@import 'assets/scss/base';

#app {
  height: 100%;
  overflow: hidden;
  position: relative;

  video {
    bottom: 0;
    height: 100%;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
  }
}
</style>
