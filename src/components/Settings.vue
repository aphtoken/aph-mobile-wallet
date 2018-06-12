<template>
  <section id="settings">
    <div class="header">
      <div class="title">Settings</div>
    </div>
    <div class="body">
      <div class="inner"></div>
    </div>
  </section>
</template>

<script>
export default {
  computed: {
  },

  data() {
    return {
    };
  },

  methods: {
  },
};
</script>

<style lang="scss">
#settings {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  > .header {
    align-items: center;
    display: flex;
    flex-direction: column;
    flex: none;
    padding: $space 0;

    .title {
      color: white;
      font-size: toRem(18px);
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
    padding: $space;

    > .inner {
      background: white;
      border-radius: $border-radius;
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
    }
  }
}
</style>


