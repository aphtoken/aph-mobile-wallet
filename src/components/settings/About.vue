<template>
  <section id="about">
    <div class="body">
      <div class="content">
        <aph-icon name="logo-mark"></aph-icon>
        <aph-icon name="word-mark"></aph-icon>
        <div class="row version">
          <div class="label">{{ $t('Version') }}</div>
          <div class="value">{{ version }}</div>
        </div>
        <div class="row block">
          <div class="label">{{ currentNetwork.net }} {{ $t('block') }}</div>
          <div class="value">{{ currentNetwork && currentNetwork.bestBlock ? currentNetwork.bestBlock.index : 0 }}</div>
          <div class="value">
            <aph-timestamp-from-now :timestamp="lastReceivedBlock"></aph-timestamp-from-now>
          </div>
        </div>
        <div class="url">aphelion.org</div>
      </div>
      <div class="footer">
        <button class="done-btn" @click="goBack">{{ $t('Done') }}</button>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      'currentNetwork',
      'lastReceivedBlock',
      'lastReceivedBlock',
      'version',
    ]),
  },

  methods: {
    goBack() {
      this.$router.back();
    },
  },
};
</script>

<style lang="scss">
#about {
  background: url('~@/assets/img/Blurred_Bg.png') no-repeat center center fixed;
  background-size: cover;
  height: 100%;
  overflow: hidden;
  position: relative;

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
      background-color: rgba($dark, .5);
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


