<template>
  <section id="login--import--scan-qr-code" :class="{show}">
    <!-- <div class="background">
      <img src="~@/assets/img/Blurred_Bg.png">
    </div> -->
    <div class="header" @click="onClose">
      <aph-icon name="arrow-down"></aph-icon>
      <div class="title">{{ $t('ScanQrCode') }}</div>
    </div>
    <div class="body">
      <qrcode-reader @decode="onDecode" :paused="!show" :video-constraints="constraints"></qrcode-reader>
    </div>
  </section>
</template>

<script>
import { QrcodeReader } from 'vue-qrcode-reader';

export default {
  components: {
    QrcodeReader,
  },

  data() {
    return {
      constraints: {
        width: { ideal: 640 },
        height: { ideal: 480 },
      },
    };
  },

  props: {
    onClose: {
      required: true,
      type: Function,
    },

    onDecode: {
      required: true,
      type: Function,
    },

    show: {
      type: Boolean,
    },
  },
};
</script>

<style lang="scss">
#login--import--scan-qr-code {
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

  > .header {
    background: $dark;
    padding: $space;
    flex: none;
    position: relative;
    z-index: 100;

    .aph-icon {
      position: absolute;

      svg {
        height: toRem(20px);
      }
    }

    .title {
      text-align: center;
    }
  }

  > .body {
    background: black;

    .qrcode-reader {
      border: solid $border-width $purple;
    }
  }

  &.show {
    top: 0;
  }
}
</style>


