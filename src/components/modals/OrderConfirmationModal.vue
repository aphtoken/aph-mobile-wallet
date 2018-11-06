<template>
  <modal-wrapper id="aph-order-confirmation-modal" icon="dex">
    <div class="title">{{ $t('confirmYourOrder') }}</div>
    <div class="help-text">{{ $t('ConfirmOrderHelpText') }}</div>
    <button class="confirm-btn" @click="onConfirm" >{{ $t('Confirm') }}</button>
    <template slot="footer">
      <button class="cancel-btn" @click="onClose">{{ $t('cancel') }}</button>
    </template>
  </modal-wrapper>
</template>


<script>
import ModalWrapper from './ModalWrapper';

export default {
  components: {
    ModalWrapper,
  },

  props: {
    onConfirm: {
      required: true,
      type: Function,
    },

    onClose: {
      required: true,
      type: Function,
    },
  },
};
</script>

<style lang="scss">
#aph-order-confirmation-modal {
  .content {
    .title {
      color: $purple;
      font-family: GilroySemibold;
      margin-top: $space;
      text-align: center;
    }

    .help-text {
      margin-top: $space;
      text-align: center;
    }

    .confirm-btn {
      @extend %btn;

      margin-top: $space-lg;
    }
  }

  > .footer {
    .cancel-btn {
      @extend %btn-footer-light;

      width: 100%;
    }
  }
}
</style>
