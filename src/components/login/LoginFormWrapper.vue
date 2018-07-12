<template>
  <div :class="['login-form-wrapper', {failed}]">
    <slot></slot>
  </div>
</template>

<script>
export default {
  computed: {
    failed() {
      return this.$isFailed(this.identifier);
    },
  },

  props: {
    identifier: {
      type: String,
    },
  },
};
</script>


