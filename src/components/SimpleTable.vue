<template>
  <section class="aph-simple-table">
    <table class="table-wrapper">
      <thead>
        <tr class="table-header-row">
          <th v-for="key in columns"
            @click="sortBy(key)"
            class="header-cell"
            :class="{ active: sortKey === key }">
            {{ key }}
            <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'"></span>
          </th>
        </tr>
      </thead>
      <tbody class="table-body-wrapper">
        <tr class="row" v-for="entry in filteredData">
          <td class="cell" :class="[key, injectStyling(entry[key], entry, key)]" v-for="key in columns">
            <slot :name=key :value=entry[key]>
              {{ formatEntry !== 'null' ? formatEntry(entry[key], entry, key) : entry[key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>

export default {
  props: {
    columns: {
      default: [],
      type: Array,
    },
    data: {
      default: [],
      type: Array,
    },
    filterKey: {
      default: '',
      type: String,
    },
    formatEntry: {
      default: null,
      type: Function,
    },
    injectStyling: {
      default: () => {},
      type: Function,
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
        data = data.sort((aVal, bVal) => {
          aVal = aVal[sortKey];
          bVal = bVal[sortKey];
          if (aVal === bVal) {
            return 0 * order;
          } else if (aVal > bVal) {
            return 1 * order;
          }
          return -1 * order;
        });
      }
      return data;
    },
  },

  methods: {
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

  .table-wrapper {
    border-radius: $border-radius;
    display: flex;
    flex-direction: column;
    flex: 1;

    .table-header-row {
      display: flex;
      flex-direction: row;
      flex: none;
      font-size: toRem(10px);
      padding: $space $space-xs $space $space;

      .header-cell {
        color: $darker-grey;
        display: flex;
        flex-basis: auto;
        margin: 0;
        padding: 0;
        user-select: none;
        width: 100%;

        &:last-child {
          justify-content: flex-end;
        }

        .arrow {
          display: inline-block;
          height: 0;
          margin: auto 0 auto toRem(2px);
          opacity: 0;
          width: 0;
        }
      }

      .header-cell .arrow.asc {
        border-bottom: 4px solid #fff;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        opacity: 0;
        text-transform: uppercase;
      }

      .header-cell .arrow.dsc {
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 4px solid #fff;
      }

      .header-cell.active .arrow {
        opacity: .66;
      }
    }

    .table-body-wrapper {
      display: block;
      overflow: auto;

      .row {
        display: flex;
        padding: 0 $space-xs 0 $space;

        &:active {
          background: $darker-grey/2;

          .cell {
            border-top: 1px solid transparent;
          }
        }

        &:active + tr {
          .cell {
            border-top: 1px solid transparent;
          }
        }

        .cell {
          border-top: 1px solid $darker-grey/2;
          display: flex;
          flex: 1;
          font-size: toRem(12px);
          padding: $space 0;

          &:last-child {
            justify-content: flex-end;
            position: relative;
            right: toRem(10px);
          }
        }
      }
    }
  }
}
</style>
