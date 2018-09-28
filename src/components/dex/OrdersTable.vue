<template>
  <section id="dex--orders-table">
    <div class="header">
      <div v-for="status in orderStatus"
        :class="[status, { active: selectedStatus === status }]"
        @click="handleStatusChange(status)">
        {{ status }} (3)
      </div>
    </div>
    <aph-simple-table v-bind="{ data: ordersTableData, columns, hasHeader: false }">
      <div slot="pairAndSide" slot-scope="{value}" class="pair-and-side-cell">
        <div class="pair">
          {{ value.pair }}
        </div>
        <div class="side" :class="value.side">
          {{ value.side }}
        </div>
      </div>
      <div slot="details" slot-scope="{value}" class="details-cell">
        <div class="trade-details">
          <div class="size-base">
            <div class="trade-size">
              {{ value.amount }}
            </div>
            <div class="base-currency">
              {{ value.base }}
            </div>
          </div>
          <div class="price-cost">
            <div class="price">
              {{ value.price }}
            </div>
            <div class="cost">
              {{ value.cost }}
            </div>
          </div>
        </div>
        <div class="cancel-btn">
          X
        </div>
      </div>
    </aph-simple-table>
  </section>
</template>

<script>

const COMPLETED = 'Completed';
const OPEN = 'Open';
const TABLE_COLUMNS = ['pairAndSide', 'details'];

export default {
  components: {
  },

  computed: {
    ordersTableData() {
      return [{pairAndSide: {pair: 'APH/NEO', side: 'buy'}, details: {amount: '72,043.56', base: 'APH', price: '0.225', cost: '$.25'}}, {pairAndSide: {pair: 'APH/ATI', side: 'sell'}, details: {amount: '72,043.56', base: 'APH', price: '0.225', cost: '$.25'}}];
    },
  },

  data() {
    return {
      columns: TABLE_COLUMNS,
      orderStatus: [OPEN, COMPLETED],
      selectedStatus: OPEN,
    };
  },

  methods: {
    handleStatusChange(newStatus) {
      this.selectedStatus = newStatus;
    },
  },

  mounted() {
  },

  watch: {
  },
};

</script>

<style lang="scss">
#dex--orders-table {
  background: $dark-purple;
  display: flex;
  flex-direction: column;
  flex: 1;
  
  .header {
    display: flex;
    flex-direction: row;
    flex: none;
    justify-content: space-between;
    margin: 0 $space;

    > div {
      flex: 1;
      padding: $space;
      text-align: center;

      &.active {
        border-bottom: $border;
      }
    }
  }

  .pair-and-side-cell {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .pair-and-side-cell {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: flex-start;

    .side {
      margin-top: $space-sm;
      text-transform: capitalize;

      &.buy {
        color: $green;
        
        &:before {
          content: "+";
        }
      }

      &.sell {
        color: $red;

        &:before {
          content: "-";
        }
      }
    }
  }

  .details-cell {
    display: flex;
    flex-direction: row;
    flex: 1;
    justify-content: flex-end;

    .trade-details {
      display: flex;
      flex: 1;
      flex-direction: column;
      margin-right: $space;

      > div {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;

        &:last-child {
          margin-top: $space-sm;
        }

        > div, &:last-child {
          margin-left: $space-sm;
        }

        .cost {
          color: $darker-grey;
        }
      }
    }

    .cancel-btn {
      border-radius: 50%;
      border: 1px $darker-grey solid;
      margin: auto 0 auto $space;
      padding: $space-sm
    }
  }
}
</style>
