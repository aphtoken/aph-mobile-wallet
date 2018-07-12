<template>
  <section id="currencies">
    <div class="header">
      <div class="title">Currency</div>
      <div class="search">
        <div class="inner">
          <aph-icon name="search"></aph-icon>
          <div class="input">
            <input type="text" placeholder="Search" v-model="searchBy">
          </div>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="currencies">
        <div v-for="(currency, index) in filteredCurrencies" :key="index" :class="['currency', {active: $store.state.currency === currency.label}]" @click="selectCurrency(currency)">
          <div class="label">{{ currency.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  beforeMount() {
    this.currencies = this.$services.settings.getCurrenciesAsArray();
  },

  computed: {
    filteredCurrencies() {
      const searchBy = this.searchBy.toLowerCase();

      if (!searchBy.length) {
        return this.currencies;
      }

      return _.filter(this.currencies, ({ label }) => {
        return label.toLowerCase().indexOf(searchBy) > -1;
      });
    },
  },

  data() {
    return {
      currencies: [],
      searchBy: '',
    };
  },

  methods: {
    selectCurrency(currency) {
      this.$services.settings.setCurrency(currency.value);
      this.$router.back();
    },
  },
};
</script>

<style lang="scss">
#currencies {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  > .header {
    align-items: center;
    display: flex;
    flex-direction: column;
    flex: none;
    padding: $space 0 0;

    .title {
      color: white;
      font-size: toRem(18px);
    }

    > .search {
      margin: $space 0 toRem(-26px);
      padding: 0 $space;
      width: 100%;
      z-index: 100;

      .inner {
        align-items: center;
        background: white;
        border-radius: $border-radius;
        box-shadow: $box-shadow;
        display: flex;
        flex-direction: row;
        height: $input-height;
        padding: 0 $space;
        width: 100%;

        .aph-icon {
          flex: none;
          margin-right: $space;

          svg {
            height: toRem(20px);

            .fill {
              fill: $purple;
            }
          }
        }

        .input {
          flex: 1;

          input {
            background: none;
            border: none;
            outline: none;
          }
        }
      }
    }
  }

  > .body {
    background: $background;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    padding: toRem(26px) $space $space $space;

    .currencies {
      background: white;
      border-radius: $border-radius;
      flex: 1;
      margin-top: $space;
      overflow: auto;
      padding: $space;

      .currency {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: $space;

        .label {
          color: $dark;
          flex: 1;
          font-family: GilroyMedium;
        }

        & + .currency {
          border-top: $border-width-thin solid $background;
        }

        &.active {
          background-color: $background;

          .label {
            color: $purple;
          }
        }
      }
    }
  }
}
</style>


