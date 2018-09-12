<template>
  <section id="commit--info-modal">
    <div class="body">
      <div class="icons">
        <aph-icon name="hex"></aph-icon>
        <aph-icon name="commit"></aph-icon>
      </div>
      <div class="content">
        <p>{{$t('commitInfoBody1')}}</p>
        <p>{{$t('commitInfoBody2', { minClaimBlocks: $store.state.commitState.minimumClaimBlocks})}}</p>
        <p>{{$t('commitInfoBody3')}}</p>
        <p>{{$t('commitInfoBody4')}}</p>
      </div>
    </div>
    <div class="close-btn" @click="onClose">{{ $t('close') }}</div>
  </section>
</template>

<script>
export default {
  props: {
    onClose: {
      required: true,
      type: Function,
    },
  },
};
</script>

<style lang="scss">
#commit--info-modal {
  background: rgba($dark, .7);
  bottom: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 100;

  > .body {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    overflow: hidden;
    padding: $space;

    .icons {
      align-items: center;
      justify-content: center;
      display: flex;
      flex: none;
      position: relative;
      z-index: 10;
      margin-bottom: toRem(-50px);

      .hex {
        height: toRem(100px);

        .fill {
          fill: $purple;
        }
      }

      .aph-icon:last-child {
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);

        svg {
          height: toRem(50px);

          .fill {
            fill: white;
          }
        }
      }
    }

    .content {
      @extend %tile-light;

      color: $dark;
      overflow: auto;
      padding: $space-xxl $space $space;

      p {
        font-size: toRem(12px);
        margin: 0;

        & + P {
          margin-top: $space;
        }
      }
    }
  }

  > .close-btn {
    @extend %btn-footer;

    flex: none;
    width: 100%;
  }
}
</style>
