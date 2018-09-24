<template>
  <section id="login--landing">
    <div class="background">
      <img src="~@/assets/img/Bg.png">
    </div>
    <div class="header">
      <aph-icon name="word-mark"></aph-icon>
      <div class="version">v{{ $store.state.version }}</div>
    </div>
    <div class="body">
      <div class="btn-group">
        <router-link to="/login/create-wallet" class="create-wallet-btn">{{ $t('createWallet') }}</router-link>
        <router-link to="/login/import" class="import-wallet-btn">{{ $t('importWallet') }}</router-link>
        <router-link to="/login/wallets" class="wallets-btn" v-if="$store.state.wallets.length">{{ $t('wallets') }}</router-link>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
#login--landing {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  z-index: 1;

  > .background {
    display: block;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: -1;

    img {
      width: 100%;
    }
  }

  .header {
    align-items: center;
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;

    > .aph-icon {
      svg.word-mark {
        height: 5vw;
      }
    }

    > .version {
      margin-top: $space-lg;
      text-transform: uppercase;
      font-size: toRem(12px);
    }
  }

  .body {
    flex: none;
    padding: 0 $space-lg $space-lg;

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

