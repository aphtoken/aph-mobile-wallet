<template>
  <section id="login--create-wallet">
    <div class="background">
      <img src="~@/assets/img/Blurred_Bg.png">
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
    <login-form-wrapper identifier="createWallet">
      <div class="help-text">Choose a name for your wallet.</div>
      <aph-input v-model="walletName" placeholder="Wallet name"></aph-input>
      <div class="help-text">You will use this passphrase to unlock your wallet.</div>
      <aph-input v-model="passphrase" placeholder="Passphrase" type="password"></aph-input>
      <aph-input v-model="passphraseConfirm" placeholder="Confirm passphrase" type="password"></aph-input>
      <button class="create-wallet-btn" @click="create" :disabled="shouldDisableCreateButton">{{ buttonLabel }}</button>
    </login-form-wrapper>
    </div>
  </section>
</template>

<script>
import LoginFormWrapper from './LoginFormWrapper';

export default {
  components: {
    LoginFormWrapper,
  },

  computed: {
    buttonLabel() {
      return this.$isPending('createWallet') ? 'Creating...' : 'Create Wallet';
    },

    passphrasesMatch() {
      return this.passphrase === this.passphraseConfirm;
    },

    shouldDisableCreateButton() {
      return this.$isPending('createWallet') || this.passphrase.length === 0
        || this.walletName.length === 0 || !this.passphrasesMatch;
    },
  },

  data() {
    return {
      passphrase: '',
      passphraseConfirm: '',
      walletName: '',
    };
  },

  methods: {
    create() {
      this.$store.dispatch('createWallet', {
        name: this.walletName,
        passphrase: this.passphrase,
        passphraseConfirm: this.passphraseConfirm,
      });
    },

    goBack() {
      this.$router.back();
    },
  },
};
</script>

<style lang="scss">
#login--create-wallet {
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
    flex: 1;
    padding: 0 $space-lg;

    .help-text {
      font-size: toRem(12px);
      line-height: $copy-line-height;
      padding: $space-xl $space-lg;
      text-align: center;
    }

    .aph-input + .aph-input {
      margin-top: $space;
    }

    .create-wallet-btn {
      @extend %btn-outline;

      margin-top: $space-xl;
    }
  }
}
</style>

