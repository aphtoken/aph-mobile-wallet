<template>
  <section id="create-wallet">
    <div class="header">
      <router-link to="/landing">
        <aph-icon name="arrow-left"></aph-icon>
      </router-link>
    </div>
  </section>
</template>

<script>
export default {
};
</script>

<style lang="scss">
#create-wallet {
  display: flex;
  flex-direction: column;

  .header {
    flex: none;
    padding: $space-lg;

    .aph-icon {
      .back {
        height: toRem(20px);
      }
    }
  }
}
</style>

