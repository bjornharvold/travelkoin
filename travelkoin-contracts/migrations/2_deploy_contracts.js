var MiniMeTokenFactory = artifacts.require('MiniMeTokenFactory');
var TravelkoinMiniMeToken = artifacts.require('TravelkoinMiniMeToken');
var Wallet = artifacts.require('TravelkoinMultiSigWallet');
var PreSale = artifacts.require('TravelkoinPreSale');
var NormalSale = artifacts.require('TravelkoinNormalSale');
var SafeMath = artifacts.require('SafeMath');
var TravelkoinController = artifacts.require('TravelkoinController');
var TravelkoinRefundVault = artifacts.require('TravelkoinRefundVault');
var TravelkoinHodler = artifacts.require('TravelkoinHodler');
var TravelkoinTokenVesting = artifacts.require('TravelkoinTokenVesting');

var dateStart = Math.floor(new Date().getTime() / 1000) + 5 * 60 * 60 * 24; // starts in 5 days
var dateEnd = dateStart + 10 * 24 * 60 * 60; // lasts 10 days

// module.exports = function (deployer) {
//   return deployer.then(function () {
//     // deploy SafeMath first
//     return deployer.deploy(SafeMath);
//   }).then(function () {
//     // link SafeMath
//     return deployer.link(SafeMath, [PreSale, NormalSale, TravelkoinRefundVault, TravelkoinController, TravelkoinHodler, TravelkoinTokenVesting]);
//   }).then(function () {
//     // then Wallet
//     return deployer.deploy(Wallet, [web3.eth.accounts[0], web3.eth.accounts[1], web3.eth.accounts[2]], 2);
//   }).then(function () {
//     // then Factory
//     return deployer.deploy(MiniMeTokenFactory);
//   }).then(function () {
//     // then Controller
//     return deployer.deploy(TravelkoinController, Wallet.address);
//   }).then(function () {
//     // then TravelkoinMiniMeToken
//     return deployer.deploy(TravelkoinMiniMeToken, TravelkoinController.address, MiniMeTokenFactory.address);
//   }).then(function () {
//     // set Token for Crowdsale
//     return (TravelkoinController.at(TravelkoinController.address)).setToken(TravelkoinMiniMeToken.address, 0);
//   }).then(function () {
//     // then PreSale
//     return deployer.deploy(PreSale, TravelkoinController.address, dateStart, dateEnd, web3.toWei(0.1, 'ether'), 1000, web3.toWei(10, 'ether'), web3.toWei(50, 'ether'), 120 * 60 * 60, web3.toWei(100, 'ether'), web3.toWei(100, 'gwei'), 80, Wallet.address);
//   }).then(function () {
//     // then NormalSale
//     return deployer.deploy(NormalSale, TravelkoinController.address, dateStart, dateEnd, web3.toWei(0.1, 'ether'), 1000, web3.toWei(50, 'ether'), 120 * 60 * 60, web3.toWei(100, 'ether'), web3.toWei(100, 'gwei'), 80, Wallet.address);
//   }).then(function () {
//     // set crowdsale
//     return (TravelkoinController.at(TravelkoinController.address)).setCrowdsaleTransfer(PreSale.address, web3.toBigNumber(web3.toWei(100, 'ether')).mul(1000));
//   });
// };

module.exports = function (deployer) {
    return deployer.then(function () {
        // deploy SafeMath first
        return deployer.deploy(SafeMath);
    }).then(function () {
        // link SafeMath
        return deployer.link(SafeMath, [PreSale, NormalSale, TravelkoinRefundVault, TravelkoinController, TravelkoinHodler, TravelkoinTokenVesting]);
    }).then(function () {
        // then Wallet
        return deployer.deploy(Wallet, [web3.eth.accounts[0], web3.eth.accounts[1], web3.eth.accounts[2]], 2);
    }).then(function () {
        // then Factory
        return deployer.deploy(MiniMeTokenFactory);
    }).then(function () {
        // then Controller
        return deployer.deploy(TravelkoinController, Wallet.address);
    }).then(function () {
        // then TravelkoinMiniMeToken
        return deployer.deploy(TravelkoinMiniMeToken, TravelkoinController.address, MiniMeTokenFactory.address);
    }).then(function () {
        // set Token for Crowdsale
        return (TravelkoinController.at(TravelkoinController.address)).setToken(TravelkoinMiniMeToken.address, 0);
    }).then(function () {
        // then PreSale
        return deployer.deploy(PreSale, TravelkoinController.address, dateStart, dateEnd, web3.toWei(0.1, 'ether'), 1000, web3.toWei(10, 'ether'), web3.toWei(50, 'ether'), 120 * 60 * 60, web3.toWei(100, 'ether'), web3.toWei(100, 'gwei'), 80, Wallet.address);
    }).then(function () {
        // then NormalSale
        return deployer.deploy(NormalSale, TravelkoinController.address, dateStart, dateEnd, web3.toWei(0.1, 'ether'), 1000, web3.toWei(50, 'ether'), 120 * 60 * 60, web3.toWei(100, 'ether'), web3.toWei(100, 'gwei'), 80, Wallet.address);
    }).then(function () {
        // set crowdsale
        return (TravelkoinController.at(TravelkoinController.address)).setCrowdsaleTransfer(PreSale.address, web3.toBigNumber(web3.toWei(100, 'ether')).mul(1000));
    });
};
