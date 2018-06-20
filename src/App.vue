<template>
  <div id="app">
    <video loop muted autoplay ref="video" :class="{show: showVideo}">
      <source src="~@/assets/video/login.mp4" type="video/mp4">
    </video>
    <router-view></router-view>
  </div>
</template>

<script>
const MINIMUM_TIME_BEFORE_FORWARD = 4000;
let startTime;

export default {
  name: 'aph-mobile-wallet',

  data() {
    return {
      showVideo: false,
    };
  },

  methods: {
    handleOnVideoCanPlay() {
      const now = moment().format('x');
      const loadTime = now - startTime;

      setTimeout(() => {
        this.showVideo = true;
        this.$router.replace('/login');
      }, MINIMUM_TIME_BEFORE_FORWARD - loadTime);
    },

    setIntroFowardTimeout() {
      startTime = moment().format('x');

      this.$refs.video.oncanplay = this.handleOnVideoCanPlay.bind(this);
    },
  },

  mounted() {
    if(this.$route.name === 'intro') {
      this.setIntroFowardTimeout();
    }
  },
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
    visibility: hidden;

    &.show {
      visibility: visible;
    }
  }
}
</style>
