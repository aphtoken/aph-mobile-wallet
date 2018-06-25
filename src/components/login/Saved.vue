<template>
  <section id="login--saved">
    <div class="header">
      <div class="title">
        <aph-icon name="word-mark"></aph-icon>
      </div>
      <div class="wallet-name">{{ this.wallet.label }}</div>
      <aph-icon name="lock"></aph-icon>
    </div>
    <div class="body">
      <login-form-wrapper identifier="openSavedWallet">
        <aph-input placeholder="Passphrase" v-model="passphrase" type="password"></aph-input>
        <button class="login-btn" @click="login" :disabled="shouldDisableLButton">{{ buttonLabel }}</button>
      </login-form-wrapper>
      <router-link class="switch-btn" to="/login/landing">Switch</router-link>
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
      return this.$isPending('openSavedWallet') ? 'Logging in...' : 'Login';
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
  background: url('~@/assets/img/Bg.png') no-repeat center center fixed;
  background-size: cover;
  display: flex;
  flex-direction: column;
  height: 100%;
  z-index: 100;

  > .header {
    align-items: center;
    display: flex;
    flex-direction: column;
    flex: none;
    padding: $space-xl 0;

    .title {
      svg.word-mark {
        height: toRem(16px);

        .fill {
          fill: white;
        }
      }
    }

    .wallet-name {
      margin: $space-lg 0;
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
    flex: 2;
    padding: 0 $space-lg;

    .login-btn {
      @extend %btn-outline;

      margin-top: $space-lg;
    }

    .switch-btn {
      display: block;
      margin-top: $space-lg;
      text-align: center;
    }
  }
}
</style>

