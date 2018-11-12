<template>
  <modal-wrapper id="aph-deposit-withdraw-modal" icon="dex">
    <div class="body">
      <div class="transaction">
        <button :class="{active: transactionType === 'deposit'}" @click="transactionType = 'deposit'">Deposit</button>
        <button :class="{active: transactionType === 'withdraw'}" @click="transactionType = 'withdraw'">Withdraw</button>
      </div>
      <div class="balance-container">
        <div class="balance">
          <span class="label">Contract Balance:</span>
          <span class="value">{{ $formatNumber(holding.contractBalance) }}</span>
        </div>
        <div class="balance">
          <span class="label">Wallet Balance:</span>
          <span class="value">{{ $formatNumber(holding.balance) }}</span>
        </div>
      </div>
      <div class="amount">
        <aph-input :isNumeric="true" @blur="amount = $cleanAmount(amount, holding)" placeholder="Amount" :light="true" v-model="amount"></aph-input>
        <div class="max" v-if="hasAsset" @click="setAmountToMax">Max</div>
      </div>
      <button class="deposit-withdraw-btn" @click="submitTransaction" :disabled="shouldDisableDepositWithdrawButton">Submit {{ transactionType }}</button>
    </div>
    <template slot="footer">
      <button class="cancel-btn" @click="onCancel()">Cancel</button>
    </template>
  </modal-wrapper>
</template>

<script>
import { BigNumber } from 'bignumber.js';

import ModalWrapper from './ModalWrapper';

export default {
  components: {
    ModalWrapper,
  },

  computed: {
    shouldDisableDepositWithdrawButton() {
      return isNaN(this.amount)
        || !this.amount.length
        || this.amount <= 0
        || (this.amount > 0 && (this.isDeposit
          ? this.holding.balance && this.holding.balance.isLessThan(this.amount)
          : this.holding.contractBalance && this.holding.contractBalance.isLessThan(this.amount)));
    },

    holding() {
      return _.find(this.$store.state.holdings, (holding) => {
        return holding.assetId === this.$store.state.depositWithdrawModalModel.holdingAssetId;
      });
    },

    hasAsset() {
      const balance = this.isDeposit ?
        this.holding.balance :
        this.holding.contractBalance;

      return balance > 0;
    },
  },

  data() {
    return {
      isDeposit: false,
      amount: '',
      transactionType: 'deposit',
    };
  },

  methods: {
    submitTransaction() {
      this.amount = this.$cleanAmount(this.amount, this.holding);
      this.onConfirmed(this.transactionType, this.holding, this.amount);
    },

    setAmountToMax() {
      this.amount = this.isDeposit ?
        this.holding.balance.toString() :
        this.holding.contractBalance.toString();

      if (this.isDeposit && this.holding.symbol === 'GAS') {
        // multiply by 10 to save some additional gas for transactions and to withdrawal
        this.amount = new BigNumber(this.amount).minus(this.$services.network.getSelectedNetwork().fee * 10).toString();
      }

      this.amount = this.$cleanAmount(this.amount, this.holding);
    },
  },

  mounted() {
    if (this.$store.state.depositWithdrawModalModel) {
      this.isDeposit = this.$store.state.depositWithdrawModalModel.isDeposit;
    }
  },

  props: {
    onCancel: {
      required: true,
      type: Function,
    },

    onConfirmed: {
      required: true,
      type: Function,
    },
  },
};
</script>

<style lang="scss">
#aph-deposit-withdraw-modal {
  .content {
    .title {
      color: $purple;
      font-family: GilroySemibold;
      margin-top: $space;
      text-align: center;
    }

    .body {
      margin-top: $space;
      text-align: center;

      .transaction {
        display: flex;
        flex: none;
        justify-content: space-around;

        > button {
          @extend %btn-outline;
          @extend %selected-text;

          + button {
            margin-left: $space;
          }

          &.active {
            background-color: $purple;
            color: white;
          }
        }
      }

      .balance-container {
        display: flex;
        flex: 1;
        flex-direction: column;

        .balance {
          display: flex;
          flex: 1;
          flex-direction: row;
          margin-top: $space;

          > * {
            flex: 1;
            text-align: left;

            &.value {
              text-align: right;
            }
          }
        }
      }

      .max {
        @extend %small-uppercase-grey-label;

        color: $purple;
        flex: none;
        margin: $space-sm 0 $space;
        text-align: right;
      }

      .deposit-withdraw-btn {
        @extend %btn;

        display: flex;
        flex: none;
        justify-content: center;
        margin-top: $space;
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
