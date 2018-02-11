import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Web3Service} from '../../core/web3.service';
import {Observable} from 'rxjs/Observable';
import {TokenPurchase} from '../../model/TokenPurchase';
import {FormGroup} from '@angular/forms';
import {environment} from '../../../environments/environment';
import * as moment from 'moment';
import {TokenContractService} from '../../core/token-contract.service';
import { BigNumber } from "bignumber.js";
import {DateService} from '../../core/date.service';

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
    currentAccountBalanceWei: BigNumber;
    currentAccountBalanceEther: string = '0';
    form: FormGroup;
    startDate: moment.Moment;
    endDate: moment.Moment;
    status = null;
    started = false;
    ended = false;

    private getAccountBalance(account: string): void {
        this.web3Service.getAccountBalance(account)
            .takeWhile(() => this.alive)
            .subscribe((balance: any) => {
                    this.currentAccountBalanceWei = balance instanceof BigNumber ? balance as BigNumber : null;
                    this.currentAccountBalanceEther = Web3Service.weiToEther(this.currentAccountBalanceWei);
                },
                error => {
                    console.error(error);
                    this.status = 'CODE.ERROR';
                },
                () => {
                }
            );
    }

    private createFormObject(account: string): TokenPurchase {
        const receiver: string = environment.ethWalletAddress;
        return new TokenPurchase(this.startDate, this.endDate, account, receiver);
    }

    /**
     * Save start time
     */
    private startTime(): void {
        this.tokenContractService.startTime()
            .takeWhile(() => this.alive)
            .subscribe((startTime: BigNumber) => {
                    this.startDate = DateService.bigNumberToMoment(startTime);
                    console.log(this.startDate.format());
                }, error => this.status = 'CODE.ERROR',
                () => {
                }
            )
    }

    /**
     * Save end time
     */
    private endTime(): void {
        this.tokenContractService.endTime()
            .takeWhile(() => this.alive)
            .subscribe((endTime: BigNumber) => {
                    this.endDate = DateService.bigNumberToMoment(endTime);
                    console.log(this.endDate.format());
                }, error => this.status = 'CODE.ERROR',
                () => {
                }
            )
    }

    /**
     * Check to see if the token sale has started
     */
    private hasStarted(): void {
        this.tokenContractService.hasStarted()
            .takeWhile(() => this.alive)
            .subscribe((hasStarted: boolean) => {
                    this.started = hasStarted;
                }, error => this.status = 'CODE.ERROR',
                () => {
                }
            )
    }

    /**
     * Check to see if the token sale has ended
     */
    private hasEnded(): void {
        this.tokenContractService.hasEnded()
            .takeWhile(() => this.alive)
            .subscribe((hasEnded: boolean) => {
                    this.ended = hasEnded;
                }, error => this.status = 'CODE.ERROR',
                () => {
                }
            )
    }

    private retrieveAccounts(): void {
        this.web3Service.getAccounts()
            .takeWhile(() => this.alive)
            .subscribe((accounts) => {
                    this.accounts = accounts;

                    // populate the form
                    this.dto = this.createFormObject(accounts[0]);
                    this.dto.populateFormValues(this.form);

                    // check that the provider exists
                    this.provider = this.web3Service.getProviderName();
                    if (this.provider == null) {
                        this.status = 'CODE.NOT_CONNECTED';
                    }

                    // retrieve current account balance in Ether
                    this.getAccountBalance(accounts[0]);
                },
                error => this.status = 'CODE.ERROR',
                () => {
                }
            );
    }

    buyTokens(): void {
        // this.status = 'Initiating transaction... (please wait)';

        // this.tokenContractService.getTravelkoinNormalSale()
        //     .takeWhile(() => this.alive)
        //     .subscribe((tokenInstance: any) => {
        //             console.log(`Buying ${this.dto.amount} tokens...`);
        //         },
        //         error => this.status = error,
        //         () => {
        //         }
        //     );

    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.provider = this.web3Service.getProviderName();
        this.startTime();
        this.endTime();

        if (this.web3Service.isConnected()) {
            this.retrieveAccounts();
        } else {
            this.status = 'CODE.NOT_LOGGED_IN';
        }

        this.form = new FormGroup({});

        // check if event has started every 5 seconds
        Observable.interval(5000)
            .takeWhile(() => this.alive && this.started === false)
            .subscribe(() => {
                this.hasStarted();
                this.hasEnded();
            });
    }

    constructor(private web3Service: Web3Service,
                private tokenContractService: TokenContractService,
                private ngZone: NgZone) {
    }
}
