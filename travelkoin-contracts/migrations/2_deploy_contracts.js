const Token = artifacts.require('TravelkoinToken');
const Crowdsale = artifacts.require('TravelkoinCrowdsale');
const SafeMath = artifacts.require('SafeMath');

// const dateStart = Math.floor(new Date().getTime() / 1000) + 5 * 60 * 60 * 24; // starts in 5 days
const dateStart = Math.floor(new Date().getTime() / 1000) + 0.008 * 60 * 60 * 24; // starts now
const dateEnd = dateStart + 0.02 * 60 * 60 * 24; // lasts 5 days
const initialSupply = 85000000; // 85 million tokens
const owner = web3.eth.accounts[0];
const minContribution = web3.toWei(0.1, 'ether');
const dayOneMaxContribution = web3.toWei(1, 'ether');
const rate = 1000; // how many tokens per 1 ETH
const crowdsaleTokens = web3.toWei(31000, 'ether');
const tokenName = 'Travelkoin';
const tokenSymbol = 'TKT';
const tokenDecimals = 18;

module.exports = function (deployer) {
    return deployer.then(function () {
        // deploy SafeMath first
        return deployer.deploy(SafeMath);
    }).then(function () {
        // link SafeMath
        return deployer.link(SafeMath, [Crowdsale]);
    }).then(function () {
        // then TravelkoinMiniMeToken
        return deployer.deploy(Token, tokenName, tokenSymbol, tokenDecimals, initialSupply);
    }).then(function () {
        // then Crowdsale
        return deployer.deploy(Crowdsale, dateStart, dateEnd, minContribution, dayOneMaxContribution, rate, crowdsaleTokens, owner, Token.address);
    });
};
