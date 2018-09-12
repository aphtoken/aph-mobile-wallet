<template>
  <commit-modal-wrapper id="commit--info-modal">
    <p>{{$t('commitInfoBody1')}}</p>
    <p>{{$t('commitInfoBody2', { minClaimBlocks: $store.state.commitState.minimumClaimBlocks})}}</p>
    <p>{{$t('commitInfoBody3')}}</p>
    <p>{{$t('commitInfoBody4')}}</p>
    <template slot="footer">
      <div class="close-btn" @click="onClose">{{ $t('close') }}</div>
    </template>
  </commit-modal-wrapper>
</template>

<script>
import CommitModalWrapper from './CommitModalWrapper';

export default {
  components: {
    CommitModalWrapper,
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
