<template>
  <section id="dashboard--token-stats">
    <div class="header">
      <div class="title">Token Stats</div>
      <div class="btn-group">
        <div class="receive-btn">
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
          <div class="tile preview">
            <div class="inner">
              <aph-token-icon :symbol="symbol"></aph-token-icon>
              <div class="token">Aphelion</div>
              <div class="symbol">{{ symbol }}</div>
              <div class="amount">{{ $formatNumber(311474) }}</div>
              <div class="value">{{ $formatMoney(325577.56) }}</div>
            </div>
          </div><!--
          --><div class="tile stats">
            <div class="inner">
              <div class="header">
                <div class="label">active Value</div>
                <div class="value">{{ $formatMoney(1.54) }}</div>
              </div>
              <div class="body">
                <div class="row">
                  <div class="col change">
                    <div class="label">24h Change</div>
                    <div class="value">{{ $formatMoney(.45) }} ({{ $formatNumber(2.77) }}%)</div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">24h Low</div>
                    <div class="value">{{ $formatMoney(1.24) }}</div>
                  </div>
                  <div class="col">
                    <div class="label">24h High</div>
                    <div class="value">{{ $formatMoney(1.72) }}</div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">24h Volume</div>
                    <div class="value">{{ $formatMoneyWithoutCents(1542207) }}</div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">Market Cap</div>
                    <div class="value">{{ $formatMoneyWithoutCents(254006318) }}</div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="label">Total Supply</div>
                    <div class="value">{{ $formatNumber(75000000) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div><!--
          --><div class="tile transaction-history">
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
    <aph-transaction-detail :on-hide="hideTransactionDetail" :show="showTransactionDetail" :transaction="transactionDetail"></aph-transaction-detail>
  </section>
</template>

<script>
export default {
  computed: {
    activeTileClass() {
      return `active-tile-${this.activeTile}`;
    },

    received() {
      return this.transactions.filter(({ amount }) => amount > 0);
    },

    sent() {
      return this.transactions.filter(({ amount }) => amount < 0);
    },
  },

  data() {
    return {
      activeTile: 'preview',
      activeTransactionHistoryTab: 'sent',
      showTransactionDetail: false,
      transactionDetail: {},
      transactions: [
        {
          address: 'adfg3asdfaw4rasdvq4asdfasdfasd34rafsdf',
          amount: 34.56,
          block_time: 1516356847,
          symbol: 'APH',
          txid: 'adfg3asdfaw4rasdvq4asdfasdfasd34rafsdf',
        },
        {
          address: '345dafgasdfaw4rasdvq4asdfasdfasd34rafsdf',
          amount: 4432.56,
          block_time: 1516356847,
          symbol: 'NEO',
          txid: '345dafgasdfaw4rasdvq4asdfasdfasd34rafsdf',
        },
        {
          address: 'cvbe5tadfasdfaw4rasdvq4asdfasdfasd34rafsdf',
          amount: -12.56,
          block_time: 1516356847,
          symbol: 'APH',
          txid: 'cvbe5tadfasdfaw4rasdvq4asdfasdfasd34rafsdf',
        },
        {
          address: 'sadfasf4asdfaw4rasdvq4asdfasdfasd34rafsdf',
          amount: -453.56,
          block_time: 1516356847,
          symbol: 'NEO',
          txid: 'sadfasf4asdfaw4rasdvq4asdfasdfasd34rafsdf',
        },
      ],
    };
  },

  methods: {
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
      flex: 1;
      position: relative;
      display: flex;

      > .tiles {
        @include transition(all);

        flex: 1;
        font-size: 0;
        left: 0;
        padding: $space-lg 0;
        position: absolute;
        display: flex;
        flex-direction: row;
        height: 100%;

        > .tile {
          @include transition(all);

          padding: 0 $space-lg;
          position: relative;
          width: 100vw;
          display: flex;
          flex-direction: column;
          font-size: $font-size;
          color: $dark;

          > .inner {
            @include transition(all);

            background: white;
            border-radius: $border-radius;
            flex: 1;
            display: flex;
            overflow: hidden;

            > .body {
              overflow: auto;
            }
          }

          &.preview {
            > .inner {
              justify-content: center;
              align-items: center;
              flex-direction: column;
              padding: $space;
              color: $dark;

              .aph-token-icon {
                flex: none;
                > img {
                  height: toRem(125px);
                  width: toRem(125px);
                }
              }

              .token {
                margin: $space-lg 0 $space-sm;
                font-size: toRem(22px);
                font-family: GilroyMedium;
              }

              .symbol {
                @extend %small-uppercase-grey-label-dark;

                font-size: toRem(20px);
                margin-bottom: $space;
                padding-bottom: $space;
                position: relative;

                &:after {
                  content: "";
                  height: $border-width;
                  background: $purple;
                  width: toRem(40px);
                  position: absolute;
                  left: 50%;
                  bottom: 0;
                  transform: translateX(toRem(-20px));
                }
              }

              .amount {
                color: $purple;
                font-size: toRem(34px);
              }

              .value {
                margin-top: $space;
                font-size: toRem(18px);
                font-family: GilroyMedium;
              }
            }
          }

          &.stats {
            > .inner {
              flex-direction: column;

              .header {
                background-color: $dark;
                flex: none;
                padding: $space;
                display: flex;
                flex-direction: row;
                align-items: center;
                border-top-left-radius: $border-radius;
                border-top-right-radius: $border-radius;

                .label {
                  @extend %small-uppercase-grey-label;

                  flex: 1;
                }

                .value {
                  flex: 1;
                  color: white;
                }
              }

              .body {
                @extend %tile-grid-light;

                flex: 1;
                padding: $space;
              }
            }
          }

          &.transaction-history {
            > .inner {
              flex-direction: column;
              overflow: hidden;

              .header {
                flex: none;
                display: flex;
                flex-direction: row;
                align-items: center;
                color: $dark;

                .tab {
                  @include transition(all);

                  flex: 1;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding: $space;
                  border-bottom: $border-width solid transparent;
                  font-family: GilroyMedium;

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
}
</style>

