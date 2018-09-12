<template>
  <commit-modal-wrapper id="commit--claim-modal">
    <template v-if="$store.state.commitState.ableToClaimHeight <= this.currentBlock">
      <p>
        {{$t('areYouSureYouWantToClaim')}}
      </p>
      <p>
        {{$t('committedAPHBalance', {
          balance: $store.state.commitState.quantityCommitted
        })}}
      </p>
    </template>
    <template v-else>
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
    </template>
    <button class="claim-btn" @click="onClaim">{{$t('claim')}}</button>
    <template slot="footer">
      <button class="cancel-btn" @click="onClose">{{ $t('cancel') }}</button>
    </template>
  </commit-modal-wrapper>
</template>

<script>
import { mapGetters } from 'vuex';
import CommitModalWrapper from './CommitModalWrapper';

export default {
  components: {
    CommitModalWrapper,
  },

  computed: {
    currentBlock() {
      return this.currentNetwork && this.currentNetwork.bestBlock ? this.currentNetwork.bestBlock.index : 0;
    },

    ...mapGetters([
      'currentNetwork',
    ]),
  },

  methods: {
    onClaim() {
      this.$services.dex.claimAPH();
      this.onClose();
    },

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
#commit--claim-modal {
  > .body {
    .content {
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

      .claim-btn {
        @extend %btn;

        margin-top: $space-lg;
      }
    }
  }

  > .footer {
    .cancel-btn {
      @extend %btn-footer-light;

      width: 100%;
    }
  }
}
</style>
