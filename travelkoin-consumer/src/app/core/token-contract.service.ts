import {Injectable} from '@angular/core';
import {Web3Service} from './web3.service';
import {Observable} from 'rxjs/Observable';
import {BigNumber} from 'bignumber.js';
import {TravelkoinController, TravelkoinMiniMeToken, TravelkoinNormalSale} from '../types';
import {environment} from '../../environments/environment';

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
            if (this.web3Service.getWeb3() != null) {
                result = Observable.fromPromise(TravelkoinNormalSale.At(environment.contracts.TravelkoinNormalSale, this.web3Service.getWeb3()))
                    .map((token: TravelkoinNormalSale) => {this.crowdsaleContract = token; return token;});
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
            if (this.web3Service.getWeb3() != null) {
                result = Observable.fromPromise(TravelkoinMiniMeToken.At(environment.contracts.TravelkoinMiniMeToken, this.web3Service.getWeb3()))
                    .map((token: TravelkoinMiniMeToken) => {this.travelkoinTokenContract = token; return token;});
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
            if (this.web3Service.getWeb3() != null) {
                result = Observable.fromPromise(TravelkoinController.At(environment.contracts.TravelkoinController, this.web3Service.getWeb3()))
                    .map((token: TravelkoinController) => {this.travelkoinController = token; return token;});
            } else {
                const error = 'CODE.NOT_CONNECTED';
                console.error(error);
                result = Observable.throw(error);
            }
        }

        return result;
    }

    hasStarted(): Observable<boolean> {
        return this.getTravelkoinNormalSale().switchMap((ti: TravelkoinNormalSale) => Observable.fromPromise(ti.hasStarted()));
    }

    minContribution(): Observable<BigNumber> {
        return this.getTravelkoinNormalSale().switchMap((ti: TravelkoinNormalSale) => Observable.fromPromise(ti.minContribution()));
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

    crowdsaleAddress(): Observable<string> {
        return this.getTravelkoinNormalSale().map((ti: TravelkoinNormalSale) => ti.address);
    }

    totalSupply(): Observable<BigNumber> {
        return this.getTravelkoinMiniMeToken().switchMap((ti: TravelkoinMiniMeToken) => Observable.fromPromise(ti.totalSupply()));
    }

    isCrowdsaleOpen(): Observable<boolean> {
        return this.getTravelkoinController().switchMap((ti: TravelkoinController) => Observable.fromPromise(ti.isCrowdsaleOpen()));
    }

    tokenAddress(): Observable<string> {
        return this.getTravelkoinMiniMeToken().map((ti: TravelkoinMiniMeToken) => ti.address);
    }

    constructor(private web3Service: Web3Service) {
    }

}
