<template>
  <div :class="['aph-fulll-token-stats', {show: show}]">
    <div class="header">
      <div class="title">{{ token.name }} ({{ token.symbol }})</div>
      <div class="control" @click="onHide">
        <aph-icon name="arrow-down"></aph-icon>
      </div>
    </div>
    <div class="body">
      <div class="header">
        <div class="label">{{$t('Value')}}</div>
        <div class="value">{{ $formatMoney(token.unitValue) }}</div>
        <div :class="['change', {increase: percentChange > 0, decrease: percentChange < 0}]">{{ $formatNumber(percentChange) }}%</div>
      </div>
      <div class="chart">
        <line-chart ref="chart" :chart-data="chartData" :options="chartOptions" v-if="chartOptions"></line-chart>
      </div>
      <div class="controls">
        <div @click="changeTimeframe('D')" :class="['option', {active: timeframeOption === 'D'}]">D</div>
        <div @click="changeTimeframe('W')" :class="['option', {active: timeframeOption === 'W'}]">W</div>
        <div @click="changeTimeframe('M')" :class="['option', {active: timeframeOption === 'M'}]">M</div>
        <div @click="changeTimeframe('3M')" :class="['option', {active: timeframeOption === '3M'}]">3M</div>
      </div>
      <div class="footer">
        <div class="row">
          <div class="col">
            <div class="label">{{$t('Low')}}</div>
            <div class="value">{{ $formatMoney(low) }}</div>
          </div>
          <div class="col">
            <div class="label">{{$t('High')}}</div>
            <div class="value">{{ $formatMoney(high) }}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label">{{$t('Open')}}</div>
            <div class="value">{{ $formatMoney(open) }}</div>
          </div>
          <div class="col">
            <div class="label">{{$t('Volume')}}</div>
            <div class="value">{{ $formatMoney(volume) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import LineChart from './charts/LineChart';

export default {
  beforeMount() {
    this.changeTimeframe('D');
  },

  components: { LineChart },

  data() {
    return {
      chartData: null,
      chartOptions: null,
      current: 0,
      date: null,
      high: 0,
      low: 0,
      open: 0,
      percentChange: 0,
      symbol: '',
      timeframeHours: 0,
      timeframeOption: '',
      volume: 0,
    };
  },

  methods: {
    changeTimeframe(timeframe) {
      this.timeframeOption = timeframe;

      switch (this.timeframeOption) {
        case 'D':
          this.timeframeHours = 24;
          break;
        case 'W':
          this.timeframeHours = 7 * 24;
          break;
        case 'M': default:
          this.timeframeHours = 30 * 24;
          break;
        case '3M':
          this.timeframeHours = 3 * 30 * 24;
          break;
      }

      this.loadPriceData();
    },

    loadPriceData() {
      const _this = this;

      this.symbol = this.token.symbol;

      // eslint-disable-next-line
      this.$services.valuation.getHistorical(this.token.symbol, this.timeframeHours)
        .then((priceData) => {
          const firstPrice = _.first(priceData.prices.filter(price => price > 0));
          const lastPrice = _.last(priceData.prices);

          this.chartOptions = null;
          this.current = priceData.last;
          this.date = moment().unix();
          this.high = priceData.high;
          this.low = priceData.low;
          this.open = _.first(priceData.prices);
          this.percentChange = ((lastPrice - firstPrice) / firstPrice) * 100;
          this.volume = priceData.volume;

          this.chartOptions = {
            legend: {
              display: false,
            },
            maintainAspectRatio: false,
            padding: {
              top: 50,
            },
            responsive: true,
            scales: {
              yAxes: [
                {
                  gridLines: {
                    display: false,
                    drawBorder: false,
                    tickMarkLength: 40,
                  },
                  margins: {
                    right: 100,
                    top: 100,
                  },
                  ticks: {
                    callback(label, index) {
                      return index % 2 === 0 ? _this.$formatMoney(label) : '';
                    },
                    autoSkip: true,
                    fontColor: '#66688D',
                    fontFamily: 'GilroySemibold',
                    fontSize: 12,
                    max: this.high,
                    maxTicksLimit: 5,
                    min: this.low,
                  },
                },
              ],
              xAxes: [
                {
                  gridLines: {
                    display: false,
                    drawBorder: false,
                    tickMarkLength: 20,
                  },
                  ticks: {
                    callback(label, index) {
                      if (index % 2 !== 0) {
                        return '';
                      }

                      switch (_this.timeframeOption) {
                        case 'D':
                          return _this.$formatTime(label);
                        case 'W':
                          return _this.$formatWeekdayAndTime(label);
                        case 'M':
                          return _this.$formatDateShort(label);
                        case '3M':
                          return _this.$formatDateShort(label);
                        default: return _this.$formatDateShort(label);
                      }
                    },
                    fontColor: '#B5B5CA',
                    fontFamily: 'GilroySemibold',
                    fontSize: 12,
                  },
                },
              ],
            },
          };

          this.chartData = {
            labels: priceData.dates,
            datasets: [
              {
                backgroundColor: 'transparent',
                borderColor: '#742BF0',
                data: priceData.prices,
                pointRadius: 0,
              },
            ],
          };

          if (priceData.dates.length > 0 && this.$refs.chart) {
            this.$refs.chart.render();
          }
        })
        .catch((e) => {
          this.$services.alert.exception(e);
        });
    },
  },

  props: ['onHide', 'show', 'token'],

  watch: {
    show(newVal) {
      if (newVal) {
        this.loadPriceData();
      }
    },
  },
};
</script>

<style lang="scss">
.aph-fulll-token-stats {
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
  z-index: 1000;

  > .header {
    align-items: center;
    display: flex;
    flex-direction: column;
    flex: none;
    padding: $space 0;

    .title {
      color: white;
      font-size: toRem(18px);
    }

    .control {
      padding: $space;
      position: absolute;
      left: 0;
      top: 0;

      svg {
        height: toRem(20px);
      }
    }
  }

  > .body {
    background: white;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    color: $dark;
    flex: 1;
    display: flex;
    flex-direction: column;

    .header {
      flex: none;
      padding: $space;

      .label {
        @extend %small-uppercase-grey-label;
      }

      .value {
        font-size: toRem(40px);
      }

      .change {
        font-size: toRem(18px);

        &.decrease {
          color: $red;
        }

        &.increase {
          color: $green;

          &:before {
            content: "+"
          }
        }
      }
    }

    > .chart {
      flex: 1;
      min-height: 0;
      padding: 0 $space;

      > div {
        height: 100%;
      }
    }

    > .controls {
      display: flex;
      justify-content: space-around;

      .option {
        border-bottom: $border-width-thick solid transparent;
        color: $purple;
        cursor: pointer;
        flex: none;
        font-family: GilroyMedium;
        font-size: toRem(14px);
        padding: $space-sm $space-lg;
        text-align: center;

        &:hover, &.active {
          border-color: $purple;
        }
      }
    }

    > .footer {
      @extend %tile-grid;

      background: $background;
      flex: none;
      padding: $space;
    }
  }

  &.show {
    top: 0vh;
  }
}
</style>


