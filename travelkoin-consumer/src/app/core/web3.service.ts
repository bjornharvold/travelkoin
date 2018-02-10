import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {WindowRefService} from './window-ref.service';
import { W3 } from "soltsice";
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
        if (web3 == null) {
            result = Observable.throw('You need to have the Mist browser or MetaMask installed and be on mainnet.');
        } else {
            result = Observable.fromPromise(this.getWeb3().eth.getBalance(account));
        }

        return result;
    }

    getAccounts(): Observable<Array<any>> {
        let result: Observable<Array<any>>;

        const web3: W3 = this.getWeb3();
        if (web3 == null) {
            result = Observable.throw('You need to have the Mist browser or MetaMask installed and be on mainnet.');
        } else {
            result = Observable.fromPromise(this.getWeb3().eth.getAccounts());
        }

        return result;
    }

    constructor(private windowRefService: WindowRefService) {
    }
}
