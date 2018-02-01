import {Injectable} from '@angular/core';
import Web3 from 'web3';
import {Subject} from 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';

declare let window: any;

@Injectable()
export class Web3Service {
    private web3: Web3;
    private accounts: string[];
    private _token: any;
    ready = false;
    accountsObservable = new Subject<string[]>();

    private refreshAccounts(): void {
        console.log('Refreshing accounts...');
        
        Observable.fromPromise(this.web3.eth.getAccounts())
            .subscribe((list: Array<any>) => {
                    if (list != null || list.length === 0) {

                        if (this.accounts == null || this.accounts.length !== list.length || this.accounts[0] !== list[0]) {
                            console.log('Observed new accounts');

                            this.accountsObservable.next(list);
                            this.accounts = list;
                        }

                        this.ready = true;
                    } else {
                        console.warn('Could not get any accounts! Make sure your Ethereum client is configured correctly.');
                    }
                },
                error => console.warn('There was an error fetching your accounts.'),
                () => {
                }
            );
    }

    bootstrapWeb3(): void {
        // Checking if Web3 has been injected by the browser (Mist/MetaMask)
        if (typeof window.web3 != null) {
            console.log('Found web3 provider');
            console.log(window.web3);

            // Use Mist / MetaMask's provider
            this.web3 = new Web3(window.web3.currentProvider);

            // Refresh account every 2 seconds
            Observable.timer(2000)
                .subscribe(() => {
                    this.refreshAccounts();
                });

            // load the contract
            Observable.fromPromise(System.import('../../assets/contracts/TravelkoinNormalSale.json'))
                .subscribe((contract: any) => {
                    if (this.web3 != null) {
                        const contractAbstraction = contract(contract);
                        contractAbstraction.setProvider(this.web3.currentProvider);
                        this._token = contractAbstraction;
                    }
                });
        } else {
            console.warn('You need to have Mist or MetaMask installed and use the right network.');
        }
    }

    get token(): any {
        return this._token;
    }

    constructor() {


    }
}
