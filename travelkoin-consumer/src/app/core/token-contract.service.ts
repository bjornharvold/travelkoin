import {Injectable} from '@angular/core';
import {Web3Service} from './web3.service';
import {Observable} from 'rxjs/Observable';
import {BigNumber} from 'bignumber.js';
import {TravelkoinNormalSale} from '../../types/TravelkoinNormalSale';

@Injectable()
export class TokenContractService {
    private _token: TravelkoinNormalSale;

    private getToken(): Observable<TravelkoinNormalSale> {
        let result: Observable<TravelkoinNormalSale>;

        if (this._token != null) {
            result = Observable.of(this._token);
        } else {
            if (this.web3Service.getWeb3() != null) {
                result = Observable.fromPromise(TravelkoinNormalSale.At('', this.web3Service.getWeb3()));
            } else {
                const error = 'You need to have the Mist browser or MetaMask installed and be on mainnet.';
                console.error(error);
                result = Observable.throw(error);
            }
        }

        return result;
    }

    hasStarted(): Observable<boolean> {
        return this.getToken().switchMap((ti: TravelkoinNormalSale) => Observable.fromPromise(ti.hasStarted()));
    }

    constructor(private web3Service: Web3Service) {
    }

}
