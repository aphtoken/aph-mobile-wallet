<template>
  <section id="login--import">
    <div class="header">
      <div class="back-btn" @click="goBack">
        <aph-icon name="arrow-left"></aph-icon>
      </div>
      <div class="title">
        <aph-icon name="word-mark"></aph-icon>
      </div>
    </div>
    <div class="body">
      <router-link class="private-key-btn" to="/login/import/private-key">Private Key</router-link>
      <a class="keystore-file-btn">Keystore File</a>
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
#login--import {
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

    .keystore-file-btn, .private-key-btn {
      @extend %btn-outline;
    }

    .keystore-file-btn {
      margin-top: $space-lg;
    }
  }
}
</style>

