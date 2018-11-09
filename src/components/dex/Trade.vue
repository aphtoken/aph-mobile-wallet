<template>
  <section id="dex--trade">
    <div class="body">
      <div class="controls">
        <div class="side">
          <button @click="setSide('Buy')" :class="['buy-btn', {selected: side === 'Buy'}]">Buy</button>
          <button @click="setSide('Sell')" :class="['sell-btn', {selected: side === 'Sell'}]">Sell</button>
        </div>
        <div class="order-type">
          <button @click="setOrderType('Limit')" :class="['limit-btn', {selected: orderType === 'Limit'}]">Limit</button>
          <button @click="setOrderType('Market')" :class="['market-btn', {selected: orderType === 'Market'}]">Market</button>
        </div>
      </div>
      <div class="form">
        <div class="price" v-if="orderType === 'Limit'">
          <aph-input v-model="$store.state.orderPrice"></aph-input>
          <div class="description">
            limit price ({{ baseHoldingSymbol }})
          </div>
        </div>
        <div class="quantity">
          <aph-input v-model="$store.state.orderQuantity"></aph-input>
          <div class="description">
            amount ({{ quoteHoldingSymbol }})
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
          <div class="label">total ({{ baseHolding.symbol }})</div>
          <div class="value">{{ $formatNumber(total) }}</div>
        </div>
        <div class="estimate">
          <div class="label">estimate ({{ $services.settings.getCurrency() }})</div>
          <div class="value">{{ $formatMoney(estimate) }}</div>
        </div>
        <div class="place-order">
          <button @click="confirmOrder" :disabled="shouldDisableOrderButton" :class="['order-btn', { 'buy-btn': side === 'Buy', 'sell-btn': side === 'Sell'}]">
            Place {{ side }} order
          </button>
        </div>
      </div>
    </div>
    <div class="footer">
      <div :class="['balance', {active: quoteHolding.symbol === actionableHolding.symbol}]" :title="quoteBalanceToolTip">
        <div class="label">{{ quoteHolding.symbol }}</div>
        <div @click="showDepositWithdrawModal(quoteHolding)" class="control">{{ $t('depositWithdraw') }}</div>
        <div class="contract">contract</div>
        <div class="contract-value">{{ $formatNumber(quoteHolding.totalBalance) }}</div>
        <div class="wallet">wallet</div>
        <div class="wallet-value">32,431</div>
      </div>
      <div :class="['balance', {active: baseHolding.symbol === actionableHolding.symbol}]" :title="baseBalanceToolTip">
        <div class="label">{{ baseHolding.symbol }}</div>
        <div @click="showDepositWithdrawModal(baseHolding)" class="control">{{ $t('depositWithdraw') }}</div>
        <div class="contract">contract</div>
        <div class="contract-value">{{ $formatNumber(baseHolding.totalBalance) }}</div>
        <div class="wallet">wallet</div>
        <div class="wallet-value">1.21</div>
      </div>
      <div :class="['balance', {active: aphHolding.symbol === actionableHolding.symbol}]" :title="aphBalanceToolTip" v-if="baseHolding.symbol !== 'APH' && quoteHolding.symbol !== 'APH'">
        <div class="label">APH</div>
        <div @click="showDepositWithdrawModal(aphHolding)" class="control">{{ $t('depositWithdraw') }}</div>
        <div class="contract">contract</div>
        <div class="contract-value">{{ $formatNumber(aphHolding.totalBalance) }}</div>
        <div class="wallet">wallet</div>
        <div class="wallet-value">3.21</div>
      </div>
    </div>
    <order-confirmation-modal v-if="$store.state.showOrderConfirmationModal" :onClose="closeConfirmModal" :onConfirm="orderConfirmed" />
    <deposit-withdraw-modal v-if="$store.state.depositWithdrawModalModel" :onConfirmed="depositWithdrawConfirmed" :onCancel="hideDepositWithdrawModal" />
  </section>
</template>

<script>
import { BigNumber } from 'bignumber.js';
import { mapGetters } from 'vuex';
import OrderConfirmationModal from '../modals/OrderConfirmationModal';
import DepositWithdrawModal from '../modals/DepositWithdrawModal';

export default {
  components: {
    DepositWithdrawModal,
    OrderConfirmationModal,
  },

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

    baseHoldingSymbol() {
      return _.get(this.baseHolding, 'symbol');
    },

    canPlaceMarketOrder() {
      const currentWallet = this.$services.wallets.getCurrentWallet();
      return currentWallet && !currentWallet.isLedger;
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

    iconName() {
      return this.isOpen ? 'arrow-up' : 'arrow-down';
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

    price() {
      let price = this.$store.state.orderPrice;
      if (!price) {
        // market order
        price = this.marketPriceForQuantity(this.side, this.$store.state.orderQuantity);
      }
      return price;
    },

    quoteHoldingSymbol() {
      return _.get(this.quoteHolding, 'symbol');
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

    ...mapGetters([
      'currentMarket',
    ]),
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
    closeConfirmModal() {
      this.$store.commit('setShowOrderConfirmationModal', false);
    },

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
      });
    },

    depositWithdrawConfirmed(transactionType, holding, amount) {
      const message = `${amount} ${holding.symbol} ${transactionType} Completed.`;
      const services = this.$services;
      services.dex[`${transactionType}Asset`](holding.assetId, Number(amount))
        .then(() => {
          services.alerts.success(message);
        })
        .catch((e) => {
          services.alerts.exception(e);
        });

      this.hideDepositWithdrawModal();
    },

    hideDepositWithdrawModal() {
      this.$store.commit('setDepositWithdrawModalModel', null);
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
      const book = _.get(this.$store.state.orderBook, side === 'Sell' ? 'bids' : 'asks', []);

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

    orderConfirmed() {
      this.closeConfirmModal();

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

    percentForBuy(value) {
      if (!this.baseHolding || !this.baseHolding.availableBalance
        || this.baseHolding.availableBalance.isLessThanOrEqualTo(0)) {
        // TODO: Translate this
        this.$services.alerts.error(`Not enough ${this.currentMarket.baseCurrency} available to perform buy.`);
        return '';
      }

      const baseAssetQuantity = this.baseHolding.availableBalance;

      let newQuantity = new BigNumber(0);
      const book = this.$store.state.orderBookAsks;
      let orderPrice = null;
      if (this.orderType !== 'Market' && this.$store.state.orderPrice !== '') {
        orderPrice = new BigNumber(this.$store.state.orderPrice);
      }

      let willTakeOffers = false;
      if (!orderPrice || orderPrice.isGreaterThanOrEqualTo(book[0].price)) {
        willTakeOffers = !this.postOnly;
      }

      let leftToSpend = baseAssetQuantity;

      if (willTakeOffers) {
        book.forEach((level) => {
          if (orderPrice && level.price.isGreaterThan(orderPrice)) {
            return;
          }

          if (leftToSpend.isLessThanOrEqualTo(0)) {
            return;
          }

          const levelCost = level.quantity.multipliedBy(level.price);

          let spendAtThisLevel = levelCost.isGreaterThan(leftToSpend) ? leftToSpend : levelCost;
          if (this.baseHolding.assetId === this.$store.state.currentNetwork.aph_hash) {
            const maxLots = spendAtThisLevel.dividedBy(level.price).dividedBy(this.currentMarket.minimumSize);
            leftToSpend = leftToSpend.minus(maxLots.multipliedBy(this.currentMarket.buyFee));
          }

          spendAtThisLevel = levelCost.isGreaterThan(leftToSpend) ? leftToSpend : levelCost;
          newQuantity = newQuantity.plus(spendAtThisLevel.dividedBy(level.price));
          leftToSpend = leftToSpend.minus(spendAtThisLevel);
        });
      }

      if (leftToSpend.isGreaterThan(0) && orderPrice) {
        newQuantity = newQuantity.plus(leftToSpend.dividedBy(orderPrice));
      }

      newQuantity = newQuantity.multipliedBy(value);
      newQuantity = newQuantity
        .multipliedBy(100000000)
        .decimalPlaces(0, BigNumber.ROUND_DOWN)
        .dividedBy(100000000.0);
      return newQuantity.toString();
    },

    percentForSell(value) {
      if (!this.quoteHolding || !this.quoteHolding.availableBalance
        || this.quoteHolding.availableBalance.isLessThanOrEqualTo(0)) {
        // TODO: Fix this translation
        this.$services.alerts.error(`Not enough ${this.currentMarket.baseCurrency} available to perform sell.`);
        return '';
      }

      const quoteAssetQuantity = this.quoteHolding.availableBalance;


      let orderPrice = null;
      if (this.orderType !== 'Market' && this.$store.state.orderPrice !== '') {
        orderPrice = new BigNumber(this.$store.state.orderPrice);
      }

      const book = _.get(this.$store.state.orderBook, 'bids', []);
      let willTakeOffers = false;
      if (!orderPrice || orderPrice.isLessThanOrEqualTo(book[0].price)) {
        willTakeOffers = !this.postOnly;
      }

      let leftToSpend = quoteAssetQuantity;
      let newQuantity = new BigNumber(0);

      if (willTakeOffers) {
        book.forEach((level) => {
          if (orderPrice && level.price.isLessThan(orderPrice)) {
            return;
          }

          if (leftToSpend.isLessThanOrEqualTo(0)) {
            return;
          }

          const levelCost = level.quantity;

          let spendAtThisLevel = levelCost.isGreaterThan(leftToSpend) ? leftToSpend : levelCost;
          if (this.quoteHolding.assetId === this.$store.state.currentNetwork.aph_hash) {
            const maxLots = spendAtThisLevel.dividedBy(this.currentMarket.minimumSize);
            leftToSpend = leftToSpend.minus(maxLots.multipliedBy(this.currentMarket.sellFee));
          }

          spendAtThisLevel = levelCost.isGreaterThan(leftToSpend) ? leftToSpend : levelCost;
          newQuantity = newQuantity.plus(spendAtThisLevel);
          leftToSpend = leftToSpend.minus(spendAtThisLevel);
        });
      }

      if (leftToSpend.isGreaterThan(0) && orderPrice) {
        newQuantity = newQuantity.plus(leftToSpend);
      }

      newQuantity = newQuantity.multipliedBy(value);
      newQuantity = newQuantity
        .multipliedBy(100000000)
        .decimalPlaces(0, BigNumber.ROUND_DOWN)
        .dividedBy(100000000.0);
      return newQuantity.toString();
    },

    setOrderType(orderType) {
      this.orderType = orderType;
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

    showDepositWithdrawModal(holdingAsset) {
      this.$store.commit('setDepositWithdrawModalModel', {
        // NOTE: if whitelisted, adjust assetId to test a new asset that has been whitelisted but market not yet added.
        holdingAssetId: holdingAsset.assetId,
      });
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
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;

  > .body {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: space-around;
    overflow: hidden;

    .controls {
      flex: none;
    }

    .form {
      @extend %tile-dark;

      flex: 1;
      margin-top: $space;
      overflow: auto;
      padding: $space;
    }

    .side {
      display: flex;
      flex: none;

      > button {
        @extend %btn-outline;

        &.buy-btn {
          border-color: $green;

          &:hover, &.selected {
            background-color: $green;
          }
        }

        &.sell-btn {
          border-color: $red;
          margin-left: $space;

          &:hover, &.selected {
            background-color: $red;
          }
        }

        &:disabled {
          background: transparent !important;
          border-color: $grey;
        }
      }
    }

    .order-type {
      display: flex;
      flex: none;
      margin-top: $space;


      > button {
        @extend %btn-outline;

        &.selected {
          @extend %btn;
        }

        & + button {
          margin-left: $space;
        }
      }
    }

    .price, .quantity {
      flex: none;

      .aph-input {
        border-color: $darker-grey;
        height: 100%;

        &:focus-within {
          border-color: $purple;
        }
      }
      .description {
        @extend %small-uppercase-grey-label-dark;

        margin-top: $space-sm;
      }
    }

    .percentages {
      color: $darker-grey;
      display: flex;
      flex-direction: row;
      flex: none;
      justify-content: space-around;
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
      flex: none;
      font-size: toRem(12px);
      margin-top: $space;

      .option {
        display: flex;
        flex-direction: row;
        align-items: center;

        label {
          margin-right: $space-sm;
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
      @extend %small-uppercase-grey-label;

      display: flex;
      flex-direction: row;
      justify-content: space-between;
      flex: none;
      margin-top: $space-sm;

      .value {
        color: white;
      }
    }

    .place-order {
      flex: 1;
      margin-top: $space;

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

  > .footer {
    @extend %tile-dark;

    display: flex;
    flex: none;
    margin-top: $space;
    padding: $space;

    > div {
      display: inline-block;
      margin: 0 $space-sm;
      flex: 1;

      &:first-child, &:last-child {
        margin: 0;
      }

      .contract, .wallet {
        @extend %small-uppercase-grey-label-dark;
      }

      .wallet {
        margin-top: $space-sm;
      }

      .control {
        @extend %small-uppercase-grey-label;

        border-radius: $border-radius;
        border: $border-width-thin solid $purple;
        color: $purple;
        display: inline-block;
        margin: $space-sm 0;
        padding: $space-xs $space-sm;
      }

      .contract-value, .wallet-value {
        font-size: toRem(10px);
        margin-top: $space-xs;
      }
    }
  }
}
</style>
