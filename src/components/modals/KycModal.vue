<template>
  <div>
    <modal-wrapper id="aph-kyc-modal" icon="dex">
      <div class="title">{{ getHeader() }}</div>
      <div id="frame-content" v-if="kycStatus === 'kycneeded'">
        <!-- NOTE: instead of using sandbox, we could probably use the router to handle redirects -->
        <iframe class="kyc-iframe" :src="getKycUrl()" sandbox="allow-forms allow-scripts allow-same-origin"></iframe>
      </div>
      <div class="kycresults" v-if="kycStatus !== 'kycneeded'" >
        <div v-if="kycStatus.startsWith('accepted')">
          <p>Your KYC Application was accepted. Please wait while your application
            is processed and your account has been whitelisted.</p>
          <p>To check again just dismiss this dialog and attempt a deposit again.</p>
        </div>
        <div v-if="kycStatus.startsWith('manualReview')">
          <p>Your KYC Application was received as of {{ reviewTime }}, but requires manual review,
            which may take up to a few days.</p>
          <p>To check again just dismiss this dialog and attempt a deposit again.</p>
        </div>
        <div v-if="kycStatus.startsWith('denied')">
          <p>Unfortunately your KYC Application was denied.</p>
          <p>You must wait an additional {{ deniedRemainingMinutes }} minutes in order to try again.</p>
        </div>
        <div v-if="kycStatus.startsWith('disabled')">
          <p>We are temporarily not accepting KYC applications.</p>
          <p>This issue should be remedied in the near future. Please be patient and try again later. </p>
        </div>
      </div>

      <template slot="footer">
        <button class="dismiss-btn" @click="close">Dismiss</button>
      </template>

      <!-- </div> -->
    </modal-wrapper>
  </div>
</template>

<script>
  import ModalWrapper from './ModalWrapper';

  let watchInterval;

  export default {
    components: {
      ModalWrapper,
    },
    data() {
      return {
        address: '',
        title: 'Loading',
        kycStatus: 'unknown',
        reviewTime: '',
        deniedWaitingMinutes: '',
        deniedRemainingMinutes: '',
        userId: '',
      };
    },
    async mounted() {
      // this.$store.state.kycInProgressModalModel.kycStatus = 'denied|100000|100000';
      // this.$store.state.kycInProgressModalModel.kycStatus = 'manualReview|5oclock';
      // this.$store.state.kycInProgressModalModel.kycStatus = 'accepted|25352352352352';

      const services = this.$services;
      this.address = services.wallets.getCurrentWallet().address;
      this.userId = await services.dex.getKycUserId(this.address);

      this.handleKycStatus(this.$store.state.kycInProgressModalModel.kycStatus);
      if (this.kycStatus === 'kycneeded') {
        const services = this.$services;
        let waitingOnStatus = false;
        watchInterval = setInterval(async () => {
          if (!waitingOnStatus) {
            waitingOnStatus = true;
            try {
              this.handleKycStatus(await services.dex.getKycStatus(this.address));
              console.log(`got status ${this.kycStatus}`);
              if (this.kycStatus !== 'kycneeded') {
                clearInterval(watchInterval);
              }
            } catch (e) {
              // couldn't get KycStatus, we'll just try again
              services.alerts.error(`Error retrieving KYC status. ${e}`);
            } finally {
              waitingOnStatus = false;
            }
          }
        }, 5000);
      }
    },
    methods: {
      getKycUrl() {
        return `${this.$store.state.currentNetwork.kycUrl}?user_id=${this.userId}`;
      },

      handleKycStatus(kycStatus) {
        console.log(`kycStatus: ${kycStatus}`);
        let updatedStatus = kycStatus;
        const modal = document.getElementById('aph-kyc-modal');
        if (modal == null) return;
        const content = modal.getElementsByClassName('content')[0];
        if (content == null) return;

        if (kycStatus.startsWith('accepted')) {
          this.title = 'KYC Accepted (whitelisting in progress...)';
          // const txHash = kycStatus.split('|')[1];
          // could monitor for transaction complete and auto-dismiss...
        } else if (kycStatus.startsWith('manualReview')) {
          this.title = 'KYC Pending Manual Review';
          this.reviewTime = kycStatus.split('|')[1];
        } else if (kycStatus.startsWith('denied')) {
          this.title = 'KYC Application Denied';
          const statusTokens = kycStatus.split('|');
          const timeRemaining = statusTokens[2];
          console.log(`timeRemaining: ${timeRemaining}`);
          if (timeRemaining > 0) {
            this.deniedRemainingMinutes = (Math.floor(timeRemaining / 60 / 10) / 100).toString();
            const timeWaiting = statusTokens[1];
            this.deniedWaitingMinutes = (Math.floor(timeWaiting / 60 / 10) / 100).toString();
          } else {
            updatedStatus = 'kycneeded';
            console.log(`set status to kyc status to ${this.kycStatus}`);
          }
        } else if (kycStatus.startsWith('disabled')) {
          this.title = 'KYC Temporarily Disabled';
        }

        if (updatedStatus === 'kycneeded') {
          this.title = 'Proof of Non-US Resident';
          content.style.height = '100%';
        } else {
          content.style.height = 'initial';
        }
        this.kycStatus = updatedStatus;
      },

      getHeader() {
        return this.title;
      },

      close() {
        if (watchInterval) {
          clearInterval(watchInterval);
          watchInterval = undefined;
        }
        /*
        if (this.kycStatus === 'kycneeded') {
          this.$store.commit('setConfirmDismissKyc', true);
          return;
        }
        */
        this.$store.commit('setKycInProgressModalModel', null);
      },
    },
  };
</script>

<style lang="scss">
#aph-kyc-modal {
  > .body {

    .content {
      display: flex;
      flex-direction: column;

      .title {
        color: $purple;
        flex:1;
        font-family: GilroySemibold;
        margin-top: $space;
        margin-bottom: $space;
        text-align: center;
      }

      .kyc-results {
        flex: 1;
      }

      p {
        font-size: toRem(14px);
        margin: 0;
        text-align: center;

        & + P {
          margin-top: $space;
        }
      }

      overflow: hidden;
      #frame-content {
        flex: 10;
        width: 100%;
        height: 100%;
        overflow: auto;
        overflow-y: scroll;
        -webkit-overflow-scrolling:touch;
      }
      .kyc-iframe {
        margin-left: -3%;
        width: 100%;
        height: 100%;
        border: none;
        overflow: auto;
        overflow-y: scroll;
        -webkit-overflow-scrolling:touch;
      }
    }
  }
  > .footer {
    .dismiss-btn {
      @extend %btn-footer-light;
      width: 100%;
    }
  }
}
</style>
