var MiniMeTokenFactory = artifacts.require('MiniMeTokenFactory');
var TravelkoinMiniMeToken = artifacts.require('TravelkoinMiniMeToken');
var MultiSigWallet = artifacts.require('MultiSigWallet');
var NormalSale = artifacts.require('TravelkoinNormalSale');
var SafeMath = artifacts.require('SafeMath');
var TravelkoinController = artifacts.require('TravelkoinController');
var TravelkoinRefundVault = artifacts.require('TravelkoinRefundVault');
var TravelkoinHodler = artifacts.require('TravelkoinHodler');
var TokenVesting = artifacts.require('TravelkoinTokenVesting');

// var dateStart = Math.floor(new Date().getTime() / 1000) + 5 * 60 * 60 * 24; // starts in 5 days
var dateStart = Math.floor(new Date().getTime() / 1000) + 0.001 * 60 * 60 * 24; // starts now
var dateEnd = dateStart + 5 * 24 * 60 * 60; // lasts 5 days

module.exports = function (deployer) {
    return deployer.then(function () {
        // deploy SafeMath first
        return deployer.deploy(SafeMath);
    }).then(function () {
        // link SafeMath
        return deployer.link(SafeMath, [NormalSale, TravelkoinRefundVault, TravelkoinController, TravelkoinHodler, TokenVesting]);
    }).then(function () {
        // then Wallet
        return deployer.deploy(MultiSigWallet, [web3.eth.accounts[0], web3.eth.accounts[1], web3.eth.accounts[2]], 2);
    }).then(function () {
        // then Factory
        return deployer.deploy(MiniMeTokenFactory);
    }).then(function () {
        // then Controller
        return deployer.deploy(TravelkoinController, MultiSigWallet.address);
    }).then(function () {
        // then TravelkoinMiniMeToken
        return deployer.deploy(TravelkoinMiniMeToken, TravelkoinController.address, MiniMeTokenFactory.address);
    }).then(function () {
        // set Token and generate token amount
        return (TravelkoinController.at(TravelkoinController.address)).setToken(TravelkoinMiniMeToken.address, 0);
    }).then(function () {
        // then NormalSale
        return deployer.deploy(NormalSale, TravelkoinController.address, dateStart, dateEnd, web3.toWei(0.1, 'ether'), 1000, web3.toWei(31000, 'ether'), MultiSigWallet.address);
    }).then(function () {
        // set crowdsale - 31M tokens at 1 ETH = 1000 tokens
        return (TravelkoinController.at(TravelkoinController.address)).setCrowdsaleTransfer(NormalSale.address, web3.toBigNumber(web3.toWei(31000, 'ether')));
    });
};
