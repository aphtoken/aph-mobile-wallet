<template>
  <section id="login--import--encrypted-key">
    <div class="header">
      <div class="back-btn" @click="goBack">
        <aph-icon name="arrow-left"></aph-icon>
      </div>
      <div class="title">
        <aph-icon name="word-mark"></aph-icon>
      </div>
    </div>
    <div class="body">
      <login-form-wrapper identifier="openEncryptedKey">
      <aph-input :hasError="$isFailed('openEncryptedKey')" v-model="passphrase" placeholder="Passphrase" type="password"></aph-input>
      <aph-input :hasError="$isFailed('openEncryptedKey')" v-model="encryptedKey" placeholder="Encrypted key" type="password"></aph-input>
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
      return this.passphrase.length === 0 || this.encryptedKey.length === 0;
    },
  },

  data() {
    return {
      encryptedKey: '',
      passphrase: '',
    };
  },

  methods: {
    goBack() {
      this.$router.back();
    },

    login() {
      this.$store.dispatch('openEncryptedKey', {
        encryptedKey: this.encryptedKey,
        passphrase: this.passphrase,
        done: () => {
          this.$router.push('/authenticated/dashboard');
        },
      });
    },
  },
};
</script>


<style lang="scss">
#login--import--encrypted-key {
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

    .aph-input {
      & + .aph-input {
        margin-top: $space-lg;
      }
    }

    .login {
      @extend %btn-outline;

      margin-top: $space-lg;
    }
  }
}
</style>

