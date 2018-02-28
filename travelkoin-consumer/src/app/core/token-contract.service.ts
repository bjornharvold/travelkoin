import {Injectable} from '@angular/core';
import {Web3Service} from './web3.service';
import {Observable} from 'rxjs/Observable';
import {BigNumber} from 'bignumber.js';
import {TravelkoinCrowdsale, TravelkoinToken} from '../types';
import {environment} from '../../environments/environment';
import {W3} from 'soltsice';
import TransactionResult = W3.TX.TransactionResult;
import TxParams = W3.TX.TxParams;

@Injectable()
export class TokenContractService {
    private crowdsaleContract: TravelkoinCrowdsale;
    private travelkoinTokenContract: TravelkoinToken;

    getTravelkoinCrowdsale(): Observable<TravelkoinCrowdsale> {
        let result: Observable<TravelkoinCrowdsale>;

        if (this.crowdsaleContract != null) {
            result = Observable.of(this.crowdsaleContract);
        } else {
            if (this.web3Service.getW3() != null) {
                result = Observable.fromPromise(TravelkoinCrowdsale.At(environment.contracts.TravelkoinCrowdsale, this.web3Service.getW3()))
                    .map((token: TravelkoinCrowdsale) => {
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

    getTravelkoinToken(): Observable<TravelkoinToken> {
        let result: Observable<TravelkoinToken>;

        if (this.travelkoinTokenContract != null) {
            result = Observable.of(this.travelkoinTokenContract);
        } else {
            if (this.web3Service.getW3() != null) {
                result = Observable.fromPromise(TravelkoinToken.At(environment.contracts.TravelkoinToken, this.web3Service.getW3()))
                    .map((token: TravelkoinToken) => {
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

    minContribution(): Observable<BigNumber> {
        return this.getTravelkoinCrowdsale().switchMap((ti: TravelkoinCrowdsale) => Observable.fromPromise(ti.minContribution()));
    }

    dayOneMaxContribution(): Observable<BigNumber> {
        return this.getTravelkoinCrowdsale().switchMap((ti: TravelkoinCrowdsale) => Observable.fromPromise(ti.dayOneMaxContribution()));
    }

    howMuchCanIContributeNow(owner: string): Observable<BigNumber> {
        return this.getTravelkoinCrowdsale().switchMap((ti: TravelkoinCrowdsale) => {
            const tx: any = {
                from: owner
            };
            return Observable.fromPromise(ti.howMuchCanIContributeNow(tx));
        });
    }

    startTime(): Observable<BigNumber> {
        return this.getTravelkoinCrowdsale().switchMap((ti: TravelkoinCrowdsale) => Observable.fromPromise(ti.openingTime()));
    }

    endTime(): Observable<BigNumber> {
        return this.getTravelkoinCrowdsale().switchMap((ti: TravelkoinCrowdsale) => Observable.fromPromise(ti.closingTime()));
    }

    stakesPerUser(address: string): Observable<BigNumber> {
        return this.getTravelkoinCrowdsale().switchMap((ti: TravelkoinCrowdsale) => Observable.fromPromise(ti.balances(address)));
    }

    weiRaised(): Observable<BigNumber> {
        return this.getTravelkoinCrowdsale().switchMap((ti: TravelkoinCrowdsale) => Observable.fromPromise(ti.weiRaised()));
    }

    crowdsaleAddress(): Observable<string> {
        return this.getTravelkoinCrowdsale().map((ti: TravelkoinCrowdsale) => ti.address);
    }

    rate(): Observable<BigNumber> {
        return this.getTravelkoinCrowdsale().switchMap((ti: TravelkoinCrowdsale) => Observable.fromPromise(ti.rate()));
    }

    cap(): Observable<BigNumber> {
        return this.getTravelkoinCrowdsale().switchMap((ti: TravelkoinCrowdsale) => Observable.fromPromise(ti.cap()));
    }

    listenToEvents(): Observable<Array<W3.Log>> {
        return this.getTravelkoinCrowdsale().switchMap((ti: TravelkoinCrowdsale) => Observable.fromPromise(ti.getLogs(0)));
    }

    addToWhitelist(owner: string, beneficiary: string): Observable<TransactionResult> {
        return this.getTravelkoinCrowdsale().switchMap((ti: TravelkoinCrowdsale) => {
            const tx: TxParams = {
                from: owner,
                gas: 40000,
                gasPrice: 4000000000,
                value: 0
            };
            return Observable.fromPromise(ti.addToWhitelist(beneficiary, tx));
        });
    }

    addManyToWhitelist(owner: string, beneficiaries: Array<string>): Observable<TransactionResult> {
        return this.getTravelkoinCrowdsale().switchMap((ti: TravelkoinCrowdsale) => {
            const tx: TxParams = {
                from: owner,
                gas: 40000,
                gasPrice: 4000000000,
                value: 0
            };
            return Observable.fromPromise(ti.addManyToWhitelist(beneficiaries, tx));
        });
    }

    removeFromWhitelist(owner: string, beneficiary: string): Observable<TransactionResult> {
        return this.getTravelkoinCrowdsale().switchMap((ti: TravelkoinCrowdsale) => {
            const tx: TxParams = {
                from: owner,
                gas: 40000,
                gasPrice: 4000000000,
                value: 0
            };
            return Observable.fromPromise(ti.removeFromWhitelist(beneficiary, tx));
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
        return this.getTravelkoinCrowdsale().switchMap((ti: TravelkoinCrowdsale) => {
            return Observable.fromPromise(ti.buyTokens(beneficiary, tx));
        });
    }

    // ================== TOKEN FEATURES ==================
    balanceOf(account: string): Observable<BigNumber> {
        return this.getTravelkoinToken().switchMap((ti: TravelkoinToken) => Observable.fromPromise(ti.balanceOf(account)));
    }

    totalSupply(): Observable<BigNumber> {
        return this.getTravelkoinToken().switchMap((ti: TravelkoinToken) => Observable.fromPromise(ti.totalSupply()));
    }

    tokenAddress(): Observable<string> {
        return this.getTravelkoinToken().map((ti: TravelkoinToken) => ti.address);
    }

    constructor(private web3Service: Web3Service) {
    }

}
