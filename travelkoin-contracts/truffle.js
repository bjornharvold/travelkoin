require('dotenv').config();
require('babel-register');
require('babel-polyfill');

const HDWalletProvider = require('truffle-hdwallet-provider');

const providerWithMnemonic = (mnemonic, rpcEndpoint) =>
  new HDWalletProvider(mnemonic, rpcEndpoint);

const infuraProvider = network => providerWithMnemonic(
  process.env.MNEMONIC || '',
  `https://${network}.infura.io/${process.env.INFURA_API_KEY}`
);

const rinkebyProvider = process.env.SOLIDITY_COVERAGE
  ? undefined
  : infuraProvider('rinkeby');

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      gas: 6712388,
      gasPrice: 65000000000,
      network_id: '*', // eslint-disable-line camelcase
    },
    rinkeby: {
      provider: rinkebyProvider,
      network_id: 4, // eslint-disable-line camelcase
    },
    coverage: {
      host: 'localhost',
      network_id: '*', // eslint-disable-line camelcase
      port: 8555,
      gas: 0xfffffffffff,
      gasPrice: 0x01,
    },
    testrpc: {
      host: 'localhost',
      port: 8545,
      gas: 6712388,
      gasPrice: 65000000000,
      network_id: '*', // eslint-disable-line camelcase
    },
    ganache: {
      host: 'localhost',
      port: 7545,
      gas: 6712388,
      gasPrice: 65000000000,
      network_id: '*', // eslint-disable-line camelcase
    },
    console: {
      host: 'localhost',
      port: 9545,
      gas: 6712388,
      gasPrice: 65000000000,
      network_id: '*', // eslint-disable-line camelcase
    },
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};

// ,
// ganache: {
//     host: 'localhost',
//         port: 7545,
//         gas: 6712388,
//         gasPrice: 65000000000,
//         network_id: '*', // eslint-disable-line camelcase
// }
