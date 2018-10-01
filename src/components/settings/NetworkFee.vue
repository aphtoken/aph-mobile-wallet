<template>
  <section id="network-fee">
    <div class="header">
      <div class="title">{{ $t('networkFee') }}</div>
    </div>
    <div class="body">
      <div class="network-fees">
        <div v-for="(fee, index) in formattedNetworkFees" :key="index" :class="['fee', {active: selectedNetworkFee === fee.raw}]" @click="selectFee(fee)">
          <div class="label">{{ fee.formatted }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  beforeMount() {
    this.initNetwork();
    this.initNetworkFees();
  },

  data() {
    return {
      formattedNetworkFees: [],
      selectedNetwork: null,
      selectedNetworkFee: 0,
    };
  },

  methods: {
    initNetwork() {
      const storedNetwork = this.$services.network.getSelectedNetwork();

      this.selectedNetwork = _.find(this.$services.network.getNetworks(), ({ value }) => {
        return value.net === storedNetwork.net;
      }).value;

      this.selectedNetworkFee = _.get(storedNetwork, 'fee', 0);
    },

    initNetworkFees() {
      this.formattedNetworkFees = this.$services.network.getNetworkFees().map((fee) => {
        return {
          formatted: this.$formatNumber(fee),
          raw: fee,
        };
      });
    },

    selectFee({ raw }) {
      this.selectedNetwork.fee = this.selectedNetworkFee = raw;
      this.$services.network.setSelectedNetwork(this.selectedNetwork);
      this.$store.commit('handleNetworkChange');
      this.$services.neo.promptGASFractureIfNecessary();
      this.$router.back();
    },
  },
};
</script>

<style lang="scss">
#network-fee {
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
    padding: toRem(26px) $space $space $space;

    .network-fees {
      background: white;
      border-radius: $border-radius;
      flex: 1;
      margin-top: $space;
      overflow: auto;
      padding: $space;

      .fee {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: $space;

        .label {
          color: $dark;
          flex: 1;
          font-family: GilroyMedium;
        }

        & + .fee {
          border-top: $border-width-thin solid $background;
        }

        &.active {
          background-color: $background;

          .label {
            color: $purple;
          }
        }
      }
    }
  }
}
</style>


