<template>
  <section id="login">
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

  > .wrapper {
    height: 100%;
    position: relative;
  }
}
</style>

