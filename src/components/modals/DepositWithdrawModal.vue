<template>
  <section class="aph-deposit-withdraw-modal">
    <div class="content">
      <div class="icons">
        <aph-icon name="hex"></aph-icon>
        <aph-icon name="trade"></aph-icon>
      </div>
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
        <div class="confirm-btn">
          <button class="deposit-withdraw-btn" @click="submitTransaction"
            :disabled="shouldDisableDepositWithdrawButton">Submit {{ transactionType }}</button>
        </div>
      </div>
    </div>
    <div class="cancel">
      <button class="cancel-btn" @click="hideDepositWithdrawModal">Cancel</button>
    </div>
  </section>
</template>

<script>
import { BigNumber } from 'bignumber.js';

export default {
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

    hideDepositWithdrawModal() {
      this.$store.commit('setDepositWithdrawModalModel', null);
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

};
</script>

<style lang="scss">
.aph-deposit-withdraw-modal {
  background: rgba($dark, .7);
  bottom: 0;
  display: flex;
  flex-direction: column;
  flex: 1;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 100;

  > .content {
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

    .body {
      @extend %tile-light;

      color: $dark;
      display: flex;
      flex-direction: column;
      overflow: auto;
      padding: $space-xxl $space $space;

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

          > span {
            flex: 1;
          }
        }
      }

      .aph-input.is-light {
        margin-bottom: $space;
      }

      .confirm-btn {
        @extend %btn-footer;

        display: flex;
        flex: none;
        justify-content: center;

        .deposit-withdraw-btn {
          text-transform: capitalize;
          color: white;
        }
      }
    }
  }

  .cancel {
    .cancel-btn {
      @extend %btn-footer-light;

      flex: none;
      width: 100%;
    }
  }
}
</style>
