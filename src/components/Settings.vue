<template>
  <section id="settings">
    <div class="header">
      <div class="title">{{ $t('Settings') }}</div>
    </div>
    <div class="body">
      <div class="inner">
        <div class="tile">
          <div class="row" @click="$router.push('/authenticated/settings/about')">
            <div class="label">{{ $t('About') }}</div>
            <div class="value">
              <aph-icon name="about"></aph-icon>
            </div>
          </div>
          <div class="row" @click="$router.push('/authenticated/settings/contacts')">
            <div class="label">{{ $t('addressBook') }}</div>
            <div class="value">
              <aph-icon name="contacts"></aph-icon>
            </div>
          </div>
          <div class="row">
            <div class="label" @click="sendFeedback">{{ $t('sendFeedback') }}</div>
            <div class="value">
              <aph-icon name="feedback"></aph-icon>
            </div>
          </div>
        </div>
        <div class="underlined">{{ $t('Preferences') }}</div>
        <div class="tile">
          <div class="row" @click="$router.push('/authenticated/settings/languages')">
            <div class="label">{{ $t('Language') }}</div>
            <div class="value">{{ selectedLanguage }}</div>
          </div>
          <div class="row" @click="$router.push('/authenticated/settings/currencies')">
            <div class="label">{{ $t('Currency') }}</div>
            <div class="value">{{ selectedCurrency }}</div>
          </div>
          <div class="row" @click="$router.push('/authenticated/settings/networks')">
            <div class="label">{{ $t('Network') }}</div>
            <div class="value">{{ selectedNetwork.net }}</div>
          </div>
          <div class="row" @click="$router.push('/authenticated/settings/network-fee')">
            <div class="label">{{ $t('networkFee') }}</div>
            <div class="value">{{ $formatNumber(selectedNetworkFee) }}</div>
          </div>
        </div>
        <div class="underlined">{{ $t('wallets') }}</div>
        <div class="tile">
          <div class="row" @click="$router.push('/authenticated/settings/wallets')">
            <div class="label">{{ $t('Wallet') }}</div>
            <div class="value">{{ $store.state.currentWallet.label }}</div>
          </div>
          <div class="row" @click="logout">
            <div class="label">{{ $t('Logout') }}</div>
            <div class="value">
              <aph-icon name="arrow-right"></aph-icon>
            </div>
          </div>
        </div>
      </div>
      <button class="backup-wallet-btn" @click="backupWallet">{{ $t('backupWallet') }}</button>
    </div>
  </section>
</template>

<script>
export default {
  beforeMount() {
    this.selectedLanguage = localStorage.getItem('language') || 'en';
    this.currencies = this.$services.settings.getCurrenciesAsArray();
    this.networks = this.$services.network.getNetworks();
    this.selectedCurrency = this.$services.settings.getCurrency();

    const storedNetwork = this.$services.network.getSelectedNetwork();
    this.selectedNetwork = _.find(this.networks, ({ value }) => {
      return value.net === storedNetwork.net;
    }).value;

    if (!this.selectedNetwork && this.networks && this.networks.length > 0) {
      this.selectedNetwork = this.networks[0];
    }

    if (storedNetwork) {
      this.selectedNetwork.fee = storedNetwork.fee;
      this.selectedNetworkFee = storedNetwork.fee;
    } else {
      this.selectedNetworkFee = 0;
    }
  },

  computed: {
  },

  data() {
    return {
      currencies: [],
      networks: [],
      selectedCurrency: null,
      selectedLanguage: null,
      selectedNetwork: null,
      selectedNetworkFee: 0,
    };
  },

  methods: {
    backupWallet() {
      this.$store.commit('setWalletToBackup', this.$store.state.currentWallet);
    },

    logout() {
      this.$services.wallets.clearCurrentWallet();
      this.$store.commit('handleLogout');
      this.$router.push('/login');
    },

    sendFeedback() {
      const address = 'support@aphelion.org';
      const subject = 'Aphelion Mobile Wallet Feedback';

      window.location.href = `mailto:${address}?subject=${subject}`;
    },
  },
};
</script>

<style lang="scss">
#settings {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

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
  }

  > .body {
    background: $background;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    padding: $space;

    > .inner {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: auto;

      .underlined {
        color: $dark;
        padding-bottom: $space;
        margin: $space 0;
        position: relative;
        font-family: GilroyMedium;
        margin-left: $space;

        &:after {
          content: "";
          height: $border-width;
          background: $purple;
          width: toRem(30px);
          position: absolute;
          left: 0;
          bottom: 0;
        }
      }

      .tile {
        background: white;
        border-radius: $border-radius;
        padding: 0 $space;

        .row {
          align-items: center;
          display: flex;
          flex-direction: row;
          padding: $space 0;

          .label {
            color: $dark;
            flex: 1;
            font-family: GilroyMedium;
            padding-left: $space-sm;
          }

          .value {
            @extend %small-uppercase-grey-label;

            flex: none;
            padding-right: $space-sm;

            .aph-icon {
              svg {
                &.about, &.contacts {
                  height: toRem(22px);
                }

                &.feedback {
                  height: toRem(14px);
                }

                &.arrow-right {
                  height: toRem(16px);
                }
              }

              .fill {
                fill: $grey;
              }
            }
          }

          & + .row {
            border-top: $border-width-thin $background solid;
          }
        }

        & + .underlined {
          margin-top: $space;
        }
      }
    }

    .backup-wallet-btn {
      @extend %btn;

      box-shadow: $box-shadow;
      flex: none;
      margin-top : $space;
      width: auto;
    }
  }
}
</style>


