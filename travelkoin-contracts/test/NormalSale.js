import ether from './helpers/ether';
import {advanceBlock} from './helpers/advanceToBlock';
import {duration, increaseTimeTo} from './helpers/increaseTime';
import latestTime from './helpers/latestTime';
import EVMRevert from './helpers/EVMRevert'

const BigNumber = web3.BigNumber;

const should = require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();

const Factory = artifacts.require('MiniMeTokenFactory');
const Controller = artifacts.require('TravelkoinController');
const Token = artifacts.require('TravelkoinMiniMeToken');
const Crowdsale = artifacts.require('TravelkoinNormalSale');
const TravelkoinHodler = artifacts.require('TravelkoinHodler');

contract('NormalSale', function ([deployer, investor, wallet, purchaser, purchaser2, purchaser3, purchaser4]) {
    const rate = new BigNumber(1000);

    const cap = ether(10);
    const fiveEther = ether(5);
    const transferAmount = ether(8);
    const minContribution = ether(0.1);
    const expectedTokenAmount = rate.mul(cap);

    before(async function () {
        // Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
        await advanceBlock();
    });

    beforeEach(async function () {
        this.startTime = latestTime() + duration.weeks(1);
        this.endTime = this.startTime + duration.weeks(4);
        this.afterEndTime = this.endTime + duration.seconds(1);

        this.factory = await Factory.new();
        this.controller = await Controller.new(wallet);
        this.token = await Token.new(this.controller.address, this.factory.address);
        await this.controller.setToken(this.token.address, 0);
        this.hodler = TravelkoinHodler.at(await this.controller.hodler());

        this.crowdsale = await Crowdsale.new(this.controller.address, this.startTime, this.endTime, minContribution, rate, cap, wallet);

        await this.controller.setCrowdsaleTransfer(this.crowdsale.address, expectedTokenAmount);
    });

    describe('creating a valid crowdsale', function () {
      it('should fail with zero rate', async function () {
        await Crowdsale.new(this.controller.address, this.startTime, this.endTime, minContribution, 0, cap, wallet).should.be.rejectedWith(EVMRevert);
      });

      it('should fail with zero cap', async function () {
        await Crowdsale.new(this.controller.address, this.startTime, this.endTime, minContribution, rate, 0, wallet).should.be.rejectedWith(EVMRevert);
      });

      it('should fail with zero controller', async function () {
        await Crowdsale.new(0, this.startTime, this.endTime, minContribution, rate, cap, wallet).should.be.rejectedWith(EVMRevert);
      });

      it('should fail with zero wallet', async function () {
        await Crowdsale.new(this.controller.address, this.startTime, this.endTime, minContribution, rate, cap, 0).should.be.rejectedWith(EVMRevert);
      });
    });

    describe('modify before sale', function () {
      it('should set valid caps', async function () {
        await this.crowdsale.setCap(cap).should.be.fulfilled;
      });

      it('should fail to set valid caps after start', async function () {
        await increaseTimeTo(this.afterEndTime);
        await this.crowdsale.setCap(cap).should.be.rejectedWith(EVMRevert);
      });

      it('should fail setting zero cap', async function () {
        await this.crowdsale.setCap(0).should.be.rejectedWith(EVMRevert);
      });

      it('should set valid times', async function () {
        await this.crowdsale.setTimes(this.startTime, this.endTime).should.be.fulfilled;
      });

      it('should fail to set valid times after start', async function () {
        await increaseTimeTo(this.afterEndTime);
        await this.crowdsale.setTimes(this.startTime, this.endTime).should.be.rejectedWith(EVMRevert);
      });

      it('should fail to set invalid times', async function () {
        await this.crowdsale.setTimes(this.endTime, this.endTime).should.be.rejectedWith(EVMRevert);
        await this.crowdsale.setTimes(latestTime(), this.endTime).should.be.rejectedWith(EVMRevert);
      });

      it('should set valid rate', async function () {
        await this.crowdsale.setRate(rate.plus(1)).should.be.fulfilled;
      });

      it('should fail to set valid rate after start', async function () {
        await increaseTimeTo(this.afterEndTime);
        await this.crowdsale.setRate(rate.plus(1)).should.be.rejectedWith(EVMRevert);
      });

      it('should fail to set invalid rate', async function () {
        await this.crowdsale.setRate(0).should.be.rejectedWith(EVMRevert);
      });
    });

    describe('ending', function () {
      it('should be ended after end time', async function () {
        let ended = await this.crowdsale.hasEnded();
        ended.should.equal(false);
        await increaseTimeTo(this.afterEndTime);
        ended = await this.crowdsale.hasEnded();
        ended.should.equal(true);
      });
    });

    describe('accepting payments', function () {
        it('should reject payments before start', async function () {
          await this.crowdsale.send(minContribution).should.be.rejectedWith(EVMRevert);
          await this.crowdsale.buyTokens(investor, { from: purchaser, value: minContribution }).should.be.rejectedWith(EVMRevert);
        });

        it('should reject payments smaller than min contribution', async function () {
          await increaseTimeTo(this.startTime);
          await this.crowdsale.send(minContribution.minus(1)).should.be.rejectedWith(EVMRevert);
          await this.crowdsale.buyTokens(investor, { value: minContribution.minus(1), from: purchaser }).should.be.rejectedWith(EVMRevert);
        });

        it('should accept payments after start', async function () {
          await increaseTimeTo(this.startTime);
          await this.crowdsale.send(minContribution).should.be.fulfilled;
          await this.crowdsale.buyTokens(investor, { value: minContribution, from: purchaser }).should.be.fulfilled;
        });

        it('should measure buyTokens tx costs', async function () {
          await increaseTimeTo(this.startTime);
          let tx = await this.crowdsale.buyTokens(investor, { value: minContribution, from: purchaser }).should.be.fulfilled;
          console.log('*** BUY TOKENS: ' + tx.receipt.gasUsed + ' gas used.');
        });

        it('should reject payments after end', async function () {
          await increaseTimeTo(this.afterEndTime);
          await this.crowdsale.send(minContribution).should.be.rejectedWith(EVMRevert);
          await this.crowdsale.buyTokens(investor, { value: minContribution, from: purchaser }).should.be.rejectedWith(EVMRevert);
        });

        it('should reject payments outside cap', async function () {
          await increaseTimeTo(this.startTime);

          await this.crowdsale.sendTransaction({ value: cap, from: purchaser2 }).should.be.fulfilled;
          await this.crowdsale.send(1).should.be.rejectedWith(EVMRevert);
        });
    });

    describe('high-level purchase', function () {
      beforeEach(async function () {
        await increaseTimeTo(this.startTime);
      });

      it('should log purchase', async function () {
        const { logs } = await this.crowdsale.sendTransaction({ value: minContribution, from: investor });

        const event = logs.find(e => e.event === 'TokenPurchase');

        should.exist(event);
        event.args._purchaser.should.equal(investor);
        event.args._beneficiary.should.equal(investor);
        event.args._value.should.be.bignumber.equal(minContribution);
        event.args._stake.should.be.bignumber.equal(minContribution);
      });

    });

    describe('low-level purchase', function () {
      beforeEach(async function () {
        await increaseTimeTo(this.startTime);
      });

      it('should log purchase', async function () {
        const { logs } = await this.crowdsale.buyTokens(investor, { value: minContribution, from: purchaser });

        const event = logs.find(e => e.event === 'TokenPurchase');

        should.exist(event);
        event.args._purchaser.should.equal(purchaser);
        event.args._beneficiary.should.equal(investor);
        event.args._value.should.be.bignumber.equal(minContribution);
        event.args._stake.should.be.bignumber.equal(minContribution);
      });

    });

    describe('claim token', function () {
      it('should deny claim token before finish', async function () {
        await this.crowdsale.claimToken({ from: investor }).should.be.rejectedWith(EVMRevert);
        await increaseTimeTo(this.startTime);
        await this.crowdsale.claimToken({ from: investor }).should.be.rejectedWith(EVMRevert);
      });

      it('should correctly distribute among multiple participants when buying on separate days', async function () {
        await increaseTimeTo(this.startTime);
        await this.crowdsale.sendTransaction({ value: cap.div(2), from: investor });

        await increaseTimeTo(this.startTime + duration.days(2));
        await this.crowdsale.sendTransaction({ value: cap.div(2), from: purchaser });

        await increaseTimeTo(this.afterEndTime);

        // no claim before finalize
        await this.crowdsale.claimToken({ from: investor, gasPrice: 0 }).should.be.rejectedWith(EVMRevert);

        // valid claim after finalize
        await this.crowdsale.finalize({ from: deployer });
        const preInvestor = await this.token.balanceOf(investor);
        const prePurchaser = await this.token.balanceOf(purchaser);
        await this.crowdsale.claimTokensFor([investor, purchaser], { gasPrice: 0 }).should.be.fulfilled;
        const postInvestor = await this.token.balanceOf(investor);
        const postPurchaser = await this.token.balanceOf(purchaser);

        const totalToken = cap.mul(rate);
        const stakeInvestor = cap.div(2);
        const stakePurchaser = cap.div(2);
        const stakeTotal = stakeInvestor.plus(stakePurchaser);
        postInvestor.minus(preInvestor).should.be.bignumber.equal(totalToken.mul(stakeInvestor).div(stakeTotal).floor());
        postPurchaser.minus(prePurchaser).should.be.bignumber.equal(totalToken.mul(stakePurchaser).div(stakeTotal).floor());

        // invalid claim after finalize
        await this.crowdsale.claimToken({ from: purchaser, gasPrice: 0 }).should.be.rejectedWith(EVMRevert);
      });

      // it('should send back excess tokens to controller\'s SALE address', async function () {
      //   await increaseTimeTo(this.startTime);
      //   await this.crowdsale.sendTransaction({ value: transferAmount, from: investor });
      //   await increaseTimeTo(this.afterEndTime);
      //
      //   // valid claim after finalize
      //   const sale = await this.controller.SALE();
      //   const pre = await this.token.balanceOf(sale);
      //   await this.crowdsale.finalize({ from: deployer });
      //   const post = await this.token.balanceOf(sale);
      //
      //   console.log(`Sale address balance: ${sale}`);
      //   console.log(`Pre balance: ${pre}`);
      //   console.log(`Post balance: ${post}`);
      //   post.minus(pre).should.be.bignumber.equal(cap.mul(rate).minus(transferAmount.mul(rate)));
      // });

      it('should allow token transfer after controller unpaused', async function () {
        await increaseTimeTo(this.startTime);
        await this.crowdsale.sendTransaction({ value: transferAmount, from: investor });
        await increaseTimeTo(this.afterEndTime);

        // valid claim after finalize
        await this.crowdsale.finalize({ from: deployer });
        await this.crowdsale.claimToken({ from: investor, gasPrice: 0 }).should.be.fulfilled;

        // invalid transfer until controller is paused
        await this.token.transfer(purchaser, 1, { from: investor, gasPrice: 0 }).should.be.rejectedWith(EVMRevert);

        // valid transfer after controller unpaused
        await this.controller.unpause({ from: deployer });
        await this.token.transfer(purchaser, 1, { from: investor, gasPrice: 0 }).should.be.fulfilled;
      });
    });

    describe('whitelist', function () {

        it('should allow to set whitelist until start', async function () {
            await this.crowdsale.setWhitelist([investor,purchaser],[],[ether(1)]).should.be.fulfilled
        });

        it('should not allow to set whitelist after start', async function () {
            await increaseTimeTo(this.startTime);
            await this.crowdsale.setWhitelist([investor,purchaser],[],[ether(1)]).should.be.rejectedWith(EVMRevert)
        });

        it('should allow to delete from the whitelist', async function () {
            // add
            await this.crowdsale.setWhitelist([investor,purchaser],[],[ether(1)]).should.be.fulfilled;

            let ok = await this.crowdsale.whitelist(investor);
            ok.should.equal(true);

            ok = await this.crowdsale.whitelist(purchaser);
            ok.should.equal(true);

            let wlDays = await this.crowdsale.whitelistDayCount();
            wlDays.should.be.bignumber.equal(new BigNumber(1));

            // remove
            await this.crowdsale.setWhitelist([],[purchaser],[]).should.be.fulfilled;

            ok = await this.crowdsale.whitelist(investor);
            ok.should.equal(true);

            ok = await this.crowdsale.whitelist(purchaser);
            ok.should.equal(false);

            wlDays = await this.crowdsale.whitelistDayCount();
            wlDays.should.be.bignumber.equal(new BigNumber(1))
        });

        it('should allow to modify whitelist days', async function () {
            // set to 1 day with 1 ether stake limit
            await this.crowdsale.setWhitelist([investor],[],[ether(1)]).should.be.fulfilled;

            let ok = await this.crowdsale.whitelist(investor);
            ok.should.equal(true);

            let wlDays = await this.crowdsale.whitelistDayCount();
            wlDays.should.be.bignumber.equal(new BigNumber(1));

            let limit = await this.crowdsale.whitelistDayMaxStake(1);
            limit.should.be.bignumber.equal(ether(1));

            // set to 1 day with 2 ether stake limit
            await this.crowdsale.setWhitelist([],[],[ether(2)]).should.be.fulfilled;

            ok = await this.crowdsale.whitelist(investor);
            ok.should.equal(true);

            wlDays = await this.crowdsale.whitelistDayCount();
            wlDays.should.be.bignumber.equal(new BigNumber(1));

            limit = await this.crowdsale.whitelistDayMaxStake(1);
            limit.should.be.bignumber.equal(ether(2));
        });

        it('should not allow unwhitelisted contribution during whitelist period', async function () {
            await this.crowdsale.setWhitelist([investor],[],[minContribution.mul(2)]).should.be.fulfilled;
            await increaseTimeTo(this.startTime);

            await this.crowdsale.sendTransaction({value: minContribution, from: purchaser3}).should.be.rejectedWith(EVMRevert)
        });

        it('should allow contribution during whitelist period for whitelist addresses', async function () {
            await this.crowdsale.setWhitelist([investor],[],[minContribution.mul(2)]).should.be.fulfilled;
            await increaseTimeTo(this.startTime);

            await this.crowdsale.sendTransaction({value: minContribution, from: investor}).should.be.fulfilled;
            await this.crowdsale.sendTransaction({value: minContribution, from: purchaser}).should.be.rejectedWith(EVMRevert);

            await increaseTimeTo(this.startTime+duration.days(2));
            await this.crowdsale.sendTransaction({value: minContribution, from: purchaser}).should.be.fulfilled;
        });

        it('should refund excess contribution during whitelist period', async function () {
            await this.crowdsale.setWhitelist([investor],[],[minContribution.mul(2)]).should.be.fulfilled;
            await increaseTimeTo(this.startTime);

            const pre = web3.eth.getBalance(investor);
            await this.crowdsale.sendTransaction({value: minContribution.mul(5), from: investor, gasPrice:0}).should.be.fulfilled;
            const post = web3.eth.getBalance(investor);

            pre.minus(post).should.be.bignumber.equal(minContribution.mul(2).floor());
        });

        it('should deny contribution above whitelist limit during whitelist period', async function () {
            await this.crowdsale.setWhitelist([investor],[],[minContribution.mul(2)]).should.be.fulfilled;
            await increaseTimeTo(this.startTime);

            await this.crowdsale.sendTransaction({value: minContribution.mul(2).floor(), from: investor}).should.be.fulfilled;
            await this.crowdsale.sendTransaction({value: 1, from: investor}).should.be.rejectedWith(EVMRevert);
        })

    });

    describe('hodl', function () {
      it('controller should own hodler', async function () {
        const owner = await this.hodler.owner();
        owner.should.equal(this.controller.address);
      });

      it('should not allow to add hodler stake for anyone', async function () {
        await this.hodler.addHodlerStake(investor, 1, { from: investor }).should.be.rejectedWith(EVMRevert);
        await this.hodler.addHodlerStake(investor, 1, { from: wallet }).should.be.rejectedWith(EVMRevert);
        await this.hodler.addHodlerStake(investor, 1, { from: deployer }).should.be.rejectedWith(EVMRevert);
      });

      it('should set hodl stake based on contribution', async function () {
        await increaseTimeTo(this.startTime);
        await this.crowdsale.sendTransaction({ value: fiveEther, from: investor, gasPrice: 0 }).should.be.fulfilled;
        let hodl = await this.hodler.hodlerStakes(investor);
        hodl[0].should.be.bignumber.equal(new BigNumber(0)); // no stake before claiming tokens

        await increaseTimeTo(this.afterEndTime);
        await this.crowdsale.finalize({ from: deployer });
        await this.crowdsale.claimToken({ from: investor, gasPrice: 0 }).should.be.fulfilled;

        hodl = await this.hodler.hodlerStakes(investor);
        hodl[0].should.be.bignumber.equal(cap.mul(rate));
      });

      it('should set hodl stake based on multiple contributions', async function () {
        await increaseTimeTo(this.startTime);
        await this.crowdsale.sendTransaction({ value: fiveEther.div(2), from: investor, gasPrice: 0 }).should.be.fulfilled;
        await this.crowdsale.sendTransaction({ value: fiveEther.div(2), from: investor, gasPrice: 0 }).should.be.fulfilled;
        let hodl = await this.hodler.hodlerStakes(investor);
        hodl[0].should.be.bignumber.equal(new BigNumber(0)); // no stake before claiming tokens

        await increaseTimeTo(this.afterEndTime);
        await this.crowdsale.finalize({ from: deployer });
        await this.crowdsale.claimToken({ from: investor, gasPrice: 0 }).should.be.fulfilled;

        hodl = await this.hodler.hodlerStakes(investor);
        hodl[0].should.be.bignumber.equal(cap.mul(rate));
      });

      it('should invalidate hodl stake after transfer', async function () {
        await increaseTimeTo(this.startTime);
        await this.crowdsale.sendTransaction({ value: fiveEther, from: investor, gasPrice: 0 }).should.be.fulfilled;
        let hodl = await this.hodler.hodlerStakes(investor);
        hodl[0].should.be.bignumber.equal(new BigNumber(0)); // no stake before claiming tokens

        await increaseTimeTo(this.afterEndTime);
        await this.crowdsale.finalize({ from: deployer });
        await this.controller.unpause({ from: deployer });
        await this.crowdsale.claimToken({ from: investor, gasPrice: 0 }).should.be.fulfilled;

        hodl = await this.hodler.hodlerStakes(investor);
        hodl[0].should.be.bignumber.equal(cap.mul(rate));
        hodl[1].should.equal(false);

        await this.token.transfer(purchaser, 1, { from: investor, gasPrice: 0 }).should.be.fulfilled;
        hodl = await this.hodler.hodlerStakes(investor);
        hodl[0].should.be.bignumber.equal(cap.mul(rate));
        hodl[1].should.equal(true);
      });

      // token transfer wont be enabled until end of normal sale, so buyers can't invalidate their stakes between pre and normal sale
      it('should not invalidate hodl stake if receiving transfer, too early claim for 3 month reward', async function () {
        await increaseTimeTo(this.startTime);
        await this.crowdsale.sendTransaction({ value: fiveEther.div(2), from: investor, gasPrice: 0 }).should.be.fulfilled;
        await this.crowdsale.sendTransaction({ value: fiveEther.div(2), from: purchaser, gasPrice: 0 }).should.be.fulfilled;

        // transfer tokens from investor to purchaser
        await increaseTimeTo(this.afterEndTime);
        await this.crowdsale.finalize({ from: deployer });
        await this.controller.unpause({ from: deployer });
        await this.crowdsale.claimTokensFor([investor, purchaser], { gasPrice: 0 }).should.be.fulfilled;
        await this.token.transfer(purchaser, 1, { from: investor, gasPrice: 0 }).should.be.fulfilled;

        // investor should be invalidated
        let hodl = await this.hodler.hodlerStakes(investor);
        hodl[0].should.be.bignumber.equal(cap.div(2).mul(rate));
        hodl[1].should.equal(true);

        // purchaser should not be invalidated
        hodl = await this.hodler.hodlerStakes(purchaser);
        hodl[0].should.be.bignumber.equal(cap.div(2).mul(rate));
        hodl[1].should.equal(false);

        // too early claiming
        await increaseTimeTo(this.afterEndTime + duration.weeks(2) + duration.days(89));
        let pre = await this.token.balanceOf(purchaser);
        await this.hodler.claimHodlRewardsFor([purchaser]).should.be.fulfilled;
        let post = await this.token.balanceOf(purchaser);
        post.minus(pre).should.be.bignumber.equal(ether(0));
      });

      it('should not invalidate hodl stake if receiving transfer, distribute 3 month reward properly', async function () {
        await increaseTimeTo(this.startTime);
        await this.crowdsale.sendTransaction({ value: fiveEther.div(2), from: investor, gasPrice: 0 }).should.be.fulfilled;
        await this.crowdsale.sendTransaction({ value: fiveEther.div(2), from: purchaser, gasPrice: 0 }).should.be.fulfilled;

        // transfer tokens from investor to purchaser
        await increaseTimeTo(this.afterEndTime);
        await this.crowdsale.finalize({ from: deployer });
        await this.controller.unpause({ from: deployer });
        await this.crowdsale.claimTokensFor([investor, purchaser], { gasPrice: 0 }).should.be.fulfilled;
        await this.token.transfer(purchaser, 1, { from: investor, gasPrice: 0 }).should.be.fulfilled;

        // investor should be invalidated
        let hodl = await this.hodler.hodlerStakes(investor);
        hodl[0].should.be.bignumber.equal(cap.div(2).mul(rate));
        hodl[1].should.equal(true);

        // purchaser should not be invalidated
        hodl = await this.hodler.hodlerStakes(purchaser);
        hodl[0].should.be.bignumber.equal(cap.div(2).mul(rate));
        hodl[1].should.equal(false);

        // claim 3 month tokens
        const totalToken3m = await this.hodler.TOKEN_HODL_3M();
        await increaseTimeTo(this.afterEndTime + duration.weeks(2) + duration.days(91));
        let pre = await this.token.balanceOf(purchaser);
        await this.hodler.claimHodlRewardsFor([purchaser]).should.be.fulfilled;
        let post = await this.token.balanceOf(purchaser);
        post.minus(pre).should.be.bignumber.equal(totalToken3m);
      });

      it('should not invalidate hodl stake if receiving transfer, distribute 6 month reward properly', async function () {
        await increaseTimeTo(this.startTime);
        await this.crowdsale.sendTransaction({ value: fiveEther.div(2), from: investor, gasPrice: 0 }).should.be.fulfilled;
        await this.crowdsale.sendTransaction({ value: fiveEther.div(2), from: purchaser, gasPrice: 0 }).should.be.fulfilled;

        // transfer tokens from investor to purchaser
        await increaseTimeTo(this.afterEndTime);
        await this.crowdsale.finalize({ from: deployer });
        await this.controller.unpause({ from: deployer });
        await this.crowdsale.claimTokensFor([investor, purchaser], { gasPrice: 0 }).should.be.fulfilled;
        await this.token.transfer(purchaser, 1, { from: investor, gasPrice: 0 }).should.be.fulfilled;

        // investor should be invalidated
        let hodl = await this.hodler.hodlerStakes(investor);
        hodl[0].should.be.bignumber.equal(cap.div(2).mul(rate));
        hodl[1].should.equal(true);

        // purchaser should not be invalidated
        hodl = await this.hodler.hodlerStakes(purchaser);
        hodl[0].should.be.bignumber.equal(cap.div(2).mul(rate));
        hodl[1].should.equal(false);

        // claim earlier hodl tokens
        await increaseTimeTo(this.afterEndTime + duration.weeks(2) + duration.days(91));
        await this.hodler.claimHodlRewardsFor([purchaser]).should.be.fulfilled;

        // claim 6 month tokens
        const totalToken6m = await this.hodler.TOKEN_HODL_6M();
        await increaseTimeTo(this.afterEndTime + duration.weeks(2) + duration.days(181));
        let pre = await this.token.balanceOf(purchaser);
        await this.hodler.claimHodlRewardsFor([purchaser]).should.be.fulfilled;
        let post = await this.token.balanceOf(purchaser);
        post.minus(pre).should.be.bignumber.equal(totalToken6m);
      });

      it('should not invalidate hodl stake if receiving transfer, distribute 9 month reward properly', async function () {
        await increaseTimeTo(this.startTime);
        await this.crowdsale.sendTransaction({ value: fiveEther.div(2), from: investor, gasPrice: 0 }).should.be.fulfilled;
        await this.crowdsale.sendTransaction({ value: fiveEther.div(2), from: purchaser, gasPrice: 0 }).should.be.fulfilled;

        // transfer tokens from investor to purchaser
        await increaseTimeTo(this.afterEndTime);
        await this.crowdsale.finalize({ from: deployer });
        await this.controller.unpause({ from: deployer });
        await this.crowdsale.claimTokensFor([investor, purchaser], { gasPrice: 0 }).should.be.fulfilled;
        await this.token.transfer(purchaser, 1, { from: investor, gasPrice: 0 }).should.be.fulfilled;

        // investor should be invalidated
        let hodl = await this.hodler.hodlerStakes(investor);
        hodl[0].should.be.bignumber.equal(cap.div(2).mul(rate));
        hodl[1].should.equal(true);

        // purchaser should not be invalidated
        hodl = await this.hodler.hodlerStakes(purchaser);
        hodl[0].should.be.bignumber.equal(cap.div(2).mul(rate));
        hodl[1].should.equal(false);

        // claim earlier hodl tokens
        await increaseTimeTo(this.afterEndTime + duration.weeks(2) + duration.days(181));
        await this.hodler.claimHodlRewardsFor([purchaser]).should.be.fulfilled;

        // claim 9 month tokens
        const totalToken9m = await this.hodler.TOKEN_HODL_9M();
        await increaseTimeTo(this.afterEndTime + duration.weeks(2) + duration.days(271));
        let pre = await this.token.balanceOf(purchaser);
        await this.hodler.claimHodlRewardsFor([purchaser]).should.be.fulfilled;
        let post = await this.token.balanceOf(purchaser);
        post.minus(pre).should.be.bignumber.equal(totalToken9m);
      });

      it('should not distribute hodl to two participants when called too early', async function () {
        await increaseTimeTo(this.startTime);
        await this.crowdsale.sendTransaction({ value: fiveEther, from: investor, gasPrice: 0 }).should.be.fulfilled;
        await this.crowdsale.sendTransaction({ value: fiveEther.div(2), from: purchaser, gasPrice: 0 }).should.be.fulfilled;

        // transfer tokens from investor to purchaser
        await increaseTimeTo(this.afterEndTime);
        await this.crowdsale.finalize({ from: deployer });
        await this.controller.unpause({ from: deployer });
        await this.crowdsale.claimTokensFor([investor, purchaser], { gasPrice: 0 }).should.be.fulfilled;

        // claiming too early
        await increaseTimeTo(this.afterEndTime + duration.weeks(2) + duration.days(89));
        let preI = await this.token.balanceOf(investor);
        let preP = await this.token.balanceOf(purchaser);
        await this.hodler.claimHodlRewardsFor([investor, purchaser]).should.be.fulfilled;
        let postI = await this.token.balanceOf(investor);
        let postP = await this.token.balanceOf(purchaser);
        postI.minus(preI).should.be.bignumber.equal(new BigNumber(0));
        postP.minus(preP).should.be.bignumber.equal(new BigNumber(0));
      });

      it('should correctly distribute 3 month hodl reward to two participants', async function () {
        await increaseTimeTo(this.startTime);
        await this.crowdsale.sendTransaction({ value: fiveEther, from: investor, gasPrice: 0 }).should.be.fulfilled;
        await this.crowdsale.sendTransaction({ value: fiveEther.div(2), from: purchaser, gasPrice: 0 }).should.be.fulfilled;

        // transfer tokens from investor to purchaser
        await increaseTimeTo(this.afterEndTime);
        await this.crowdsale.finalize({ from: deployer });
        await this.controller.unpause({ from: deployer });
        await this.crowdsale.claimTokensFor([investor, purchaser], { gasPrice: 0 }).should.be.fulfilled;

        // claim 3 month tokens
        const totalToken3m = await this.hodler.TOKEN_HODL_3M();
        await increaseTimeTo(this.afterEndTime + duration.weeks(2) + duration.days(91));

        let preI = await this.token.balanceOf(investor);
        let preP = await this.token.balanceOf(purchaser);
        await this.hodler.claimHodlRewardsFor([investor, purchaser]).should.be.fulfilled;
        let postI = await this.token.balanceOf(investor);
        let postP = await this.token.balanceOf(purchaser);

        postI.minus(preI).should.be.bignumber.equal(totalToken3m.mul(2).div(3).floor());
        postP.minus(preP).should.be.bignumber.equal(totalToken3m.div(3).floor());
      });

      it('should correctly distribute 6 month hodl reward to two participants', async function () {
        await increaseTimeTo(this.startTime);
        await this.crowdsale.sendTransaction({ value: fiveEther, from: investor, gasPrice: 0 }).should.be.fulfilled;
        await this.crowdsale.sendTransaction({ value: fiveEther.div(2), from: purchaser, gasPrice: 0 }).should.be.fulfilled;

        // transfer tokens from investor to purchaser
        await increaseTimeTo(this.afterEndTime);
        await this.crowdsale.finalize({ from: deployer });
        await this.controller.unpause({ from: deployer });
        await this.crowdsale.claimTokensFor([investor, purchaser], { gasPrice: 0 }).should.be.fulfilled;

        // claim earlier hodl tokens
        await increaseTimeTo(this.afterEndTime + duration.weeks(2) + duration.days(91));
        await this.hodler.claimHodlRewardsFor([investor, purchaser]).should.be.fulfilled;

        // claim 6 month tokens
        const totalToken6m = await this.hodler.TOKEN_HODL_6M();
        await increaseTimeTo(this.afterEndTime + duration.weeks(2) + duration.days(181));

        let preI = await this.token.balanceOf(investor);
        let preP = await this.token.balanceOf(purchaser);
        await this.hodler.claimHodlRewardsFor([investor, purchaser]).should.be.fulfilled;
        let postI = await this.token.balanceOf(investor);
        let postP = await this.token.balanceOf(purchaser);

        postI.minus(preI).should.be.bignumber.equal(totalToken6m.mul(2).div(3).floor());
        postP.minus(preP).should.be.bignumber.equal(totalToken6m.div(3).floor());
      });

      it('should correctly distribute 9 month hodl reward to two participants', async function () {
        await increaseTimeTo(this.startTime);
        await this.crowdsale.sendTransaction({ value: fiveEther, from: investor, gasPrice: 0 }).should.be.fulfilled;
        await this.crowdsale.sendTransaction({ value: fiveEther.div(2), from: purchaser, gasPrice: 0 }).should.be.fulfilled;

        // transfer tokens from investor to purchaser
        await increaseTimeTo(this.afterEndTime);
        await this.crowdsale.finalize({ from: deployer });
        await this.controller.unpause({ from: deployer });
        await this.crowdsale.claimTokensFor([investor, purchaser], { gasPrice: 0 }).should.be.fulfilled;

        // claim earlier hodl tokens
        await increaseTimeTo(this.afterEndTime + duration.weeks(2) + duration.days(181));
        await this.hodler.claimHodlRewardsFor([investor, purchaser]).should.be.fulfilled;

        // claim 9 month tokens
        const totalToken9m = await this.hodler.TOKEN_HODL_9M();
        await increaseTimeTo(this.afterEndTime + duration.weeks(2) + duration.days(270) + 1);

        let preI = await this.token.balanceOf(investor);
        let preP = await this.token.balanceOf(purchaser);
        await this.hodler.claimHodlRewardsFor([investor, purchaser]).should.be.fulfilled;
        let postI = await this.token.balanceOf(investor);
        let postP = await this.token.balanceOf(purchaser);

        postI.minus(preI).should.be.bignumber.equal(totalToken9m.mul(2).div(3).floor());
        postP.minus(preP).should.be.bignumber.equal(totalToken9m.div(3).floor());
      });
    });
});
