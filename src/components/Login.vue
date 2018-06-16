<template>
  <section id="login">
    <video loop muted autoplay>
      <source src="~@/assets/video/login.mp4" type="video/mp4">
    </video>
    <div class="wrapper">
      <router-view></router-view>
    </div>
  </section>
</template>

<style lang="scss">
#login {
  height: 100%;
  overflow: hidden;
  position: relative;

  video {
    bottom: 0;
    height: 100%;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
  }

  > .wrapper {
    height: 100%;
    position: relative;
  }
}
</style>

