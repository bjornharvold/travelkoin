import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {W3} from 'soltsice';
import 'rxjs/add/observable/bindCallback';
import 'rxjs/add/observable/bindNodeCallback';
import { BigNumber } from "bignumber.js";

// const Web3 = require('web3');

@Injectable()
export class Web3Service {
    private _w3: W3;
    private _provider: string;

    weiToEther(value: BigNumber): string {
        let result: string = null;
        // console.log(this.getWeb3().utils);
        // return this.getWeb3().utils.fromWei(value, 'ether');
        // console.log(value.dividedBy(1e18).toFormat(0));
        // console.log(typeof value.dividedBy(1e18).toFormat(0));
        if (value != null) {
            result= this.getW3().web3.fromWei(value, 'ether');
            // result = value.dividedBy(1e18).toFormat(8);
        }
        return result;
    }

    /**
     * Loads Ethereum's Web3 into the app
     * @returns {Web3}
     */
    getW3(): W3 {
        let result: W3 = null;

        if (this._w3 != null) {
            result = this._w3;
        } else {
            // Use Mist / MetaMask's provider
            result = this._w3 = new W3();
        }

        return result;
    }

    getProviderName(): string {
        let providerName = null;

        const w3: W3 = this.getW3();
        if (w3 != null) {
            // Checking if Web3 has been injected by the browser (Mist/MetaMask)
            this._provider = w3.currentProvider.constructor.name;

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

        const w3: W3 = this.getW3();
        if (w3 != null) {
            const callbackObservable = Observable.bindNodeCallback(this.getW3().eth.getBalance);
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

        const w3: W3 = this.getW3();
        if (w3 != null) {
            const callbackObservable = Observable.bindNodeCallback(w3.eth.getAccounts);
            result = callbackObservable();
        } else {
            result = Observable.throw('CODE.NOT_CONNECTED');
        }

        return result;
    }

    /**
     * Returns the default account making changes to the contract
     * @returns {Observable<Array<string>>}
     */
    get defaultAccount(): string {
        let result: string = null;

        const w3: W3 = this.getW3();
        if (w3 != null) {
            result = w3.eth.defaultAccount;
        }

        return result;
    }

    set defaultAccount(account: string) {
        const w3: W3 = this.getW3();
        if (w3 != null) {
            w3.web3.eth.defaultAccount = account;
        }
    }

    isConnected(): boolean {
        return this.getW3().web3.isConnected();
    }

    constructor() {
    }
}
