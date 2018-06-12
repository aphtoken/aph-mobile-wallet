<template>
  <section id="login--import--private-key">
    <div class="header">
      <div class="back-btn" @click="goBack">
        <aph-icon name="arrow-left"></aph-icon>
      </div>
      <div class="title">
        <aph-icon name="word-mark"></aph-icon>
      </div>
    </div>
    <div class="body">
      <login-form-wrapper identifier="openPrivateKey">
        <aph-input :hasError="$isFailed('openPrivateKey')" v-model="wif" placeholder="Private key" type="password"></aph-input>
        <button class="login" @click="login" :disabled="shouldDisableLoginButton">Import wallet</button>
      </login-form-wrapper>
    </div>
  </section>
</template>

<script>
import LoginFormWrapper from './LoginFormWrapper';

export default {
  components: {
    LoginFormWrapper,
  },

  computed: {
    shouldDisableLoginButton() {
      return this.wif.length === 0;
    },
  },

  data() {
    return {
      wif: '',
    };
  },

  methods: {
    goBack() {
      this.$router.back();
    },

    login() {
      this.$store.dispatch('openPrivateKey', {
        wif: this.wif,
        done: () => {
          this.$router.push('/authenticated/dashboard');
        },
      });
    },
  },
};
</script>


<style lang="scss">
#login--import--private-key {
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

    .login {
      @extend %btn-outline;

      margin-top: $space-lg;
    }
  }
}
</style>

