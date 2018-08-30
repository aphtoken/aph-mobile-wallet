<template>
  <section id="languages">
    <div class="header">
      <div class="title">{{ $t('Language') }}</div>
    </div>
    <div class="body">
      <div class="languages">
        <div v-for="(language, index) in languages"
             :key="index"
             :class="['language', {active: selectedLanguage === language.value}]"
             @click="selectLanguage(language.value)">
          <div class="label">{{ language.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    beforeMount() {
      this.languages = this.$constants.languages;
      this.selectedLanguage = localStorage.getItem('language') || 'en';
    },

    computed: {
    },

    data() {
      return {
        languages: [],
        selectedLanguage: null,
      };
    },

    methods: {
      selectLanguage(language) {
        this.$i18n.locale = language;
        this.selectedLanguage = language;
        localStorage.setItem('language', language);
        this.$router.back();
      },
    },
  };
</script>

<style lang="scss">
  #languages {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    > .header {
      align-items: center;
      display: flex;
      flex-direction: column;
      flex: none;
      padding: $space 0 0;

      .title {
        color: white;
        font-size: toRem(18px);
      }
    }

    > .body {
      background: $background;
      border-top-left-radius: $border-radius;
      border-top-right-radius: $border-radius;
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
      padding: toRem(26px) $space $space $space;

      .languages {
        background: white;
        border-radius: $border-radius;
        flex: 1;
        margin-top: $space;
        overflow: auto;
        padding: $space;

        .language {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: $space;

          .label {
            color: $dark;
            flex: 1;
            font-family: GilroyMedium;
          }

          & + .language {
            border-top: $border-width-thin solid $background;
          }

          &.active {
            background-color: $background;

            .label {
              color: $purple;
            }
          }
        }
      }
    }
  }
</style>


