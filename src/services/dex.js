import {
  wallet,
  u,
} from '@cityofzion/neon-js';

import alerts from './alerts';
import assets from './assets';
import neo from './neo';
import network from './network';
import { store } from '../store';

import { claiming } from '../constants';
import { MARKETS, HISTORY } from '../../sample_api/dex_sample.js';

export default {
  fetchMarkets() {
    return new Promise((resolve, reject) => {
      try {
        // Will add line below once API is live
        // const currentNetwork = network.getSelectedNetwork();
        resolve(MARKETS);
      } catch (error) {
        reject(error);
      }
    });
  },

  fetchTradeHistory() {
    return new Promise((resolve, reject) => {
      try {
        // Will add line below once API is live
        // const currentNetwork = network.getSelectedNetwork();
        resolve(HISTORY);
      } catch (error) {
        reject(error);
      }
    });
  },

  fetchSystemAssetUTXOReserved(input) {
    return new Promise((resolve, reject) => {
      try {
        const prevTxHash = input.prevHash ? input.prevHash : input.txid;
        const prevTxIndex = input.prevIndex ? input.prevIndex : input.index;

        let utxoParam = u.reverseHex(prevTxHash);
        if (prevTxIndex > 0) {
          utxoParam = `${utxoParam}${u.num2hexstring(prevTxIndex)}`; // todo: support > 8bit indexes
        }

        const rpcClient = network.getRpcClient();
        rpcClient.query({
          method: 'getstorage',
          params: [assets.DEX_SCRIPT_HASH, utxoParam],
        })
          .then((res) => {
            if (!!res.result && res.result.length > 0) {
              input.reservedFor = u.reverseHex(res.result);
            }
            resolve(input);
          })
          .catch((e) => {
            reject(`Failed to fetch UTXO Reserved Status from contract storage. ${e.message}`);
          });
      } catch (e) {
        reject(`Failed to fetch UTXO Reserved Status from contract storage. ${e.message}`);
      }
    });
  },

  fetchCommitState(address) {
    return new Promise((resolve, reject) => {
      try {
        this.fetchCommitUserState(address)
          .then((commitState) => {
            this.fetchCommitDEXState()
              .then((dexState) => {
                commitState.totalUnitsContributed = dexState.totalUnitsContributed;
                commitState.lastAppliedFeeSnapshot = dexState.lastAppliedFeeSnapshot;
                commitState.totalFeeUnits = dexState.totalFeeUnits;
                commitState.totalFeesCollected = dexState.totalFeesCollected;
                commitState.minimumClaimBlocks = dexState.minimumClaimBlocks;

                // Apply the fees not yet applied into the totalFeeUnits to get an accurate calculation.
                if (commitState.lastAppliedFeeSnapshot < commitState.totalFeesCollected) {
                  const feesCollectedSinceSnapshot = commitState.totalFeesCollected - commitState.lastAppliedFeeSnapshot;
                  commitState.totalFeeUnits += feesCollectedSinceSnapshot * commitState.totalUnitsContributed;
                  commitState.lastAppliedFeeSnapshot = commitState.totalFeesCollected;
                }
                commitState.networkWeight = Math.round(commitState.totalFeeUnits - commitState.feeUnitsSnapshot);

                if (commitState.contributionHeight > 0) {
                  commitState.ableToClaimHeight = commitState.contributionHeight + commitState.minimumClaimBlocks;
                  commitState.ableToCompoundHeight = commitState.compoundHeight + commitState.minimumClaimBlocks;

                  commitState.feesCollectedSinceCommit = commitState.totalFeesCollected - commitState.feesCollectedSnapshot;
                  commitState.userWeight = commitState.feesCollectedSinceCommit * commitState.quantityCommitted * 100000000;
                  commitState.weightFraction = commitState.networkWeight > 0 ? commitState.userWeight / commitState.networkWeight : 0;
                  commitState.weightPercentage = Math.round(commitState.weightFraction * 100 * 10000) / 10000;

                  commitState.availableToClaim = commitState.feesCollectedSinceCommit * commitState.weightFraction;
                  commitState.availableToClaim = Math.floor(commitState.availableToClaim * 100000000) / 100000000;
                }
                resolve(commitState);
              })
              .catch((e) => {
                reject(`Failed to fetch commit state. ${e.message}`);
              });
          })
          .catch((e) => {
            reject(`Failed to fetch commit state. ${e.message}`);
          });
      } catch (e) {
        reject(`Failed to fetch commit state. ${e.message}`);
      }
    });
  },

  fetchCommitUserState(address) {
    return new Promise((resolve, reject) => {
      try {
        const contributionKey = `${u.reverseHex(wallet.getScriptHashFromAddress(address))}${u.reverseHex(assets.APH)}d0`;

        const rpcClient = network.getRpcClient();
        rpcClient.query({
          method: 'getstorage',
          params: [assets.DEX_SCRIPT_HASH, contributionKey],
        })
          .then((res) => {
            const commitState = {
              userScriptHash: wallet.getScriptHashFromAddress(address),
              quantityCommitted: 0,
              contributionHeight: null,
              contributionTimestamp: null,
              compoundHeight: null,
              feesCollectedSnapshot: 0,
              feeUnitsSnapshot: 0,
            };

            if (!res || !res.result || res.result.length < 120) {
              resolve(commitState);
              return;
            }

            commitState.quantityCommitted = u.fixed82num(res.result.substr(40, 16));
            commitState.contributionHeight = Math.round(u.fixed82num(res.result.substr(56, 16)) * 100000000);
            commitState.compoundHeight = Math.round(u.fixed82num(res.result.substr(72, 16)) * 100000000);
            commitState.feesCollectedSnapshot = u.fixed82num(res.result.substr(88, 16));
            commitState.feeUnitsSnapshot = u.fixed82num(res.result.substr(104, 32));
            // console.log(`got commitState.feeUnitsSnapshot: ${commitState.feeUnitsSnapshot}`);

            rpcClient.getBlock(commitState.contributionHeight)
              .then((data) => {
                commitState.contributionTimestamp = data.time;
                resolve(commitState);
              });
          })
          .catch((e) => {
            reject(`Failed to fetch commit state. ${e.message}`);
          });
      } catch (e) {
        reject(`Failed to fetch commit state. ${e.message}`);
      }
    });
  },

  fetchCommitDEXState() {
    return new Promise((resolve, reject) => {
      try {
        const rpcClient = network.getRpcClient();
        rpcClient.query({
          method: 'getstorage',
          params: [assets.DEX_SCRIPT_HASH, `${u.reverseHex(assets.APH)}fa`],
        })
          .then((res) => {
            const dexState = {
              totalUnitsContributed: 0,
              lastAppliedFeeSnapshot: 0,
              totalFeeUnits: 0,
            };

            if (res.result && res.result.length >= 48) {
              dexState.totalUnitsContributed = u.fixed82num(res.result.substr(0, 16)) * 100000000;
              dexState.lastAppliedFeeSnapshot = u.fixed82num(res.result.substr(16, 32));
              dexState.totalFeeUnits = u.fixed82num(res.result.substr(48, 32));
            }

            rpcClient.query({
              method: 'getstorage',
              params: [assets.DEX_SCRIPT_HASH, `${u.reverseHex(assets.APH)}fc`],
            })
              .then((res) => {
                dexState.totalFeesCollected = 0;

                if (res.result && res.result.length >= 32) {
                  dexState.totalFeesCollected = u.fixed82num(res.result.substr(0, 16));
                }


                rpcClient.query({
                  method: 'getstorage',
                  params: [assets.DEX_SCRIPT_HASH, u.str2hexstring('claimMinimumBlocks')],
                })
                  .then((res) => {
                    dexState.minimumClaimBlocks = claiming.DEFAULT_CLAIM_BLOCKS;

                    if (res.result) {
                      dexState.minimumClaimBlocks = u.fixed82num(res.result) * 100000000;
                    }

                    resolve(dexState);
                  })
                  .catch(() => {
                    dexState.minimumClaimBlocks = claiming.DEFAULT_CLAIM_BLOCKS;
                    resolve(dexState);
                  });
              })
              .catch((e) => {
                reject(`Failed to fetch DEX commit state, Total Fees Collected. ${e.message}`);
              });
          })
          .catch((e) => {
            reject(`Failed to fetch DEX commit state, Contribution Sums. ${e.message}`);
          });
      } catch (e) {
        reject(`Failed to fetch commit state. ${e.message}`);
      }
    });
  },

  commitAPH(quantity) {
    return new Promise((resolve, reject) => {
      try {
        this.executeContractTransaction('commit',
          [
            u.num2fixed8(quantity),
          ])
          .then((res) => {
            if (res.success) {
              alerts.success('Commit relayed, waiting for confirmation...');
              neo.monitorTransactionConfirmation(res.tx, true)
                .then(() => {
                  store.commit('setAssetHoldingsNeedRefresh', [assets.APH]);

                  resolve(res.tx);
                })
                .catch((e) => {
                  reject(e);
                });
            } else {
              reject('Transaction rejected');
            }
          })
          .catch((e) => {
            reject(`Commit Failed. ${e.message}`);
          });
      } catch (e) {
        reject(`Commit Failed. ${e.message}`);
      }
    });
  },

  claimAPH() {
    return new Promise((resolve, reject) => {
      try {
        this.executeContractTransaction('claim',
          [])
          .then((res) => {
            if (res.success) {
              alerts.success('Claim relayed, waiting for confirmation...');
              neo.monitorTransactionConfirmation(res.tx, true)
                .then(() => {
                  store.commit('setAssetHoldingsNeedRefresh', [assets.APH]);

                  resolve(res.tx);
                })
                .catch((e) => {
                  reject(e);
                });
            } else {
              reject('Transaction rejected');
            }
          })
          .catch((e) => {
            reject(`Claim Failed. ${e.message}`);
          });
      } catch (e) {
        reject(`Claim Failed. ${e.message}`);
      }
    });
  },

  compoundAPH() {
    return new Promise((resolve, reject) => {
      try {
        this.executeContractTransaction('compound',
          [])
          .then((res) => {
            if (res.success) {
              alerts.success('Compound relayed, waiting for confirmation...');
              neo.monitorTransactionConfirmation(res.tx, true)
                .then(() => {
                  // Note: Compound doesn't change wallet nep5 balance; no need to require refresh of APH balance here.

                  resolve(res.tx);
                })
                .catch((e) => {
                  reject(e);
                });
            } else {
              reject('Transaction rejected');
            }
          })
          .catch((e) => {
            reject(`Compound Failed. ${e.message}`);
          });
      } catch (e) {
        reject(`Compound Failed. ${e.message}`);
      }
    });
  },
};
