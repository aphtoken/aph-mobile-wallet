<template>
  <div :class="['aph-transaction-detail', {show: show}]">
    <div class="control" @click="onHide">
      <aph-icon name="arrow-down"></aph-icon>
    </div>
    <div class="header">
        <div class="confirmed" v-if="details.confirmed">
          <aph-icon name="confirmed-big"></aph-icon>
          <div class="label">{{ $t('Confirmed') }}</div>
        </div>
        <div class="unconfirmed" v-else>
          <aph-icon name="unconfirmed-big"></aph-icon>
          <div class="label">{{ $t('Unconfirmed') }}</div>
        </div>
    </div>
    <div class="body">
      <div class="row">
        <div class="col">
          <div class="label">{{ $t('Hash') }}</div>
          <div class="value address">{{ transaction.address }}</div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label">{{ $t('Date') }}</div>
          <div class="value">{{ $formatDate(transaction.block_time) }}</div>
        </div>
        <div class="col">
          <div class="label">{{ $t('Time') }}</div>
          <div class="value">{{ $formatTime(transaction.block_time) }}</div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label">{{ $t('Token') }}</div>
          <div class="value">{{ transaction.symbol }}</div>
        </div>
        <div class="col">
          <div class="label">{{ $t('Amount') }}</div>
          <div :class="['value', {green: transaction.value > 0, red: transaction.value < 0}]">{{ $formatNumber(transaction.value) }}</div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label">{{ $t('Block') }}</div>
          <div class="value purple">{{ $formatNumber(transaction.block_index) }}</div>
        </div>
        <div class="col">
          <div class="label">{{ $t('Status') }}</div>
          <div class="value" v-if="transaction.value < 0">{{ $t('Sent') }}</div>
          <div class="value" v-else>{{ $t('Received') }}</div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label">{{ $t('From') }}</div>
          <div class="value">{{  transaction.from }}</div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label">{{ $t('To') }}</div>
          <div class="value purple">{{  transaction.to }}</div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label">{{ $t('networkFee') }}</div>
          <div class="value">{{ $t('feeInGas', { fee: $formatNumber(details.net_fee) }) }}</div>
        </div>
        <div class="col">
          <div class="label">{{ $t('systemFee') }}</div>
          <div class="value">{{ $t('systemFeeInGas', { fee: $formatNumber(details.sys_fee)}) }}</div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label">{{ $t('Confirmations') }}</div>
          <div class="value">{{ $formatNumber(details.confirmations) }}</div>
        </div>
        <div class="col">
          <div class="label">{{ $t('Size') }}</div>
          <div class="value">{{ $t('sizeInBytes', { bytes: $formatNumber(details.size)}) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    details() {
      return _.get(this.transaction, 'details', {});
    },
  },

  props: {
    onHide: {
      required: true,
      type: Function,
    },

    show: {
      type: Boolean,
    },

    transaction: {
      type: Object,
    },
  },
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
  z-index: 9999;

  > .control {
    background: $dark;
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
    opacity: 0;
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

    .row > .col > .value.address {
      white-space: normal;
      word-break: break-all;
    }

    background: white;
    color: $dark;
    flex: 1;
    opacity: 0;
    overflow: auto;
    padding: $space;
  }

  &.show {
    top: 0vh;

    > .header, > .body {
      opacity: 1;
    }
  }
}
</style>


