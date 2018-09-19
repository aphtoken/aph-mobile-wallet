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
        <aph-input :placeholder="priceLabel" v-model="$store.state.orderPrice"></aph-input>
      </div>
      <div class="quantity">
        <aph-input :placeholder="amountLabel" v-model="$store.state.orderQuantity"></aph-input>
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
        <div class="value">$999999.99</div>
      </div>
      <button @click="confirmOrder" :disabled="shouldDisableOrderButton"
            :class="['order-btn', { 'buy-btn': side === 'Buy', 'sell-btn': side === 'Sell'}]">
        {{ orderButtonLabel }}
      </button>
    </div>
    <div class="footer">
      <div @click="actionableHolding = quoteHolding" :class="['balance', {active: quoteHolding.symbol === actionableHolding.symbol}]" :title="quoteBalanceToolTip">
        <div class="label">Balance ({{ quoteHolding.symbol }})</div>
        <div class="value">{{ $formatNumber(quoteHolding.totalBalance) }}</div>
      </div>
      <div @click="actionableHolding = baseHolding" :class="['balance', {active: baseHolding.symbol === actionableHolding.symbol}]" :title="baseBalanceToolTip">
        <div class="label">Balance ({{ baseHolding.symbol }})</div>
        <div class="value">{{ $formatNumber(baseHolding.totalBalance) }}</div>
      </div>
      <div @click="actionableHolding = aphHolding" :class="['balance', {active: aphHolding.symbol === actionableHolding.symbol}]" :title="aphBalanceToolTip" v-if="baseHolding.symbol !== 'APH' && quoteHolding.symbol !== 'APH'">
        <div class="label">Balance (APH)</div>
        <div class="value">{{ $formatNumber(aphHolding.totalBalance) }}</div>
      </div>
    </div>
  </section>
</template>

<script>
import { BigNumber } from 'bignumber.js';
// import { TICKER_LIST } from '../../../sample_api/dex_sample.js';
import MarketPairChart from './MarketPairChart';
import MarketSelector from './MarketSelector';

const ORDER_TYPES_LIST = [
  {
    label: 'Limit',
    value: 'Limit',
  },
];

export default {
  created() {
    this.loadHoldings();

    this.actionableHolding = this.quoteHolding;
  },

  components: {
    MarketPairChart,
    MarketSelector,
  },

  computed: {
    currentMarket() {
      return this.$store.state.currentMarket;
    },

    isTradingDisabled() {
      return this.isOutOfDate || this.isMarketClosed;
    },

    isOutOfDate() {
      return this.$store.state.latestVersion && this.$store.state.latestVersion.testExchangeScriptHash
        && this.$store.state.latestVersion.testExchangeScriptHash.replace('0x', '')
          !== this.$services.assets.DEX_SCRIPT_HASH;
    },

    isMarketClosed() {
      return this.$store.state.currentMarket && this.$store.state.currentMarket.isOpen === false;
    },

    quoteHolding() {
      if (this.currentMarket && this.$store.state.holdings) {
        const holding = _.find(this.$store.state.holdings, (o) => {
          return o.assetId === this.currentMarket.quoteAssetId;
        });

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
    baseHolding() {
      if (this.currentMarket && this.$store.state.holdings) {
        const holding = _.find(this.$store.state.holdings, (o) => {
          return o.assetId === this.currentMarket.baseAssetId;
        });

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
    aphHolding() {
      if (this.currentMarket && this.$store.state.holdings) {
        const holding = _.find(this.$store.state.holdings, (o) => {
          return o.assetId === this.$services.assets.APH;
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
      };
    },
    quoteBalanceToolTip() {
      return 'walletBalanceContractBalance'; // TODO: Fix this
    },
    baseBalanceToolTip() {
      return 'walletBalanceContractBalance'; // TODO: Fix this
    },
    aphBalanceToolTip() {
      return 'walletBalanceContractBalance'; // TODO: Fix this
    },
    priceLabel() {
      if (!this.currentMarket) {
        return '';
      }

      return 'GAS'; // this.$t('priceBase', { base: this.currentMarket.baseCurrency });
    },
    amountLabel() {
      if (!this.currentMarket) {
        return '';
      }

      return 'ATI'; // this.$t('amountQuote', { quote: this.currentMarket.quoteCurrency });
    },
    price() {
      let price = this.$store.state.orderPrice;
      if (!price) {
        // market order
        price = this.marketPriceForQuantity(this.side, this.$store.state.orderQuantity);
      }
      return price;
    },
    total() {
      try {
        if (!this.$store.state.orderQuantity) {
          return 0;
        }

        return new BigNumber(this.price).multipliedBy(new BigNumber(this.$store.state.orderQuantity));
      } catch (e) {
        console.log(e);
        return 0;
      }
    },
    estimate() {
      const holding = this.currentMarket ?
        this.$services.neo.getHolding(this.currentMarket.baseAssetId).unitValue :
        0;

      console.log('holding', holding);

      try {
        return new BigNumber(this.total).multipliedBy(
          new BigNumber(holding));
      } catch (e) {
        console.log(e);
        return 0;
      }
    },
    orderButtonLabel() {
      return 'button label';
      // return this.$isPending('placeOrder') === false ?
      //   this.$t('placeSideOrder', { side: this.side }) :
      //   this.$t('placingOrder');
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
    canPlaceMarketOrder() {
      const currentWallet = this.$services.wallets.getCurrentWallet();
      return currentWallet && currentWallet.isLedger !== true;
    },
  },

  methods: {
    setSide(side) {
      this.side = side;
      this.$store.commit('setOrderQuantity', '');
    },

    loadHoldings() {
      this.$store.dispatch('fetchHoldings', { done: null });
    },

    loadHoldingsSilently() {
      this.$store.dispatch('fetchHoldings', { done: null, isRequestSilent: true });
    },

    setPercent(value) {
      if (this.orderType === 'Limit' && !this.$store.state.orderPrice && this.side === 'Buy') {
        this.$services.alerts.error(this.$t('pleaseEnterAPrice'));
        return;
      }

      this.$store.commit('setOrderQuantity', this.percent(value));
      this.selectedPercent = value;
    },

    percent(value) {
      if (this.side === 'Buy') {
        return this.percentForBuy(value);
      }

      return this.percentForSell(value);
    },

    percentForBuy() {
      // TODO: fix this
      console.log('return');
    },

    percentForSell() {
      // TODO: fix this
      console.log('return');
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

    confirmOrder() {
      //TODO: Fill this in with API request
    },
  },

  data() {
    return {
      actionableHolding: '',
      side: 'Buy',
      orderType: 'Limit',
      postOnly: false,
      selectedPercent: null,
    };
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
    overflow: hidden;
    margin: $space;

    .side {
      display: flex;

      .buy-btn {
        border-color: $green;

        &:hover, &.selected {
          background-color: $green;
        }
      }

      .sell-btn {
        border-color: $red;

        &:hover, &.selected {
          background-color: $red;
        }
      }

      .buy-btn, .sell-btn {
        @extend %btn-outline;
        @extend %selected-text;

        color: white;
        margin: $space;
        flex: 1;
        font-family: GilroySemibold;

        &:disabled {
          background: transparent !important;
          border-color: $grey;
        }
      }
    }

    .order-type {
      margin: 0 $space $space;

      .aph-select--label {
        background: $dark-purple*1.25;
        color: white;
      }

      .aph-icon .fill {
        fill: white;
      }
    }
  }
}
</style>
