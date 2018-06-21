<template>
  <section id="contacts" :class="[{'show-add-contact': showAddContact}]">
    <div class="header">
      <div class="title">Contacts</div>
      <div class="search">
        <div class="inner">
          <aph-icon name="search"></aph-icon>
          <div class="input">
            <input type="text" placeholder="Search" v-model="searchBy">
          </div>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="contacts">
        <div v-for="(contact) in filteredContacts" :key="`${contact.name}.${contact.address}`" :class="['contact', {'show-actions': contactWithActionsShowing && contactWithActionsShowing.name === contact.name}]">
        <!-- <div v-for="(contact, index) in filteredContacts" :key="index" :class="['contact', {'show-actions': contactWithActionsShowing.name === contact.name}]"> -->
          <div class="actions">
            <div class="delete" @click="remove(contact)">Delete</div>
          </div>
          <div class="content" v-touch:swipe="getSwipeHandler(contact)">
          <!-- <div class="content"> -->
            <div class="name">{{ contact.name }}</div>
            <div class="copy">
              <aph-copy-text :text="contact.address"></aph-copy-text>
            </div>
          </div>
        </div>
      </div>
      <div class="add-btn" @click="showAddContact = true">
        <aph-icon name="plus"></aph-icon>
      </div>
    </div>
    <div class="add-contact" v-touch:swipe.down="hideAddContact">
      <div class="control" @click="hideAddContact">
        <aph-icon name="arrow-down"></aph-icon>
        <div class="title">Add Contact</div>
      </div>
      <div class="body">
        <div class="inner">
          <div class="body">
            <aph-icon name="user"></aph-icon>
            <div class="title">Enter contact details.</div>
            <div class="form">
              <aph-input :light="true" placeholder="Name" v-model="name"></aph-input>
              <aph-input :light="true" placeholder="Address" v-model="address"></aph-input>
            </div>
          </div>
        </div>
      </div>
      <button class="submit-btn" @click="add" :disabled="shouldDisableAddButton">Add</button>
    </div>
  </section>
</template>

<script>
export default {
  computed: {
    shouldDisableAddButton() {
      return !this.address.length || !this.name.length;
    },

    filteredContacts() {
      const searchBy = this.searchBy.toLowerCase();

      if (!searchBy.length) {
        return this.$store.state.contacts;
      }

      return _.filter(this.$store.state.contacts, ({ name }) => {
        return name.toLowerCase().indexOf(searchBy) > -1;
      });
    },
  },

  data() {
    return {
      address: '',
      name: '',
      searchBy: '',
      showAddContact: false,
      contactWithActionsShowing: null,
    };
  },

  methods: {
    add() {
      if (this.$services.contacts.contactExistsByName(this.name)) {
        this.$services.alerts.error('Contact with that name already exists.');
        return;
      }

      if (this.$services.contacts.contactExistsByAddress(this.address)) {
        this.$services.alerts.error('Contact with that address already exists.');
        return;
      }

      this.$services.contacts.add(this.address, {
        name: this.name.trim(),
        address: this.address.trim(),
      }).sync();

      this.showAddContact = false;
      return true;
    },

    hideAddContact() {
      this.showAddContact = false;
    },

    getSwipeHandler(contact) {
      const fn = function (direction) {
        if (direction === 'right' && this.contactWithActionsShowing
          && contact.address === this.contactWithActionsShowing.address) {
          this.contactWithActionsShowing = null;
        } else if (direction === 'left' && !this.contactWithActionsShowing) {
          this.contactWithActionsShowing = contact;
        } else if (direction === 'left' && contact.address !== this.contactWithActionsShowing.address) {
          this.contactWithActionsShowing = contact;
        }
      }.bind(this);

      return fn;
    },

    remove({ address }) {
      this.$services.contacts.remove(address).sync();
      this.contactWithActionsShowing = null;
    },
  },

  watch: {
    showAddContact() {
      this.address = this.name = '';
    },
  },
};
</script>

<style lang="scss">
#contacts {
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

    > .search {
      margin: $space 0 toRem(-26px);
      padding: 0 $space;
      width: 100%;
      z-index: 100;

      .inner {
        align-items: center;
        background: white;
        border-radius: $border-radius;
        box-shadow: $box-shadow;
        display: flex;
        flex-direction: row;
        height: $input-height;
        padding: 0 $space;
        width: 100%;

        .aph-icon {
          flex: none;
          margin-right: $space;

          svg {
            height: toRem(20px);

            .fill {
              fill: $purple;
            }
          }
        }

        .input {
          flex: 1;

          input {
            background: none;
            border: none;
            outline: none;
          }
        }
      }
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

    .contacts {
      background: white;
      border-radius: $border-radius;
      flex: 1;
      margin-top: $space;
      overflow: auto;
      padding: 0 $space;

      .contact {
        overflow: hidden;
        position: relative;

        .content {
          @include transitionFast(left);

          align-items: center;
          background: white;
          display: flex;
          flex-direction: row;
          padding: $space;
          position: relative;
          left: 0;

          .name {
            color: $dark;
            flex: 1;
            font-family: GilroyMedium;
          }

          .copy {
            flex: none;
          }
        }

        .actions {
          @include transitionFast(opacity);

          display: flex;
          flex-direction: row;
          height: 100%;
          opacity: 0;
          position: absolute;
          right: 0;
          top: 0;

          > * {
            align-items: center;
            display: flex;
            flex-direction: row;
            font-size: toRem(12px);
            justify-content: center;
            width: toRem(80px);
          }

          .delete {
            background: $red;
          }
        }

        &.show-actions {
          .content {
            left: toRem(-80px);
          }

          .actions {
            opacity: 1;
          }
        }

        & + .contact {
          border-top: $border-width-thin solid $background;
        }
      }
    }

    .add-btn {
      @extend %btn-circle;

      bottom: $space-lg;
      box-shadow: $box-shadow;
      position: fixed;
      right: $space-lg;
    }
  }

  > .add-contact {
    @include transitionFast(top);

    display: flex;
    flex-direction: column;
    height: 100%;
    left: 0;
    overflow: hidden;
    position: fixed;
    top: 100vh;
    width: 100%;
    z-index: 200;

    > .control {
      background: $dark;
      padding: $space;
      flex: none;
      position: relative;

      .aph-icon {
        position: absolute;
        svg {
          height: toRem(20px);
        }
      }

      .title {
        text-align: center;
      }
    }

    > .body {
      @extend %tile-grid;

      color: $dark;
      flex: 1;
      overflow: auto;
      display: flex;
      flex-direction: column;

      > .inner {
        background: white;
        border-radius: $border-radius;
        flex: 1;
        margin: 0 $space;

        .body {
          display: flex;
          flex-direction: column;
          align-items: center;

          .aph-icon {
            margin: $space-lg 0;

            svg {
              height: toRem(50px);

              .fill {
                fill: $purple;
              }
            }
          }

          .title {
            font-family: GilroyMedium;
            line-height: $copy-line-height;
            text-align: center;
            width: 50vw;
            margin-bottom: $space-lg;
          }

          .form {
            padding: 0 $space;
            width: 100%;
          }
        }
      }
    }

    .submit-btn {
      @extend %btn-footer;
    }
  }

  &.show-add-contact {
    > .add-contact {
      top: 0vh;
    }
  }
}
</style>


