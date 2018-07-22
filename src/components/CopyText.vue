<template>
  <span class="aph-copy-text" @click.stop="copy" :title="$t('copyToClipboard')">
    <aph-icon name="copy" ref="icon" v-if="icon"></aph-icon>
    <span v-else class="text-label">{{$t('Copy')}}</span>
    <span :class="['aph-copy-text--confirmation-text', {show: showConfirmationText}]" ref="confirmationText" v-dom-portal>{{$t('Copied')}}</span>
  </span>
</template>

<script>
const SHOW_CONFIRMATION_DELAY = 50;
const SHOW_CONFIRMATION_TIMEOUT = 500;

export default {
  beforeDestroy() {
    const $confirmationText = this.$refs.confirmationText;

    $confirmationText.parentNode.removeChild($confirmationText);
  },

  data() {
    return {
      showConfirmationText: false,
    };
  },

  methods: {
    copy(e) {
      this.position(e);
      this.copyToClipboard();

      setTimeout(() => {
        this.showConfirmationText = true;
      }, SHOW_CONFIRMATION_DELAY);

      setTimeout(() => {
        this.showConfirmationText = false;
      }, SHOW_CONFIRMATION_TIMEOUT);
    },

    copyToClipboard() {
      const el = document.createElement('textarea');

      el.value = this.text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    },

    position({ x, y }) {
      const $confirmationText = this.$refs.confirmationText;

      $confirmationText.style.left = `${x}px`;
      $confirmationText.style.top = `${y}px`;
    },
  },

  props: {
    icon: {
      default: true,
      type: Boolean,
    },

    text: {
      type: String,
    },
  },
};
</script>

<style lang="scss">
.aph-copy-text--confirmation-text {
  color: $purple;
  display: inline-block;
  font-family: GilroyMedium;
  font-size: toRem(12px);
  opacity: 1;
  position: fixed;
  transform: translate(-50%, -20px);
  visibility: hidden;
  z-index: -1;

  &.show {
    opacity: 0;
    transform: translate(-50%, -30px);
    transition: all 0.5s;
    visibility: visible;
    z-index: 1000000;
  }
}

.aph-copy-text {
  color: $grey;
  display: inline-block;
  font-weight: bold;
  position: relative;

  .aph-icon {
    cursor: pointer;
    min-height: auto;

    svg {
      height: toRem(17px);

      .fill {
        &.st0 {
          fill: lighten($grey, 5%);
        }

        &.st1 {
          fill: $grey;
        }
      }
    }
  }

  .text-label {
    font-size: toRem(12px);
    text-transform: uppercase;
  }
}
</style>
