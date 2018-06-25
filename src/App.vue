<template>
  <div id="app">
    <router-view></router-view>
    <flash-message class="vue-flash-container"></flash-message>
  </div>
</template>

<script>
const TIME_BEFORE_FORWARD = 3000;

export default {
  name: 'aph-mobile-wallet',

  mounted() {
      setTimeout(() => {
        this.$router.push('/login');
      },TIME_BEFORE_FORWARD);
  },
};
</script>

<style lang="scss">
@import 'assets/scss/base';

#app {
  height: 100%;
  overflow: hidden;
  position: relative;
}
</style>
