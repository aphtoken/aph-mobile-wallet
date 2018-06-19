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

