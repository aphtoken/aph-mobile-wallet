<template>
  <section id="commit--info-modal">
    <div class="body">
      <div class="icons">
        <aph-icon name="hex"></aph-icon>
        <aph-icon name="commit"></aph-icon>
      </div>
      <div class="content">
        <div v-if="$store.state.commitState.ableToClaimHeight <= this.currentBlock">
          <p>
            {{$t('areYouSureYouWantToClaim')}}
          </p>
          <p>
            {{$t('committedAPHBalance', {
              balance: $store.state.commitState.quantityCommitted
            })}}
          </p>
        </div>
        <div v-else>
          <p>
            {{$t('notMetMinimumBlocksToClaim')}}
          </p>
          <p>
            {{$t('youMayStillClaim', {
              balance: $store.state.commitState.quantityCommitted
            })}}
          </p>
          <p>
            {{$t('waitAnAdditionalBlocks', {
              blocks: $store.state.commitState.ableToClaimHeight - this.currentBlock
            })}}
          </p>
        </div>
        <button class="commit-btn" @click="onConfirmed()">{{$t('claim')}}</button>
      </div>
    </div>
    <div class="cancel-btn" @click="onClose">{{ $t('cancel') }}</div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    currentBlock() {
      return this.currentNetwork && this.currentNetwork.bestBlock ? this.currentNetwork.bestBlock.index : 0;
    },

    shouldDisableCommitButton() {
      return !this.amount.length || this.amount <= 0;
    },

    ...mapGetters([
      'currentNetwork',
    ]),
  },

  data() {
    return {
      amount: '',
    };
  },

  methods: {
    setAmountToMax() {
      if (this.aphHolding) {
        this.amount = this.aphHolding.balance.toString();
      }
    },
  },

  props: {
    onClose: {
      required: true,
      type: Function,
    },
  },
};
</script>

<style lang="scss">
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

      .title {
        color: $purple;
        font-family: GilroySemibold;
        margin-top: $space;
        text-align: center;
      }

      .help-text {
        margin-top: $space;
        text-align: center;
      }

      .max {
        @extend %small-uppercase-grey-label;

        color: $purple;
        flex: none;
        margin-top: $space-sm;
        text-align: right;
      }

      .commit-btn {
        @extend %btn;

        margin-top: $space-lg;
      }
    }
  }

  > .cancel-btn {
    @extend %btn-footer-light;

    flex: none;
    width: 100%;
  }
}
</style>
