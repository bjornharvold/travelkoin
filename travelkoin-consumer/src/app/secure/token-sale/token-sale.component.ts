import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Web3Service} from '../../core/web3.service';
import {Observable} from 'rxjs/Observable';
import {TokenPurchase} from '../../model/TokenPurchase';
import {FormGroup} from '@angular/forms';
import {DateService} from '../../core/date.service';
import {environment} from '../../../environments/environment';
import * as moment from 'moment';
import {TokenContractService} from '../../core/token-contract.service';

const GWEI: number = 1000000000000000000;

@Component({
    selector: 'app-secure-token-sale',
    templateUrl: './token-sale.component.html',
    styleUrls: ['./token-sale.component.scss']
})
export class TokenSaleComponent implements OnInit, OnDestroy {
    private alive = true;
    accounts: string[];
    provider: string;
    dto: TokenPurchase;
    currentAccountBalanceGwei: number = 0;
    currentAccountBalanceEther: string = '';
    form: FormGroup;
    startDate: moment.Moment;
    endDate: moment.Moment;
    status = null;
    started = false;

    private retrieveAccountBalance(account: string): void {
        this.web3Service.getAccountBalance(account)
            .takeWhile(() => this.alive)
            .subscribe((balance: number) => {
                    this.currentAccountBalanceGwei = balance;
                    this.currentAccountBalanceEther = '' + (balance / GWEI);
                },
                error => this.status = error,
                () => {
                }
            );
    }

    private createTokenPurchase(account: string): TokenPurchase {
        const receiver: string = environment.ethWalletAddress;
        return new TokenPurchase(this.startDate, this.endDate, account, receiver);
    }

    private retrieveCrowdsaleStartDate(): void {

    }

    private retrieveAccounts(): void {
        this.web3Service.getAccounts()
            .takeWhile(() => this.alive)
            .subscribe((accounts) => {
                    this.accounts = accounts;

                    // populate the form
                    this.dto = this.createTokenPurchase(accounts[0]);
                    this.dto.populateFormValues(this.form);

                    // check that the provider exists
                    this.provider = this.web3Service.getProviderName();
                    if (this.provider == null) {
                        this.status = 'You need to have the Mist browser or MetaMask plugin installed and be on mainnet.';
                    }

                    // retrieve current account balance in Ether
                    this.retrieveAccountBalance(accounts[0]);
                },
                error => this.status = error,
                () => {
                }
            );
    }

    buyTokens(): void {
        this.status = 'Initiating transaction... (please wait)';

        this.tokenContractService.getTokenInstance()
            .takeWhile(() => this.alive)
            .subscribe((tokenInstance: any) => {
                    console.log(`Buying ${this.dto.amount} tokens...`);
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

        this.form = new FormGroup({});

        this.startDate = DateService.utcToMoment(environment.eventStartDate);
        this.endDate = DateService.utcToMoment(environment.eventEndDate);

        // check if event has started every 5 seconds
        Observable.interval(5000)
            .takeWhile(() => this.alive && this.started === false)
            .subscribe(() => {

                const now = DateService.getInstanceOfNow();
                this.started = DateService.isSameOrAfter(now, this.startDate) && DateService.isSameOrBefore(now, this.endDate);
            });
    }

    constructor(private web3Service: Web3Service,
                private tokenContractService: TokenContractService,
                private ngZone: NgZone) {
    }
}
