<template>
  <section id="authenticated-wrapper">
    <aside id="sidebar">
      <div class="logo">
        <aph-icon name="logo-mark"></aph-icon>
      </div>
      <div class="menu" @click="menuOpen = false">
        <router-link to="/authenticated/dashboard">
          <aph-icon name="dashboard"></aph-icon>
          <p>{{ $t('Dashboard') }}</p>
        </router-link>
        <router-link v-if="shouldShowCommitLink" to="/authenticated/commit">
          <aph-icon name="commit"></aph-icon>
          <p>{{ $t('Commit') }}</p>
        </router-link>
        <router-link to="/authenticated/assets">
          <aph-icon name="wallet"></aph-icon>
          <p>{{ $t('Assets') }}</p>
        </router-link>
        <router-link to="/authenticated/history">
          <aph-icon name="history"></aph-icon>
          <p>{{ $t('History') }}</p>
        </router-link>
        <router-link to="/authenticated/settings">
          <aph-icon name="settings"></aph-icon>
          <p>{{ $t('Settings') }}</p>
        </router-link>
      </div>
    </aside>
    <div id="content" :class="[{'menu-open': menuOpen}]">
      <div id="back-button" @click="goBack" v-if="shouldShowBackButton">
        <aph-icon name="arrow-left"></aph-icon>
      </div>
      <div id="menu-toggle" :class="[{open: menuOpen}]" @click="toggleMenu" v-else>
        <span></span>
        <span></span>
      </div>
      <router-view></router-view>
    </div>
    <backup-wallet v-if="$store.state.walletToBackup"></backup-wallet>
    <claim-gas-status v-if="$store.state.showClaimGasStatus"></claim-gas-status>
  </section>
</template>

<script>
import BackupWallet from './BackupWallet';
import ClaimGasStatus from './ClaimGasStatus';

let loadRecentTxIntervalId;
let loadHoldingsIntervalId;

const ROUTES_USING_BACK_BUTTON = [
  'dashboard.token-stats',
  'settings.contacts',
  'settings.currencies',
  'settings.languages',
  'settings.networks',
  'settings.wallets',
];

export default {
  beforeDestroy() {
    clearInterval(loadHoldingsIntervalId);
    clearInterval(loadRecentTxIntervalId);
  },

  components: {
    BackupWallet,
    ClaimGasStatus,
  },

  computed: {
    shouldShowBackButton() {
      return _.includes(ROUTES_USING_BACK_BUTTON, this.$route.name);
    },

    shouldShowCommitLink() {
      return this.$store.state.currentNetwork.net !== 'MainNet';
    },
  },

  data() {
    return {
      menuOpen: false,
    };
  },

  methods: {
    goBack() {
      this.$router.back();
    },

    loadHoldings() {
      this.$store.dispatch('fetchHoldings');
    },

    loadRecentTransactions() {
      this.$store.dispatch('fetchRecentTransactions');
    },

    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
  },

  mounted() {
    this.$services.tokens.migrateToAssets(this.$services.network.getSelectedNetwork());

    this.$services.neo.fetchNEP5Tokens(() => {
      // Do a fetch of only user assets initially to speed up load.
      this.$store.dispatch('fetchHoldings', {
        done: () => {
          this.$store.dispatch('fetchHoldings');
        },
        onlyFetchUserAssets: true });
      this.loadRecentTransactions();
    });

    loadHoldingsIntervalId = setInterval(() => {
      this.loadHoldings();
    }, this.$constants.intervals.HOLDINGS_POLLING);

    loadRecentTxIntervalId = setInterval(() => {
      this.loadRecentTransactions();
    }, this.$constants.intervals.TRANSACTIONS_POLLING);
  },
};
</script>

<style lang="scss">
#authenticated-wrapper {
  height: 100%;
  overflow: hidden;
  position: relative;

  #sidebar {
    background: $purple;
    display: flex;
    flex-direction: column;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 40vw;

    .aph-icon .fill {
      fill: white;
    }

    .logo {
      flex: none;
      padding: $space-lg 0;
      text-align: center;

      .aph-icon > svg {
        height: 30vw;
      }
    }

    .menu {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      .aph-icon > svg {
          &.dashboard {
            height: toRem(35px);
          }

          &.dex {
            height: toRem(35px);
          }

          &.commit {
            height: toRem(34px);
          }

          &.wallet {
            height: toRem(30px);
          }

          &.ico {
            height: toRem(35px);
          }

          &.history {
            height: toRem(35px);
          }

          &.settings {
            height: toRem(30px);
          }

          .fill {
            fill: $dark;
          }
      }

      > a {
        border-left: $border-width solid transparent;
        border-right: $border-width solid transparent;
        display: flex;
        flex-direction: column;
        align-items: center;

        > p {
          color: white;
          margin: $space-sm 0 0;
        }

        &.router-link-active {
          border-left-color: white;

          .fill {
            fill: white;
          }
        }

        & + a {
          margin-top: $space-lg;
        }
      }
    }
  }

  #content {
    @include transitionFast(all);

    background: $dark;
    height: 100%;
    height: 100%;
    left: 0;
    overflow: auto;
    position: relative;
    width: 100%;
    z-index: 10;

    &.menu-open {
      left: 40vw;
    }

    #back-button {
      left: $space;
      position: absolute;
      top: $space;
      width: $space-lg;

      svg {
        height: toRem(18px);
      }
    }

    #menu-toggle {
      left: $space;
      position: absolute;
      top: $space;
      width: $space-lg;
      z-index: 100;

      > span {
        @include transitionFast(all);

        background: white;
        display: block;
        height: toRem(2px);
        position: relative;

        & + span {
          margin-top: $space;
        }
      }

      &.open {
        > span {
          &:first-child {
            transform-origin: top left;
            transform: rotate(45deg);
          }

          &:last-child {
            margin-top: toRem(12px);
            transform-origin: bottom left;
            transform: rotate(-45deg);
          }
        }
      }
    }
  }
}
</style>

