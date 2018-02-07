import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Provider} from 'web3/types';
import {WindowRefService} from './window-ref.service';

const Web3 = require('web3');

@Injectable()
export class Web3Service {
    private _web3: any;
    private _token: any;
    private provider: string;

    /**
     * Loads the json contract from a source file
     * @returns {Observable<any>}
     */
    private static loadContract(): Observable<any> {
        // load the contract
        return Observable.fromPromise(System.import('../../assets/contracts/TravelkoinNormalSale.json'));
    }

    /**
     * Injects the web3 provider we want to use
     * @param contract
     * @param {Provider} provider
     * @returns {any}
     */
    private injectProvider(contract: any, provider: Provider): any {
        // use truffle contract to load the JSON contract into an object
        const contractAbstraction = contract(contract);
        contractAbstraction.setProvider(provider);
        this._token = contractAbstraction;

        return this._token;
    }

    private set web3(web3: any) {
        this._web3 = web3;
    }

    /**
     * Loads Ethereum's Web3 into the app
     * @returns {Web3}
     */
    private get web3(): any {
        let result: any = null;

        if (this._web3 != null) {
            result = this._web3;
        } else if (typeof this.windowRefService.nativeWindow.web3 != null) {
            // Checking if Web3 has been injected by the browser (Mist/MetaMask)
            this.provider = this.windowRefService.nativeWindow.web3.currentProvider.constructor.name;

            // Use Mist / MetaMask's provider
            this.web3 = new Web3(this.windowRefService.nativeWindow.web3.currentProvider);

            // recursive call here
            result = this.web3;
        }

        return result;
    }

    /**
     * Loads the contracts into memory and returns the create contract
     * @param {Provider} provider
     * @returns {Observable<any>}
     */
    private initializeContract(provider: Provider): Observable<any> {
        return Web3Service.loadContract()
            .map((contract: any) => this.injectProvider(contract, provider));
    }

    getProviderName(): string {
        let providerName = 'UNKNOWN';

        if (this.provider === 'MetamaskInpageProvider') {
            providerName = 'METAMASK';
        } else if (this.provider === 'EthereumProvider') {
            providerName = 'MIST';
        } else if (this.provider === 'o') {
            providerName = 'PARITY';
        }

        return providerName
    }

    getAccounts(): Observable<Array<any>> {
        return Observable.fromPromise(this.web3.eth.getAccounts());
    }

    getToken(): Observable<any> {
        let result: Observable<any>;

        if (this._token != null) {
            result = Observable.of(this._token);
        } else {
            if (this.web3 != null) {
                result = this.initializeContract(this.web3.currentProvider);
            } else {
                const error = 'You need to have the Mist browser or MetaMask installed and use the right network.';
                console.warn(error);
                result = Observable.throw(error);
            }
        }

        return result;
    }

    constructor(private windowRefService: WindowRefService) {
    }
}
