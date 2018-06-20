<template>
  <section id="about">
    <video loop muted autoplay>
      <source src="~@/assets/video/login.mp4" type="video/mp4">
    </video>
    <div class="body">
      <div class="content">
        <aph-icon name="logo-mark"></aph-icon>
        <aph-icon name="word-mark"></aph-icon>
        <div class="row version">
          <div class="label">Version</div>
          <div class="value">{{ $store.state.version }}</div>
        </div>
        <div class="row block">
          <div class="label">{{ $store.state.currentNetwork.net }} block</div>
          <div class="value">{{ $store.state.currentNetwork && $store.state.currentNetwork.bestBlock ? $store.state.currentNetwork.bestBlock.index : 0 }}</div>
          <div class="value">
            <aph-timestamp-from-now :timestamp="$store.state.lastReceivedBlock"></aph-timestamp-from-now>
          </div>
        </div>
        <div class="url">aphelion.org</div>
      </div>
      <div class="footer">
        <button class="done-btn" @click="goBack">Done</button>
      </div>
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
#about {
  background: $dark;
  height: 100%;
  overflow: hidden;
  position: relative;

  > video {
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  > .body {
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    display: flex;
    flex-direction: column;

    > .content {
      align-items: center;
      background-color: rgba($dark, .7);
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: center;

      .aph-icon {
        svg {
          &.logo-mark {
            height: 28vh;
          }

          &.word-mark {
            height: 5vw;
          }
        }

        &.aph-icon {
          margin-top: $space;
        }
      }

      .row {
        align-items: center;
        display: flex;
        flex-direction: column;
        margin-top: $space-lg;

        .label {
          @extend %small-uppercase-grey-label;

          color: $purple;
        }

        .value {
          margin-top: $space;
          text-transform: uppercase;
        }
      }

      .url {
        margin-top: $space-xl;
        text-transform: uppercase;
      }
    }

    > .footer {
      display: flex;
      flex-direction: column;
      flex: none;

      .done-btn {
        @extend %btn-footer;
      }
    }
  }
}
</style>


