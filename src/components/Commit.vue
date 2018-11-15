<template>
  <section id="commit">
    <div class="header">
      <div class="title">{{ $t('commit') }}</div>
      <div class="icon" @click="showInfoModal = true">
        <aph-icon name="info"></aph-icon>
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
                <div class="highlight">{{ $formatNumber(getCommitStateNumericalField('totalFeesCollected')) }} APH</div>
                <div class="pair">
                  <div class="label">{{ $t('estimated') }} ({{ $store.state.currency }})</div>
                  <div class="value">{{ $formatNumber(aphHolding ? aphHolding.unitValue * getCommitStateNumericalField('totalFeesCollected') : 0) }}</div>
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
                <div class="highlight">{{ $formatNumber(getCommitStateNumericalField('feesCollectedSinceCommit')) }} APH</div>
                <div class="pair">
                  <div class="label">{{ $t('estimated') }} ({{ $store.state.currency }})</div>
                  <div class="value">{{ $formatNumber(aphHolding ? aphHolding.unitValue * getCommitStateNumericalField('feesCollectedSinceCommit') : 0) }}</div>
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
                <div class="highlight">{{ $formatNumber(getCommitStateNumericalField('quantityCommitted')) }} APH</div>
                <div class="pair">
                  <div class="label">{{ $t('estimated') }} ({{ $store.state.currency }})</div>
                  <div class="value">{{ $formatNumber(aphHolding ? aphHolding.unitValue * getCommitStateNumericalField('quantityCommitted') : 0) }}</div>
                </div>
              </div>
            </div>
            <div class="slide date-committed" v-touch:swipe.left="goToMyWeight" v-touch:swipe.right="goToAmountCommitted">
              <div class="content">
                <h1 class="underlined">{{ $t('dateCommitted') }}</h1>
                <div class="highlight">{{ $formatDate(getCommitStateNumericalField('contributionTimestamp')) }}</div>
                <div class="pair">
                  <div class="label">{{ $t('time') }}</div>
                  <div class="value">{{ $formatTime(getCommitStateNumericalField('contributionTimestamp')) }}</div>
                </div>
                <div class="pair">
                  <div class="label">{{ $t('block') }}</div>
                  <div class="value">{{ getCommitStateNumericalField('contributionHeight') || '--' }}</div>
                </div>
              </div>
            </div>
            <div class="slide my-weight" v-touch:swipe.left="goToFeesEarned"  v-touch:swipe.right="goToDateCommitted">
              <div class="content">
                <h1 class="underlined">{{ $t('myWeight') }}</h1>
                <div class="highlight">{{ $formatNumber(getCommitStateNumericalField('weightPercentage')) }}%</div>
                <div class="pair">
                  <div class="label">{{ $t('myWeight') }}</div>
                  <div class="value">{{ $abbreviateNumber(getCommitStateNumericalField('userWeight')) }}</div>
                </div>
                <div class="pair">
                  <div class="label">{{ $t('networkWeight') }}</div>
                  <div class="value">{{ $abbreviateNumber(getCommitStateNumericalField('networkWeight')) }}</div>
                </div>
              </div>
            </div>
            <div class="slide fees-earned" v-touch:swipe.right="goToMyWeight">
              <div class="content">
                <h1 class="underlined">{{ $t('feesEarned') }}</h1>
                <div class="highlight">~{{ getCommitStateNumericalField('availableToClaim') }} APH</div>
                <div class="pair">
                  <div class="label">{{ $t('estimated') }} ({{ $store.state.currency }})</div>
                  <div class="value">{{ $formatNumber(aphHolding ? aphHolding.unitValue * getCommitStateNumericalField('availableToClaim') : 0) }}</div>
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
        <template v-if="getCommitStateNumericalField('quantityCommitted') > 0">
          <div class="inner" v-if="getCommitStateNumericalField('ableToClaimHeight') > currentBlock">
            <div class="header">{{ getCommitStateNumericalField('ableToClaimHeight') - currentBlock }}</div>
            <div class="copy">{{ $t('blocksUntilClaim') }} ({{ getCommitStateNumericalField('ableToCompoundHeight') }})</div>
          </div>
          <div class="inner" v-else-if="getCommitStateNumericalField('ableToCompoundHeight') > currentBlock">
            <div class="header">{{ $store.state.commitState.ableToCompoundHeight - currentBlock }}</div>
            <div class="copy">{{ $t('blocksUntilClaim') }} ({{ getCommitStateNumericalField('ableToCompoundHeight') }})</div>
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
          <button class="commit-btn" v-if="shouldShowCommitButton" @click="showCommitModal = true" :disabled="shouldDisableCommitButton">
            <aph-icon name="commit"></aph-icon>
            <p>{{ $t('commit') }}</p>
          </button>
          <button class="claim-btn" v-else @click="showClaimModal = true" :disabled="shouldDisableClaimButton">
            <aph-icon name="claim"></aph-icon>
            <p>{{ $t('claim') }}</p>
          </button>
          <button class="compound-btn" @click="compound" :disabled="shouldDisableCompoundButton">
            <aph-icon name="compound"></aph-icon>
            <p>{{ $t('compound') }}</p>
          </button>
        </div>
      </div>
    </div>
     <commit-claim-modal v-if="showClaimModal" :onClose="() => this.showClaimModal = false"></commit-claim-modal>
     <commit-commit-modal v-if="showCommitModal" :onClose="() => this.showCommitModal = false"></commit-commit-modal>
     <commit-info-modal v-if="showInfoModal" :onClose="() => this.showInfoModal = false"></commit-info-modal>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import CommitClaimModal from './modals/CommitClaim';
import CommitInfoModal from './modals/CommitInfo';
import CommitCommitModal from './modals/CommitCommit';

let loadCommitStateIntervalId;

export default {
  beforeDestroy() {
    clearInterval(loadCommitStateIntervalId);
  },

  components: {
    CommitClaimModal,
    CommitCommitModal,
    CommitInfoModal,
  },

  computed: {
    ...mapGetters([
      'currentNetwork',
    ]),

    activeMiddleSlideClass() {
      return `active-slide-${this.activeMiddleSlide}`;
    },

    activeTopSlideClass() {
      return `active-slide-${this.activeTopSlide}`;
    },

    aphHolding() {
      if (this.$store.state.holdings) {
        const holding = _.find(this.$store.state.holdings, (holding) => {
          return holding.assetId === this.currentNetwork.aph_hash;
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

    shouldDisableCommitButton() {
      if (!this.$store.state.commitState) {
        return true;
      }
      return this.$store.state.commitChangeInProgress;
    },

    shouldDisableClaimButton() {
      if (!this.$store.state.commitState) {
        return true;
      }
      return this.$store.state.commitState.quantityCommitted <= 0 || this.$store.state.commitChangeInProgress;
    },

    shouldDisableCompoundButton() {
      if (!this.$store.state.commitState) {
        return true;
      }
      return this.$store.state.commitState.quantityCommitted <= 0
        || this.$store.state.commitState.ableToCompoundHeight > this.currentBlock || this.$store.state.commitChangeInProgress;
    },

    shouldShowCommitButton() {
      if (!this.$store.state.commitState) {
        return true;
      }
      return this.$store.state.commitState.quantityCommitted <= 0;
    },
  },

  data() {
    return {
      activeMiddleSlide: 'amount-committed',
      activeTopSlide: 'total-dex-fees',
      showClaimModal: false,
      showCommitModal: false,
      showInfoModal: false,
    };
  },

  methods: {
    compound() {
      this.$services.dex.compoundAPH();
    },

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

    getCommitStateNumericalField(fieldName) {
      if (!this.$store.state.commitState) {
        return 0;
      }
      return this.$store.state.commitState[fieldName] ? this.$store.state.commitState[fieldName] : 0;
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
              padding: $space $space $space (toRem(50px + $space));

              @include lowRes() {
                padding: $space $space $space (toRem(35px + $space));
              }
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

        .line {
          background: $purple;
          content: " ";
          height: $border-width;
          margin-top: $space-lg;
          width: 5vw;

          @include lowRes() {
            margin-top: $space;
            transform: scale(.9);
          }
        }

        .header {
          color: $purple;
          font-family: GilroySemibold;
          font-size: toRem(18px);
          margin-top: $space-lg;

          @include lowRes() {
            margin-top: $space;
            transform: scale(.9);
          }
        }

        .copy {
          @extend %small-uppercase-grey-label-dark;

          line-height: 200%;
          margin-top: $space-lg;
          text-align: center;

          .block {
            color: $dark;
          }

          @include lowRes() {
            margin-top: $space;
            transform: scale(.9);
          }
        }
      }

      .btn-group {
        display: flex;
        flex: none;
        flex-direction: row;
        justify-content: space-evenly;
        margin-top: toRem(-62.5px);
        width: 100%;
        z-index: 100;

        > * {
          @extend %btn-square;

          background: $purple;
          box-shadow: $box-shadow;
          width: 40%;

          > p {
            color: white;
            margin-top: 0;
          }

          &.disabled, &:disabled {
            background-color: $grey;
            color: $dark;

            > p {
              color: $dark;
              margin-top: 0;
            }
          }

          @include lowRes() {
            height: toRem(100px);

            .aph-icon {
              svg {
                height: toRem(35px);
              }
            }
          }
        }

        @include lowRes() {
          margin-top: toRem(-50px);
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
            margin-right: toRem(-46px);
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

            @include lowRes() {
              margin-right: toRem(-32px);

              .hex {
                height: toRem(70px);
              }

              .aph-icon:last-child {
                svg {
                  height: toRem(35px);
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

              @include lowRes() {
                font-size: toRem(14px);
              }
            }

            .title {
              font-family: GilroySemibold;
              font-size: toRem(16px);

              @include lowRes() {
                font-size: toRem(14px);
              }
            }

            .highlight {
              color: $purple;
              font-size: toRem(18px);
              margin: $space 0;

              @include lowRes() {
                font-size: toRem(16px);
                margin: $space-sm 0;
              }
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

              @include lowRes() {
                font-size: toRem(10px);
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
}
</style>
