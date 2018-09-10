<template>
  <section id="assets" :class="{'show-add-token': showAddToken}">
    <div class="header">
      <div class="title">{{ $t('commit') }}</div>
    </div>
    <div class="body">
      <div class="top">
        <div class="slide total-fees">
          <div class="icons">
            <aph-icon name="hex"></aph-icon>
            <aph-icon name="star"></aph-icon>
          </div>
          <div class="content">
            <div class="title">Total fees collected at time of commitment</div>
            <div class="amount">{{ $formatNumber(0) }} APH</div>
            <div class="estimated-value">estimated (usd) <span class="value">{{ $formatMoneyWithoutCents(0) }}</span></div>
          </div>
        </div>
        <div class="slide-controls">
          <div :class="['control', {active: 'asdf' === 'total-fees'}]"></div>
          <div :class="['control', {active: 'asdf' === 'transaction-history'}]"></div>
        </div>
      </div>
      <div class="middle"></div>
      <div class="bottom">
        <div class="line"></div>
        <div class="copy">
          commit aphelion to be eligible<br />current block <span class="block">{{ $formatNumber(2533022) }}</span>
        </div>
        <div class="btn-group">
          <div class="commit-btn">
            <aph-icon name="commit"></aph-icon>
            <p>{{ $t('Commit') }}</p>
          </div>
          <div class="claim-btn">
            <aph-icon name="claim"></aph-icon>
            <p>{{ $t('Claim') }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  computed: {
    //
  },

  data() {
    return {
      //
    };
  },

  methods: {
    //
  },

  watch: {
    //
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
    padding: $space;

    .slide-controls {
      display: flex;
      flex-direction: row;
      flex: none;
      justify-content: center;
      padding: $space 0;

      .control {
        background: $grey;
        border-radius: 50%;
        height: toRem(8px);
        width: toRem(8px);

        &.active {
          background: $purple;
        }

        & + .control {
          margin-left: $space;
        }
      }
    }

    > .top {
      > .slide {
        display: flex;

        .icons {
          align-items: center;
          display: flex;
          flex: none;
          margin-right: toRem(-47px);
          position: relative;
          z-index: 10;

          .hex {
            height: toRem(100px);
          }

          .aph-icon:last-child {
            left: 50%;
            position: absolute;
            top: 50%;
            transform: translate(-50%, -50%);

            svg {
              height: toRem(50px);

              .fill {
                fill: $purple;
              }
            }
          }
        }
        .content {
          @extend %tile-light;

          background: $grey;
          color: $dark;
          flex: 1;
          padding: $space $space-xxl;

          .title {
            font-family: GilroySemibold;
            font-size: toRem(16px);
          }

          .amount {
            color: $purple;
            font-size: toRem(18px);
            margin: $space 0;
          }

          .estimated-value {
            @extend %small-uppercase-grey-label-dark;

            .value {
              color: $dark;
            }
          }
        }
      }
    }

    > .middle {}

    > .bottom {
      @extend %tile-light;

      display: flex;
      flex-direction: column;
      flex: none;
      align-items: center;

      .line {
        background: $purple;
        content: " ";
        height: $border-width-thick;
        margin: $space-xl 0 $space-lg;
        width: 5vw;
      }

      .copy {
        @extend %small-uppercase-grey-label-dark;

        line-height: 200%;
        margin-bottom: $space-lg;
        text-align: center;

        .block {
          color: $dark;
        }
      }

      .btn-group {
        display: flex;
        flex: none;
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: toRem(-62.5px);
        padding: 0 $space-lg;
        width: 100%;
        z-index: 100;

        .commit-btn, .claim-btn {
          @extend %btn-square;

          box-shadow: $box-shadow;
          width: 100%;

          > p {
            margin-top: 0;
          }
        }

        .commit-btn {
          background: $purple;
          box-shadow: $box-shadow;
          margin-right: $space-lg;

          > p {
            color: white;
          }
        }

        .claim-btn {
          background: $grey;
          color: $darker-grey;

          .aph-icon {
            svg {
              .fill {
                fill: $darker-grey;
              }
            }
          }
        }
      }
    }
  }
}
</style>


