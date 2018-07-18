<template>
  <section id="networks">
    <div class="header">
      <div class="title">{{$t('Network')}}</div>
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
      <div class="networks">
        <div v-for="(network, index) in filteredNetworks" :key="index" :class="['network', {active: $store.state.currentNetwork.net === network.value.net}]" @click="selectNetwork(network)">
          <div class="label">{{ network.value.net }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  beforeMount() {
    this.networks = this.$services.network.getNetworks();
  },

  computed: {
    filteredNetworks() {
      const searchBy = this.searchBy.toLowerCase();

      if (!searchBy.length) {
        return this.networks;
      }

      return _.filter(this.networks, ({ label }) => {
        return label.toLowerCase().indexOf(searchBy) > -1;
      });
    },
  },

  data() {
    return {
      networks: [],
      searchBy: '',
    };
  },

  methods: {
    selectNetwork(network) {
      this.$services.network.setSelectedNetwork(network.value);
      this.$store.commit('handleNetworkChange');
      this.$router.back();
    },
  },
};
</script>

<style lang="scss">
#networks {
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

    .networks {
      background: white;
      border-radius: $border-radius;
      flex: 1;
      margin-top: $space;
      overflow: auto;
      padding: $space;

      .network {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: $space;

        .label {
          color: $dark;
          flex: 1;
          font-family: GilroyMedium;
        }

        & + .network {
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


