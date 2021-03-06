<template>
  <section id="assets" :class="{'show-add-token': showAddToken}">
    <div class="header">
      <div class="title">{{$t('Assets')}}</div>
      <aph-search-bar v-model="searchBy"></aph-search-bar>
    </div>
    <div class="body">
      <div class="holdings">
        <aph-holding :holding="holding" v-for="(holding, index) in filteredHoldings" :key="index" :on-remove="remove" :on-swipe="onSwipe" :show-actions="holdingWithActionsShowing && holdingWithActionsShowing.assetId === holding.assetId"></aph-holding>
      </div>
      <div class="add-btn" @click="showAddToken = true">
        <aph-icon name="plus"></aph-icon>
      </div>
    </div>
    <div class="add-token">
      <div class="control" @click="hideAddToken">
        <aph-icon name="arrow-down"></aph-icon>
        <div class="title">{{ $t('addToken') }}</div>
      </div>
      <div class="body">
        <div class="inner">
          <div class="body">
            <aph-icon name="create"></aph-icon>
            <div class="form">
              <aph-input :placeholder="$t('hashOrToken')" :light="true" v-model="hashOrSymbol"></aph-input>
            </div>
          </div>
        </div>
      </div>
      <button class="submit-btn" @click="add" :disabled="shouldDisableAddButton">{{ $t('Add') }}</button>
    </div>
  </section>
</template>


<script>
import { BigNumber } from 'bignumber.js';

export default {
  computed: {
    holdingsWithCanRemove() {
      return this.$store.state.holdings.map((holding) => {
        const canRemove = holding.isNep5 && holding.isUserAsset
          && holding.symbol !== 'APH' && new BigNumber(holding.balance).isZero();

        return _.merge(_.cloneDeep(holding), { canRemove });
      });
    },

    filteredHoldings() {
      const searchBy = this.searchBy.toLowerCase();

      if (!searchBy.length) {
        return this.holdingsWithCanRemove;
      }

      return _.filter(this.holdingsWithCanRemove, ({ name, symbol }) => {
        if (!name || !symbol) {
          return false;
        }

        return name.toLowerCase().indexOf(searchBy) > -1
          || symbol.toLowerCase().indexOf(searchBy) > -1;
      });
    },

    shouldDisableAddButton() {
      return !this.hashOrSymbol.length;
    },
  },

  data() {
    return {
      holdingWithActionsShowing: null,
      hashOrSymbol: '',
      searchBy: '',
      showAddToken: false,
    };
  },

  methods: {
    add() {
      this.$store.dispatch('addToken', {
        hashOrSymbol: this.hashOrSymbol,
        done: () => {
          this.showAddToken = false;
        },
      });
    },

    hideAddToken() {
      this.showAddToken = false;
    },

    onSwipe(holding, direction) {
      if (!holding.canRemove) {
        return;
      }

      if (direction === 'right' && this.holdingWithActionsShowing
        && holding.assetId === this.holdingWithActionsShowing.assetId) {
        this.holdingWithActionsShowing = null;
      } else if (direction === 'left' && !this.holdingWithActionsShowing) {
        this.holdingWithActionsShowing = holding;
      } else if (direction === 'left' && holding.assetId !== this.holdingWithActionsShowing.assetId) {
        this.holdingWithActionsShowing = holding;
      }
    },

    remove(holding) {
      // this.$services.tokens.remove(holding.asset, this.$store.state.currentNetwork.net);
      this.$services.assets.removeUserAsset(holding.assetId);
      this.$services.alerts.success(`Removed ${holding.symbol}`);
      this.$store.dispatch('fetchHoldings');
    },
  },

  watch: {
    showAddToken() {
      this.hashOrSymbol = '';
      this.$store.commit('endRequest', { identifier: 'addToken' });
      this.$store.dispatch('fetchHoldings');
    },
  },
};
</script>

<style lang="scss">
#assets {
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

    .aph-search-bar {
      margin: $space 0 toRem(-26px);
    }
  }

  > .body {
    background: $background;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    flex: 1;
    overflow: auto;
    padding: $space;
    padding-top: toRem(26px);

    .holdings {
      .holding {
        margin-top: $space;
      }
    }

    .add-btn {
      @extend %btn-circle;

      bottom: $space-sm;
      box-shadow: $box-shadow;
      position: fixed;
      right: $space-sm;
    }
  }

  > .add-token {
    @include transition(top);

    display: flex;
    flex-direction: column;
    height: 100%;
    left: 0;
    overflow: hidden;
    position: fixed;
    top: 100vh;
    width: 100%;
    z-index: 200;

    > .control {
      background: $dark;
      padding: $space;
      flex: none;
      position: relative;

      .aph-icon {
        position: absolute;

        svg {
          height: toRem(20px);
        }
      }

      .title {
        text-align: center;
      }
    }

    > .body {
      @extend %tile-grid;

      color: $dark;
      flex: 1;
      overflow: auto;
      display: flex;
      flex-direction: column;

      > .inner {
        background: white;
        border-radius: $border-radius;
        flex: 1;
        margin: 0 $space;

        .body {
          display: flex;
          flex-direction: column;
          align-items: center;

          .aph-icon {
            margin: $space-lg 0;

            svg {
              height: toRem(50px);

              .fill {
                fill: $purple;
              }
            }
          }

          .title {
            font-family: GilroyMedium;
            line-height: $copy-line-height;
            text-align: center;
            width: 50vw;
            margin-bottom: $space-lg;
          }

          .form {
            padding: 0 $space;
            width: 100%;
          }

          .aph-request-status-message {
            margin: $space;

            .aph-icon {
              margin: 0;
            }
          }
        }
      }
    }

    .submit-btn {
      @extend %btn-footer;
    }
  }

  &.show-add-token {
    > .add-token {
      top: 0vh;
    }
  }
}
</style>


