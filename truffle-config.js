'use strict';
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = 'bench annual horn gentle region glory wolf uncle lyrics black orbit expect';

module.exports = {
  networks: {
    tomotestnet: {
      provider: () => new HDWalletProvider(
        mnemonic,
        "https://rpc.testnet.tomochain.com",
        0,
        1,
        true,
        "m/44'/889'/0'/0/"
      ),
      network_id: "89",
      gas: 2000000,
      gasPrice: 10000000000000
    },
    tomomainnet: {
      provider: () => new HDWalletProvider(
        mnemonic,
        "https://rpc.tomochain.com",
        0,
        1,
        true,
        "m/44'/889'/0'/0/"
      ),
      network_id: "88",
      gas: 2000000,
      gasPrice: 10000000000000
    }
  }
};
