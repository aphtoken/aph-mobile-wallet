<template>
  <section id="wallets" :class="[{'show-import-wallet': showImportWallet, 'show-open-wallet': showOpenWallet}]">
    <div class="header">
      <div class="title">{{ $t('wallets') }}</div>
      <div class="search">
        <div class="inner">
          <aph-icon name="search"></aph-icon>
          <div class="input">
            <input type="text" :placeholder="$t('Search')" v-model="searchBy">
          </div>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="wallets">
        <div v-for="(wallet) in filteredWallets" :key="wallet.label" :class="['wallet', {active: isActive(wallet), 'show-actions': walletWithActionsShowing && walletWithActionsShowing.label === wallet.label}]">
          <div class="actions">
            <div class="delete" @click="initDeleteWallet(wallet)">{{ $t('Delete') }}</div>
          </div>
          <div class="content" v-touch:swipe="getSwipeHandler(wallet)">
            <div class="label" @click="beginOpenWallet(wallet)">{{ wallet.label }}</div>
          </div>
        </div>
      </div>
      <div class="import-btn" @click="showImportWallet = true">
        <aph-icon name="plus"></aph-icon>
      </div>
    </div>
    <div class="import-wallet">
      <div class="control" @click="hideImportWallet">
        <aph-icon name="arrow-down"></aph-icon>
        <div class="title">{{ $t('importWallet') }}</div>
      </div>
      <div class="body">
        <div class="inner">
          <div class="body">
            <aph-icon name="wallet"></aph-icon>
            <div class="title">{{ $t('enterWalletDetails') }}</div>
            <div class="form">
              <aph-input :placeholder="$t('Name')" v-model="walletName" :light="true"></aph-input>
              <aph-input :placeholder="$t('privateKey')" v-model="wif" :light="true"></aph-input>
              <aph-input :placeholder="$t('passphrase')" v-model="passphrase" type="password" :light="true"></aph-input>
              <aph-input :placeholder="$t('confirmPassphrase')" v-model="passphraseConfirm" type="password" :light="true"></aph-input>
            </div>
          </div>
        </div>
      </div>
      <button class="submit-btn" @click="importWallet" :disabled="shouldDisableImportButton">{{ importButtonLabel }}</button>
    </div>
    <div class="open-wallet">
      <div class="control" @click="hideOpenWallet">
        <aph-icon name="arrow-down"></aph-icon>
        <div class="title">{{ $t('openWallet') }}</div>
      </div>
      <div class="body">
        <div class="inner">
          <div class="body">
            <aph-icon name="wallet"></aph-icon>
            <div class="title">{{ walletToOpen.label }}</div>
            <div class="form">
              <aph-input placeholder="Passphrase" v-model="passphrase" type="password" :light="true"></aph-input>
            </div>
          </div>
        </div>
      </div>
      <button class="submit-btn" @click="openWallet" :disabled="shouldDisableOpenButton">{{ openButtonLabel }}</button>
    </div>
    <div class="delete-wallet" v-if="walletToDelete">
      <div class="inner">
        <div class="body">
          <aph-icon name="unconfirmed-big"></aph-icon>
          <div class="help-text">{{ $t('confirmDelete') }} <span class="red">{{ $t('lossOfFunds') }}</span>{{ $t('notProperlyBackedUp') }}</div>
          <div class="label">{{ walletToDelete.label }}</div>
        </div>
        <button class="delete-btn" @click="deleteWallet" :disabled="$isPending('deleteWallet')">{{ $t('Delete') }}</button>
      </div>
      <div class="cancel-btn" @click="walletToDelete = null">{{ $t('Cancel') }}</div>
    </div>
  </section>
</template>

<script>
export default {
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
      return this.$isPending('importWallet') ? this.$t('importing') : this.$t('Import');
    },

    openButtonLabel() {
      return this.$isPending('openSavedWallet') ? this.$t('opening') : this.$t('Open');
    },

    passphrasesMatch() {
      return this.passphrase === this.passphraseConfirm;
    },

    shouldDisableImportButton() {
      return this.$isPending('importWallet') || this.wif.length === 0
        || this.walletName.length === 0 || this.passphrase.length === 0
        || !this.passphrasesMatch;
    },

    shouldDisableOpenButton() {
      return this.$isPending('openSavedWallet') || this.passphrase.length === 0;
    },
  },

  data() {
    return {
      passphrase: '',
      passphraseConfirm: '',
      searchBy: '',
      showImportWallet: false,
      showOpenWallet: false,
      walletName: '',
      walletToDelete: null,
      walletToOpen: {},
      walletWithActionsShowing: null,
      wif: '',
    };
  },

  methods: {
    beginOpenWallet(wallet) {
      if (wallet.label === this.$store.state.currentWallet.label) {
        return;
      }

      this.showOpenWallet = true;
      this.walletToOpen = wallet;
    },

    deleteWallet() {
      this.$store.dispatch('deleteWallet', {
        name: this.walletToDelete.label,
        done: () => {
          this.$services.alerts.success(this.$t('deletedWallet', { name: this.walletToDelete.label }));
          if (this.walletToDelete.label === this.$store.state.currentWallet.label) {
            this.$services.wallets.clearCurrentWallet();
            this.$services.wallets.setLastWallet(null);
            this.$router.push('/login');
          }

          this.walletToDelete = null;
        },
      });
    },

    getSwipeHandler(wallet) {
      const handler = function handleSwipe(direction) {
        if (direction === 'right' && this.walletWithActionsShowing
          && wallet.address === this.walletWithActionsShowing.address) {
          this.walletWithActionsShowing = null;
        } else if (direction === 'left' && !this.walletWithActionsShowing) {
          this.walletWithActionsShowing = wallet;
        } else if (direction === 'left' && wallet.address !== this.walletWithActionsShowing.address) {
          this.walletWithActionsShowing = wallet;
        }
      }.bind(this);

      return handler;
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

    initDeleteWallet(wallet) {
      console.log(wallet);
      this.walletWithActionsShowing = null;
      this.walletToDelete = wallet;
    },

    openWallet() {
      this.$store.dispatch('openSavedWallet', {
        walletToOpen: this.walletToOpen,
        passphrase: this.passphrase,
        done: () => {
          this.showOpenWallet = false;
          this.$store.dispatch('fetchHoldings');
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
      margin: $space 0 toRem(-26px);
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
        border-radius: $border-radius;
        overflow: hidden;
        position: relative;

        .content {
          @include transitionFast(left);

          align-items: center;
          background: white;
          border-left: $border-width-thick solid transparent;
          border-radius: $border-radius;
          display: flex;
          flex-direction: row;
          left: 0;
          padding: $space;
          position: relative;

          .label {
            color: $dark;
            flex: 1;
            font-family: GilroyMedium;
          }
        }

        .actions {
          @include transitionFast(opacity);

          display: flex;
          flex-direction: row;
          height: 100%;
          opacity: 0;
          position: absolute;
          right: 0;
          top: 0;

          > * {
            align-items: center;
            display: flex;
            flex-direction: row;
            font-size: toRem(12px);
            justify-content: center;
            width: toRem(80px);
          }

          .delete {
            background: $red;
            border-bottom-right-radius: $border-radius;
            border-top-right-radius: $border-radius;
          }
        }

        &.show-actions {
          .content {
            left: toRem(-80px);
          }

          .actions {
            opacity: 1;
          }
        }

        & + .wallet {
          margin-top: $space;
        }

        &.active {
          .content {
            border-color: $purple;
          }
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
      flex: none;
      padding: $space;
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
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: auto;

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

  > .delete-wallet {
    background: rgba($dark, .7);
    display: flex;
    flex-direction: column;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 100;

    .inner {
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: center;
      padding: $space;

      .body {
        align-items: center;
        background: white;
        border-radius: $border-radius;
        color: $dark;
        display: flex;
        flex-direction: column;
        padding: $space-lg;

        .aph-icon {
          svg {
            height: toRem(60px);
          }

          .fill {
            fill: $red;
          }
        }

        .help-text {
          font-size: toRem(12px);
          line-height: $copy-line-height;
          margin: $space-lg 0;
          text-align: center;

          .red {
            color: $red;
          }
        }

        .label {
          color: $purple;
          font-family: GilroyMedium;
        }
      }

      .delete-btn {
        @extend %btn;

        background: $red;
        border-color: transparent;
        margin-top: $space-lg;

        &:disabled {
          background-color: rgba($red, 0.5);
        }
      }
    }

    .cancel-btn {
      @extend %btn-footer;
    }
  }
}
</style>


