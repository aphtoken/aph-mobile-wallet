<template>
  <section id="intro">
    <aph-icon name="logo-mark"></aph-icon>
  </section>
</template>

<script>
const FORWARD_TIMEOUT = 2000;

export default {
  mounted() {
    setTimeout(() => {
      this.$router.replace('/login');
    }, FORWARD_TIMEOUT);
  },
};
</script>

<style lang="scss">
#intro {
  align-items: center;
  background: $dark;
  display: flex;
  height: 100%;
  justify-content: center;

  > .aph-icon {
    svg.logo-mark {
      height: 30vh;
    }
  }
}
</style>

