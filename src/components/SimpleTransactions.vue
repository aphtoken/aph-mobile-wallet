<template>
  <table class="transactions-table" :class="{'is-clickable': isClickable}">
    <tr v-for="(transaction, index) in transactions" :key="index" @click="handleOnClick(transaction)" :class="[{active: transaction.active}]">
      <td width="65%">
        <div class="hash truncate">{{ transaction.address }}</div>
        <div class="date">{{ $formatDate(transaction.block_time) }}</div>
      </td>
      <td width="35%" class="right">
        <div class="currency">{{ transaction.symbol }}</div>
        <div :class="['amount', {sent: transaction.value < 0, received: transaction.value > 0}]">{{ $formatNumber(transaction.value) }}</div>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  computed: {
    isClickable() {
      return _.isFunction(this.onClick);
    },
  },

  methods: {
    handleOnClick(transaction) {
      if (this.onClick) {
        this.onClick(transaction);
      }
    },
  },

  props: {
    onClick: {
      type: Function,
    },

    showBlockTime: {
      default: true,
      type: Boolean,
    },

    transactions: {
      default() {
        return [];
      },
      type: Array,
    },
  },
};
</script>

<style lang="scss">
.transactions-table {
  border-collapse: collapse;
  font-family: GilroySemibold;
  font-size: toRem(12px);
  table-layout: fixed;
  width: 100%;

  td {
    border-top: toRem(1px) solid $border-grey;
    padding: $space;
    white-space: nowrap;

    &.right {
      text-align: right;
    }

    > .truncate {
      @include truncate();
    }

    > .hash {
      color: $dark;
      font-family: GilroyMedium;
      margin-bottom: $space-sm;
    }

    > .date, > .currency {
      @extend %small-uppercase-grey-label-dark;
    }

    > .currency {
      margin-bottom: $space-sm;
    }

    > .amount {
      color: $dark;

      &.received {
        color: $green;

        &:before {
          content: "+";
        }
      }

      &.sent {
        color: $red;
      }
    }
  }

  &.is-clickable {
    tr {
      cursor: pointer;

      td {
        @include transition(background-color);

        background-color: transparent;

        &:first-child {
          padding-left: $space;
        }

        &:last-child {
          padding-right: $space;
        }
      }
    }
  }
}
</style>


