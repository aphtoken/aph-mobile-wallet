<template>
  <section id="login--create-wallet">
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
      <aph-input v-model="walletName" placeholder="Wallet name"></aph-input>
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
      return this.$isPending('createWallet') ? 'Creating...' : 'Create';
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

  > .header {
    display: flex;
    flex-direction: row;
    flex: 1;
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
    flex: 2;
    padding: 0 $space-lg;

    .aph-input + .aph-input {
      margin-top: $space;
    }

    .create-wallet-btn {
      @extend %btn-outline;

      margin-top: $space-lg;
    }
  }
}
</style>

