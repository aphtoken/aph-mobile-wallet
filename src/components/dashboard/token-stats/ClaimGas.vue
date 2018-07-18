<template>
  <div class="tile claim-gas">
    <div class="inner" v-if="this.$store.state.statsToken.availableToClaim">
      <aph-icon name="claim-gas"></aph-icon>
      <div class="title">{{$t('claimGas')}}</div>
      <div class="underlined">{{$t('youCurrentlyHave')}}</div>
      <div class="amount">{{ $formatNumber(this.$store.state.statsToken.availableToClaim) }}</div>
      <button class="claim-btn" @click="claim">{{$t('Claim')}}</button>
    </div>
    <div class="inner cannot-claim" v-else>
      <aph-icon name="claim-gas"></aph-icon>
      <div class="title">{{$t('cannotClaimGas')}}</div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    claim() {
      this.$store.dispatch('claimGas');
    },
  },
};
</script>

<style lang="scss">
.tile.claim-gas {
  > .inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .aph-icon {
      svg {
        height: toRem(50px);
      }

      .fill {
        fill: $purple;
      }
    }

    .title {
      font-size: toRem(16px);
      color: $purple;
      margin: $space 0;
    }

    .underlined {
      color: $dark;
      padding-bottom: $space;
      position: relative;
      font-family: GilroyMedium;

      &:after {
        content: "";
        height: $border-width;
        background: $purple;
        width: toRem(30px);
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
      }
    }

    .amount {
      font-size: toRem(18px);
      margin: $space-lg 0 $space-xl;
    }

    .claim-btn {
      @extend %btn;

      box-shadow: $box-shadow;
      padding: toRem(16px) toRem(40px);
      width: initial;
    }

    &.cannot-claim {
      .aph-icon {
        .fill {
          fill: $red;
        }
      }

      .title {
        color: $red;
      }

      .sub-title {
        flex: none;
      }
    }
  }
}
</style>

