<template>
  <div :class="['aph-transaction-detail', {show: show}]" v-touch:swipe.down="onHide">
    <div class="control" @click="onHide">
      <aph-icon name="arrow-down"></aph-icon>
    </div>
    <div class="header">
        <div class="confirmed" v-if="transaction.details.confirmed">
          <aph-icon name="confirmed-big"></aph-icon>
          <div class="label">Confirmed</div>
        </div>
        <div class="unconfirmed" v-else>
          <aph-icon name="unconfirmed-big"></aph-icon>
          <div class="label">Unconfirmed</div>
        </div>
    </div>
    <div class="body">
      <div class="row">
        <div class="col">
          <div class="label">Hash</div>
          <div class="value">{{ transaction.address }}</div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label">Date</div>
          <div class="value">{{ $formatDate(transaction.block_time) }}</div>
        </div>
        <div class="col">
          <div class="label">Time</div>
          <div class="value">{{ $formatTime(transaction.block_time) }}</div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label">Token</div>
          <div class="value">{{ transaction.symbol }}</div>
        </div>
        <div class="col">
          <div class="label">Amount</div>
          <div :class="['value', {green: transaction.value > 0, red: transaction.value < 0}]">{{ $formatNumber(transaction.value) }}</div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label">Block</div>
          <div class="value purple">{{ $formatNumber(transaction.block_index) }}</div>
        </div>
        <div class="col">
          <div class="label">Status</div>
          <div class="value" v-if="transaction.value < 0">Sent</div>
          <div class="value" v-else>Received</div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label">From</div>
          <div class="value">{{  transaction.from }}</div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label">To</div>
          <div class="value purple">{{  transaction.to }}</div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label">Network Fee</div>
          <div class="value">{{ $formatNumber(transaction.details.net_fee) }} GAS</div>
        </div>
        <div class="col">
          <div class="label">System Fee</div>
          <div class="value">{{ $formatNumber(transaction.details.sys_fee) }} GAS</div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label">Confirmations</div>
          <div class="value">{{ $formatNumber(transaction.details.confirmations) }}</div>
        </div>
        <div class="col">
          <div class="label">Size</div>
          <div class="value">{{ $formatNumber(transaction.details.size) }} Bytes</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['onHide', 'show', 'transaction'],
};
</script>

<style lang="scss">
.aph-transaction-detail {
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

  > .control {
    padding: $space;

    svg {
      height: toRem(20px);
    }
  }

  > .header {
    align-items: center;
    background: $background;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    display: flex;
    flex-direction: column;
    flex: none;
    padding: $space 0;

    svg {
      height: $input-height;
    }

    .label {
      font-family: GilroyMedium;
      margin-top: $space;
      text-transform: uppercase;
    }

    .confirmed {
      color: $green;
      text-align: center;

      .fill {
        fill: $green;
      }
    }

    .unconfirmed {
      color: $red;
      text-align: center;

      .fill {
        fill: $red;
      }
    }
  }

  > .body {
    @extend %tile-grid;

    background: white;
    color: $dark;
    flex: 1;
    overflow: auto;
    padding: $space;
  }

  &.show {
    top: 0vh;
  }
}
</style>


