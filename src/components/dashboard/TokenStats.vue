<template>
  <section id="dashboard--token-stats" :class="[{'show-receive': showReceive}]">
    <div class="header">
      <div class="title">Token Stats</div>
      <div class="btn-group">
        <div class="receive-btn" @click="showReceive = true">
          <aph-icon name="receive"></aph-icon>
          <p>Receive</p>
        </div>
        <div class="send-btn">
          <aph-icon name="send"></aph-icon>
          <p>Send</p>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="tile-wrapper">
        <div :class="['tiles', activeTileClass]">
          <div class="tile preview" v-touch:swipe.left="goToStats">
            <div class="inner">
              <aph-token-icon :symbol="symbol"></aph-token-icon>
              <div class="token">{{ $store.state.statsToken.name }}</div>
              <div class="symbol">{{ $store.state.statsToken.symbol }}</div>
              <div class="amount">{{ $formatNumber($store.state.statsToken.balance) }}</div>
              <div class="value">{{ $formatMoney($store.state.statsToken.balance * $store.state.statsToken.unitValue) }}</div>
            </div>
          </div><!--
          --><div class="tile stats" v-touch:swipe.left="goToTransactionHistory" v-touch:swipe.right="goToPreview">
            <div class="inner">
              <div class="header">
                <div class="label">Active Value</div>
                <div class="value">{{ $formatMoney($store.state.statsToken.balance * $store.state.statsToken.unitValue) }}</div>
              </div>
              <div class="body">
                <div class="row">
                  <div class="col change">
                    <div class="label">24h Change</div>
                    <div class="value">{{ $formatMoney($store.state.statsToken.change24hrValue) }} ({{ $formatNumber($store.state.statsToken.change24hrPercent) }}%)</div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">24h Low</div>
                    <div class="value">{{ $formatMoney(low) }}</div>
                  </div>
                  <div class="col">
                    <div class="label">24h High</div>
                    <div class="value">{{ $formatMoney(high) }}</div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">24h Volume</div>
                    <div class="value">{{ $formatMoneyWithoutCents(volume) }}</div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">Market Cap</div>
                    <div class="value">{{ $formatMoneyWithoutCents($store.state.statsToken.marketCap) }}</div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">Total Supply</div>
                    <div class="value">{{ $formatNumber($store.state.statsToken.totalSupply) }}</div>
                  </div>
                </div>
              </div>
              <div class="expand-btn" @click="showFullTokenStats = true">
                <aph-icon name="expand"></aph-icon>
              </div>
            </div>
          </div><!--
          --><div class="tile transaction-history" v-touch:swipe.right="goToStats">
            <div class="inner">
              <div class="header">
                <div :class="['tab', {active: activeTransactionHistoryTab === 'sent'}]" @click="activeTransactionHistoryTab = 'sent'">Sent</div>
                <div :class="['tab', {active: activeTransactionHistoryTab === 'received'}]" @click="activeTransactionHistoryTab = 'received'">Received</div>
              </div>
              <div class="body">
                <div class="sent" v-if="activeTransactionHistoryTab === 'sent'">
                  <aph-simple-transactions :transactions="sent" :on-click="showTransaction"></aph-simple-transactions>
                </div>
                <div class="received" v-if="activeTransactionHistoryTab === 'received'">
                  <aph-simple-transactions :transactions="received" :on-click="showTransaction"></aph-simple-transactions>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="controls">
        <div :class="['control', {active: activeTile === 'preview'}]" @click="activeTile = 'preview'"></div>
        <div :class="['control', {active: activeTile === 'stats'}]" @click="activeTile = 'stats'"></div>
        <div :class="['control', {active: activeTile === 'transaction-history'}]" @click="activeTile = 'transaction-history'"></div>
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
    <aph-transaction-detail :on-hide="hideTransactionDetail" :show="showTransactionDetail" :transaction="transactionDetail"></aph-transaction-detail>
    <aph-full-token-stats :on-hide="hideFullTokenStats" :show="showFullTokenStats" :token="$store.state.statsToken"></aph-full-token-stats>
  </section>
</template>

<script>
import VueQrcode from '@xkeshi/vue-qrcode';
const HOURS = 24;

export default {
  beforeMount() {
    this.getMetaData();
    this.$store.dispatch('fetchRecentTransactions');
  },

  components: {
    VueQrcode,
  },

  computed: {
    activeTileClass() {
      return `active-tile-${this.activeTile}`;
    },

    received() {
      return this.$store.state.recentTransactions.filter(({ value, symbol }) => {
        return value > 0 && this.symbol === symbol;
      });
    },

    sent() {
      return this.$store.state.recentTransactions.filter(({ value, symbol }) => {
        return value < 0 && this.symbol === symbol;
      });
    },
  },

  data() {
    return {
      activeTile: 'preview',
      activeTransactionHistoryTab: 'sent',
      high: 0,
      low: 0,
      showFullTokenStats: false,
      showReceive: false,
      showTransactionDetail: false,
      transactionDetail: {},
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

    goToPreview() {
      this.activeTile = 'preview';
    },

    goToStats() {
      this.activeTile = 'stats';
    },

    goToTransactionHistory() {
      this.activeTile = 'transaction-history';
    },

    hideFullTokenStats() {
      this.showFullTokenStats = false;
    },

    hideReceive() {
      this.showReceive = false;
    },

    hideTransactionDetail() {
      this.showTransactionDetail = false;
    },

    showTransaction(transaction) {
      this.transactionDetail = transaction;
      this.showTransactionDetail = true;
    },
  },

  props: ['symbol'],
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
      margin-bottom: $space-lg;
    }

    .btn-group {
      display: flex;
      flex: none;
      justify-content: space-evenly;
      margin-bottom: toRem(-75px);
      width: 100%;
      z-index: 100;

      .receive-btn, .send-btn {
        @extend %btn-square;

        box-shadow: $box-shadow;

        > p {
          margin-top: 0;
        }
      }

      .send-btn {
        background: $purple;

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
    padding: toRem(75px) 0 $space-lg;

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
            overflow: hidden;

            > .body {
              overflow: auto;
            }
          }

          &.preview {
            > .inner {
              align-items: center;
              color: $dark;
              flex-direction: column;
              justify-content: center;
              padding: $space;

              .aph-token-icon {
                flex: none;
                > img {
                  height: toRem(125px);
                  width: toRem(125px);
                }
              }

              .token {
                font-family: GilroyMedium;
                font-size: toRem(22px);
                margin: $space-lg 0 $space-sm;
              }

              .symbol {
                @extend %small-uppercase-grey-label-dark;

                font-size: toRem(20px);
                margin-bottom: $space;
                padding-bottom: $space;
                position: relative;

                &:after {
                  background: $purple;
                  bottom: 0;
                  content: "";
                  height: $border-width;
                  left: 50%;
                  position: absolute;
                  transform: translateX(toRem(-20px));
                  width: toRem(40px);
                }
              }

              .amount {
                color: $purple;
                font-size: toRem(34px);
              }

              .value {
                font-family: GilroyMedium;
                font-size: toRem(18px);
                margin-top: $space;
              }
            }
          }

          &.stats {
            > .inner {
              flex-direction: column;

              .header {
                align-items: center;
                background-color: $dark;
                border-top-left-radius: $border-radius;
                border-top-right-radius: $border-radius;
                display: flex;
                flex-direction: row;
                flex: none;
                padding: $space;

                .label {
                  @extend %small-uppercase-grey-label;

                  flex: 1;
                }

                .value {
                  color: white;
                  flex: 1;
                }
              }

              .body {
                @extend %tile-grid-light;

                flex: 1;
                padding: $space;
              }
            }

            .expand-btn {
              @extend %btn-circle;

              position: absolute;
              right: 0;
              bottom: 0;
              box-shadow: $box-shadow-lg;
              transform: translate(-100%, 50%)
            }
          }

          &.transaction-history {
            > .inner {
              flex-direction: column;
              overflow: hidden;

              .header {
                align-items: center;
                color: $dark;
                display: flex;
                flex-direction: row;
                flex: none;

                .tab {
                  @include transition(all);

                  align-items: center;
                  border-bottom: $border-width solid transparent;
                  display: flex;
                  flex: 1;
                  font-family: GilroyMedium;
                  justify-content: center;
                  padding: $space;

                  &.active {
                    border-color: $purple;
                    color: $purple;
                  }
                }
              }

              .body {
                @extend %tile-grid-light;

                flex: 1;
                overflow: auto;
              }
            }
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
          left: -100vw;

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
          left: -200vw;

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
        margin: $space;
        padding: $space;

        .title {
          @extend %small-uppercase-grey-label;

          margin-bottom: $space-xl;
          text-align: center;
          width: 70vw;
        }

        .address {
          font-family: GilroyMedium;
          margin-top: $space-xl;
        }
      }
    }

    .submit-btn {
      @extend %btn-footer;
    }
  }

  &.show-receive {
    .receive {
      top: 0;
    }
  }
}
</style>

