import { wallet } from '@cityofzion/neon-js';

import { store } from '../store';
import storage from './storage';

const WALLETS_STORAGE_KEY = 'aph.wallets';
const LAST_WALLET_STORAGE_KEY = 'aph.lastWallet';
let currentWallet = null;

export default {

  add(name, data) {
    storage.set(WALLETS_STORAGE_KEY, _.set(this.getAll(), this.cleanForKey(name), data));
    return this;
  },

  remove(name) {
    return new Promise((resolve, reject) => {
      try {
        storage.set(WALLETS_STORAGE_KEY, _.omit(this.getAll(), this.cleanForKey(name)));
        return resolve();
      } catch (e) {
        console.log(e);

        return reject('Unable to delete wallet');
      }
    });
  },

  clearCurrentWallet() {
    this.setCurrentWallet(null).sync();
  },

  getAll() {
    return storage.get(WALLETS_STORAGE_KEY, {});
  },

  getAllAsArray() {
    try {
      return _.sortBy(_.values(this.getAll()), [wallet => wallet.label.toLowerCase()], ['label']);
    } catch (e) {
      console.log(e);
      this.cleanBadWalletValues();
      return _.sortBy(_.values(this.getAll()), [wallet => wallet.label.toLowerCase()], ['label']);
    }
  },

  cleanForKey(key) {
    return key.trim().replace('.', '_').replace('[', '').replace(']', '');
  },

  cleanBadWalletValues() {
    const wallets = this.getAll();
    const keys = Object.keys(wallets);
    const values = Object.values(wallets);
    for (let i = 0; i < keys.length; i += 1) {
      if (!values[i].label) {
        console.log(wallets);
        storage.set(WALLETS_STORAGE_KEY, _.omit(wallets, keys[i]));
      }
    }
  },

  getCurrentWallet() {
    return currentWallet;
  },

  getLastWallet() {
    return storage.get(LAST_WALLET_STORAGE_KEY);
  },

  getOne(name) {
    return _.find(this.getAllAsArray(), (o) => {
      return o.label === name;
    });
  },

  walletExists(name) {
    return !!this.getOne(name.trim());
  },

  openSavedWallet(walletToOpen, passphrase) {
    return new Promise((resolve, reject) => {
      try {
        const wif = wallet.decrypt(walletToOpen.encryptedWIF, passphrase);
        const account = new wallet.Account(wif);
        const currentWallet = {
          address: account.address,
          encryptedWIF: walletToOpen.encryptedWIF,
          label: walletToOpen.label,
          passphrase,
          privateKey: account.privateKey,
          wif,
        };

        this.setCurrentWallet(currentWallet).sync();

        return resolve(currentWallet);
      } catch (e) {
        console.log(e);

        return reject('Wrong passphrase');
      }
    });
  },

  openLedger(publicKey) {
    return new Promise((resolve, reject) => {
      try {
        const scriptHash = wallet.getScriptHashFromPublicKey(publicKey);
        const address = wallet.getAddressFromScriptHash(scriptHash);
        const currentWallet = {
          isLedger: true,
          address,
          publicKey,
          publicKeyEncoded: wallet.getPublicKeyEncoded(publicKey),
        };

        this.setCurrentWallet(currentWallet).sync();
        return resolve(currentWallet);
      } catch (e) {
        console.log(e);
        return reject(e.message);
      }
    });
  },

  openEncryptedKey(encryptedKey, passphrase) {
    return new Promise((resolve, reject) => {
      try {
        const wif = wallet.decrypt(encryptedKey, passphrase);
        const account = new wallet.Account(wif);
        const currentWallet = {
          wif,
          encryptedWIF: encryptedKey,
          address: account.address,
          passphrase,
          privateKey: account.privateKey,
        };

        this.setCurrentWallet(currentWallet).sync();

        return resolve(currentWallet);
      } catch (e) {
        console.log(e);

        return reject('Wrong key or passphrase');
      }
    });
  },

  openWIF(wif) {
    return new Promise((resolve, reject) => {
      try {
        const account = new wallet.Account(wif);
        const currentWallet = {
          wif,
          address: account.address,
          privateKey: account.privateKey,
        };

        this.setCurrentWallet(currentWallet).sync();

        return resolve(currentWallet);
      } catch (e) {
        console.log(e);

        return reject('Wrong private key');
      }
    });
  },


  importWIF(name, wif, passphrase) {
    return new Promise((resolve, reject) => {
      try {
        if (this.walletExists(name) === true) {
          return reject(`Wallet with name '${name}' already exists.`);
        }
        const account = new wallet.Account(wif);
        const encryptedWIF = wallet.encrypt(account.WIF, passphrase);
        const currentWallet = {
          label: name,
          encryptedWIF,
          wif,
          address: account.address,
          privateKey: account.privateKey,
        };

        this.setCurrentWallet(currentWallet).sync();
        this
          .add(name, currentWallet)
          .sync();
        return resolve(currentWallet);
      } catch (e) {
        return reject('Wrong key or passphrase');
      }
    });
  },

  setCurrentWallet(wallet) {
    currentWallet = wallet;

    if (wallet) {
      this.setLastWallet(wallet);
    }

    return this;
  },

  setLastWallet(wallet) {
    storage.set(LAST_WALLET_STORAGE_KEY, wallet);
  },

  sync() {
    store.commit('setCurrentWallet', this.getCurrentWallet());
    store.commit('setWallets', this.getAllAsArray());
  },

};
