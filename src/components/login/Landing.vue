<template>
  <section id="login--landing">
    <aph-icon name="logo"></aph-icon>
    <div class="body">
      <div class="btn-group">
        <router-link to="/login/create-wallet" class="create-wallet-btn">Create wallet</router-link>
        <router-link to="/login/import" class="import-wallet-btn">Import wallet</router-link>
        <router-link to="/login/wallets" class="wallets-btn">Wallets</router-link>
      </div>
    </div>
  </section>
</template>

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

    .wallets-btn {
      display: block;
      margin-top: $space-lg;
      text-align: center;
    }
  }
}
</style>

