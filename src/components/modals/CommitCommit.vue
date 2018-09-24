<template>
  <commit-modal-wrapper id="commit--commit-modal">
    <div class="title">{{ $t('Commit') }}</div>
    <div class="help-text">{{ $t('howMuchWouldYouLikeToCommit') }}</div>
    <aph-input type="number" :light="true" v-model="amount"></aph-input>
    <div class="max" @click="setAmountToMax">{{ $t('max') }}</div>
    <button class="commit-btn" @click="onCommit" :disabled="shouldDisableCommitButton">{{ $t('commit') }}</button>
    <template slot="footer">
      <button class="cancel-btn" @click="onClose">{{ $t('cancel') }}</button>
    </template>
  </commit-modal-wrapper>
</template>

<script>
import { BigNumber } from 'bignumber.js';
import CommitModalWrapper from './CommitModalWrapper';

export default {
  components: {
    CommitModalWrapper,
  },

  computed: {
    aphHolding() {
      if (this.$store.state.holdings) {
        const holding = _.find(this.$store.state.holdings, { assetId: this.$services.assets.APH });

        if (holding) {
          return holding;
        }
      }

      return {
        balance: 0,
        contractBalance: 0,
        openOrdersBalance: 0,
        symbol: 'APH',
        totalBalance: 0,
      };
    },

    shouldDisableCommitButton() {
      return !this.amount.length || this.amount <= 0;
    },
  },

  data() {
    return {
      amount: '',
    };
  },

  methods: {
    onCommit() {
      this.$services.dex.commitAPH(new BigNumber(this.amount).toNumber());
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
#commit--commit-modal {
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

    .commit-btn {
      @extend %btn;

      margin-top: $space-lg;
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
