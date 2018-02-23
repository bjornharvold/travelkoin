import {Injectable} from '@angular/core';
import {Web3Service} from './web3.service';
import {Observable} from 'rxjs/Observable';
import {BigNumber} from 'bignumber.js';
import {TravelkoinController, TravelkoinMiniMeToken, TravelkoinNormalSale} from '../types';
import {environment} from '../../environments/environment';
import {W3} from 'soltsice';
import TransactionResult = W3.TX.TransactionResult;
import TxParams = W3.TX.TxParams;

@Injectable()
export class TokenContractService {
    private crowdsaleContract: TravelkoinNormalSale;
    private travelkoinTokenContract: TravelkoinMiniMeToken;
    private travelkoinController: TravelkoinController;

    getTravelkoinNormalSale(): Observable<TravelkoinNormalSale> {
        let result: Observable<TravelkoinNormalSale>;

        if (this.crowdsaleContract != null) {
            result = Observable.of(this.crowdsaleContract);
        } else {
            if (this.web3Service.getW3() != null) {
                result = Observable.fromPromise(TravelkoinNormalSale.At(environment.contracts.TravelkoinNormalSale, this.web3Service.getW3()))
                    .map((token: TravelkoinNormalSale) => {
                        this.crowdsaleContract = token;
                        return token;
                    });
            } else {
                const error = 'CODE.NOT_CONNECTED';
                console.error(error);
                result = Observable.throw(error);
            }
        }

        return result;
    }

    getTravelkoinMiniMeToken(): Observable<TravelkoinMiniMeToken> {
        let result: Observable<TravelkoinMiniMeToken>;

        if (this.travelkoinTokenContract != null) {
            result = Observable.of(this.travelkoinTokenContract);
        } else {
            if (this.web3Service.getW3() != null) {
                result = Observable.fromPromise(TravelkoinMiniMeToken.At(environment.contracts.TravelkoinMiniMeToken, this.web3Service.getW3()))
                    .map((token: TravelkoinMiniMeToken) => {
                        this.travelkoinTokenContract = token;
                        return token;
                    });
            } else {
                const error = 'CODE.NOT_CONNECTED';
                console.error(error);
                result = Observable.throw(error);
            }
        }

        return result;
    }

    getTravelkoinController(): Observable<TravelkoinController> {
        let result: Observable<TravelkoinController>;

        if (this.travelkoinController != null) {
            result = Observable.of(this.travelkoinController);
        } else {
            if (this.web3Service.getW3() != null) {
                result = Observable.fromPromise(TravelkoinController.At(environment.contracts.TravelkoinController, this.web3Service.getW3()))
                    .map((token: TravelkoinController) => {
                        this.travelkoinController = token;
                        return token;
                    });
            } else {
                const error = 'CODE.NOT_CONNECTED';
                console.error(error);
                result = Observable.throw(error);
            }
        }

        return result;
    }

    // ================== SALE FEATURES ==================
    hasStarted(): Observable<boolean> {
        return this.getTravelkoinNormalSale().switchMap((ti: TravelkoinNormalSale) => Observable.fromPromise(ti.hasStarted()));
    }

    minContribution(): Observable<BigNumber> {
        return this.getTravelkoinNormalSale().switchMap((ti: TravelkoinNormalSale) => Observable.fromPromise(ti.minContribution()));
    }

    howMuchCanXContributeNow(account: string): Observable<BigNumber> {
        return this.getTravelkoinNormalSale().switchMap((ti: TravelkoinNormalSale) => Observable.fromPromise(ti.howMuchCanXContributeNow(account)));
    }

    getSaleDayNow(): Observable<BigNumber> {
        return this.getTravelkoinNormalSale().switchMap((ti: TravelkoinNormalSale) => Observable.fromPromise(ti.getSaleDayNow()));
    }

    getContributors(): Observable<Array<string>> {
        return this.getTravelkoinNormalSale().switchMap((ti: TravelkoinNormalSale) => Observable.fromPromise(ti.getContributors()));
    }

    balance(): Observable<BigNumber> {
        return this.getTravelkoinNormalSale().switchMap((ti: TravelkoinNormalSale) => Observable.fromPromise(ti.getTravelkoinBalance()));
    }

    hasEnded(): Observable<boolean> {
        return this.getTravelkoinNormalSale().switchMap((ti: TravelkoinNormalSale) => Observable.fromPromise(ti.hasEnded()));
    }

    startTime(): Observable<BigNumber> {
        return this.getTravelkoinNormalSale().switchMap((ti: TravelkoinNormalSale) => Observable.fromPromise(ti.startTime()));
    }

    endTime(): Observable<BigNumber> {
        return this.getTravelkoinNormalSale().switchMap((ti: TravelkoinNormalSale) => Observable.fromPromise(ti.endTime()));
    }

    tokenSold(): Observable<BigNumber> {
        return this.getTravelkoinNormalSale().switchMap((ti: TravelkoinNormalSale) => Observable.fromPromise(ti.tokenSold()));
    }

    tokenBalance(): Observable<BigNumber> {
        return this.getTravelkoinNormalSale().switchMap((ti: TravelkoinNormalSale) => Observable.fromPromise(ti.tokenBalance()));
    }

    stakesPerUser(address: string): Observable<BigNumber> {
        return this.getTravelkoinNormalSale().switchMap((ti: TravelkoinNormalSale) => Observable.fromPromise(ti.stakesPerUser(address)));
    }

    weiRaised(): Observable<BigNumber> {
        return this.getTravelkoinNormalSale().switchMap((ti: TravelkoinNormalSale) => Observable.fromPromise(ti.weiRaised()));
    }

    crowdsaleAddress(): Observable<string> {
        return this.getTravelkoinNormalSale().map((ti: TravelkoinNormalSale) => ti.address);
    }

    rate(): Observable<BigNumber> {
        return this.getTravelkoinNormalSale().switchMap((ti: TravelkoinNormalSale) => Observable.fromPromise(ti.rate()));
    }

    cap(): Observable<BigNumber> {
        return this.getTravelkoinNormalSale().switchMap((ti: TravelkoinNormalSale) => Observable.fromPromise(ti.cap()));
    }

    travelkoinBalance(): Observable<BigNumber> {
        return this.getTravelkoinNormalSale().switchMap((ti: TravelkoinNormalSale) => Observable.fromPromise(ti.getTravelkoinBalance()));
    }

    listenToEvents(): Observable<Array<W3.Log>> {
        return this.getTravelkoinNormalSale().switchMap((ti: TravelkoinNormalSale) => Observable.fromPromise(ti.getLogs(0)));
    }

    setTimes(account: string, startTime: number, endTime: number): Observable<TransactionResult> {
        return this.getTravelkoinNormalSale().switchMap((ti: TravelkoinNormalSale) => {
            const tx: TxParams = {
                from: account,
                gas: 40000,
                gasPrice: 4000000000,
                value: 0
            };
            return Observable.fromPromise(ti.setTimes(startTime, endTime, tx));
        });
    }

    setWhitelist(owner: string, add: Array<string>, remove: Array<string>): Observable<TransactionResult> {
        return this.getTravelkoinNormalSale().switchMap((ti: TravelkoinNormalSale) => {
            const tx: TxParams = {
                from: owner,
                gas: 40000,
                gasPrice: 4000000000,
                value: 0
            };
            return Observable.fromPromise(ti.setWhitelist(add, remove, [0.1], tx));
        });
    }

    setDefaultAccount(): Observable<string> {
        return this.web3Service.setDefaultAccount()
            .switchMap((account: string) => {
                let result: Observable<string | null>;

                if (account != null) {
                    result = this.getTravelkoinNormalSale()
                        .map((ti: TravelkoinNormalSale) => {
                            ti.w3.web3.defaultAccount = account;
                            return account;
                        });
                } else {
                    result = Observable.throw('No account could be found.');
                }

                return result;
            });
    }

    buyTokens(beneficiary: string, amountInEther: number): Observable<TransactionResult> {
        const amountInWei: BigNumber = this.web3Service.etherToWei(amountInEther);
        const tx: TxParams = {
            from: beneficiary,
            gas: 300000,
            gasPrice: 4000000000,
            value: amountInWei
        };
        return this.getTravelkoinNormalSale().switchMap((ti: TravelkoinNormalSale) => {
            return Observable.fromPromise(ti.buyTokens(beneficiary, tx));
        });
    }

    // ================== TOKEN FEATURES ==================
    balanceOf(account: string): Observable<BigNumber> {
        return this.getTravelkoinMiniMeToken().switchMap((ti: TravelkoinMiniMeToken) => Observable.fromPromise(ti.balanceOf(account)));
    }

    totalSupply(): Observable<BigNumber> {
        return this.getTravelkoinMiniMeToken().switchMap((ti: TravelkoinMiniMeToken) => Observable.fromPromise(ti.totalSupply()));
    }

    tokenAddress(): Observable<string> {
        return this.getTravelkoinMiniMeToken().map((ti: TravelkoinMiniMeToken) => ti.address);
    }

    // ================== CONTROLLER FEATURES ==================
    isCrowdsaleOpen(): Observable<boolean> {
        return this.getTravelkoinController().switchMap((ti: TravelkoinController) => Observable.fromPromise(ti.isCrowdsaleOpen()));
    }

    bountySupply(): Observable<BigNumber> {
        return this.getTravelkoinController().switchMap((ti: TravelkoinController) => Observable.fromPromise(ti.TOKEN_BOUNTY()));
    }

    communitySupply(): Observable<BigNumber> {
        return this.getTravelkoinController().switchMap((ti: TravelkoinController) => Observable.fromPromise(ti.TOKEN_COMMUNITY()));
    }

    teamSupply(): Observable<BigNumber> {
        return this.getTravelkoinController().switchMap((ti: TravelkoinController) => Observable.fromPromise(ti.TOKEN_TEAM()));
    }

    founderSupply(): Observable<BigNumber> {
        return this.getTravelkoinController().switchMap((ti: TravelkoinController) => Observable.fromPromise(ti.TOKEN_FOUNDERS()));
    }

    earlyContributorSupply(): Observable<BigNumber> {
        return this.getTravelkoinController().switchMap((ti: TravelkoinController) => Observable.fromPromise(ti.TOKEN_EARLY_CONTRIBUTORS()));
    }

    threeMonthHODLSupply(): Observable<BigNumber> {
        return this.getTravelkoinController().switchMap((ti: TravelkoinController) => Observable.fromPromise(ti.TOKEN_HODL_3M()));
    }

    sixMonthHODLSupply(): Observable<BigNumber> {
        return this.getTravelkoinController().switchMap((ti: TravelkoinController) => Observable.fromPromise(ti.TOKEN_HODL_6M()));
    }

    nineMonthHODLSupply(): Observable<BigNumber> {
        return this.getTravelkoinController().switchMap((ti: TravelkoinController) => Observable.fromPromise(ti.TOKEN_HODL_9M()));
    }

    saleSupply(): Observable<BigNumber> {
        return this.getTravelkoinController().switchMap((ti: TravelkoinController) => Observable.fromPromise(ti.TOKEN_SALE1_NORMAL()));
    }

    vestingTeamDuration(): Observable<BigNumber> {
        return this.getTravelkoinController().switchMap((ti: TravelkoinController) => Observable.fromPromise(ti.VESTING_TEAM_DURATION()));
    }

    vestingTeamCliff(): Observable<BigNumber> {
        return this.getTravelkoinController().switchMap((ti: TravelkoinController) => Observable.fromPromise(ti.VESTING_TEAM_CLIFF()));
    }

    vestingAdvisorsDuration(): Observable<BigNumber> {
        return this.getTravelkoinController().switchMap((ti: TravelkoinController) => Observable.fromPromise(ti.VESTING_ADVISOR_DURATION()));
    }

    vestingAdvisorsCliff(): Observable<BigNumber> {
        return this.getTravelkoinController().switchMap((ti: TravelkoinController) => Observable.fromPromise(ti.VESTING_ADVISOR_CLIFF()));
    }

    constructor(private web3Service: Web3Service) {
    }

}
