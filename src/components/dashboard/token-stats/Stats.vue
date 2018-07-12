<template>
  <div class="tile stats">
    <div class="inner">
      <div class="header">
        <div class="label">Active Value</div>
        <div class="value">{{ $formatMoney($store.state.statsToken.balance * $store.state.statsToken.unitValue) }}</div>
      </div>
      <div class="body">
        <div class="row">
          <div class="col change">
            <div class="label">24h Change</div>
            <div class="value">{{ $formatMoney($store.state.statsToken.change24hrValue) }} ({{ $formatNumber($store.state.statsToken.change24hrPercent) }}%)</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">24h Low</div>
            <div class="value">{{ $formatMoney(low) }}</div>
          </div>
          <div class="col">
            <div class="label">24h High</div>
            <div class="value">{{ $formatMoney(high) }}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">24h Volume</div>
            <div class="value">{{ $formatMoneyWithoutCents(volume) }}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">Market Cap</div>
            <div class="value">{{ $formatMoneyWithoutCents($store.state.statsToken.marketCap) }}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">Total Supply</div>
            <div class="value">{{ $formatNumber($store.state.statsToken.totalSupply) }}</div>
          </div>
        </div>
      </div>
      <div class="expand-btn" @click="showFullTokenStats = true">
        <aph-icon name="expand"></aph-icon>
      </div>
    </div>
    <aph-full-token-stats :on-hide="hideFullTokenStats" :show="showFullTokenStats" :token="$store.state.statsToken"></aph-full-token-stats>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showFullTokenStats: false,
    };
  },

  methods: {
    hideFullTokenStats() {
      this.showFullTokenStats = false;
    },
  },

  props: ['high', 'low', 'volume'],
};
</script>

<style lang="scss">
.tile.stats {
  > .inner {
    flex-direction: column;

    .header {
      align-items: center;
      background-color: $dark;
      border-top-left-radius: $border-radius;
      border-top-right-radius: $border-radius;
      display: flex;
      flex-direction: row;
      flex: none;
      padding: $space;

      .label {
        @extend %small-uppercase-grey-label;

        flex: 1;
      }

      .value {
        color: white;
        flex: 1;
      }
    }

    .body {
      @extend %tile-grid-light;

      flex: 1;
      padding: $space;
    }
  }

  .expand-btn {
    @extend %btn-circle;

    position: absolute;
    right: 0;
    bottom: 0;
    box-shadow: $box-shadow-lg;
    transform: translate(-50%, 50%)
  }
}
</style>
