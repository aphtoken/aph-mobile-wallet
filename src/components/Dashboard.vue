<template>
  <section id="dashboard">
    <div class="body">
      <router-view></router-view>
    </div>
    <div class="footer" v-if="showFooter">
      <router-link to="/authenticated/dashboard/holdings">
        <aph-icon name="holdings"></aph-icon>
      </router-link>
      <router-link to="/authenticated/dashboard/recent-transactions">
        <aph-icon name="transactions"></aph-icon>
      </router-link>
    </div>
  </section>
</template>

<script>
let loadTransactionsIntervalId;

export default {
  beforeDestroy() {
    clearInterval(loadTransactionsIntervalId);
  },

  beforeMount() {
    this.loadTransactions();

    loadTransactionsIntervalId = setInterval(() => {
      this.loadTransactions();
    }, this.$constants.intervals.TRANSACTIONS_POLLING);
  },

  computed: {
    showFooter() {
      return !_.includes(this.$route.name, ['dashboard.token-stats']);
    },
  },

  methods: {
    loadTransactions() {
      this.$store.dispatch('fetchRecentTransactions');
    },
  },
};
</script>

<style lang="scss">
#dashboard {
  display: flex;
  flex-direction: column;
  height: 100%;

  > .body {
    flex: 1;
    overflow: hidden;
  }

  > .footer {
    flex: none;
    display: flex;

    > a {
      align-items: center;
      border-bottom: $border-width solid transparent;
      border-top: $border-width solid transparent;
      display: flex;
      flex-direction: column;
      flex: 1;
      height: toRem(60px);
      justify-content: center;

      .aph-icon {
        svg {
          height: toRem(35px);

          &.transactions {
            height: toRem(18px);
          }
        }
      }

      &.router-link-active {
        border-bottom-color: $purple;

        .fill {
          fill: $purple;
        }
      }
    }
  }
}
</style>

