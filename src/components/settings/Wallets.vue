<template>
  <section id="wallets" :class="[{'show-import-wallet': showAddWallet}]">
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
          <div class="label">{{ wallet.label }}</div>
        </div>
      </div>
      <div class="import-btn" @click="showAddWallet = true">
        <aph-icon name="plus"></aph-icon>
      </div>
    </div>
    <div class="import-wallet">
      <div class="control" @click="showAddWallet = false">
        <aph-icon name="chevron-down"></aph-icon>
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
              <button class="import-btn" @click="importWallet" :disabled="shouldDisableLButton">{{ buttonLabel }}</button>
            </div>
            <request-error-message identifier="importWallet"></request-error-message>
          </div>
        </div>
      </div>
      <button class="submit-btn" @click="importWallet" :disabled="shouldDisableAddButton">Add</button>
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
    shouldDisableAddButton() {
      return !this.address.length || !this.label.length;
    },

    filteredWallets() {
      const searchBy = this.searchBy.toLowerCase();

      if (!searchBy.length) {
        return this.$store.state.wallets;
      }

      return _.filter(this.$store.state.wallets, ({ label }) => {
        return label.toLowerCase().indexOf(searchBy) > -1;
      });
    },
  },

  data() {
    return {
      address: '',
      label: '',
      searchBy: '',
      showAddWallet: false,
    };
  },

  methods: {
    importWallet() {
      // this.showAddWallet = false;
    },

    isActive({ label }) {
      return _.get(this.$store.state.currentWallet, 'label') === label;
    },

  },

  watch: {
    showAddWallet() {
      this.address = this.label = '';
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

  > .import-wallet {
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
          height: toRem(14px);
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
        margin: $space $space 0;

        .body {
          display: flex;
          flex-direction: column;
          align-items: center;

          .aph-icon {
            margin: $space-lg 0;

            svg.wallet {
              height: toRem(50px);

              .fill {
                fill: $purple;
              }
            }
          }

          .title {
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
  }

  &.show-import-wallet {
    > .import-wallet {
      top: 0vh;
    }
  }
}
</style>


