<template>
  <section class="aph-order-confirmation-modal">
    <div class="wrapper">
      <h2 class="title">
        Confirm Your Order:
      </h2>
      <div class="content">
        <p class="description">
          Are you sure that you would like to place a
          <span class="type">{{ $store.state.orderToConfirm.orderType }}</span>
          <span :class="['side', $store.state.orderToConfirm.side]">{{ $store.state.orderToConfirm.side }}</span>
          <span class="postOnly" v-if="$store.state.orderToConfirm.postOnly === true">post only</span>
          order for
          <span class="quantity">{{ $formatNumber($store.state.orderToConfirm.quantity) }}</span>
          <span class="currency">{{ $store.state.orderToConfirm.market.quoteCurrency }}</span>
          <span v-if="$store.state.orderToConfirm.orderType === 'Limit'">
            at a unit price of
            <span class="price">
              {{ $formatNumber($store.state.orderToConfirm.price) }}
              {{ $store.state.orderToConfirm.market.baseCurrency }}
            </span>
            <span class="price" v-if="$store.state.orderToConfirm.side == 'Buy'">
              for a total of
              {{ $formatNumber($store.state.orderToConfirm.expectedQuantityToGive) }}
              {{ $store.state.orderToConfirm.market.baseCurrency }}
            </span>
            <span class="price" v-else>
              to receive a total of
              {{ $formatNumber($store.state.orderToConfirm.expectedQuantityToReceive) }}
              {{ $store.state.orderToConfirm.market.baseCurrency }}
            </span>
          </span>
          <span v-else>
            <span class="price" v-if="$store.state.orderToConfirm.side == 'Buy'">
              for an estimated total of
              {{ $formatNumber($store.state.orderToConfirm.expectedQuantityToGive) }}
              {{ $store.state.orderToConfirm.market.baseCurrency }}
            </span>
            <span class="price" v-else>
              to receive an estimated total of
              {{ $formatNumber($store.state.orderToConfirm.expectedQuantityToReceive) }}
              {{ $store.state.orderToConfirm.market.baseCurrency }}
            </span>
          </span>
          ?
        </p>
        <!-- <div v-if="offersToTake.length === 0">
          {{$t('thisWillBeAMakerOrder')}}
        </div>
        <div class="taking" v-if="offersToTake.length > 0 && $store.state.orderToConfirm.postOnly === true">
          {{$t('thisOrderWouldTakeTheFollowing')}}
          <div>
            <div class="offer" v-for="(offer, index) in offersToTake" :key="index">
              x{{ $formatNumber(offer.quantity) }} @{{ $formatNumber(offer.price) }}
            </div>
            <br />{{$t('thisMeansThatItIsIneligible')}}
          </div>
        </div>
        <div class="taking" v-if="offersToTake.length > 0 && $store.state.orderToConfirm.postOnly === false">
          {{$t('youWillBeImmediatelyTaking', { count: offersToTake.length })}}
          <div>
            <div class="offer" v-for="(offer, index) in offersToTake" :key="index">
              x{{ $formatNumber(offer.quantity) }} @{{ $formatNumber(offer.price) }}
            </div>
          </div>
          <div v-if="backupOffersToTake.length > 0">
            {{$t('weveAlsoMatchedBackupOrders', { count: backupOffersToTake.length })}}
          </div>
          <div v-if="$formatNumber($store.state.orderToConfirm.minTakerFees) !== $formatNumber($store.state.orderToConfirm.maxTakerFees)">
            {{$t('theFeeForCompletingYourTradeWillDepend', { min: $formatNumber($store.state.orderToConfirm.minTakerFees), max: $formatNumber($store.state.orderToConfirm.maxTakerFees)})}}
          </div>
          <div v-else>
            {{$t('theFeeForCompletingYourTradeWillBe', { amount: $formatNumber($store.state.orderToConfirm.maxTakerFees)})}}
          </div>
        </div>
        <div v-if="$store.state.orderToConfirm.assetIdToSell">
          <p v-if="quantityToPullFromWallet > 0">
            {{$t('thisOrderRequires', {
                quantity: $formatNumber(expectedQuantityToGive),
                symbol: holdingForAssetToGive.symbol,
                balance: $formatNumber(holdingForAssetToGive.contractBalance),
                deposit: $formatNumber(quantityToPullFromWallet),
              })
            }}
          </p>
          <p v-if="$store.state.orderToConfirm.feeDeposit && $store.state.orderToConfirm.feeDeposit.quantityToDeposit > 0">
            {{$t('thisOrderRequires', {
                quantity: $formatNumber(this.$store.state.orderToConfirm.feeDeposit.quantityRequired),
                symbol: this.$store.state.orderToConfirm.feeDeposit.symbol,
                balance: $formatNumber(this.$store.state.orderToConfirm.feeDeposit.currentQuantity),
                deposit: $formatNumber(this.$store.state.orderToConfirm.feeDeposit.quantityToDeposit),
              })
            }}
          </p>
        </div>
        <div v-if="offersToTake.length > 0 && $store.state.orderToConfirm.quantityToTake < $store.state.orderToConfirm.quantity && $store.state.orderToConfirm.postOnly === false">
          <div v-if="offersToTake.length > 0">
            {{$t('youWillBeCreatingTheFollowingMakerOrder')}}
            <div class="offer">
              {{ $store.state.orderToConfirm.side }} x{{ $formatNumber($store.state.orderToConfirm.quantity.minus($store.state.orderToConfirm.quantityToTake))}} @{{ $formatNumber($store.state.orderToConfirm.price) }}
            </div>
          </div>
          <div v-else>
            {{$t('thisWillBeAMakerOrderLeftOnTheBook')}}
          </div>
        </div> -->
      </div>
      <div class="footer">
        <div class="cancel-btn" @click="onClose">Cancel</div>
        <button class="confirm-btn" @click="onConfirmed" :disabled="shouldDisableConfirmButton">
          {{ buttonLabel }}
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  computed: {
    backupOffersToTake() {
      return _.filter(this.$store.state.orderToConfirm.offersToTake, (offer) => {
        return offer.isBackupOffer === true;
      });
    },

    buttonLabel() {
      // return this.$isPending('placeOrder') ? `${this.orderStatus}...` : this.$t('submit');
      return 'Submit'
    },

    expectedQuantityToGive() {
      let quantityNeeded = this.$store.state.orderToConfirm.expectedQuantityToGive;
      if ((this.holdingForAssetToGive.assetId === this.$store.state.currentNetwork.aph_hash)
        && this.$store.state.orderToConfirm.totalFees) {
        quantityNeeded = quantityNeeded.plus(this.$store.state.orderToConfirm.totalFees);
      }
      return quantityNeeded;
    },

    holdingForAssetToGive() {
      return _.find(this.$store.state.holdings, { assetId: this.$store.state.orderToConfirm.assetIdToSell });
    },

    offersToTake() {
      return _.filter(this.$store.state.orderToConfirm.offersToTake, (offer) => {
        return offer.isBackupOffer !== true;
      });
    },

    orderStatus() {
      return this.$store.state.orderToConfirm.status;
    },

    quantityToPullFromWallet() {
      let quantityToDeposit = this.$store.state.orderToConfirm.expectedQuantityToGive
        .minus(this.holdingForAssetToGive.contractBalance);
      if (this.holdingForAssetToGive.assetId === this.$store.state.currentNetwork.aph_hash
        && this.$store.state.orderToConfirm.totalFees) {
        quantityToDeposit = quantityToDeposit.plus(this.$store.state.orderToConfirm.totalFees);
      }
      if (this.holdingForAssetToGive.decimals < 8) {
        const toDepositTruncated = new BigNumber(quantityToDeposit.toFixed(this.holdingForAssetToGive.decimals));
        if (toDepositTruncated.isGreaterThanOrEqualTo(quantityToDeposit)) {
          quantityToDeposit = toDepositTruncated;
        } else {
          quantityToDeposit = toDepositTruncated.plus(1 / (10 ** this.holdingForAssetToGive.decimals));
        }
      }
      return quantityToDeposit;
    },

    shouldDisableConfirmButton() {
      return this.$isPending('placeOrder')
        || (this.$store.state.orderToConfirm.quantityToTake > 0 && this.$store.state.orderToConfirm.postOnly === true);
    },
  },

  props: {
    onConfirmed: {
      required: true,
      type: Function,
    },

    onClose: {
      required: true,
      type: Function,
    },
  },
};
</script>

<style lang="scss">
.aph-order-confirmation-modal {
  justify-content: center;
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

  > .wrapper {
    @extend %tile-light;

    display: flex;
    flex-direction: column;
    flex: none;
    justify-content: center;
    overflow: hidden;
    padding: $space;
    margin: $space-xl;

    > div {
      color: $dark;
    }

    .title {
      text-align: center;
      color: $dark;
    }

    p {
      text-align: center;

      .type, .side, .quantity, .currency, .price, .postOnly {
        font-family: GilroySemibold;
        font-size: toRem(16px);
      }

      .side {
        font-size: toRem(18px);
        text-decoration: underline;

        &.Buy {
          color: $green;
        }
        &.Sell {
          color: $red;
        }
      }

      .postOnly {
        font-style: italic;
        color: $grey;
      }
    }

    .offer {
      margin-bottom: $space-xs;
    }

    .taking > div:first-child {
      overflow-y:auto;
      max-height: toRem(400px);
    }

    .footer {
      display: flex;

      .cancel-btn {
        @extend %btn-footer-light;

        flex: 1;
        border-bottom-left-radius: $border-radius;
      }

      .confirm-btn {
        @extend %btn-footer;

        flex: 1;
        border-bottom-right-radius: $border-radius;
      }
    }
  }
}
</style>
