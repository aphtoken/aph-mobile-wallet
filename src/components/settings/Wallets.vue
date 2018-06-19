<template>
  <section id="wallets" :class="[{'show-import-wallet': showImportWallet, 'show-open-wallet': showOpenWallet}]">
    <div class="header">
      <div class="title">Wallets</div>
      <div class="search">
        <div class="inner">
          <aph-icon name="search"></aph-icon>
          <div class="input">
            <input type="text" placeholder="Search" v-model="searchBy">
          </div>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="wallets">
        <div v-for="(wallet, index) in filteredWallets" :key="index" :class="['wallet', {active: isActive(wallet)}]">
          <div class="label" @click="beginOpenWallet(wallet)">{{ wallet.label }}</div>
        </div>
      </div>
      <div class="import-btn" @click="showImportWallet = true">
        <aph-icon name="plus"></aph-icon>
      </div>
    </div>
    <div class="import-wallet" v-touch:swipe.down="hideImportWallet">
      <div class="control" @click="hideImportWallet">
        <aph-icon name="arrow-down"></aph-icon>
        <div class="title">Import Wallet</div>
      </div>
      <div class="body">
        <div class="inner">
          <div class="body">
            <aph-icon name="wallet"></aph-icon>
            <div class="title">Enter wallet details.</div>
            <div class="form">
              <aph-input placeholder="Name" v-model="walletName" :light="true"></aph-input>
              <aph-input placeholder="Private key" v-model="wif" :light="true"></aph-input>
              <aph-input placeholder="Passphrase" v-model="passphrase" type="password" :light="true"></aph-input>
            </div>
            <request-error-message identifier="importWallet"></request-error-message>
          </div>
        </div>
      </div>
      <button class="submit-btn" @click="importWallet" :disabled="shouldDisableImportButton">{{ importButtonLabel }}</button>
    </div>
    <div class="open-wallet" v-touch:swipe.down="hideOpenWallet">
      <div class="control" @click="hideOpenWallet">
        <aph-icon name="arrow-down"></aph-icon>
        <div class="title">Open Wallet</div>
      </div>
      <div class="body">
        <div class="inner">
          <div class="body">
            <aph-icon name="wallet"></aph-icon>
            <div class="title">{{ walletToOpen.label }}</div>
            <div class="form">
              <aph-input placeholder="Passphrase" v-model="passphrase" type="password" :light="true"></aph-input>
            </div>
            <request-error-message identifier="openSavedWallet"></request-error-message>
          </div>
        </div>
      </div>
      <button class="submit-btn" @click="openWallet" :disabled="shouldDisableOpenButton">{{ openButtonLabel }}</button>
    </div>
  </section>
</template>

<script>
import RequestErrorMessage from './../RequestErrorMessage';

export default {
  components: {
    RequestErrorMessage,
  },

  computed: {
    filteredWallets() {
      const searchBy = this.searchBy.toLowerCase();

      if (!searchBy.length) {
        return this.$store.state.wallets;
      }

      return _.filter(this.$store.state.wallets, ({ label }) => {
        return label.toLowerCase().indexOf(searchBy) > -1;
      });
    },

    importButtonLabel() {
      return this.$isPending('importWallet') ? 'Importing...' : 'Import';
    },

    openButtonLabel() {
      return this.$isPending('openSavedWallet') ? 'Opening...' : 'Open';
    },

    shouldDisableImportButton() {
      return this.$isPending('importWallet') || this.wif.length === 0
        || this.walletName.length === 0 || this.passphrase.length === 0;
    },

    shouldDisableOpenButton() {
      return this.$isPending('openSavedWallet') || this.passphrase.length === 0;
    },
  },

  data() {
    return {
      passphrase: '',
      searchBy: '',
      showImportWallet: false,
      showOpenWallet: false,
      walletName: '',
      walletToOpen: {},
      wif: '',
    };
  },

  methods: {
    beginOpenWallet({ label }) {
      if(label === this.$store.state.currentWallet.label) {
        return;
      }

      this.showOpenWallet = true;
      this.walletToOpen = wallet;
    },

    hideImportWallet() {
      this.showImportWallet = false;
    },

    hideOpenWallet() {
      this.showOpenWallet = false;
    },

    importWallet() {
      this.$store.dispatch('importWallet', {
        name: this.walletName,
        wif: this.wif,
        passphrase: this.passphrase,
        done: () => {
          this.showImportWallet = false;
        },
      });
    },

    openWallet() {
      this.$store.dispatch('openSavedWallet', {
        walletToOpen: this.walletToOpen,
        passphrase: this.passphrase,
        done: () => {
          this.showOpenWallet = false;
        },
      });
    },

    isActive({ label }) {
      return this.$store.state.currentWallet.label === label;
    },

  },

  watch: {
    showImportWallet() {
      this.address = this.passphrase = this.walletName = this.wif = '';
      this.$store.commit('endRequest', { identifier: 'importWallet' });
    },

    showOpenWallet() {
      this.passphrase = '';
      this.$store.commit('endRequest', { identifier: 'openSavedWallet' });
    },
  },
};
</script>

<style lang="scss">
#wallets {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  > .header {
    align-items: center;
    display: flex;
    flex-direction: column;
    flex: none;
    padding: $space 0 0;

    .title {
      color: white;
      font-size: toRem(18px);
    }

    > .search {
      margin: $space-lg 0 toRem(-26px);
      padding: 0 $space;
      width: 100%;
      z-index: 100;

      .inner {
        align-items: center;
        background: white;
        border-radius: $border-radius;
        box-shadow: $box-shadow;
        display: flex;
        flex-direction: row;
        height: $input-height;
        padding: 0 $space;
        width: 100%;

        .aph-icon {
          flex: none;
          margin-right: $space;

          svg {
            height: toRem(20px);

            .fill {
              fill: $purple;
            }
          }
        }

        .input {
          flex: 1;

          input {
            background: none;
            border: none;
            outline: none;
          }
        }
      }
    }
  }

  > .body {
    background: $background;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    padding: toRem(26px) $space $space $space;

    .wallets {
      flex: 1;
      margin-top: $space;
      overflow: auto;

      .wallet {
        align-items: center;
        background: white;
        border-left: $border-width-thick solid transparent;
        border-radius: $border-radius;
        display: flex;
        flex-direction: row;
        padding: $space;

        .label {
          color: $dark;
          flex: 1;
          font-family: GilroyMedium;
        }

        .copy {
          flex: none;
        }

        & + .wallet {
          margin-top: $space;
        }

        &.active {
          border-color: $purple;
        }
      }
    }

    .import-btn {
      @extend %btn-circle;

      bottom: $space-lg;
      box-shadow: $box-shadow;
      position: fixed;
      right: $space-lg;
    }
  }

  > .import-wallet, > .open-wallet {
    @include transition(top);

    display: flex;
    flex-direction: column;
    height: 100%;
    left: 0;
    overflow: hidden;
    position: fixed;
    top: 100vh;
    width: 100%;
    z-index: 200;

    > .control {
      background: $dark;
      padding: $space;
      flex: none;
      position: relative;

      .aph-icon {
        position: absolute;
        svg {
          height: toRem(20px);
        }
      }

      .title {
        text-align: center;
      }
    }

    > .body {
      @extend %tile-grid;

      color: $dark;
      flex: 1;
      overflow: auto;
      display: flex;
      flex-direction: column;

      > .inner {
        background: white;
        border-radius: $border-radius;
        flex: 1;
        margin: 0 $space;

        .body {
          display: flex;
          flex-direction: column;

          .aph-icon {
            align-self: center;
            margin: $space-lg 0;

            svg.wallet {
              height: toRem(50px);

              .fill {
                fill: $purple;
              }
            }
          }

          .title {
            align-self: center;
            font-family: GilroyMedium;
            line-height: $copy-line-height;
            margin-bottom: $space-lg;
            text-align: center;
            width: 50vw;
          }

          .form {
            padding: 0 $space;
            width: 100%;
          }
        }
      }
    }

    .submit-btn {
      @extend %btn-footer;
    }

    .aph-request-status-message {
      margin: $space;

      .aph-icon {
        margin: 0 !important;
      }
    }
  }

  &.show-import-wallet {
    > .import-wallet {
      top: 0vh;
    }
  }

  &.show-open-wallet {
    > .open-wallet {
      top: 0vh;
    }
  }
}
</style>


