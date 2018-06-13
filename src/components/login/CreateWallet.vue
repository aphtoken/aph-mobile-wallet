<template>
  <section id="login--create-wallet">
    <div class="header">
      <div class="back-btn" @click="goBack">
        <aph-icon name="arrow-left"></aph-icon>
      </div>
      <div class="title">
        <aph-icon name="word-mark"></aph-icon>
      </div>
    </div>
    <div class="body">
    </div>
  </section>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.back();
    },
  },
};
</script>

<style lang="scss">
#login--create-wallet {
  display: flex;
  flex-direction: column;
  height: 100%;

  > .header {
    display: flex;
    flex-direction: row;
    flex: 1;
    justify-content: center;
    position: relative;

    .back-btn {
      left: $space;
      position: absolute;
      top: $space;

      svg {
        height: toRem(16px);

        .fill {
          fill: white;
        }
      }
    }

    .title {
      margin-top: $space;
      svg {
        height: toRem(16px);

        .fill {
          fill: white;
        }
      }
    }
  }

  .body {
    flex: 2;
    padding: 0 $space-lg;
  }
}
</style>

