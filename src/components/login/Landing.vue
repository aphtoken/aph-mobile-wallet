<template>
  <section id="login--landing">
    <aph-icon name="logo"></aph-icon>
    <div class="body">
      <div class="btn-group">
        <router-link to="/login/create-wallet" class="create-wallet-btn">Create wallet</router-link>
        <router-link to="/login/import" class="import-wallet-btn">Import wallet</router-link>
      </div>
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
#login--landing {
  display: flex;
  flex-direction: column;
  height: 100%;

  > .aph-icon {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    svg.logo {
      height: 30vh;
    }
  }

  .body {
    flex: 1;
    padding: 0 $space-lg;

    .btn-group {
      flex: none;
      width: 100%;
    }

    .create-wallet-btn,
    .import-wallet-btn {
      @extend %btn-outline;
    }

    .create-wallet-btn {
      margin-bottom: $space-lg;
    }
  }
}
</style>

