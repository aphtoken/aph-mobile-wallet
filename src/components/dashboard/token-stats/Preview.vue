<template>
  <div class="tile preview">
    <div class="inner">
      <aph-token-icon :symbol="symbol"></aph-token-icon>
      <div class="token">{{ $store.state.statsToken.name }}</div>
      <div class="symbol">{{ $store.state.statsToken.symbol }}</div>
      <div class="amount">{{ $formatNumber($store.state.statsToken.balance) }}</div>
      <div class="value">{{ $formatMoney($store.state.statsToken.balance * $store.state.statsToken.unitValue) }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['symbol'],
};
</script>

<style lang="scss">
.tile.preview {
  > .inner {
    align-items: center;
    color: $dark;
    flex-direction: column;
    justify-content: center;
    padding: $space;

    .aph-token-icon {
      flex: none;
      > img {
        height: toRem(90px);
        width: toRem(90px);
      }
    }

    .token {
      font-family: GilroyMedium;
      font-size: toRem(22px);
      margin: $space-lg 0 $space-sm;
    }

    .symbol {
      @extend %small-uppercase-grey-label-dark;

      font-size: toRem(20px);
      margin-bottom: $space;
      padding-bottom: $space;
      position: relative;

      &:after {
        background: $purple;
        bottom: 0;
        content: "";
        height: $border-width;
        left: 50%;
        position: absolute;
        transform: translateX(toRem(-20px));
        width: toRem(40px);
      }
    }

    .amount {
      color: $purple;
      font-size: toRem(30px);
    }

    .value {
      font-family: GilroyMedium;
      font-size: toRem(18px);
      margin-top: $space;
    }
  }
}
</style>


