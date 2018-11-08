<template>
  <modal-wrapper id="commit--info-modal" icon="commit">
    <p>{{$t('commitInfoBody1')}}</p>
    <p>{{$t('commitInfoBody2', { minClaimBlocks: $store.state.commitState.minimumClaimBlocks})}}</p>
    <p>{{$t('commitInfoBody3')}}</p>
    <p>{{$t('commitInfoBody4')}}</p>
    <template slot="footer">
      <button class="close-btn" @click="onClose">{{ $t('close') }}</button>
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
    onClose: {
      required: true,
      type: Function,
    },
  },
};
</script>

<style lang="scss">
#commit--info-modal {
  > .body {
    .content {
      p {
        font-size: toRem(12px);
        margin: 0;

        & + P {
          margin-top: $space;
        }
      }
    }
  }

  > .footer {
    .close-btn {
      @extend %btn-footer;

      flex: none;
      width: 100%;
    }
  }
}
</style>
