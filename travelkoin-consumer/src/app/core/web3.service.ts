import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {W3} from 'soltsice';
import 'rxjs/add/observable/bindCallback';
import 'rxjs/add/observable/bindNodeCallback';
import {BigNumber} from 'bignumber.js';

// const Web3 = require('web3');

@Injectable()
export class Web3Service {
    private _w3: W3;
    private _provider: string;

    weiToEther(value: BigNumber): BigNumber {
        let result: BigNumber = null;
        if (value != null) {
            result = this.getW3().web3.fromWei(value, 'ether');
        }

        console.log(`weiToEther result is BigNumber: ${result instanceof BigNumber}`);
        console.log(`weiToEther result is string: ${typeof result === 'string'}`);
        return result;
    }

    etherToWei(value: number | BigNumber): BigNumber {
        let result: BigNumber = null;
        if (value != null) {
            result = this.getW3().web3.toWei(value, 'ether');
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
            this._provider = w3.web3.currentProvider.constructor.name;

            // console.log(`Using provider: ${this._provider}`);
            if (this._provider === 'MetamaskInpageProvider' || this._provider === 'f') {
                providerName = 'METAMASK';
            } else if (this._provider === 'EthereumProvider') {
                providerName = 'MIST';
            } else if (this._provider === 'o') {
                providerName = 'PARITY';
            }
        } else {
            console.error('No W3');
        }

        return providerName
    }

    getAccountBalance(account: string): Observable<number> {
        let result: Observable<number>;

        const w3: W3 = this.getW3();
        if (w3 != null) {
            const eth: W3.Eth = w3.web3.eth;
            const callbackObservable = Observable.bindNodeCallback(eth.getBalance);
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
            const eth: W3.Eth = w3.web3.eth;
            const callbackObservable = Observable.bindNodeCallback(eth.getAccounts);
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
    getDefaultAccount(): string {
        let result: string = null;

        const w3: W3 = this.getW3();
        if (w3 != null) {
            result = w3.web3.eth.defaultAccount;
        }

        return result;
    }

    /**
     * Sets the main account holder as the default account
     * @returns {Observable<string>}
     */
    setDefaultAccount(): Observable<string> {
        return this.getAccounts()
            .switchMap((accounts: Array<string>) => {
                let result: Observable<string>;
                if (accounts != null && accounts.length > 0) {
                    this.getW3().web3.eth.defaultAccount = accounts[0];
                    result = Observable.of(accounts[0]);
                } else {
                    result = Observable.throw('No account could be found');
                }
                return result;
            });

    }

    isConnected(): boolean {
        return this.getW3().web3.isConnected();
    }

    constructor() {
    }
}
