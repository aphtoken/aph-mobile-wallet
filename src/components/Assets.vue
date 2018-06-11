<template>
  <section id="assets" :class="{'show-add-token': showAddToken}">
    <div class="header">
      <div class="title">Assets</div>
      <div class="search">
        <div class="inner">
          <aph-icon name="search"></aph-icon>
          <div class="input">
            <input type="text" placeholder="Search" v-model="searchBy">
          </div>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="holdings">
        <aph-holding :holding="holding" v-for="(holding, index) in filteredHoldings" :key="index"></aph-holding>
      </div>
      <div class="add-btn" @click="showAddToken = true">
        <aph-icon name="plus"></aph-icon>
      </div>
    </div>
    <div class="add-token">
      <div class="control" @click="showAddToken = false">
        <aph-icon name="chevron-down"></aph-icon>
        <div class="title">Add Token</div>
      </div>
      <div class="body">
        <div class="inner">
          <div class="body">
            <aph-icon name="create"></aph-icon>
            <div class="title">Enter token details to add custom token.</div>
            <div class="form">
              <aph-input :light="true" placeholder="Address" v-model="address"></aph-input>
              <aph-input :light="true" placeholder="Token Symbol" v-model="symbol"></aph-input>
              <aph-input :light="true" placeholder="Decimals" v-model="decimals"></aph-input>
            </div>
          </div>
        </div>
      </div>
      <button class="submit-btn" @click="add" :disabled="shouldDisableAddButton">Add</button>
    </div>
  </section>
</template>

<script>
export default {
  computed: {
    filteredHoldings() {
      const searchBy = this.searchBy.toLowerCase();

      if (!searchBy.length) {
        return this.holdings;
      }

      return _.filter(this.holdings, ({ name, symbol }) => {
        if (!name || !symbol) {
          return false;
        }

        return name.toLowerCase().indexOf(searchBy) > -1
          || symbol.toLowerCase().indexOf(searchBy) > -1;
      });
    },

    shouldDisableAddButton() {
      return !this.address.length || !this.decimals.length || !this.symbol.length;
    },
  },

  data() {
    return {
      address: '',
      decimals: '',
      holdings: [
        {
          balance: 211414,
          change24hrPercent: '2.77',
          name: 'Aphelion',
          symbol: 'APH',
          value: 325557.56,
        },
        {
          balance: 28.67,
          change24hrPercent: '-10.52',
          name: 'Neo',
          symbol: 'NEO',
          value: 3560.56,
        },
      ],
      searchBy: '',
      showAddToken: false,
      symbol: '',
    };
  },

  methods: {
    add() {
      //
    },
  },

  watch: {
    showAddToken() {
      this.address = this.decimals = this.symbol = '';
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

    > .search {
      margin: $space-lg 0 toRem(-26px);
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
    flex: 1;
    overflow: auto;
    padding: $space;
    padding-top: toRem(25px);

    .holdings {
      .holding {
        margin-top: $space;
      }
    }

    .add-btn {
      @extend %btn-circle;

      bottom: $space-lg;
      box-shadow: $box-shadow;
      position: fixed;
      right: $space-lg;
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
          height: toRem(14px);
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
        margin: $space $space 0;

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


