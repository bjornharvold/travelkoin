const Token = artifacts.require('TravelkoinToken');
const Crowdsale = artifacts.require('TravelkoinCrowdsale');
const SafeMath = artifacts.require('SafeMath');

// const dateStart = 1523278800000; // starts in April 9th 13:00 UTC
// const dateEnd = 1523710800000; // ends on April 14th 13:00 UTC
const dateStart = Math.floor(new Date().getTime() / 1000) + 0.005 * 60 * 60 * 24; // starts now
const dateEnd = dateStart + 7 * 60 * 60 * 24; // lasts 1 week
const initialSupply = 85000000 * Math.pow(10, 18); // 85 million tokens
const owner = web3.eth.accounts[0];
const minContribution = web3.toWei(0.1, 'ether');
const dayOneMaxContribution = web3.toWei(1, 'ether');
const rate = 1000; // how many tokens per 1 ETH
const crowdsaleTokens = 31000000 * Math.pow(10, 18);
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
        // then TravelkoinToken
        return deployer.deploy(Token, tokenName, tokenSymbol, tokenDecimals, initialSupply);
    }).then(function () {
        // then Crowdsale
        return deployer.deploy(Crowdsale, dateStart, dateEnd, minContribution, dayOneMaxContribution, rate, crowdsaleTokens, owner, Token.address);
    });
};
