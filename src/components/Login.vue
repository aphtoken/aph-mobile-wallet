<template>
  <section id="login">
    <div class="wrapper">
      <router-view></router-view>
    </div>
  </section>
</template>

<script>
export default {
  beforeMount() {
    if (this.$services.wallets.getLastWallet()) {
      this.$router.replace('/login/saved');
    }
  },
};
</script>


<style lang="scss">
#login {
  background-color: rgba($dark, .4);
  height: 100%;
  overflow: hidden;
  position: relative;

  > .wrapper {
    height: 100%;
    position: relative;
  }
}
</style>

