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
    var sortOrders = {}
    this.columns.forEach(function (key) {
      sortOrders[key] = 1
    })

    return {
      sortKey: '',
      sortOrders: sortOrders
    }
  },

  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },

  methods: {
    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    }
  }
};

</script>

<style lang="scss">
#dex--simple-table {
  display: flex;
  flex: 1;


}
</style>