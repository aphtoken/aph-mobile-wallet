<template>
  <section class="aph-commit-modal-wrapper">
    <div class="body">
      <div class="icons">
        <aph-icon name="hex"></aph-icon>
        <aph-icon name="commit"></aph-icon>
      </div>
      <div class="content">
        <slot></slot>
      </div>
    </div>
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </section>
</template>

<script>
export default {

};
</script>


<style lang="scss">
.aph-commit-modal-wrapper {
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

      @include lowRes() {
        margin-bottom: toRem(-35px);

        .hex {
          height: toRem(70px);
        }

        .aph-icon:last-child {
          svg {
            height: toRem(35px);
          }
        }
      }
    }

    .content {
      @extend %tile-light;

      color: $dark;
      overflow: auto;
      padding: $space-xxl $space $space;
    }
  }

  > .footer {
    flex: none;
  }
}
</style>
