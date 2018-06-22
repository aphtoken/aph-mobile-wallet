<template>
  <section id="dashboard--token-stats" :class="[{'show-receive': showReceive, 'show-send': showSend}]">
    <div class="header">
      <div class="title">Token Stats</div>
      <div class="btn-group">
        <div class="receive-btn" @click="showReceive = true">
          <aph-icon name="receive"></aph-icon>
          <p>Receive</p>
        </div>
        <div class="send-btn" @click="showSend = true">
          <aph-icon name="send"></aph-icon>
          <p>Send</p>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="tile-wrapper">
        <div :class="['tiles', activeTileClass]">
          <preview v-touch:swipe.left="goToClaimGas" :symbol="symbol"></preview>
          <claim-gas v-touch:swipe.left="goToStats" v-touch:swipe.right="goToPreview" :symbol="symbol"></claim-gas>
          <stats v-touch:swipe.left="goToTransactionHistory" v-touch:swipe.right="goToClaimGas" :high="high" :low="low" :volume="volume"></stats>
          <transaction-history v-touch:swipe.right="goToStats"></transaction-history>
        </div>
      </div>
      <div class="controls">
        <div :class="['control', {active: activeTile === 'preview'}]" @click="goToPreview"></div>
        <div :class="['control', {active: activeTile === 'claim-gas'}]" @click="goToClaimGas"></div>
        <div :class="['control', {active: activeTile === 'stats'}]" @click="goToStats"></div>
        <div :class="['control', {active: activeTile === 'transaction-history'}]" @click="goToTransactionHistory"></div>
      </div>
    </div>
    <div class="receive" v-touch:swipe.down="hideReceive">
      <div class="control" @click="hideReceive">
        <aph-icon name="arrow-down"></aph-icon>
        <div class="title">Receive</div>
      </div>
      <div class="body">
        <div class="inner">
          <div class="title">Share this wallet address to receive payment.</div>
          <vue-qrcode :value="$store.state.currentWallet.address" :options="{ backgroundAlpha: 0, size: 150 }"></vue-qrcode>
          <div class="address">{{ $store.state.currentWallet.address }}</div>
        </div>
      </div>
    </div>
    <template v-if="showSendConfirmation">
      <div class="send confirmation">
        <div class="control" @click="showSendConfirmation = false">
          <aph-icon name="arrow-left"></aph-icon>
          <div class="title">Send</div>
        </div>
        <div class="body">
          <div class="inner">
            <p>You are sending</p>
            <aph-token-icon :symbol="$store.state.statsToken.symbol"></aph-token-icon>
            <div class="amount">{{amount}} {{ $store.state.statsToken.symbol }}</div>
            <div class="row">
              <div class="col">
                <div class="label">Value</div>
                <div class="value">{{ $formatMoney($store.state.statsToken.unitValue * amount) }}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">Token</div>
                <div class="value">{{ $store.state.statsToken.name }}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="label">Recipient</div>
                <div class="value">{{ address }}</div>
              </div>
            </div>
          </div>
        </div>
        <button class="send-btn" @click="send">Send</button>
      </div>
    </template>
    <template v-else>
      <div class="send">
        <div class="control" @click="hideSend">
          <aph-icon name="arrow-down"></aph-icon>
          <div class="title">Send</div>
        </div>
        <div class="header">
          <aph-token-icon :symbol="$store.state.statsToken.symbol"></aph-token-icon>
          <div class="meta">
            <div class="symbol">{{ $store.state.statsToken.symbol }}</div>
            <div class="balance">{{ $formatNumber($store.state.statsToken.balance) }}</div>
          </div>
          <aph-icon name="arrow-right"></aph-icon>
        </div>
        <div class="body">
          <div class="underlined">Send To</div>
          <div class="tile send-to">
            <aph-input placeholder="Address" :light="true" v-model="address"></aph-input>
            <div class="help-text">
              <div class="symbol">{{ $store.state.statsToken.symbol }}</div>
            </div>
          </div>
          <div class="underlined">Amount</div>
          <div class="tile amount">
            <aph-input placeholder="Amount" :light="true" type="number" v-model="amount"></aph-input>
            <div class="help-text">
              <div class="value">{{ $formatMoney($store.state.statsToken.unitValue * amount) }}</div>
              <div class="max" @click="amount = `${$store.state.statsToken.balance}`">Max</div>
            </div>
          </div>
        </div>
        <button class="next-btn" :disabled="shouldDisableNextButton" @click="showSendConfirmation = true">Next</button>
      </div>
    </template>
  </section>
</template>

<script>
import VueQrcode from '@xkeshi/vue-qrcode';
import ClaimGas from './token-stats/ClaimGas';
import Preview from './token-stats/Preview';
import Stats from './token-stats/Stats';
import TransactionHistory from './token-stats/TransactionHistory';
const HOURS = 24;

export default {
  beforeMount() {
    this.getMetaData();
  },

  components: {
    ClaimGas,
    Preview,
    Stats,
    TransactionHistory,
    VueQrcode,
  },

  computed: {
    activeTileClass() {
      return `active-tile-${this.activeTile}`;
    },

    shouldDisableNextButton() {
      return !this.address || !this.amount || !parseFloat(this.amount);
    },
  },

  data() {
    return {
      activeTile: 'preview',
      address: '',
      amount: '',
      high: 0,
      low: 0,
      showReceive: false,
      showSend: false,
      showSendConfirmation: false,
      volume: 0,
    };
  },

  methods: {
    getMetaData() {
      this.$services.valuation
        .getHistorical(this.$store.state.statsToken.symbol, HOURS)
        .then(({ high, low, volume }) => {
          this.high = high;
          this.low = low;
          this.volume = volume;
        });
    },

    goToClaimGas() {
      this.activeTile = 'claim-gas';
    },

    goToPreview() {
      this.activeTile = 'preview';
    },

    goToStats() {
      this.activeTile = 'stats';
    },

    goToTransactionHistory() {
      this.activeTile = 'transaction-history';
    },

    hideReceive() {
      this.showReceive = false;
    },

    hideSend() {
      this.showSend = false;
    },

    send() {
      setTimeout(() => {
        this.$services.neo.sendFunds(this.address, this.$store.state.statsToken.asset,
          this.amount, this.$store.state.statsToken.isNep5)
          .then(() => {
            this.hideSend();
          })
          .catch((e) => {
            this.$services.alerts.error(e);
          });
      }, this.$constants.timeouts.NEO_API_CALL);
    },
  },

  props: ['symbol'],

  watch: {
    showSend() {
      this.address = this.amount = '';
    },
  },
};
</script>


<style lang="scss">
#dashboard--token-stats {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  > .header {
    align-items: center;
    display: flex;
    flex-direction: column;
    flex: none;
    padding: $space 0 0;

    .title {
      color: white;
      font-size: toRem(18px);
    }

    .btn-group {
      display: flex;
      flex: none;
      flex-direction: row;
      justify-content: space-between;
      margin: $space 0 toRem(-62.5px);
      padding: 0 $space-lg;
      width: 100%;
      z-index: 100;

      .receive-btn, .send-btn {
        @extend %btn-square;

        box-shadow: $box-shadow;
        width: 100%;

        > p {
          margin-top: 0;
        }
      }

      .send-btn {
        background: $purple;
        margin-left: $space-lg;

        > p {
          color: white;
        }
      }
    }
  }

  > .body {
    background: $background;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    padding: toRem(62.5px) 0 $space-lg;

    > .tile-wrapper {
      display: flex;
      flex: 1;
      position: relative;

      > .tiles {
        @include transition(all);

        display: flex;
        flex-direction: row;
        flex: 1;
        font-size: 0;
        height: 100%;
        left: 0;
        padding: $space-lg 0;
        position: absolute;

        > .tile {
          @include transition(all);

          color: $dark;
          display: flex;
          flex-direction: column;
          font-size: $font-size;
          padding: 0 $space-lg;
          position: relative;
          width: 100vw;

          > .inner {
            @include transition(all);

            background: white;
            border-radius: $border-radius;
            display: flex;
            flex: 1;

            > .body {
              overflow: auto;
            }
          }
        }

        &.active-tile-claim-gas {
          left: -100vw;

          > .preview {
            transform: scale(.9);
          }

          > .stats {
            transform-origin: left center;
            transform: scale(.9);
          }
        }

        &.active-tile-preview {
          left: 0;

          > .stats {
            transform: scale(.9);
          }

          > .transaction-history {
            transform-origin: left center;
            transform: scale(.9);
          }
        }

        &.active-tile-stats {
          left: -200vw;

          > .preview {
            transform-origin: right center;
            transform: scale(.9);
          }

          > .transaction-history {
            transform-origin: left center;
            transform: scale(.9);
          }
        }

        &.active-tile-transaction-history {
          left: -300vw;

          > .preview {
            transform: scale(.9);
          }

          > .stats {
            transform-origin: center;
            transform: scale(.9);
          }
        }
      }
    }

    > .controls {
      display: flex;
      flex-direction: row;
      flex: none;
      justify-content: center;

      .control {
        border-radius: 50%;
        border: $border-width-thin solid $purple;
        height: toRem(10px);
        width: toRem(10px);

        &.active {
          background: $purple;
        }

        & + .control {
          margin-left: $space;
        }
      }
    }
  }

  > .receive {
    @include transition(top);

    background: $dark;
    display: flex;
    flex-direction: column;
    height: 100%;
    left: 0;
    overflow: hidden;
    position: fixed;
    top: 100vh;
    width: 100%;
    z-index: 200;

    > .control {
      background: $dark;
      padding: $space;
      flex: none;
      position: relative;

      .aph-icon {
        position: absolute;

        svg {
          height: toRem(20px);
        }
      }

      .title {
        font-size: toRem(18px);
        text-align: center;
      }
    }

    > .body {
      @extend %tile-grid;

      color: $dark;
      flex: 1;
      overflow: auto;
      display: flex;
      flex-direction: column;

      > .inner {
        align-items: center;
        background: white;
        border-radius: $border-radius;
        display: flex;
        flex-direction: column;
        flex: 1;
        justify-content: center;
        margin: 0 $space $space;
        padding: $space;

        .title {
          @extend %small-uppercase-grey-label;

          margin-bottom: $space-xl;
          text-align: center;
          width: 70vw;
        }

        .address {
          font-family: GilroyMedium;
          font-size: toRem(10px);
          margin-top: $space-xl;
        }
      }
    }
  }

  > .send {
    @include transition(top);

    background: $dark;
    display: flex;
    flex-direction: column;
    height: 100%;
    left: 0;
    overflow: hidden;
    position: fixed;
    top: 100vh;
    width: 100%;
    z-index: 200;

    > .control {
      background: $dark;
      padding: $space;
      flex: none;
      position: relative;

      .aph-icon {
        position: absolute;

        svg {
          height: toRem(20px);
        }
      }

      .title {
        font-size: toRem(18px);
        text-align: center;
      }
    }

    > .header {
      background: white;
      border-radius: $border-radius;
      box-shadow: $box-shadow;
      display: flex;
      flex-direction: row;
      align-items: center;
      height: toRem(70px);
      padding: 0 $space;
      color: $dark;
      margin: 0 $space toRem(-35px) $space;
      z-index: 100;

      .aph-token-icon {
        flex: none;
      }

      .meta {
        flex: 1;
        margin-left: $space;
        font-size: toRem(18px);

        .symbol {
          font-family: GilroyMedium;
        }

        .balance {
          @extend %small-uppercase-grey-label-dark;

          font-size: toRem(18px);
        }
      }

      .aph-icon {
        flex: none;

        svg {
          height: toRem(18px);
        }

        .fill {
          fill: $dark;
        }
      }
    }

    > .body {
      @extend %tile-grid;

      background: $background;
      border-top-left-radius: $border-radius;
      border-top-right-radius: $border-radius;
      color: $dark;
      flex: 1;
      overflow: auto;
      display: flex;
      flex-direction: column;
      padding: $space;

      > .inner {
        background: white;
        border-radius: $border-radius;
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
        padding: $space;
      }

      .underlined {
        color: $dark;
        padding-bottom: $space;
        margin: $space 0;
        position: relative;
        font-family: GilroyMedium;
        margin-left: $space;

        &:after {
          content: "";
          height: $border-width;
          background: $purple;
          width: toRem(30px);
          position: absolute;
          left: 0;
          bottom: 0;
        }

        &:first-child {
          margin-top: toRem(35px);
        }
      }

      .tile {
        background: white;
        border-radius: $border-radius;
        padding: $space;

        & + .underlined {
          margin-top: $space;
        }

        &.send-to {
          .help-text {
            margin-top: $space;

            .symbol {
              @extend %small-uppercase-grey-label;

              text-align: right;
            }
          }
        }

        &.amount {
          .help-text {
            display: flex;
            flex-direction: row;
            margin-top: $space;

            .value {
              @extend %small-uppercase-grey-label;

              flex: 1;
            }

            .max {
              @extend %small-uppercase-grey-label;

              color: $purple;
              flex: none;
              text-align: right;
            }
          }
        }
      }
    }

    .next-btn, .send-btn {
      @extend %btn-footer;
    }

    &.confirmation {
      p {
        margin: 0;
        text-align: center;
      }

      .aph-token-icon {
        text-align: center;
        margin: $space-lg 0 0;

        img {
          height: auto;
          width: toRem(125px);
        }
      }

      .amount {
        @extend %small-uppercase-grey-label-dark;

        font-size: toRem(20px);
        margin: $space-lg 0;
        text-align: center;
      }
    }
  }

  &.show-receive {
    .receive {
      top: 0;
    }
  }

  &.show-send {
    .send {
      top: 0;
    }
  }
}
</style>

