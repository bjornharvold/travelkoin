import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {W3} from 'soltsice';
import 'rxjs/add/observable/bindCallback';
import 'rxjs/add/observable/bindNodeCallback';
import { BigNumber } from "bignumber.js";

// const Web3 = require('web3');

@Injectable()
export class Web3Service {
    private _web3: W3;
    private _provider: string;

    /**
     * Loads Ethereum's Web3 into the app
     * @returns {Web3}
     */
    getWeb3(): W3 {
        let result: W3 = null;

        if (this._web3 != null) {
            result = this._web3;
        } else {
            // Use Mist / MetaMask's provider
            result = this._web3 = new W3();
        }

        return result;
    }

    getProviderName(): string {
        let providerName = null;

        const web3: W3 = this.getWeb3();
        if (web3 != null) {
            // Checking if Web3 has been injected by the browser (Mist/MetaMask)
            this._provider = web3.currentProvider.constructor.name;

            if (this._provider === 'MetamaskInpageProvider') {
                providerName = 'METAMASK';
            } else if (this._provider === 'EthereumProvider') {
                providerName = 'MIST';
            } else if (this._provider === 'o') {
                providerName = 'PARITY';
            }
        }

        return providerName
    }

    getAccountBalance(account: string): Observable<number> {
        let result: Observable<number>;

        const web3: W3 = this.getWeb3();
        if (web3 != null) {
            const callbackObservable = Observable.bindNodeCallback(this.getWeb3().eth.getBalance);
            result = callbackObservable(account, 'latest');
            // result = Observable.of(10000000000000000);
            // result = Observable.fromPromise(this.getWeb3().eth.getBalance(account));

        } else {
            result = Observable.throw('CODE.NOT_CONNECTED');
        }

        return result;
    }

    /**
     * Returns a list of ethereum addresses. Notice the methods we are using requires that we bind to a callback function to make it work
     * @returns {Observable<Array<string>>}
     */
    getAccounts(): Observable<Array<string>> {
        let result: Observable<Array<string>>;

        const web3: W3 = this.getWeb3();
        if (web3 != null) {
            const callbackObservable = Observable.bindNodeCallback(this.getWeb3().eth.getAccounts);
            result = callbackObservable();
        } else {
            result = Observable.throw('CODE.NOT_CONNECTED');
        }

        return result;
    }

    weiToEther(value: BigNumber): string {
        // console.log(this.getWeb3().utils);
        // return this.getWeb3().utils.fromWei(value, 'ether');
        // console.log(value.dividedBy(1e18).toFormat(0));
        // console.log(typeof value.dividedBy(1e18).toFormat(0));
        return value.dividedBy(1e18).toFormat(8);
    }
    isConnected(): boolean {
        return true;
    }

    constructor() {
    }
}
