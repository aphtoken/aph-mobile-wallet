<template>
  <section id="dex--orders-table">
    <div class="header">
      <div v-for="status in orderStatus"
        :class="[status, { active: selectedStatus === status }]"
        @click="handleStatusChange(status)">
        {{ status }} ()
      </div>
      <aph-simple-table v-bind="{ data: ordersTableData, columns }">
        <div slot="pairAndSide" slot-scope="pairAndSide" class="pair-and-side">
          <div class="pair">
            {{ pairAndSide.pair }}
          </div>
        </div>
      </aph-simple-table>
    </div>
  </section>
</template>

<script>

const OPEN = 'Open';
const COMPLETED = 'Completed';
const TABLE_COLUMNS = ['pairAndSide', 'details'];

  
export default {
  components: {
  },

  computed: {
    ordersTableData() {
      return [{pairAndSide: {pair: 'APH/NEO', side: 'buy'}, details: {amount: '72,043.56', base: 'APH', price: '0.225', cost: '$.25'}}];
    }
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
  flex: 1;
  flex-direction: column;
  
  .header {
    margin: 0 $space;
    display: flex;
    flex-direction: row;
    flex: none;
    justify-content: space-between;

    > div {
      flex: 1;
      padding: $space;
      text-align: center;

      &.active {
        border-bottom: $border;
      }
    }
  }
}
</style>