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
    selector: 'app-secure-token-contract',
    templateUrl: './token-contract.component.html',
    styleUrls: ['./token-contract.component.scss']
})
export class TokenContractComponent implements OnInit, OnDestroy, AfterViewInit {
    private alive = true;
    accounts: string[];
    provider: string;
    dto: TokenPurchase;
    currentAccountBalanceWei: number = 0;
    currentAccountBalanceEther: string = '';
    currentTokenBalance: number = 0;
    form: FormGroup;
    startDate: moment.Moment;
    endDate: moment.Moment;
    status = null;
    started = false;

    private retrieveTokenBalance(tokenInstance: any, account: string): void {
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

    private retrieveAccountBalance(account: string): void {
        this.web3Service.getAccountBalance(account)
            .takeWhile(() => this.alive)
            .subscribe((balance: number) => {
                    this.currentAccountBalanceWei = balance;
                    this.currentAccountBalanceEther = '' + (balance / 1000000000000000000);
                },
                error => this.status = error,
                () => {
                }
            );
    }

    private refreshTokenBalance(account: string): void {
        this.tokenContractService.getTokenInstance()
            .takeWhile(() => this.alive)
            .subscribe((tokenInstance: any) => {
                    this.retrieveTokenBalance(tokenInstance, account);
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

    private retrieveAccounts(): void {
        this.web3Service.getAccounts()
            .takeWhile(() => this.alive)
            .subscribe((accounts) => {
                    this.accounts = accounts;
                    this.dto = this.createTokenPurchase(accounts[0]);
                    this.refreshTokenBalance(accounts[0]);
                    this.retrieveAccountBalance(accounts[0]);
                    this.dto.populateFormValues(this.form);
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
                    Observable.fromPromise(tokenInstance.deployed())
                        .takeWhile(() => this.alive)
                        .subscribe((token: any) => {
                                console.log(`Buying ${this.dto.amount} tokens...`);
                            },
                            error => this.status = error,
                            () => {
                            }
                        );
                },
                error => this.status = error,
                () => {
                }
            );
    }

    ngOnDestroy() {
        this.alive = false;
    }

    // web3 MetaMask should be injected by now
    ngAfterViewInit(): void {

        // this.retrieveAccounts();
    }

    ngOnInit() {

        this.provider = this.web3Service.getProviderName();
        if (this.provider == null) {
            this.status = 'You need to have the Mist browser or MetaMask plugin installed and be on mainnet.';
        }

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
