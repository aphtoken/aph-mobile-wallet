<template>
  <section id="backup-wallet">
    <div class="background">
      <img src="~@/assets/img/Blurred_Bg.png">
    </div>
    <div class="header">
      <div class="title">
        <aph-icon name="word-mark"></aph-icon>
      </div>
    </div>
    <div class="body">
      <div class="help-text">You must save and backup the keys below. If you lose them, you lose access to your assets.</div>
      <div class="keys">
        <div class="row">
          <div class="label">Private Key</div>
          <div class="value">{{ $store.state.currentWallet.privateKey }}</div>
          <aph-copy-text :text="$store.state.currentWallet.privateKey" :icon="false"></aph-copy-text>
        </div>
        <div class="row">
          <div class="label">Encrypted Key</div>
          <div class="value">{{ $store.state.currentWallet.encryptedWIF }}</div>
          <aph-copy-text :text="$store.state.currentWallet.encryptedWIF" :icon="false"></aph-copy-text>
        </div>
        <div class="row">
          <div class="label">WIF</div>
          <div class="value">{{ $store.state.currentWallet.wif }}</div>
          <aph-copy-text :text="$store.state.currentWallet.wif" :icon="false"></aph-copy-text>
        </div>
        <div class="qr-codes-btn" @click="showQrCodes = true">View QR Codes</div>
      </div>
    </div>
    <div class="footer">
      <div class="done-btn" @click="$store.commit('setWalletToBackup', null)">Done</div>
    </div>
    <div class="qr-codes-wrapper" v-if="showQrCodes">
      <div class="qr-codes">
        <vue-qrcode :value="$store.state.currentWallet.address" :options="{ size: 130 }"></vue-qrcode>
        <p class="help-text">Public Address</p>
        <vue-qrcode :value="$store.state.currentWallet.privateKey" :options="{ size: 130 }"></vue-qrcode>
        <p class="help-text">Private Key</p>
      </div>
      <div class="close-btn" @click="showQrCodes = false">Close</div>
    </div>
  </section>
</template>

<script>
import VueQrcode from '@xkeshi/vue-qrcode';

export default {
  components: {
    VueQrcode,
  },

  data() {
    return {
      showQrCodes: false,
    };
  },
};
</script>

<style lang="scss">
#backup-wallet {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: fixed;
  z-index: 100000;
  background: $dark;
  width: 100%;
  top: 0;
  left: 0;

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
    padding: $space;

    .help-text {
      line-height: $copy-line-height;
      margin: $space-xl 0;
      text-align: center;
    }

    .row {
      position: relative;

      .label {
        @extend %small-uppercase-grey-label;

        color: $purple;
      }

      .value {
        border-bottom: $border-width solid $purple;
        padding: $space 0 $space-sm;
        overflow-wrap: break-word;
      }

      .aph-copy-text {
        position: absolute;
        right: 0;
        top: 0;
      }

      & + .row {
        margin-top: $space-lg;
      }
    }

    .qr-codes-btn {
      @extend %btn;

      margin-top: $space-xl;
    }
  }

  .footer {
    flex: none;

    .done-btn {
      @extend %btn-footer;

      display: block;
    }
  }

  .qr-codes-wrapper {
    background: rgba($dark, .7);
    bottom: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    left: 0;
    padding: $space-xl;
    position: absolute;
    right: 0;
    top: 0;

    .qr-codes {
      background: white;
      border-radius: $border-radius;
      padding: $space;
      text-align: center;

      .help-text {
        @extend %small-uppercase-grey-label;

        color: $purple;
        margin: 0;

        & + canvas {
          margin-top: $space;
        }
      }
    }

    .close-btn {
      @extend %btn;

      margin-top: $space;
    }
  }
}
</style>
