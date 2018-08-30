<template>
  <section id="login--saved">
    <div class="background">
      <img src="~@/assets/img/Bg.png">
    </div>
    <div class="header">
      <div class="title">
        <aph-icon name="word-mark"></aph-icon>
      </div>
      <div class="wallet-name">{{ this.wallet.label }}</div>
      <aph-icon name="lock"></aph-icon>
    </div>
    <div class="body">
      <login-form-wrapper identifier="openSavedWallet">
        <aph-input :placeholder="$t('Passphrase')" v-model="passphrase" type="password"></aph-input>
        <button class="login-btn" @click="login" :disabled="shouldDisableLButton">{{ buttonLabel }}</button>
      </login-form-wrapper>
      <router-link class="switch-btn" to="/login/landing">{{ $t('Switch') }}</router-link>
    </div>
  </section>
</template>

<script>
import LoginFormWrapper from './LoginFormWrapper';

export default {
  beforeMount() {
    this.wallet = this.$services.wallets.getLastWallet();

    if (!this.wallet) {
      return this.$router.replace('/login');
    }
    return true;
  },

  components: {
    LoginFormWrapper,
  },

  computed: {
    buttonLabel() {
      return this.$isPending('openSavedWallet') ? this.$t('loggingIn') : this.$t('Login');
    },

    shouldDisableLButton() {
      return this.$isPending('openSavedWallet') || this.passphrase.length === 0;
    },
  },

  data() {
    return {
      passphrase: '',
      wallet: {},
    };
  },

  methods: {
    goBack() {
      this.$router.back();
    },

    login() {
      this.$store.dispatch('openSavedWallet', {
        walletToOpen: this.wallet,
        passphrase: this.passphrase,
        done: () => {
          this.$router.push('/authenticated/dashboard');
        },
      });
    },
  },
};
</script>


<style lang="scss">
#login--saved {
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
    align-items: center;
    display: flex;
    flex-direction: column;
    flex: none;
    padding: $space-xl 0 $space-xxl;

    .title {
      svg.word-mark {
        height: toRem(16px);

        .fill {
          fill: white;
        }
      }
    }

    .wallet-name {
      padding: $space-xl 0;
    }

    .aph-icon {
      svg.lock {
        height: toRem(50px);

        .fill {
          fill: $purple;
        }
      }
    }
  }

  .body {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    padding: 0 $space-lg;

    .login-btn {
      @extend %btn-outline;

      margin-top: $space-xl;
    }

    .switch-btn {
      display: block;
      margin-top: $space-lg;
      text-align: center;
    }
  }
}
</style>

