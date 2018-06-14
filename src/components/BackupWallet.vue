<template>
  <section id="backup-wallet" :class="{show}">
    <div class="header">
      <div class="title">Backup Wallet</div>
      <div class="control" @click="close">
        <aph-icon name="arrow-down"></aph-icon>
      </div>
    </div>
    <div class="body">
      <p>Save and backup the keys below. If you lose them, you lose access to your assets.</p>
      <div class="qr-codes">
        <div class="qr-code">
          <vue-qrcode :value="$store.state.currentWallet.address" :options="{ backgroundAlpha: 0, size: 120 }"></vue-qrcode>
          <p class="help-text">Public<br />Address</p>
        </div>
        <div class="qr-code">
          <vue-qrcode :value="$store.state.currentWallet.wif" :options="{ backgroundAlpha: 0, size: 120  }"></vue-qrcode>
          <p class="help-text">Encrypted<br />Private Key</p>
        </div>
      </div>
      <div class="row">
        <aph-input v-model="$store.state.walletToBackup.encryptedWIF" placeholder="Encrypted key" :disabled="true"></aph-input>
        <aph-copy-text :text="$store.state.walletToBackup.encryptedWIF"></aph-copy-text>
      </div>
      <div class="row">
        <aph-input v-model="$store.state.walletToBackup.privateKey" placeholder="Private key" :disabled="true"></aph-input>
        <aph-copy-text :text="$store.state.walletToBackup.privateKey"></aph-copy-text>
      </div>
      <div class="row">
        <aph-input v-model="$store.state.walletToBackup.wif" placeholder="WIF" :disabled="true"></aph-input>
        <aph-copy-text :text="$store.state.walletToBackup.wif"></aph-copy-text>
      </div>
    </div>
  </section>
</template>

<script>
import VueQrcode from '@xkeshi/vue-qrcode';

export default {
  components: {
    VueQrcode,
  },

  computed: {
    show() {
      return !_.isEmpty(this.$store.state.walletToBackup);
    },
  },

  data() {
    return {
    };
  },

  methods: {
    close() {
      this.$store.commit('setWalletToBackup', {});
    },
  },
};
</script>

<style lang="scss">
#backup-wallet {
  @include transition(top);

  background: $dark;
  display: flex;
  flex-direction: column;
  height: 100vh;
  left: 0;
  overflow: hidden;
  position: fixed;
  top: 100vh;
  width: 100vw;
  z-index: 1000;

  > .header {
    align-items: center;
    display: flex;
    flex-direction: column;
    flex: none;
    padding: $space 0;

    .title {
      color: white;
      font-size: toRem(18px);
    }

    .control {
      padding: $space;
      position: absolute;
      left: 0;
      top: 0;

      svg {
        height: toRem(20px);
      }
    }
  }

  > .body {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    padding: $space;

    p {
      line-height: $copy-line-height;
      margin: 0 0 $space;
      padding: 0 $space-lg;
      text-align: center;
    }

    .qr-codes {
      display: flex;
      margin-top: $space;
      flex-direction: row;

      .qr-code {
        flex: 1;
        text-align: center;

        canvas {
          background: white;
          padding: $space-sm;
        }

        .help-text {
          font-family: GilroySemibold;
          font-size: toRem(10px);
          text-transform: uppercase;
        }
      }
    }

    .row {
      margin-top: $space;
      position: relative;

      .aph-copy-text {
        position: absolute;
        right: 0;
        top: 0;
      }

      .aph-input {
        > input {
          font-size: toRem(8px);
        }
      }
    }
  }

  &.show {
    top: 0;
  }
}
</style>
