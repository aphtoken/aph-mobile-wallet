<template>
  <section id="login--import">
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
      <login-form-wrapper identifier="importWallet">
        <aph-input placeholder="Name" v-model="walletName"></aph-input>
        <aph-input placeholder="Private key" v-model="wif"></aph-input>
        <aph-input placeholder="Passphrase" v-model="passphrase" type="password"></aph-input>
        <aph-input placeholder="Confirm passphrase" v-model="passphraseConfirm" type="password"></aph-input>
        <button class="import-btn" @click="importWallet" :disabled="shouldDisableLButton">{{ buttonLabel }}</button>
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
      return this.$isPending('importWallet') ? 'Importing...' : 'Import';
    },

    passphrasesMatch() {
      return this.passphrase === this.passphraseConfirm;
    },

    shouldDisableLButton() {
      return this.$isPending('importWallet') || this.wif.length === 0
        || this.walletName.length === 0 || this.passphrase.length === 0
        || !this.passphrasesMatch;
    },
  },

  data() {
    return {
      passphrase: '',
      passphraseConfirm: '',
      walletName: '',
      wif: '',
    };
  },

  methods: {
    goBack() {
      this.$router.back();
    },

    importWallet() {
      this.$store.dispatch('importWallet', {
        name: this.walletName,
        wif: this.wif,
        passphrase: this.passphrase,
        done: () => {
          this.$router.push('/authenticated');
        },
      });
    },
  },
};
</script>


<style lang="scss">
#login--import {
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
    justify-content: center;
    padding: 0 $space-lg;

    .aph-input + .aph-input {
      margin-top: $space;
    }

    .import-btn {
      @extend %btn-outline;

      margin-top: $space-xl;
    }
  }
}
</style>

