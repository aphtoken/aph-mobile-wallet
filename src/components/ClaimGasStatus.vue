<template>
  <section id="claim-gas-status">
    <!-- <div class="body" v-if="$store.state.gasClaim"> -->
    <div class="body">
      <aph-icon name="claim-gas"></aph-icon>
      <div class="title">{{$t('claimGas')}}</div>
      <p>{{$t('claimingGas')}}</p>
      <p>{{$t('pleaseWaitForGas')}}</p>
      <p>{{$t('closingYourWallet')}}</p>
      <div class="checklist">
        <div class="checklist-header">{{$t('Steps')}}</div>
        <ul>
          <li :class="stepClass(1)"><span>{{ stepIndicator(1) }}</span>{{ step1Label }}</li>
          <li :class="stepClass(2)"><span>{{ stepIndicator(2) }}</span>{{ step2Label }}</li>
          <li :class="stepClass(3)"><span>{{ stepIndicator(3) }}</span>{{ step3Label }}</li>
          <li :class="stepClass(4)"><span>{{ stepIndicator(4) }}</span>{{ step4Label }}</li>
          <li :class="stepClass(5)"><span>{{ stepIndicator(5) }}</span>{{ step5Label }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  computed: {
    step1Label() {
      if (this.$store.state.gasClaim && this.$store.state.gasClaim.step > 1) {
        return `Transferred ${this.$store.state.gasClaim.neoTransferAmount} NEO to yourself.`;
      } else if (this.$store.state.gasClaim && this.$store.state.gasClaim.step === 1) {
        return `Transferring ${this.$store.state.gasClaim.neoTransferAmount} NEO to yourself.`;
      }
      return 'Transfer all NEO to yourself.';
    },

    step2Label() {
      if (this.$store.state.gasClaim && this.$store.state.gasClaim.step > 2) {
        return 'Received NEO transfer confirmation.';
      } else if (this.$store.state.gasClaim && this.$store.state.gasClaim.step === 2) {
        return 'Waiting for NEO transfer confirmation.';
      }
      return 'Wait for NEO transfer confirmation.';
    },

    step3Label() {
      if (this.$store.state.gasClaim && this.$store.state.gasClaim.step > 3) {
        return `Sent claim for ~${this.$store.state.gasClaim.gasClaimAmount} GAS.`;
      } else if (this.$store.state.gasClaim && this.$store.state.gasClaim.step === 3) {
        return `Sending claim for ~${this.$store.state.gasClaim.gasClaimAmount} GAS.`;
      }
      return 'Send GAS claim.';
    },

    step4Label() {
      if (this.$store.state.gasClaim && this.$store.state.gasClaim.step > 4) {
        return 'GAS claim confirmed.';
      } else if (this.$store.state.gasClaim && this.$store.state.gasClaim.step === 4) {
        return 'Waiting for GAS claim confirmation.';
      }
      return 'Wait for GAS claim confirmation.';
    },

    step5Label() {
      if (this.$store.state.gasClaim && this.$store.state.gasClaim.step === 5) {
        return 'Success!';
      }
      return 'Wait for GAS claim transaction details.';
    },
  },

  methods: {
    close() {
      this.$store.commit('setSendInProgress', false);
      this.$store.commit('setShowClaimGasStatus', false);
    },

    stepClass(step) {
      if (this.$store.state.gasClaim.step === step) {
        return ['in-progress'];
      }
      if (this.$store.state.gasClaim.step > step) {
        return ['complete'];
      }
      return [];
    },

    stepIndicator(step) {
      if (this.$store.state.gasClaim.step <= step
        && this.$store.state.gasClaim.step < 5) {
        return `${step}.`;
      }
      return '✔';
    },
  },
};
</script>


<style lang="scss">
#claim-gas-status {
  background: white;
  color: $dark;
  height: 100%;
  left: 0px;
  position: fixed;
  top: 0px;
  width: 100%;
  z-index: 100;
  display: flex;
  flex-direction: column;

  .body {
    align-items: center;
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    padding: $space;

    .aph-icon {
      svg {
        height: toRem(50px);
      }

      .fill {
        fill: $purple;
      }
    }

    .title {
      font-size: toRem(16px);
      color: $purple;
      margin: $space 0;
    }

    p {
      margin: $space 0 0;
      font-size: toRem(12px);
      text-align: center;

      &:first-child {
        span {
          font-family: GilroySemibold;
        }
      }
    }

    .checklist {
      max-width: toRem(450px);
      text-align: left;

      .checklist-header {
        font-size: toRem(16px);
        font-family: GilroyMedium;
        margin: $space 0;
        text-align: center;
      }

      ul {
        margin: 0;
        padding: 0;
        list-style: none;

        li {
          color: $grey;
          padding: $space-sm 0;
          font-size: toRem(11px);

          span {
            padding: $space-sm;
          }

          &.in-progress {
            color: $dark;
            font-family: GilroySemibold;
            &:last-child {
              color: $green;
            }
          }
          &.complete {
            color: $dark;

            span {
              color: $green;
            }
          }
        }
      }

      .error {
        color: $red;
        font-size: toRem(15px);
        font-family: GilroySemibold;
        text-align: center;
        padding: $space;
      }
    }
  }
  .footer {
    display: flex;
    > * {
      flex: 1;
    }
  }
  .cancel-btn {
    @extend %btn-footer-light;
    border-bottom-left-radius: $border-radius;
    border-bottom-right-radius: $border-radius;
  }
}
</style>
