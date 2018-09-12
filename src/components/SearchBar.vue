<template>
  <section id="search-bar" class="aph-search-bar">
    <div class="search-bar-wrapper">
      <aph-icon name="search"></aph-icon>
      <div class="input">
        <input type="text" :placeholder="$t('Search')" :value="value" @input="$emit('input', $event.target.value)">
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    value: {
      default: '',
      type: String,
    },
  },
};
</script>

<style lang="scss">
#search-bar {
  padding: 0 $space;
  width: 100%;
  z-index: 100;

  .search-bar-wrapper {
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
</style>
