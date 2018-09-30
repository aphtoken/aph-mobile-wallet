<template>
  <section id="dex--charts">
    <div class="body">
    </div>
  </section>
</template>

<script>
export default {
};
</script>

<style lang="scss">
#dex--charts {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  overflow: hidden;

   > .body {
    background: lighten($dark-purple, 3%);
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;

    .btn-group {
      display: flex;
      flex: none;
      padding: $space-lg $space;

      > * {
        @extend %btn;

        margin: 0 $space;

        &:not(.active) {
          background-color: $dark-purple;
          border-color: $dark-purple;
        }
      }
    }

    .chart {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: $space;

      #chart-container {
        overflow: hidden;
        flex: 1;
      }

      #depth-container {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding-top: $space-lg;

        .upper {
          display: flex;
          flex: 1;

          .left-axis {
            padding-right: $space-sm;
          }


          .right-axis {
            padding-left: $space-sm;
          }

          .left-axis, .right-axis {
            flex: none;

            .value {
              height: percentage(1/5);
            }
          }

          .left-axis {
            text-align: right;
          }

          .panel {
            display: flex;
            flex: 1;
            overflow: hidden;

            .bids, .asks {
              display: flex;
              flex: 1;

              .level {
                flex: 1;
                position: relative;

                .size-bar {
                  bottom: 0px;
                  position: absolute;
                  width: 100%;

                  span {
                    border-radius: 4px;
                    border: 1px solid $green;
                    display: none;
                    left: -10px;
                    padding: $space-sm $space;
                    position: absolute;
                    right: -10px;
                    text-align: center;
                    top: -45px;

                    &:before {
                      background-color: $grey;
                      content: "";
                      display: block;
                      height: 500px;
                      left: 48%;
                      position: absolute;
                      top: 30px;
                      width: 1px;
                    }

                    &:after {
                      color: $green;
                      content: "\25CF";
                      display: block;
                      height: 5px;
                      left: 0px;
                      position: absolute;
                      right: 0px;
                      top: 35px;
                      width: 100%;
                    }
                  }

                  &:hover {
                    span {
                      display: block;
                    }
                  }
                }
              }
            }

            .bids {
              .level {
                margin-left: -$border-width-thin;

                .size-bar {
                  background-color: $light-green;
                  border-right: $border-width-thin solid $green;
                  border-top: $border-width-thin solid $green;
                }
              }
            }

            .asks {
              border-left: 1px solid $dark-grey;
              flex-direction: row-reverse;

              .level {
                margin-right: -$border-width-thin;

                .size-bar {
                  background-color: $light-red;
                  border-left: $border-width-thin solid $red;
                  border-top: $border-width-thin solid $red;

                  span {
                    border: 1px solid $red;

                    &:after {
                      color: $red;
                    }
                  }
                }
              }
            }
          }

          .right-axis {
            text-align: left;
          }
        }

        .bottom-axis {
          display: flex;
          padding-bottom: $space-xxl;

          .level {
            flex: 1;
            width: percentage(1/12);

            span {
              display: block;
              transform: rotate(59deg) translateX(25px) translateY(0px);
            }
          }
        }
      }
    }
  }
}
</style>
