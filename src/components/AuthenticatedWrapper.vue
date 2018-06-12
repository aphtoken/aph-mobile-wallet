<template>
  <section id="authenticated-wrapper">
    <aside id="sidebar">
      <div class="logo">
        <aph-icon name="logo-mark"></aph-icon>
      </div>
      <div class="menu" @click="menuOpen = false">
        <router-link to="/authenticated/dashboard">
          <aph-icon name="dashboard"></aph-icon>
          <p>Dashboard</p>
        </router-link>
        <router-link to="/authenticated/assets">
          <aph-icon name="wallet"></aph-icon>
          <p>Assets</p>
        </router-link>
        <router-link to="/authenticated/history">
          <aph-icon name="history"></aph-icon>
          <p>History</p>
        </router-link>
        <router-link to="/authenticated/settings">
          <aph-icon name="settings"></aph-icon>
          <p>Settings</p>
        </router-link>
      </div>
    </aside>
    <div id="content" :class="[{'menu-open': menuOpen}]">
      <div id="back-button" @click="goBack" v-if="showBackButton">
        <aph-icon name="arrow-left"></aph-icon>
      </div>
      <div id="menu-toggle" :class="[{open: menuOpen}]" @click="toggleMenu" v-else>
        <span></span>
        <span></span>
      </div>
      <router-view></router-view>
    </div>
  </section>
</template>

<script>
const ROUTES_USING_BACK_BUTTON = [
  'dashboard.token-stats',
  'settings.contacts',
  'settings.currencies',
  'settings.networks',
];

export default {
  computed: {
    showBackButton() {
      return _.includes(ROUTES_USING_BACK_BUTTON, this.$route.name);
    },
  },

  data() {
    return {
      menuOpen: false,
    };
  },

  methods: {
    goBack() {
      this.$router.back();
    },

    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
  },

  mounted() {
    this.$services.neo.fetchNEP5Tokens();
  },
};
</script>

<style lang="scss">
#authenticated-wrapper {
  height: 100%;
  overflow: hidden;
  position: relative;

  #sidebar {
    background: $purple;
    display: flex;
    flex-direction: column;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 40vw;



    .aph-icon .fill {
      fill: white;
    }

    .logo {
      flex: none;
      padding: $space-xl 0 $space;
      text-align: center;

      .aph-icon > svg {
        height: 30vw;
      }
    }

    .menu {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin: $space-lg 0 $space-xl;

      .aph-icon > svg {
          &.dashboard {
            height: toRem(45px);
          }

          &.wallet {
            height: toRem(38px);
          }

          &.history {
            height: toRem(45px);
          }

          &.settings {
            height: toRem(38px);
          }

          .fill {
            fill: $dark;
          }
      }

      > a {
        border-left: $border-width solid transparent;
        border-right: $border-width solid transparent;
        display: flex;
        flex-direction: column;
        align-items: center;

        > p {
          color: white;
          margin: $space 0 0;
        }

        &.router-link-active {
          border-left-color: white;

          .fill {
            fill: white;
          }
        }
      }
    }
  }

  #content {
    @include transitionFast(all);

    background: $dark;
    height: 100%;
    height: 100%;
    left: 0;
    overflow: auto;
    position: relative;
    width: 100%;
    z-index: 10;

    &.menu-open {
      left: 40vw;
    }

    #back-button {
      left: $space;
      position: absolute;
      top: $space;
      width: $space-lg;

      svg {
        height: toRem(18px);
      }
    }

    #menu-toggle {
      left: $space;
      position: absolute;
      top: $space;
      width: $space-lg;

      > span {
        @include transitionFast(all);

        background: white;
        display: block;
        height: toRem(2px);
        position: relative;

        & + span {
          margin-top: $space;
        }
      }

      &.open {
        > span {
          &:first-child {
            transform-origin: top left;
            transform: rotate(45deg);
          }

          &:last-child {
            margin-top: toRem(17px);
            transform-origin: bottom left;
            transform: rotate(-45deg);
          }
        }
      }
    }
  }
}
</style>

