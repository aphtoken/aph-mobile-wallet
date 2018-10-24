<template>
  <section id="dex--trade">
    <div class="body">
      <div class="side">
        <div @click="setSide('Buy')" :class="['buy-btn', {selected: side === 'Buy'}]">Buy</div>
        <div @click="setSide('Sell')" :class="['sell-btn', {selected: side === 'Sell'}]">Sell</div>
      </div>
      <div class="order-type">
        <aph-select :light="true" :options="orderTypes" v-model="orderType"></aph-select>
      </div>
      <div class="price" v-if="orderType === 'Limit'">
        <aph-input v-model="$store.state.orderPrice"></aph-input>
        <div class="description">
          LIMIT PRICE ({{ priceLabel }})
        </div>
      </div>
      <div class="quantity">
        <aph-input v-model="$store.state.orderQuantity"></aph-input>
        <div class="description">
          AMOUNT ({{ priceLabel }})
        </div>
      </div>
      <div class="percentages">
        <div @click="setPercent(.25)" :class="['percent-btn', {selected: selectedPercent === .25}]">25%</div>
        <div @click="setPercent(.50)" :class="['percent-btn', {selected: selectedPercent === .50}]">50%</div>
        <div @click="setPercent(.75)" :class="['percent-btn', {selected: selectedPercent === .75}]">75%</div>
        <div @click="setPercent(1)" :class="['percent-btn', {selected: selectedPercent === 1}]">100%</div>
      </div>
      <div class="options">
        <div @click="postOnly = !postOnly" class="option" v-if="orderType === 'Limit'">
          <label>POST ONLY</label>
          <aph-icon name="radio-on" v-if="postOnly"></aph-icon>
          <aph-icon name="radio-off" v-else></aph-icon>
        </div>
      </div>
      <div class="total">
        <div class="label">TOTAL ({{ baseHolding.symbol }})</div>
        <div class="value">{{ $formatNumber(total) }}</div>
      </div>
      <div class="estimate">
        <div class="label">ESTIMATE ({{ $services.settings.getCurrency() }})</div>
        <div class="value">{{ $formatMoney(estimate) }}</div>
      </div>
      <div class="place-order">
        <button @click="confirmOrder" :disabled="shouldDisableOrderButton" :class="['order-btn', { 'buy-btn': side === 'Buy', 'sell-btn': side === 'Sell'}]">
          Place {{ side }} order
        </button>
      </div>
    </div>
    <div class="footer">
      <div @click="actionableHolding = quoteHolding" :class="['balance', {active: quoteHolding.symbol === actionableHolding.symbol}]" :title="quoteBalanceToolTip">
        <div class="label">{{ quoteHolding.symbol }} Balance</div>
        <div class="contract">CONTRACT</div>
        <div class="contract-value">{{ $formatNumber(quoteHolding.totalBalance) }}</div>
        <div class="wallet">WALLET</div>
        <div class="wallet-value">32,431</div>
      </div>
      <div @click="actionableHolding = baseHolding" :class="['balance', {active: baseHolding.symbol === actionableHolding.symbol}]" :title="baseBalanceToolTip">
        <div class="label">{{ baseHolding.symbol }} Balance</div>
        <div class="contract">CONTRACT</div>
        <div class="contract-value">{{ $formatNumber(baseHolding.totalBalance) }}</div>
        <div class="wallet">WALLET</div>
        <div class="wallet-value">1.21</div>
      </div>
      <div @click="actionableHolding = aphHolding" :class="['balance', {active: aphHolding.symbol === actionableHolding.symbol}]" :title="aphBalanceToolTip" v-if="baseHolding.symbol !== 'APH' && quoteHolding.symbol !== 'APH'">
        <div class="label">APH Balance</div>
        <div class="contract">CONTRACT</div>
        <div class="contract-value">{{ $formatNumber(aphHolding.totalBalance) }}</div>
        <div class="wallet">WALLET</div>
        <div class="wallet-value">3.21</div>
      </div>
    </div>
  </section>
</template>

<script>
import { BigNumber } from 'bignumber.js';

const ORDER_TYPES_LIST = [
  {
    label: 'Limit',
    value: 'Limit',
  },
];

export default {
  computed: {
    amountLabel() {
      if (!this.currentMarket) {
        return '';
      }

      return 'ATI'; // this.$t('amountQuote', { quote: this.currentMarket.quoteCurrency });
    },

    aphBalanceToolTip() {
      return 'walletBalanceContractBalance'; // TODO: Fix this
    },

    aphHolding() {
      if (this.currentMarket && this.$store.state.holdings) {
        const holding = _.find(this.$store.state.holdings, { assetId: this.$store.state.currentNetwork.aph_hash });

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
      };
    },

    baseBalanceToolTip() {
      return 'walletBalanceContractBalance'; // TODO: Fix this
    },

    baseHolding() {
      if (this.currentMarket && this.$store.state.holdings) {
        const holding = _.find(this.$store.state.holdings, { assetId: this.currentMarket.baseAssetId });

        if (holding) {
          return holding;
        }
      }

      return {
        symbol: this.currentMarket ? this.currentMarket.baseCurrency : '',
        balance: 0,
        totalBalance: 0,
        contractBalance: 0,
      };
    },

    canPlaceMarketOrder() {
      const currentWallet = this.$services.wallets.getCurrentWallet();
      return currentWallet && !currentWallet.isLedger;
    },

    currentMarket() {
      return this.$store.state.currentMarket;
    },

    estimate() {
      const holding = this.currentMarket ?
        this.$services.neo.getHolding(this.currentMarket.baseAssetId).unitValue :
        0;

      try {
        return new BigNumber(this.total).multipliedBy(
          new BigNumber(holding));
      } catch (e) {
        console.log(e);
        return 0;
      }
    },

    isMarketClosed() {
      return this.$store.state.currentMarket && !this.$store.state.currentMarket.isOpen;
    },

    isOutOfDate() {
      if (!this.$store.state.latestVersion) {
        return true;
      }
      const currentNetworkLatestDexScriptHash = this.$store.state.currentNetwork.net === 'MainNet' ?
        this.$store.state.latestVersion.prodExchangeScriptHash : this.$store.state.latestVersion.testExchangeScriptHash;
      return currentNetworkLatestDexScriptHash.replace('0x', '') !== this.$store.state.currentNetwork.dex_hash;
    },

    isTradingDisabled() {
      return this.isOutOfDate || this.isMarketClosed;
    },

    // orderButtonLabel() {
    //   return this.$isPending('placeOrder') === false ?
    //     this.$t('placeSideOrder', { side: this.side }) :
    //     this.$t('placingOrder');
    // },

    orderTypes() {
      if (this.canPlaceMarketOrder) {
        return _.concat(ORDER_TYPES_LIST, [
          {
            label: 'Market',
            value: 'Market',
          },
        ]);
      }
      return ORDER_TYPES_LIST;
    },

    price() {
      let price = this.$store.state.orderPrice;
      if (!price) {
        // market order
        price = this.marketPriceForQuantity(this.side, this.$store.state.orderQuantity);
      }
      return price;
    },

    priceLabel() {
      // TODO: This will most likely change when we get live data.
      return this.currentMarket ? 'GAS' : '';
    },

    quoteBalanceToolTip() {
      return 'walletBalanceContractBalance'; // TODO: Fix this
    },

    quoteHolding() {
      if (this.currentMarket && this.$store.state.holdings) {
        const holding = _.find(this.$store.state.holdings, { assetId: this.currentMarket.quoteAssetId });

        if (holding) {
          return holding;
        }
      }

      return {
        symbol: this.currentMarket ? this.currentMarket.quoteCurrency : '',
        balance: 0,
        totalBalance: 0,
        contractBalance: 0,
      };
    },

    shouldDisableOrderButton() {
      if (this.isTradingDisabled) {
        return true;
      }
      if (this.orderType === 'Market') {
        return !this.$store.state.orderQuantity || this.$isPending('placeOrder');
      }
      return !this.$store.state.orderQuantity || !this.$store.state.orderPrice || this.$isPending('placeOrder');
    },

    total() {
      if (!this.$store.state.orderQuantity) {
        return 0;
      }

      try {
        return new BigNumber(this.price).multipliedBy(new BigNumber(this.$store.state.orderQuantity));
      } catch (e) {
        console.log(e);
        return 0;
      }
    },
  },

  created() {
    this.loadHoldings();

    this.actionableHolding = this.quoteHolding;
  },

  data() {
    return {
      actionableHolding: '',
      orderType: 'Limit',
      postOnly: false,
      selectedPercent: null,
      side: 'Buy',
    };
  },

  methods: {
    confirmOrder() {
      this.validateQuantity();

      if (this.orderType === 'Market') {
        this.$store.commit('setOrderPrice', '');
        if (this.canPlaceMarketOrder !== true) {
          this.orderType = 'Limit';
          this.$services.alerts.error('Unable to place Market order using a Ledger');
          return;
        }
      }

      this.$store.dispatch('formOrder', {
        order: {
          market: this.currentMarket,
          side: this.side,
          orderType: this.orderType,
          quantity: new BigNumber(this.$store.state.orderQuantity),
          price: this.$store.state.orderPrice !== '' ? new BigNumber(this.$store.state.orderPrice) : null,
          postOnly: this.postOnly,
        },
        done: () => {
          this.orderConfirmed();
        },
      });
    },

    loadHoldings() {
      this.$store.dispatch('fetchHoldings');
    },

    loadHoldingsSilently() {
      this.$store.dispatch('fetchHoldings', { isRequestSilent: true });
    },

    marketPriceForQuantity(side, quantity) {
      let quantityRemaining = new BigNumber(quantity);
      let totalMultiple = new BigNumber(0);
      let book = this.$store.state.orderBook.asks;

      if (side === 'Sell') {
        book = this.$store.state.orderBook.bids;
      }

      book.forEach((level) => {
        const takeQuantity = level.quantity.isGreaterThan(quantityRemaining) ? quantityRemaining : level.quantity;
        if (quantityRemaining.isLessThanOrEqualTo(0)) {
          return;
        }
        quantityRemaining = quantityRemaining.minus(takeQuantity);
        totalMultiple = totalMultiple.plus(takeQuantity.multipliedBy(level.price));
      });

      return (totalMultiple / quantity).toString();
    },

    // TODO: Remove when confirm modal is built. This short circuits the order placing process.
    orderConfirmed() {
      if (this.$isPending('placeOrder')) {
        return;
      }

      this.$store.dispatch('placeOrder', {
        order: this.$store.state.orderToConfirm,
        done: () => {
          this.$store.commit('setOrderQuantity', '');
        },
      });
    },

    percent(value) {
      return this.side === 'Buy' ? this.percentForBuy(value) : this.percentForSell(value);
    },

    percentForBuy() {
      // TODO: fix this
      console.log('return');
    },

    percentForSell() {
      // TODO: fix this
      console.log('return');
    },

    setPercent(value) {
      if (this.orderType === 'Limit' && !this.$store.state.orderPrice && this.side === 'Buy') {
        this.$services.alerts.error('pleaseEnterAPrice');
        return;
      }
      this.$store.commit('setOrderQuantity', this.percent(value));
      this.selectedPercent = value;
    },

    setSide(side) {
      this.side = side;
      this.$store.commit('setOrderQuantity', '');
    },

    // TODO: move this code into a codebase that's shared between mobile and desktop
    validateQuantity() {
      if (!this.$store.state.orderQuantity
        || this.$store.state.orderQuantity === ''
        || this.$store.state.orderQuantity[this.$store.state.orderQuantity - 1] === '.') {
        return;
      }

      const minTickSizeFraction = this.currentMarket.minimumTickSize - Math.floor(this.currentMarket.minimumTickSize);
      let allowedQuantityDecimals;
      if (minTickSizeFraction <= 0.00000001) {
        allowedQuantityDecimals = 0;
      } else {
        allowedQuantityDecimals = Math.log10(minTickSizeFraction * (10 ** 8));
      }
      const decimalFactor = 10 ** allowedQuantityDecimals;
      const beforeRounded = new BigNumber(this.$store.state.orderQuantity);
      const floored = beforeRounded.multipliedBy(decimalFactor).decimalPlaces(0, BigNumber.ROUND_DOWN);
      const roundedQuantity = floored.dividedBy(decimalFactor);
      if (roundedQuantity.isEqualTo(beforeRounded) === false) {
        this.$store.commit('setOrderQuantity', roundedQuantity.toString());
        this.$services.alerts.error(this.$t('orderQuantityLimited', {
          marketName: this.currentMarket.marketName,
          allowedQuantityDecimals,
        }));
      }
    },
  },

  watch: {
    //
  },
};
</script>

<style lang="scss">
#dex--trade {
  background: $dark-purple*1.25;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  > .body {
    background: $dark-purple;
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: space-around;
    margin: $space;
    overflow: hidden;

    .side {
      display: flex;
      margin: 0 $space;

      .buy-btn {
        border-color: $green;

        &:hover, &.selected {
          background-color: $green;
        }
      }

      .sell-btn {
        border-color: $red;
        margin-left: $space;

        &:hover, &.selected {
          background-color: $red;
        }
      }

      .buy-btn, .sell-btn {
        @extend %btn-outline;
        @extend %selected-text;

        color: white;
        flex: 1;
        font-family: GilroySemibold;
        margin-top: $space;

        &:disabled {
          background: transparent !important;
          border-color: $grey;
        }
      }
    }

    .order-type {
      margin: $space $space 0;

      .aph-select--label {
        background: $dark-purple*1.25;
        color: white;
      }

      .aph-icon .fill {
        fill: $purple;
      }
    }

    .price, .quantity {
      margin: 0 $space;

      .aph-input {
        border-color: $darker-grey;
        height: 100%;

        &:focus-within {
          border-color: $purple;
        }
      }
      .description {
        color: $darker-grey;
        font-size: toRem(10px);
        margin-top: $space-sm;
      }
    }

    .percentages {
      background-color: $dark-purple*1.25;
      color: $darker-grey;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      margin: $space;
      padding: $space 0;

      > div {
        flex: 1;
        text-align: center;

        &.selected {
          color: $purple;
        }
      }
    }

    .options {
      color: $darker-grey;
      font-size: toRem(12px);
      margin: 0 $space $space;

      .option {
        display: flex;
        flex-direction: row;

        label {
          margin: auto $space-sm auto 0;
        }

        .aph-icon {
          svg {
            height: toRem(20px);
          }

          .fill {
            fill: $purple !important;
          }
        }
      }
    }

    .total, .estimate {
      display: flex;
      flex-direction: row;
      font-size: toRem(12px);
      justify-content: space-between;
      margin: 0 $space $space;

      .label {
        color: $darker-grey;
      }
    }

    .place-order {
      margin: 0 $space $space;

      .order-btn {
        @extend %btn-outline;

        &.buy-btn {
          border-color: $green;
        }

        &.sell-btn {
          border-color: $red;
        }
      }
    }
  }

  .footer {
    margin: 0 $space;
    overflow: scroll;
    white-space: nowrap;

    > div {
      background-color: $dark-purple;
      display: inline-block;
      height: toRem(110px);
      margin: 0 $space-sm;
      padding: $space;
      width: toRem(150px);

      &:first-child, &:last-child {
        margin: 0;
      }

      .contract, .wallet {
        color: $darker-grey;
        font-size: toRem(10px);
        margin-top: $space-sm;
      }

      .contract-value, .wallet-value {
        font-size: toRem(10px);
        margin-top: $space-xs;
      }
    }
  }
}
</style>
