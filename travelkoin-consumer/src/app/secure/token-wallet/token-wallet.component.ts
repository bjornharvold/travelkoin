import {AfterViewInit, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Web3Service} from '../../core/web3.service';
import {Observable} from 'rxjs/Observable';
import {TokenPurchase} from '../../model/TokenPurchase';
import {FormGroup} from '@angular/forms';
import {DateService} from '../../core/date.service';
import {environment} from '../../../environments/environment';
import * as moment from 'moment';
import {TokenContractService} from '../../core/token-contract.service';

@Component({
    selector: 'app-secure-token-wallet',
    templateUrl: './token-wallet.component.html',
    styleUrls: ['./token-wallet.component.scss']
})
export class TokenWalletComponent implements OnInit, OnDestroy {
    private alive = true;
    accounts: string[];
    provider: string;
    currentAccountBalanceWei: number = 0;
    currentAccountBalanceEther: string = '';
    currentTokenBalance: number = 0;
    form: FormGroup;
    startDate: moment.Moment;
    endDate: moment.Moment;
    status = null;
    started = false;
    error: string = null;

    /**
     * Execute method on contract to retrieve token balance
     * @param tokenInstance
     * @param {string} account
     */
    private getTokenBalance(tokenInstance: any, account: string): void {
        console.log(tokenInstance);
        Observable.fromPromise(tokenInstance.getBalance.call(account))
            .takeWhile(() => this.alive)
            .subscribe((balance: number) => {
                    this.currentTokenBalance = balance;
                },
                error => this.status = error,
                () => {
                }
            );
    }

    /**
     * Retrieve the instantiated version of the oken contract
     * @param {string} account
     */
    private getTokenInstance(account: string): void {
        this.tokenContractService.getTokenInstance()
            .takeWhile(() => this.alive)
            .subscribe((tokenInstance: any) => {
                    this.getTokenBalance(tokenInstance, account);
                },
                error => this.status = error,
                () => {
                }
            );
    }

    /**
     * Grab the active account from Ethereum provider
     */
    private retrieveAccounts(): void {
        this.web3Service.getAccounts()
            .takeWhile(() => this.alive)
            .subscribe((accounts) => {
                    this.accounts = accounts;
                    this.getTokenInstance(accounts[0]);
                },
                error => this.status = error,
                () => {
                }
            );
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.retrieveAccounts();
    }

    constructor(private web3Service: Web3Service,
                private tokenContractService: TokenContractService,
                private ngZone: NgZone) {
    }
}
