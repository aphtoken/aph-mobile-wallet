<template>
  <section id="login--wallets">
    <div class="background">
      <img src="~@/assets/img/Blurred_Bg_Wallets.png">
    </div>
    <div class="header">
      <div class="back-btn" @click="goBack">
        <aph-icon name="arrow-left"></aph-icon>
      </div>
      <div class="title">
        <aph-icon name="word-mark"></aph-icon>
      </div>
    </div>
    <div class="body">
      <div class="help-text">Switch to another wallet</div>
      <div class="wallets">
        <div v-for="wallet in $store.state.wallets" :key="wallet.label" :class="['wallet', {active: isActive(wallet)}]" @click="switchTo(wallet)">
          <div class="label">{{ wallet.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  methods: {
    isActive({ label }) {
      const lastWallet = this.$services.wallets.getLastWallet();
      return lastWallet && lastWallet.label === label;
    },

    goBack() {
      this.$router.back();
    },

    switchTo(wallet) {
      this.$services.wallets.setLastWallet(wallet);

      this.$router.push('/login/saved');
    },
  },
};
</script>


<style lang="scss">
#login--wallets {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  z-index: 1;

  > .background {
    display: block;
    height: 100%;
    left: 0;
    opacity: .5;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: -1;

    img {
      width: 100%;
    }
  }

  > .header {
    display: flex;
    flex-direction: row;
    flex: none;
    justify-content: center;
    position: relative;

    .back-btn {
      left: $space;
      position: absolute;
      top: $space;

      svg {
        height: toRem(16px);

        .fill {
          fill: white;
        }
      }
    }

    .title {
      margin-top: $space;

      svg {
        height: toRem(16px);

        .fill {
          fill: white;
        }
      }
    }
  }

  .body {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 0 $space-lg;
    overflow: hidden;

    .help-text {
      flex: none;
      padding: $space-xxl 0 $space-xl;
      text-align: center;
      font-size: toRem(12px);
    }

    .wallets {
      flex: 1;
      overflow: scroll;

      .wallet {
        background: $dark;
        border-radius: $border-radius;
        border-left: $border-width-thick solid transparent;
        padding: $space;

        &.active {
          border-color: $purple;
        }

        & + .wallet {
          margin-top: $space;
        }
      }
    }
  }
}
</style>

