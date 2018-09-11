<template>
  <section class="aph-simple-table">
    <table>
      <thead>
        <tr>
          <th v-for="key in columns"
            @click="sortBy(key)"
            :class="{ active: sortKey == key }">
            {{ key | capitalize }}
            <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in filteredData">
          <td v-for="key in columns">
            {{entry[key]}}
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>

export default {
  props: {
    data: {
      default: [],
      type: Array,
    },
    columns: {
      default: [],
      type: Array,
    },
    // Not sure if we plan on filtering this list
    filterKey: {
      default: '',
      type: String,
    },
  },

  data() {
    const sortOrders = {};
    this.columns.forEach((key) => {
      sortOrders[key] = 1;
    });

    return {
      sortKey: '',
      sortOrders,
    };
  },

  computed: {
    filteredData() {
      const sortKey = this.sortKey;
      const filterKey = this.filterKey && this.filterKey.toLowerCase();
      const order = this.sortOrders[sortKey] || 1;
      let data = this.data;
      if (filterKey) {
        data = data.filter((row) => {
          return Object.keys(row).some((key) => {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1;
          });
        });
      }
      if (sortKey) {
        data = data.slice().sort((a, b) => {
          a = a[sortKey];
          b = b[sortKey];
          if (a === b) {
            return 0 * order;
          } else if (a > b) {
            return 1 * order;
          }
          return -1 * order;
        });
      }
      return data;
    },
  },

  filters: {
    capitalize(str) {
      return str.toUpperCase();
    },
  },

  methods: {
    debug() {
      console.log('here', this.props.data)
    },

    sortBy(key) {
      this.sortKey = key;
      this.sortOrders[key] = this.sortOrders[key] * -1;
    },
  },
};

</script>

<style lang="scss">
.aph-simple-table {
  display: flex;
  flex: 1;
  font-family: Gilroy;

  table {
    border-radius: $border-radius;
    display: flex;
    flex-direction: column;
    flex: 1;

    thead {
      display: flex;
      flex: none;

      tr {
        display: flex;
        flex: 1;
        padding: $space $space 0;
        color: $darker-grey;


        th {
          display: flex;
          flex: 1;
          font-size: toRem(10px);
          user-select: none;
        }

        span {
          margin: auto 0;
        }

        .arrow {
          display: inline-block;
          vertical-align: middle;
          width: 0;
          height: 0;
          margin-left: toRem(2px);
        }

        th.active .arrow.asc {
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-bottom: 4px solid #fff;
        }

        th.active .arrow.dsc {
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 4px solid #fff;
        }

        th.active .arrow {
          opacity: .66;
        }
      }
    }

    tbody {
      display: flex;
      flex: none;
      flex-direction: column;
      overflow-y: scroll;

      tr {
        display: flex;
        margin: $space;
        flex-direction: row;

        &:active {
          background: $darker-grey/2;
        }


        td {
          display: flex;
          flex: 1;
          font-size: toRem(12px);
          border-top: 1px solid $darker-grey/2;
          padding-top: $space;

          &:last-child {
            justify-content: flex-end;
          }
        }
      }
    }
  }
}
</style>