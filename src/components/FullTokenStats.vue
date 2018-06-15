<template>
  <div :class="['aph-fulll-token-stats', {show: show}]">
    <div class="control" @click="onHide">
      <aph-icon name="arrow-down"></aph-icon>
    </div>
  </div>
</template>

<script>
export default {
  props: ['onHide', 'show', 'token'],
};
</script>

<style lang="scss">
.aph-fulll-token-stats {
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

  &.show {
    top: 0vh;
  }
}
</style>


