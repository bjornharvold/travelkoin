import {Injectable} from '@angular/core';
import {Provider} from 'web3/types';
import {Web3Service} from './web3.service';
import {Observable} from 'rxjs/Observable';
const contract = require('truffle-contract');


@Injectable()
export class TokenContractService {
    private _token: any;
    private _tokenInstance: any;

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
     * @param tokenContract
     * @param {Provider} provider
     * @returns {any}
     */
    private injectProvider(tokenContract: any, provider: Provider): any {
        // use truffle contract to load the JSON contract into an object
        const contractAbstraction = contract(tokenContract);
        contractAbstraction.setProvider(provider);
        this._token = contractAbstraction;

        return this._token;
    }

    /**
     * Loads the contracts into memory and returns the create contract
     * @param {Provider} provider
     * @returns {Observable<any>}
     */
    private initializeContract(provider: Provider): Observable<any> {
        return TokenContractService.loadContract()
            .map((contract: any) => this.injectProvider(contract, provider));
    }

    private getToken(): Observable<any> {
        let result: Observable<any>;

        if (this._token != null) {
            result = Observable.of(this._token);
        } else {
            if (this.web3Service.getWeb3() != null) {
                result = this.initializeContract(this.web3Service.getWeb3().currentProvider);
            } else {
                const error = 'You need to have the Mist browser or MetaMask installed and be on mainnet.';
                console.warn(error);
                result = Observable.throw(error);
            }
        }

        return result;
    }

    getTokenInstance(): Observable<any> {
        let result: Observable<any>;

        if (this._tokenInstance != null) {
            result = Observable.of(this._tokenInstance);
        } else {
            result = this.getToken()
                .switchMap((token: any) => Observable.fromPromise(token.deployed())
                    .map((tokenInstance: any) => {
                            this._tokenInstance = tokenInstance;
                            return this._tokenInstance;
                        }
                    )
                );
        }

        return result;
    }

    getStartDate(): void {
        this.getTokenInstance()
            .subscribe((ti: any) => {
                Observable.fromPromise(ti.hasStarted())
                    .subscribe((val: any) => {
                        console.log(val);
                    });
            });
    }

    constructor(private web3Service: Web3Service) {
    }

}
