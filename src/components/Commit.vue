<template>
  <section id="commit">
    <div class="header">
      <div class="title">{{ $t('commit') }}</div>
      <div class="icon" @click="showInfoModal = true">
        <aph-icon name="info" @click="showInfoModal = true"></aph-icon>
      </div>
    </div>
    <div class="body">
      <div class="top">
        <div class="slide-wrapper">
          <div :class="['slides', activeTopSlideClass]">
            <div class="slide total-dex-fees" v-touch:swipe.left="goToTotalCommitmentFees">
              <div class="icons">
                <aph-icon name="hex"></aph-icon>
                <aph-icon name="award"></aph-icon>
              </div>
              <div class="content">
                <div class="title">{{ $t('totalFeesCollectedByDex') }}</div>
                <div class="highlight">{{ $formatNumber($store.state.commitState.totalFeesCollected) }} APH</div>
                <div class="pair">
                  <div class="label">{{ $t('estimated') }} ({{ $store.state.currency }})</div>
                  <div class="value">{{ $formatNumber(aphHolding ? aphHolding.unitValue * $store.state.commitState.totalFeesCollected : 0) }}</div>
                </div>
              </div>
            </div>
            <div class="slide total-commitment-fees" v-touch:swipe.right="goToTotalDexFees">
              <div class="icons">
                <aph-icon name="hex"></aph-icon>
                <aph-icon name="star"></aph-icon>
              </div>
              <div class="content">
                <div class="title">{{ $t('totalFeesCollectedSinceCommit') }}</div>
                <div class="highlight">{{ $formatNumber($store.state.commitState.feesCollectedSinceCommit) }} APH</div>
                <div class="pair">
                  <div class="label">{{ $t('estimated') }} ({{ $store.state.currency }})</div>
                  <div class="value">{{ $formatNumber(aphHolding ? aphHolding.unitValue * $store.state.commitState.feesCollectedSinceCommit : 0) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="slide-controls">
          <div :class="['control', {active: activeTopSlide === 'total-dex-fees'}]" @click="goToTotalDexFees"></div>
          <div :class="['control', {active: activeTopSlide === 'total-commitment-fees'}]" @click="goToTotalCommitmentFees"></div>
        </div>
      </div>
      <div class="middle">
        <div class="slide-wrapper">
          <div :class="['slides', activeMiddleSlideClass]">
            <div class="slide amount-committed" v-touch:swipe.left="goToDateCommitted">
              <div class="content">
                <h1 class="underlined">{{ $t('amountCommitted') }}</h1>
                <div class="highlight">{{ $formatNumber($store.state.commitState.quantityCommitted) }} APH</div>
                <div class="pair">
                  <div class="label">{{ $t('estimated') }} ({{ $store.state.currency }})</div>
                  <div class="value">{{ $formatNumber(aphHolding ? aphHolding.unitValue * $store.state.commitState.quantityCommitted : 0) }}</div>
                </div>
              </div>
            </div>
            <div class="slide date-committed" v-touch:swipe.left="goToMyWeight" v-touch:swipe.right="goToAmountCommitted">
              <div class="content">
                <h1 class="underlined">{{ $t('dateCommitted') }}</h1>
                <div class="highlight">{{ $formatDate($store.state.commitState.contributionTimestamp) }}</div>
                <div class="pair">
                  <div class="label">{{ $t('time') }}</div>
                  <div class="value">{{ $formatTime($store.state.commitState.contributionTimestamp) }}</div>
                </div>
                <div class="pair">
                  <div class="label">{{ $t('block') }}</div>
                  <div class="value">{{ $store.state.commitState.contributionHeight || '--' }}</div>
                </div>
              </div>
            </div>
            <div class="slide my-weight" v-touch:swipe.left="goToFeesEarned"  v-touch:swipe.right="goToDateCommitted">
              <div class="content">
                <h1 class="underlined">{{ $t('myWeight') }}</h1>
                <div class="highlight">{{ $formatNumber($store.state.commitState.weightPercentage) }}%</div>
                <div class="pair">
                  <div class="label">{{ $t('myWeight') }}</div>
                  <div class="value">{{ $abbreviateNumber($store.state.commitState.userWeight) }}</div>
                </div>
                <div class="pair">
                  <div class="label">{{ $t('networkWeight') }}</div>
                  <div class="value">{{ $abbreviateNumber($store.state.commitState.networkWeight) }}</div>
                </div>
              </div>
            </div>
            <div class="slide fees-earned" v-touch:swipe.right="goToMyWeight">
              <div class="content">
                <h1 class="underlined">{{ $t('feesEarned') }}</h1>
                <div class="highlight">~{{ $store.state.commitState.availableToClaim }} APH</div>
                <div class="pair">
                  <div class="label">{{ $t('estimated') }} ({{ $store.state.currency }})</div>
                  <div class="value">{{ $formatNumber(aphHolding ? aphHolding.unitValue * $store.state.commitState.availableToClaim : 0) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="slide-controls">
          <div :class="['control', {active: activeMiddleSlide === 'amount-committed'}]" @click="goToAmountCommitted"></div>
          <div :class="['control', {active: activeMiddleSlide === 'date-committed'}]" @click="goToDateCommitted"></div>
          <div :class="['control', {active: activeMiddleSlide === 'my-weight'}]" @click="goToMyWeight"></div>
          <div :class="['control', {active: activeMiddleSlide === 'fees-earned'}]" @click="goToFeesEarned"></div>
        </div>
      </div>
      <div class="bottom">
        <template v-if="$store.state.commitState.quantityCommitted > 0">
          <div class="inner" v-if="$store.state.commitState.ableToClaimHeight > currentBlock">
            <div class="copy">{{ $store.state.commitState.ableToClaimHeight - currentBlock }}<br />{{ $t('blocksUntilClaim') }} ({{ $store.state.commitState.ableToCompoundHeight }})</div>
          </div>
          <div class="inner" v-else-if="$store.state.commitState.ableToCompoundHeight > currentBlock">
            <div class="copy">{{ $store.state.commitState.ableToClaimHeight - currentBlock }}<br />{{ $t('blocksUntilClaim') }} ({{ $store.state.commitState.ableToCompoundHeight }})</div>
          </div>
          <div class="inner" v-else>
            <div class="line"></div>
            <div class="copy">{{ $t('eligibleToCompound') }}</div>
          </div>
        </template>
        <template v-else>
          <div class="inner">
            <div class="line"></div>
            <div class="copy">
              {{ $t('commitAphelionToBeEligible') }}<br />{{ $t('currentBlock') }} <span class="block">{{ currentBlock }}</span>
            </div>
          </div>
        </template>
        <div class="btn-group">
          <div class="claim-btn">
            <aph-icon name="claim"></aph-icon>
            <p>{{ $t('Claim') }}</p>
          </div>
          <div class="commit-btn" v-if="shouldShowCommitButton">
            <aph-icon name="commit"></aph-icon>
            <p>{{ $t('Commit') }}</p>
          </div>
          <div class="compound-btn" v-if="shouldShowCompoundButton">
            <aph-icon name="compound"></aph-icon>
            <p>{{ $t('Compound') }}</p>
          </div>
        </div>
      </div>
    </div>
    <div id="commit--info-modal" v-if="showInfoModal">
      <div class="body">
        <div class="icons">
          <aph-icon name="hex"></aph-icon>
          <aph-icon name="commit"></aph-icon>
        </div>
        <div class="content">
          <p>{{$t('commitInfoBody1')}}</p>
          <p>{{$t('commitInfoBody2', { minClaimBlocks: $store.state.commitState.minimumClaimBlocks})}}</p>
          <p>{{$t('commitInfoBody3')}}</p>
          <p>{{$t('commitInfoBody4')}}</p>
        </div>
      </div>
      <div class="close-btn" @click="showInfoModal = false">{{ $t('close') }}</div>
    </div>
  </section>
</template>

<script>
// import { BigNumber } from 'bignumber.js';
import { mapGetters } from 'vuex';
// import CommitInfo from './modals/CommitInfo';
// import CommitModal from './modals/CommitModal';
// import ClaimModal from './modals/ClaimModal';

let loadCommitStateIntervalId;

export default {
  beforeDestroy() {
    clearInterval(loadCommitStateIntervalId);
  },

  computed: {
    activeMiddleSlideClass() {
      return `active-slide-${this.activeMiddleSlide}`;
    },

    activeTopSlideClass() {
      return `active-slide-${this.activeTopSlide}`;
    },

    aphHolding() {
      if (this.$store.state.holdings) {
        const holding = _.find(this.$store.state.holdings, (o) => {
          return o.assetId === this.$services.assets.APH;
        });

        if (holding) {
          return holding;
        }
      }

      return {
        symbol: 'APH',
        balance: 0,
        totalBalance: 0,
        contractBalance: 0,
        openOrdersBalance: 0,
        unitValue: 0,
      };
    },

    blocksSinceCommitted() {
      if (this.blockCommitted <= 0) {
        return 0;
      }
      return this.currentBlock - this.blockCommitted;
    },

    currentBlock() {
      return this.currentNetwork && this.currentNetwork.bestBlock ? this.currentNetwork.bestBlock.index : 0;
    },

    shouldDisableClaimButton() {
      return this.$store.state.commitState.quantityCommitted <= 0;
    },

    shouldShowCommitButton() {
      return this.$store.state.commitState.quantityCommitted <= 0;
    },

    shouldShowCompoundButton() {
      return !this.shouldShowCommitButton;
    },

    ...mapGetters([
      'currentNetwork',
    ]),
  },

  data() {
    return {
      activeMiddleSlide: 'amount-committed',
      activeTopSlide: 'total-dex-fees',
      showInfoModal: false,
    };
  },

  methods: {
    goToAmountCommitted() {
      this.activeMiddleSlide = 'amount-committed';
    },

    goToDateCommitted() {
      this.activeMiddleSlide = 'date-committed';
    },

    goToFeesEarned() {
      this.activeMiddleSlide = 'fees-earned';
    },

    goToMyWeight() {
      this.activeMiddleSlide = 'my-weight';
    },

    goToTotalCommitmentFees() {
      this.activeTopSlide = 'total-commitment-fees';
    },

    goToTotalDexFees() {
      this.activeTopSlide = 'total-dex-fees';
    },
  },

  mounted() {
    this.$store.dispatch('fetchCommitState');

    loadCommitStateIntervalId = setInterval(() => {
      this.$store.dispatch('fetchCommitState');
    }, this.$constants.intervals.HOLDINGS_POLLING);
  },

  watch: {
    //
  },
};
</script>

<style lang="scss">
#commit {
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
    position: relative;

    .title {
      color: white;
      font-size: toRem(18px);
    }

    > .icon {
      padding: $space;
      position: absolute;
      right: 0;
      top: 0;
      z-index: 100;

      svg {
        height: toRem(20px);
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
    padding: $space 0;

    .slide-controls {
      display: flex;
      flex-direction: row;
      flex: none;
      justify-content: center;
      padding: $space 0;

      .control {
        background: $light-grey;
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

    > .top, > .middle {
      display: flex;
      flex-direction: column;
      flex: none;
    }

    > .top {
      .slide-wrapper {
        .slides {
          width: 200vw;

          .slide {
            .content {
              background: $light-grey;
              padding: $space $space $space $space-xxl;
            }
          }
        }
      }
    }

    > .middle {
      .slide-wrapper {
        .slides {
          width: 400vw;

          .slide {
            .content {
              justify-content: flex-start;
              padding: $space;
            }
          }
        }
      }
    }

    > .bottom {
      display: flex;
      flex-direction: column;
      flex: 1;
      margin: 0 $space;

      .inner {
        @extend %tile-light;

        align-items: center;
        display: flex;
        flex-direction: column;
        flex: 1;
        justify-content: space-around;
        padding-bottom: toRem(62.5px);

        .line {
          background: $purple;
          content: " ";
          height: $border-width-thick;
          margin-top: $space-lg;
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
      }

      .btn-group {
        display: flex;
        flex: none;
        flex-direction: row;
        justify-content: space-around;
        margin-top: toRem(-62.5px);
        width: 100%;
        z-index: 100;

        .commit-btn, .claim-btn, .compound-btn {
          @extend %btn-square;

          box-shadow: $box-shadow;
          width: 40%;

          > p {
            margin-top: 0;
          }
        }

        .claim-btn {
          background: $purple;
          box-shadow: $box-shadow;

          > p {
            color: white;
          }
        }

        .commit-btn, .compound-btn {
          background: $light-grey;
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

    .slide-wrapper {
      display: flex;
      flex: 1;
      position: relative;
      flex-direction: column;

      .slides {
        @include transition(all);

        display: flex;
        flex-direction: row;
        flex: 1;
        font-size: 0;
        left: 0;
        position: relative;

        .slide {
          @include transition(all);

          display: flex;
          flex: 1;
          padding: 0 $space;
          width: 100vw;

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

            color: $dark;
            display: flex;
            flex-direction: column;
            flex: 1;
            justify-content: center;

            h1.underlined {
              @extend %underlined-header;

              font-size: toRem(16px);
              margin-bottom: 0;
            }

            .title {
              font-family: GilroySemibold;
              font-size: toRem(16px);
            }

            .highlight {
              color: $purple;
              font-size: toRem(18px);
              margin: $space 0;
            }

            .pair {
              @extend %small-uppercase-grey-label-dark;

              display: flex;
              flex: none;

              .value {
                color: $dark;
                margin-left: $space-xs;
              }

              & + .pair {
                margin-top: $space-sm;
              }
            }
          }
        }

        &.active-slide-total-dex-fees {
          left: 0;

          > .total-commitment-fees {
            transform: scale(.8);
          }
        }

        &.active-slide-total-commitment-fees {
          left: -100vw;

          > .total-dex-fees {
            transform: scale(.8);
          }
        }

        &.active-slide-amount-committed {
          left: 0;

          > .date-committed {
            transform: scale(.8);
          }
        }

        &.active-slide-date-committed {
          left: -100vw;

          > .my-weight {
            transform: scale(.8);
          }

          > .amount-committed {
            transform-origin: left center;
            transform: scale(.8);
          }
        }

        &.active-slide-my-weight {
          left: -200vw;

          > .fees-earned {
            transform: scale(.8);
          }

          > .date-committed {
            transform-origin: left center;
            transform: scale(.8);
          }
        }

        &.active-slide-fees-earned {
          left: -300vw;

          > .my-weight {
            transform-origin: left center;
            transform: scale(.8);
          }
        }
      }
    }
  }

  #commit--info-modal {
    background: rgba($dark, .7);
    bottom: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    width: 100%;
    z-index: 100;

    > .body {
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: center;
      overflow: hidden;
      padding: $space;

      .icons {
        align-items: center;
        justify-content: center;
        display: flex;
        flex: none;
        position: relative;
        z-index: 10;
        margin-bottom: toRem(-50px);

        .hex {
          height: toRem(100px);

          .fill {
            fill: $purple;
          }
        }

        .aph-icon:last-child {
          left: 50%;
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);

          svg {
            height: toRem(50px);

            .fill {
              fill: white;
            }
          }
        }
      }

      .content {
        @extend %tile-light;

        color: $dark;
        overflow: auto;
        padding: $space-xxl $space $space;

        p {
          font-size: toRem(12px);
          margin: 0;

          & + P {
            margin-top: $space;
          }
        }
      }
    }

    > .close-btn {
      @extend %btn-footer;

      flex: none;
      width: 100%;
    }
  }
}
</style>


