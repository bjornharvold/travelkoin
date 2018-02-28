import ether from './helpers/ether';
import {advanceBlock} from './helpers/advanceToBlock';
import {duration, increaseTimeTo} from './helpers/increaseTime';
import latestTime from './helpers/latestTime';
import EVMRevert from './helpers/EVMRevert';
import EVMThrow from './helpers/EVMThrow';


const BigNumber = web3.BigNumber;

const should = require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();

const Token = artifacts.require('TravelkoinToken');
const Crowdsale = artifacts.require('TravelkoinCrowdsale');

contract('TravelkoinCrowdsale', function ([_, investor, wallet, purchaser, purchaser2, purchaser3, purchaser4]) {
    const rate = new BigNumber(1000);

    const cap = ether(10);
    const lessThanCap = ether(5);
    const fiveEther = ether(5);
    const transferAmount = ether(8);
    const minContribution = ether(0.1);
    const dayOneMaxContribution = ether(1);
    const expectedTokenAmount = rate.mul(cap);
    const tokenName = 'Travelkoin';
    const tokenSymbol = 'TKT';
    const decimals = 18;
    const totalSupply = ether(85000);
    const saleTokenSupply = ether(31000);

    before(async function () {
        // Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
        await advanceBlock();
    });

    beforeEach(async function () {
        this.openingTime = latestTime() + duration.weeks(1);
        this.openingTimePlusOneDay = this.openingTime + duration.days(1);
        this.closingTime = this.openingTime + duration.weeks(4);
        this.beforeClosingTime = this.closingTime - duration.hours(1);
        this.afterClosingTime = this.closingTime + duration.seconds(1);

        this.token = await Token.new(tokenName, tokenSymbol, decimals, totalSupply);
        this.crowdsale = await Crowdsale.new(this.openingTime, this.closingTime, minContribution, dayOneMaxContribution, rate, cap, wallet, this.token.address);
        await this.token.transfer(this.crowdsale.address, saleTokenSupply);
    });

    describe('creating a valid crowdsale', function () {
        it('should fail with zero rate', async function () {
            await Crowdsale.new(this.openingTime, this.closingTime, minContribution, dayOneMaxContribution, 0, cap, wallet, this.token.address).should.be.rejectedWith(EVMRevert);
        });

        it('should fail with zero cap', async function () {
            await Crowdsale.new(this.openingTime, this.closingTime, minContribution, dayOneMaxContribution, rate, 0, wallet, this.token.address).should.be.rejectedWith(EVMRevert);
        });

        it('should fail with zero wallet', async function () {
            await Crowdsale.new(this.openingTime, this.closingTime, minContribution, dayOneMaxContribution, rate, cap, 0, this.token.address).should.be.rejectedWith(EVMRevert);
        });

        it('should fail with zero token', async function () {
            await Crowdsale.new(this.openingTime, this.closingTime, minContribution, dayOneMaxContribution, rate, cap, wallet, 0).should.be.rejectedWith(EVMRevert);
        });
    });

    describe('custom conditions', function () {
        beforeEach(async function () {
            await this.crowdsale.addToWhitelist(investor);
        });

        it('should reject payments of more than 1 ETH on the first day', async function () {
            await increaseTimeTo(this.openingTime);
            await this.crowdsale.buyTokens(investor, {value: fiveEther, from: purchaser2}).should.be.rejectedWith(EVMRevert);

            await increaseTimeTo(this.openingTimePlusOneDay);
            await this.crowdsale.buyTokens(investor, {value: fiveEther, from: purchaser2}).should.be.fulfilled;
        });
    });

    describe('is TimedCrowdsale', function () {
        describe('ending', function () {
            it('should be ended after end time', async function () {
                let ended = await this.crowdsale.hasClosed();
                ended.should.equal(false);
                await increaseTimeTo(this.afterClosingTime);
                ended = await this.crowdsale.hasClosed();
                ended.should.equal(true);
            });
        });

        describe('accepting payments', function () {
            beforeEach(async function () {
                await this.crowdsale.addToWhitelist(investor);
                await this.crowdsale.addToWhitelist(purchaser);
            });

            it('should reject payments before start', async function () {
                await this.crowdsale.send(minContribution).should.be.rejectedWith(EVMThrow);
                await this.crowdsale.buyTokens(investor, {from: purchaser, value: minContribution}).should.be.rejectedWith(EVMThrow);
            });

            it('should accept payments after start', async function () {
                await increaseTimeTo(this.openingTime);
                await this.crowdsale.send(minContribution).should.be.rejectedWith(EVMRevert);
                await this.crowdsale.buyTokens(investor, {value: minContribution, from: purchaser}).should.be.fulfilled;
            });

            it('should reject payments after end', async function () {
                await increaseTimeTo(this.afterClosingTime);
                await this.crowdsale.send(minContribution).should.be.rejectedWith(EVMRevert);
                await this.crowdsale.buyTokens(investor, {value: minContribution, from: purchaser}).should.be.rejectedWith(EVMRevert);
            });
        });
    });

    describe('is CappedCrowdsale', function () {
        beforeEach(async function () {
            await this.crowdsale.addToWhitelist(investor);
            await this.crowdsale.addToWhitelist(purchaser);
            await increaseTimeTo(this.openingTimePlusOneDay); // there is a limit on the first day so we can only test cap on second day
        });

        describe('accepting payments', function () {
            it('should accept payments within cap', async function () {
                await this.crowdsale.buyTokens(investor, {value: cap, from: purchaser}).should.be.fulfilled;
            });

            it('should reject payments outside cap', async function () {
                await this.crowdsale.buyTokens(investor, {value: cap, from: purchaser}).should.be.fulfilled;
                await this.crowdsale.buyTokens(investor, {value: minContribution, from: purchaser}).should.be.rejectedWith(EVMRevert);
            });

            it('should reject payments that exceed cap', async function () {
                await this.crowdsale.send(cap.plus(1)).should.be.rejectedWith(EVMRevert);
            });
        });

        describe('ending', function () {
            it('should not reach cap if sent under cap', async function () {
                let capReached = await this.crowdsale.capReached();
                capReached.should.equal(false);
                await this.crowdsale.buyTokens(investor, {value: minContribution, from: purchaser}).should.be.fulfilled;
                capReached = await this.crowdsale.capReached();
                capReached.should.equal(false);
            });

            it('should not reach cap if sent just under cap', async function () {
                await this.crowdsale.buyTokens(investor, {value: cap.minus(1), from: purchaser}).should.be.fulfilled;
                let capReached = await this.crowdsale.capReached();
                capReached.should.equal(false);
            });

            it('should reach cap if cap sent', async function () {
                await this.crowdsale.buyTokens(investor, {value: cap, from: purchaser}).should.be.fulfilled;
                let capReached = await this.crowdsale.capReached();
                capReached.should.equal(true);
            });
        });
    });

    describe('is PostDeliveryCrowdsale', function () {
        beforeEach(async function () {
            await this.crowdsale.addToWhitelist(investor);
            await this.crowdsale.addToWhitelist(purchaser);
        });

        it('should not immediately assign tokens to beneficiary', async function () {
            await increaseTimeTo(this.openingTime);
            await this.crowdsale.buyTokens(investor, {value: minContribution, from: purchaser});
            const balance = await this.token.balanceOf(investor);
            balance.should.be.bignumber.equal(0);
        });

        it('should not allow beneficiaries to withdraw tokens before crowdsale ends', async function () {
            await increaseTimeTo(this.beforeClosingTime);
            await this.crowdsale.buyTokens(investor, {value: minContribution, from: purchaser});
            await this.crowdsale.withdrawTokens({from: investor}).should.be.rejectedWith(EVMRevert);
        });

        it('should allow beneficiaries to withdraw tokens after crowdsale ends', async function () {
            await increaseTimeTo(this.openingTime);
            await this.crowdsale.buyTokens(investor, {value: minContribution, from: purchaser});
            await increaseTimeTo(this.afterClosingTime);
            await this.crowdsale.withdrawTokens({from: investor}).should.be.fulfilled;
        });

        it('should return the amount of tokens bought', async function () {
            await increaseTimeTo(this.openingTime);
            await this.crowdsale.buyTokens(investor, {value: minContribution, from: purchaser});
            await increaseTimeTo(this.afterClosingTime);
            await this.crowdsale.withdrawTokens({from: investor});
            const balance = await this.token.balanceOf(investor);
            balance.should.be.bignumber.equal(minContribution.mul(rate));
        });

    });

    describe('is WhitelistedCrowdsale', function () {
        describe('single user whitelisting', function () {
            beforeEach(async function () {
                await this.crowdsale.addToWhitelist(purchaser2);
                await increaseTimeTo(this.openingTime);
            });

            describe('accepting payments', function () {
                it('should accept payments to whitelisted', async function () {
                    await this.crowdsale.buyTokens(purchaser2, {value: minContribution, from: purchaser2}).should.be.fulfilled;
                    await this.crowdsale.buyTokens(purchaser2, {value: minContribution, from: purchaser3}).should.be.rejectedWith(EVMThrow);
                });

                it('should reject payments to not whitelisted (from whichever buyers)', async function () {
                    await this.crowdsale.send(minContribution).should.be.rejected;
                    await this.crowdsale.buyTokens(purchaser3, {value: minContribution, from: purchaser3}).should.be.rejected;
                    await this.crowdsale.buyTokens(purchaser3, {value: minContribution, from: purchaser2}).should.be.rejected;
                });

                it('should reject payments to addresses removed from whitelist', async function () {
                    await this.crowdsale.removeFromWhitelist(purchaser2);
                    await this.crowdsale.buyTokens(purchaser2, {value: minContribution, from: purchaser2}).should.be.rejectedWith(EVMRevert);
                });
            });

            describe('reporting whitelisted', function () {
                it('should correctly report whitelisted addresses', async function () {
                    let isAuthorized = await this.crowdsale.whitelist(purchaser2);
                    isAuthorized.should.equal(true);
                    let isntAuthorized = await this.crowdsale.whitelist(purchaser3);
                    isntAuthorized.should.equal(false);
                });
            });
        });

        describe('many user whitelisting', function () {
            beforeEach(async function () {
                await this.crowdsale.addManyToWhitelist([purchaser2, purchaser4]);
                await increaseTimeTo(this.openingTime);
            });

            describe('accepting payments', function () {
                it('should accept payments to whitelisted', async function () {
                    await this.crowdsale.buyTokens(purchaser2, {value: minContribution, from: purchaser2}).should.be.fulfilled;
                    await this.crowdsale.buyTokens(purchaser2, {value: minContribution, from: purchaser3}).should.be.rejectedWith(EVMThrow);
                    await this.crowdsale.buyTokens(purchaser4, {value: minContribution, from: purchaser2}).should.be.fulfilled;
                    await this.crowdsale.buyTokens(purchaser4, {value: minContribution, from: purchaser3}).should.be.rejectedWith(EVMThrow);
                });

                it('should reject payments to not whitelisted (with whichever buyers)', async function () {
                    await this.crowdsale.send(minContribution).should.be.rejected;
                    await this.crowdsale.buyTokens(purchaser3, {value: minContribution, from: purchaser3}).should.be.rejected;
                    await this.crowdsale.buyTokens(purchaser3, {value: minContribution, from: purchaser2}).should.be.rejected;
                });

                it('should reject payments to addresses removed from whitelist', async function () {
                    await this.crowdsale.removeFromWhitelist(purchaser4);
                    await this.crowdsale.buyTokens(purchaser2, {value: minContribution, from: purchaser2}).should.be.fulfilled;
                    await this.crowdsale.buyTokens(purchaser4, {value: minContribution, from: purchaser2}).should.be.rejectedWith(EVMRevert);
                });
            });

            describe('reporting whitelisted', function () {
                it('should correctly report whitelisted addresses', async function () {
                    let isAuthorized = await this.crowdsale.whitelist(purchaser2);
                    isAuthorized.should.equal(true);
                    let isAnotherAuthorized = await this.crowdsale.whitelist(purchaser4);
                    isAnotherAuthorized.should.equal(true);
                    let isntAuthorized = await this.crowdsale.whitelist(purchaser3);
                    isntAuthorized.should.equal(false);
                });
            });
        });
    });

});
