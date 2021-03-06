<template>
  <modal-wrapper id="aph-order-confirmation-modal" icon="dex">
    <div class="title">{{ $t('confirmYourOrder') }}</div>
    <div class="body">
      <p class="description">
        {{$t('areYouSureYouWouldLikeToPlace')}}
        <span class="type">{{ $store.state.orderToConfirm.orderType }}</span>
        <span :class="['side', $store.state.orderToConfirm.side]">{{ $store.state.orderToConfirm.side }}</span>
        <span class="post-only" v-if="$store.state.orderToConfirm.postOnly === true">{{$t('post-only')}}</span>
        order for
        <span class="quantity">{{ $formatNumber($store.state.orderToConfirm.quantity) }}</span>
        <span class="currency">{{ $store.state.orderToConfirm.market.quoteCurrency }}</span>
        <span v-if="$store.state.orderToConfirm.orderType === 'Limit'">
          {{$t('atAUnitPriceOf')}}
          <span class="price">
            {{ $formatNumber($store.state.orderToConfirm.price) }}
            {{ $store.state.orderToConfirm.market.baseCurrency }}
          </span>
          <span class="price" v-if="$store.state.orderToConfirm.side == 'Buy'">
            {{$t('forATotalOf')}}
            {{ $formatNumber($store.state.orderToConfirm.expectedQuantityToGive) }}
            {{ $store.state.orderToConfirm.market.baseCurrency }}
          </span>
          <span class="price" v-else>
            {{$t('toReceiveATotalOf')}}
            {{ $formatNumber($store.state.orderToConfirm.expectedQuantityToReceive) }}
            {{ $store.state.orderToConfirm.market.baseCurrency }}
          </span>
        </span>
        <span v-else>
          <span class="price" v-if="$store.state.orderToConfirm.side == 'Buy'">
            {{$t('forAnEstimatedTotalOf')}}
            {{ $formatNumber($store.state.orderToConfirm.expectedQuantityToGive) }}
            {{ $store.state.orderToConfirm.market.baseCurrency }}
          </span>
          <span class="price" v-else>
            {{$t('toReceiveAnEstimatedTotalOf')}}
            {{ $formatNumber($store.state.orderToConfirm.expectedQuantityToReceive) }}
            {{ $store.state.orderToConfirm.market.baseCurrency }}
          </span>
        </span>?
      </p>
      <div v-if="offersToTake.length === 0">
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
      </div>
    </div>
    <button class="confirm-btn" @click="onConfirm" >{{ $t('Confirm') }}</button>
    <template slot="footer">
      <button class="cancel-btn" @click="onClose">{{ $t('cancel') }}</button>
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

    orderStatus() {
      return this.$store.state.orderToConfirm.status;
    },

    buttonLabel() {
      return this.$isPending('placeOrder') ? `${this.orderStatus}...` : this.$t('submit');
    },

    shouldDisableConfirmButton() {
      return this.$isPending('placeOrder')
        || (this.$store.state.orderToConfirm.quantityToTake > 0 && this.$store.state.orderToConfirm.postOnly === true);
    },

    offersToTake() {
      return _.filter(this.$store.state.orderToConfirm.offersToTake, (offer) => {
        return offer.isBackupOffer !== true;
      });
    },

    holdingForAssetToGive() {
      return _.find(this.$store.state.holdings, { assetId: this.$store.state.orderToConfirm.assetIdToSell });
    },

    expectedQuantityToGive() {
      let quantityNeeded = this.$store.state.orderToConfirm.expectedQuantityToGive;
      if ((this.holdingForAssetToGive.assetId === this.$store.state.currentNetwork.aph_hash)
        && this.$store.state.orderToConfirm.totalFees) {
        quantityNeeded = quantityNeeded.plus(this.$store.state.orderToConfirm.totalFees);
      }
      return quantityNeeded;
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

    backupOffersToTake() {
      return _.filter(this.$store.state.orderToConfirm.offersToTake, (offer) => {
        return offer.isBackupOffer === true;
      });
    },
  },

  props: {
    onConfirm: {
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
#aph-order-confirmation-modal {
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

      .description {
        .type, .side, .quantity, .currency, .price, .post-only {
          font-family: GilroySemibold;
        }

        .side {
          &.Buy {
            color: $green;
          }
          &.Sell {
            color: $red;
          }
        }

        .post-only {
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
    }

    .confirm-btn {
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
