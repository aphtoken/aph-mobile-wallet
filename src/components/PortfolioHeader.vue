<template>
  <section id="portfolio-header">
      <div class="title-underlined">Total Balance</div>
      <div class="total-balance">{{ $formatMoney($store.state.portfolio.balance) }}</div>
      <div class="change">
        <div class="label">24h Change</div>
        <div :class="['amount', {increase: $store.state.portfolio.changeValue > 0, decrease: $store.state.portfolio.changeValue < 0}]">{{ $formatMoney($store.state.portfolio.changeValue) }} (<span class="percentage">{{ $formatNumber($store.state.portfolio.changePercent) }}</span>)</div>
      </div>
  </section>
</template>

<script>
export default {
};
</script>


<style lang="scss">
#portfolio-header {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .title-underlined {
    margin: $space-xl 0 $space;
    color: white;
    font-size: toRem(18px);
    position: relative;
    padding-bottom: $space;

    &:after {
      content: "";
      height: $border-width;
      background: $purple;
      width: toRem(50px);
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translateX(toRem(-25px));
    }
  }

  .total-balance {
    font-size: toRem(40px);
  }

  .change {
    align-items: center;
    display: flex;
    flex-direction: column;

    .label {
      @extend %small-uppercase-grey-label;

      margin: $space 0;
    }

    .amount {
      &.increase {
        color: $green;

        content: "+";

        .percentage {
          &:before {
            content: "+";
          }
        }
      }

      &.decrease {
        color: $red;
      }

      .percentage {
        &:after {
          content: "%";
        }
      }
    }
  }
}
</style>
