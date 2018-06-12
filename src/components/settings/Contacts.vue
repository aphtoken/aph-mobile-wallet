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
        <div v-for="(contact, index) in filteredContacts" :key="index" class="contact">
          <div class="name">{{ contact.name }}</div>
          <div class="copy">
            <aph-copy-text :text="contact.address"></aph-copy-text>
          </div>
        </div>
      </div>
      <div class="add-btn" @click="showAddContact = true">
        <aph-icon name="plus"></aph-icon>
      </div>
    </div>
    <div class="add-contact">
      <div class="control" @click="showAddContact = false">
        <aph-icon name="chevron-down"></aph-icon>
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

      if(!searchBy.length) {
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
    };
  },

  methods: {
    add() {
      if (this.$services.contacts.contactExists(this.name.trim())) {
        return this.$services.alerts.error(`Contact ${this.name.trim()} already exists.`);
      }

      this.$services.contacts.add(this.address, {
        name: this.name.trim(),
        address: this.address.trim(),
      }).sync();

      this.showAddContact = false;
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
      margin: $space-lg 0 toRem(-26px);
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
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: $space;

        .name {
          color: $dark;
          flex: 1;
          font-family: GilroyMedium;
        }

        .copy {
          flex: none;
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
    @include transition(top);

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
          height: toRem(14px);
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
        margin: $space $space 0;

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


