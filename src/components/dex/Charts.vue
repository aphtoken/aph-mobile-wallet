<template>
  <section id="dex--charts">
    <div class="body">
      <div class="btn-group">
        <button :class="['btn-candlesticks', {active: tab === 'candlesticks'}]" @click="tab = 'candlesticks'">{{ $t('candlesticks') }}</button>
        <button :class="['btn-depth', {active: tab === 'depth'}]" @click="tab = 'depth'">{{ $t('depth') }}</button>
      </div>
      <div class="chart">
        <div v-show="tab === 'candlesticks'" id="chart-container"></div>
        <div v-show="tab === 'depth'" id="depth-container">
          <div class="upper">
            <div class="left-axis">
              <div class="value">100</div>
              <div class="value">80</div>
              <div class="value">60</div>
              <div class="value">40</div>
              <div class="value">20</div>
              <div class="value"></div>
              </div>
            <div class="panel">
              <div class="bids" v-if="$store.state.orderBook">
                <div class="level" v-for="(bid, index) in bidGroups" :key="`left-bid-${index}`">
                    <div class="size-bar" :style="{ height: (bid.quantityRatio * 100) + '%' }">
                        <span>{{ $formatNumber(bid.runningQuantity) }}</span>
                    </div>
                </div>
              </div>
              <div class="asks" v-if="$store.state.orderBook">
                <div class="level" v-for="(ask, index) in askGroups" :key="`left-ask-${index}`">
                    <div class="size-bar" :style="{ height: (ask.quantityRatio * 100) + '%' }">
                        <span>{{ $formatNumber(ask.runningQuantity) }}</span>
                    </div>
                </div>
              </div>
            </div>
            <div class="right-axis">
              <div class="value">100</div>
              <div class="value">80</div>
              <div class="value">60</div>
              <div class="value">40</div>
              <div class="value">20</div>
              <div class="value"></div>
            </div>
          </div>
          <div class="bottom-axis" v-if="$store.state.orderBook">
            <div class="level"><span>&nbsp;</span></div>
            <div class="level" v-for="(bid, index) in bidGroups" :key="`bottom-bid-${index}`">
              <span>{{ bid.priceLabel }}</span>
            </div>
            <div class="level" v-for="(ask, index) in askGroups" :key="`bottom-ask-${index}`">
              <span>{{ ask.priceLabel }}</span>
            </div>
            <div class="level"><span>&nbsp;</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { BigNumber } from 'bignumber.js';

export default {
  beforeDestroy() {
    clearInterval(this.barsSubscription);
  },

  computed: {
    askGroups() {
      try {
        const groups = [];
        const size = this.groupSize;
        let currentUpper = this.middle.plus(size);

        while (groups.length < 5) {
          const currentGroup = {
            priceUpper: currentUpper,
            priceLower: currentUpper.minus(size),
            priceLabel: this.$formatNumber(currentUpper),
            quantity: new BigNumber(0),
          };

          this.$store.state.orderBook.asks.forEach((ask) => {
            if (ask.price.isGreaterThanOrEqualTo(currentGroup.priceLower) && ask.price.isLessThan(currentGroup.priceUpper)) {
              currentGroup.quantity = currentGroup.quantity.plus(ask.quantity);
            }
          });

          groups.push(currentGroup);
          currentUpper = this.roundToDepthPrecision(currentUpper.plus(size));
        }

        let totalQuantity = new BigNumber(0);
        let runningQuantity = new BigNumber(0);
        groups.forEach((group) => {
          totalQuantity = totalQuantity.plus(group.quantity);
        });
        groups.forEach((group) => {
          group.runningQuantity = runningQuantity = runningQuantity.plus(group.quantity);
          group.quantityRatio = runningQuantity.dividedBy(totalQuantity);
        });

        return groups.reverse();
      } catch (e) {
        console.log(e);
        return [];
      }
    },

    bidGroups() {
      try {
        const groups = [];
        const size = this.groupSize;
        let currentLower = this.middle.minus(size);

        while (groups.length < 5) {
          const currentGroup = {
            priceLabel: this.$formatNumber(currentLower),
            priceLower: currentLower,
            priceUpper: currentLower.plus(size),
            quantity: new BigNumber(0),
          };

          this.$store.state.orderBook.bids.forEach((bid) => {
            if (bid.price.isGreaterThan(currentGroup.priceLower) && bid.price.isLessThanOrEqualTo(currentGroup.priceUpper)) {
              currentGroup.quantity = currentGroup.quantity.plus(bid.quantity);
            }
          });
          groups.push(currentGroup);
          currentLower = this.roundToDepthPrecision(currentLower.minus(size));
        }

        let totalQuantity = new BigNumber(0);
        let runningQuantity = new BigNumber(0);
        groups.forEach((group) => {
          totalQuantity = totalQuantity.plus(group.quantity);
        });
        groups.forEach((group) => {
          group.runningQuantity = runningQuantity = runningQuantity.plus(group.quantity);
          group.quantityRatio = runningQuantity.dividedBy(totalQuantity);
        });

        return groups.reverse();
      } catch (e) {
        console.log(e);
        return [];
      }
    },

    groupSize() {
      const bids = this.$store.state.orderBook.bids;
      const asks = this.$store.state.orderBook.asks;

      // TODO: Re-visit math used here for determining the groupSize.
      let bidRange = 0;
      if (bids.length > 1 && asks.length > 0) {
        bidRange = Math.abs(this.middle - bids[bids.length - 1].price);
      }

      let askRange = 0;
      if (asks.length > 1 && bids.length > 0) {
        askRange = Math.abs(asks[asks.length - 1].price - this.middle);
      }

      let groupSize = bidRange;
      if (askRange < bidRange) {
        groupSize = askRange;
      }

      this.depthPrecision = 4;
      while (groupSize * (10 ** this.depthPrecision) < 1) {
        this.depthPrecision += 1;
      }

      groupSize = this.roundToDepthPrecision(groupSize).dividedBy(5);
      return groupSize;
    },

    isMarketClosed() {
      return this.$store.state.currentMarket && this.$store.state.currentMarket.isOpen === false;
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

    middle() {
      const bids = this.$store.state.orderBook.bids;
      const asks = this.$store.state.orderBook.asks;
      if (bids.length > 0 && asks.length > 0) {
        return bids[0].price.plus(asks[0].price).dividedBy(2);
      } else if (bids.length > 0) {
        return bids[0].price;
      } else if (asks.length > 0) {
        return asks[0].price;
      }
      return new BigNumber(0);
    },
  },

  data() {
    return {
      tab: 'candlesticks',
      depthPrecision: 4,
      lastPrice: 0,
      barsSubscription: null,
      tradingView: null,
    };
  },

  methods: {
    loadChart() {
      /* eslint-disable */
      const regressionTrend = this.$t('regressionTrend'); // Fixes the `Cannot read property '_t' of undefined` error

      try {
        const container = document.getElementById('chart-container');
        if (!container) {
          return;
        }

        if (!this.$store.state.currentMarket) {
          return;
        }

        this.removeChart();

        const symbolName = this.$store.state.currentMarket.marketName;
        const tradedExchange = 'Aphelion';
        const fullName = `${tradedExchange}:${symbolName}`;
        const symbolInfo = {
          has_daily: true,
          has_empty_bars: true,
          has_intraday: true,
          has_no_volume: false,
          has_weekly_and_monthly: true,
          intraday_multipliers: ['1', '5', '15', '30', '60', '360'],
          minmov2: 0,
          minmov: 1,
          name: fullName,
          pricescale: 100000000,
          session: '24x7',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          volume_precision: 5,
        };

        const getResolutionInMinutes = (resolution) => 
          resolution === 'D' ? 60 * 24 :
          resolution === 'W' ? 7 * 60 * 24 :
          Number(resolution);

        const datafeed = {
          onReady: (callback) => {
            setTimeout(() => {
              callback(
                {
                  exchanges: [],
                  supported_resolutions: [1, 5, 15, 30, 60, 360, '1D', '3D', '1W'],
                  supports_group_request: false,
                  supports_marks: false,
                  supports_search: false,
                  supports_time: false,
                  supports_timescale_marks: false,
                  symbolsTypes: [],
                },
              )
            }, 0)
          },

          searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
            onResultReadyCallback([])
          },

          resolveSymbol: (_symbolName, onSymbolResolvedCallback,
            onResolveErrorCallback) => {
            setTimeout(() => { onSymbolResolvedCallback(symbolInfo) }, 0)
          },

          getBars: (_symbolInfo, resolution, from, to, onDataCallback, onErrorCallback) => {
            const resolutionInMinutes = getResolutionInMinutes(resolution);

            this.$store.dispatch('fetchTradesBucketed', {
              marketName: this.$store.state.currentMarket.marketName,
              interval: resolutionInMinutes,
              from: from, 
              to: to,
              }).then(() => {
                // Compute and fetch bars on newly populated apiBuckets
                const bars = this.$store.state.tradeHistory && this.$store.state.tradeHistory.getBars ?
                  this.$store.state.tradeHistory.getBars(this.$store.state.tradeHistory, resolutionInMinutes, from, to) :
                  [];

                if (bars.length === 0) {
                  onDataCallback(bars, { noData: true, nextTime: (to + (resolutionInMinutes * 60)) })
                } else {
                  onDataCallback(bars, { noData: false })
                }
              });
          },

          subscribeBars: (_symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
            const resolutionInMinutes = getResolutionInMinutes(resolution);

            let lastBarTime = NaN;
            if (this.barsSubscription) {
              clearInterval(this.barsSubscription);
            }

            this.barsSubscription = setInterval(() => {
              if (!this.tradingView || !this.tradingView._options) {
                return;
              }
              const to = Math.round(new Date().valueOf() / 1000);
              const from = to - (resolutionInMinutes * 60 * 2); //  back 2x resolutions

              const bars = this.$store.state.tradeHistory && this.$store.state.tradeHistory.getBars ?
                  this.$store.state.tradeHistory.getBars(this.$store.state.tradeHistory, resolution, from, to) :
                  [];

              if (bars.length === 0) {
                return;
              }

              const lastBar = bars[bars.length - 1];

              if (!Number.isNaN(lastBarTime) && lastBar.time < lastBarTime) {
                return;
              }

              const isNewBar = !Number.isNaN(lastBarTime) && lastBar.time > lastBarTime

              if (isNewBar && bars.length >= 2) {
                const previousBar = bars[bars.length - 2];
                onRealtimeCallback(previousBar);
              }

              lastBarTime = lastBar.time;

              try {
                onRealtimeCallback(lastBar);
              } catch (err) {
                // This is a false positive due to using has_empty_bars
                if (err.message.contains('time order violation')) {
                  return
                }

                throw err;
              }
            }, 10000)
          },

          unsubscribeBars: (subscriberUID) => {
            clearInterval(this.barsSubscription);
          },
        }

        var settings = {
          autosize: true,
          container_id: "chart-container",
          datafeed: datafeed,
          disabled_features: [
            "use_localstorage_for_settings","header_symbol_search","header_interval_dialog_button","header_screenshot","header_undo_redo",
            "header_compare","symbol_info","display_market_status","display_market_status",
          ],
          drawings_access: { type: 'black', tools: [ { name: regressionTrend } ] },
          enabled_features: [],
          fullscreen: false,
          hide_top_toolbar: false,
          interval: '15',
          library_path: '/static/charting_library/',
          loading_screen: false,
          locale: "en",
          overrides: {
            "paneProperties.background": "#171629",
            "paneProperties.vertGridProperties.color": "#454545",
            "paneProperties.horzGridProperties.color": "#454545",
            "symbolWatermarkProperties.transparency": 90,
            "scalesProperties.textColor": "#AAA",
            "scalesProperties.backgroundColor": "#171629",
            "paneProperties.topMargin": 15,
            "paneProperties.bottomMargin": 10,
          },
          symbol: symbolName,
          toolbar_bg: '#171629',
        };

        this.tradingView = new TradingView.widget(settings);

        setTimeout(() => {
          var cssLink = document.createElement("link");
          cssLink.href = "/static/charting_library/static/styles.css";
          cssLink.rel = "stylesheet";
          cssLink.type = "text/css";
          for (var i = 0; i < window.frames.length; i++) {
            if (window.frames[i].name === container.children[0].id) {
              window.frames[i].document.body.appendChild(cssLink);
              break;
            }
          }
        }, 1000);
      } catch (e) {
        console.log(e);
        alert(e);
      }
    },

    removeChart() {
      const container = document.getElementById('chart-container');
      while (container && container.hasChildNodes()) {
        container.removeChild(container.lastChild);
      }
      clearInterval(this.barsSubscription);
    },

    roundToDepthPrecision(value) {
      return new BigNumber(Math.round(value * (10 ** this.depthPrecision)) / (10 ** this.depthPrecision));
    },

    selectTab(tab) {
      this.tab = tab;
      if (tab === 'Chart') {
        this.loadChart();
      } else {
        this.removeChart();
      }
    },
  },

  mounted() {
    this.loadChart();
  },
};
</script>

<style lang="scss">
#dex--charts {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  overflow: hidden;

   > .body {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;

    .btn-group {
      display: flex;
      flex: none;

      > button {
        @extend %btn;

        &:not(.active) {
          background-color: $dark-purple;
          border-color: $dark-purple;
        }

        & + button {
          margin-left: $space;
        }
      }
    }

    .chart {
      @extend %tile-dark;

      display: flex;
      flex-direction: column;
      flex: 1;
      margin-top: $space;

      #chart-container {
        overflow: hidden;
        flex: 1;
      }

      #depth-container {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding-top: $space-lg;

        .upper {
          display: flex;
          flex: 1;

          .left-axis {
            padding-right: $space-sm;
          }


          .right-axis {
            padding-left: $space-sm;
          }

          .left-axis, .right-axis {
            flex: none;

            .value {
              height: percentage(1/5);
            }
          }

          .left-axis {
            text-align: right;
          }

          .panel {
            display: flex;
            flex: 1;
            overflow: hidden;

            .bids, .asks {
              display: flex;
              flex: 1;

              .level {
                flex: 1;
                position: relative;

                .size-bar {
                  bottom: 0px;
                  position: absolute;
                  width: 100%;

                  span {
                    border-radius: 4px;
                    border: 1px solid $green;
                    display: none;
                    left: -10px;
                    padding: $space-sm $space;
                    position: absolute;
                    right: -10px;
                    text-align: center;
                    top: -45px;

                    &:before {
                      background-color: $grey;
                      content: "";
                      display: block;
                      height: 500px;
                      left: 48%;
                      position: absolute;
                      top: 30px;
                      width: 1px;
                    }

                    &:after {
                      color: $green;
                      content: "\25CF";
                      display: block;
                      height: 5px;
                      left: 0px;
                      position: absolute;
                      right: 0px;
                      top: 35px;
                      width: 100%;
                    }
                  }

                  &:hover {
                    span {
                      display: block;
                    }
                  }
                }
              }
            }

            .bids {
              .level {
                margin-left: -$border-width-thin;

                .size-bar {
                  background-color: $light-green;
                  border-right: $border-width-thin solid $green;
                  border-top: $border-width-thin solid $green;
                }
              }
            }

            .asks {
              border-left: 1px solid $dark-grey;
              flex-direction: row-reverse;

              .level {
                margin-right: -$border-width-thin;

                .size-bar {
                  background-color: $light-red;
                  border-left: $border-width-thin solid $red;
                  border-top: $border-width-thin solid $red;

                  span {
                    border: 1px solid $red;

                    &:after {
                      color: $red;
                    }
                  }
                }
              }
            }
          }

          .right-axis {
            text-align: left;
          }
        }

        .bottom-axis {
          display: flex;
          padding-bottom: $space-xxl;

          .level {
            flex: 1;
            width: percentage(1/12);
            font-size: toRem(12px);

            span {
              display: block;
              transform: rotate(90deg) translateX(14px);
            }
          }
        }
      }
    }
  }
}
</style>
