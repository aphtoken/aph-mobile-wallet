<template>
  <div :class="['holding', {'show-actions': showActions}]">
    <div class="actions">
      <div class="delete" @click="handleOnRemove">Delete</div>
    </div>
    <div class="content" v-touch:swipe="getOnSwipeHandler()" @click="handleOnClick">
      <div class="left">
        <aph-token-icon :symbol="holding.symbol"></aph-token-icon>
        <div class="token">
          <div class="currency">{{ holding.symbol }}</div>
          <div class="value">{{ $formatMoney(holding.balance * holding.unitValue)}}</div>
        </div>
      </div>
      <div class="right">
        <div class="balance">
          <div class="amount">{{ $formatNumber(holding.balance) }}</div>
          <div :class="['change', {decrease: holding.change24hrPercent < 0, increase: holding.change24hrPercent > 0}]">{{ $formatNumber(holding.change24hrPercent) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    canBeRemoved() {
      return !!this.holding.canRemove && !!this.onRemove;
    },

    isClickable() {
      return _.isFunction(this.onClick);
    },
  },

  methods: {
    getOnSwipeHandler() {
      const fn = function handleSwipe(direction) {
        if (this.onSwipe) {
          this.onSwipe(this.holding, direction);
        }
      }.bind(this);

      return fn;
    },

    handleOnClick() {
      if (this.onClick) {
        this.onClick(this.holding);
      }
    },

    handleOnRemove() {
      this.onRemove(this.holding);
    },
  },

  props: {
    holding: {
      required: true,
      type: Object,
    },

    onClick: {
      type: Function,
    },

    onRemove: {
      type: Function,
    },

    onSwipe: {
      type: Function,
    },

    showActions: {
      type: Boolean,
    },
  },
};
</script>

<style lang="scss">
.holding {
  align-items: center;
  border-radius: $border-radius;
  overflow: hidden;
  position: relative;

  .content {
    @include transitionFast(left);

    background: white;
    display: flex;
    flex-direction: row;
    position: relative;
    left: 0;
    padding: $space;
    border-radius: $border-radius;
  }

  .actions {
    @include transitionFast(opacity);

    border-bottom-right-radius: $border-radius;
    border-top-right-radius: $border-radius;
    display: flex;
    flex-direction: row;
    height: 100%;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    right: 0;
    top: 0;

    > * {
      align-items: center;
      display: flex;
      flex-direction: row;
      font-size: toRem(12px);
      justify-content: center;
      width: toRem(80px);
    }

    .delete {
      background: $red;
    }
  }

  .left, .right {
    flex: 1;
    display: flex;
  }

  .aph-token-icon {
    flex: none;
    padding-right: $space;
  }

  .token {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;

    .currency {
      color: $dark;
      font-family: GilroyMedium;
      margin-bottom: $space-sm;
    }

    .value {
      @extend %small-uppercase-grey-label-dark;
    }
  }

  .balance {
    display: flex;
    flex-direction: column;
    flex: 1;
    font-family: GilroyMedium;
    justify-content: center;
    text-align: right;

    .amount {
      color: $dark;
      font-family: GilroyMedium;
      margin-bottom: $space-sm;
    }

    .change {
      &.increase {
        color: $green;

        &:before {
          content: "+";
        }

        &:after {
          content: "%";
        }
      }

      &.decrease {
        color: $red;
      }

      &:after {
        content: "%";
      }
    }
  }

  &.show-actions {
    .content {
      left: toRem(-80px);
    }

    .actions {
      opacity: 1;
    }
  }
}
</style>

