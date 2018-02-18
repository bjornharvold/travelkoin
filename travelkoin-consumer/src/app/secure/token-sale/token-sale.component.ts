import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Web3Service} from '../../core/web3.service';
import {Observable} from 'rxjs/Observable';
import {TokenPurchase} from '../../model/TokenPurchase';
import {FormGroup} from '@angular/forms';
import * as moment from 'moment';
import {TokenContractService} from '../../core/token-contract.service';
import {BigNumber} from 'bignumber.js';
import {DateService} from '../../core/date.service';
import {W3} from 'soltsice';
import TransactionResult = W3.TX.TransactionResult;

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
    error = null;
    hasStarted = false;
    loading = false;
    hasEnded = false;
    isCrowdsaleOpen = false;

    private getAccountBalance(account: string): void {
        this.web3Service.getAccountBalance(account)
            .takeWhile(() => this.alive)
            .subscribe((balance: any) => {
                    this.currentAccountBalanceWei = balance;
                    this.currentAccountBalanceEther = this.web3Service.weiToEther(balance);
                },
                error => {
                    console.error(error);
                    this.error = 'CODE.ERROR';
                },
                () => {
                }
            );
    }

    /**
     * Save start time
     */
    private startTime(): void {
        this.tokenContractService.startTime()
            .takeWhile(() => this.alive)
            .subscribe((startTime: BigNumber) => {
                    this.startDate = DateService.bigNumberToMoment(startTime);
                    this.dto.updateValidator(this.form, this.startDate);

                    // console.log(this.startDate.format());
                }, error => {
                    console.error(error);
                    this.error = 'CODE.ERROR';
                },
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
                    // console.log(this.endDate.format());
                }, error => {
                    console.error(error);
                    this.error = 'CODE.ERROR';
                },
                () => {
                }
            )
    }

    /**
     * Check to see if the token sale has ended
     */
    private hasCrowdsaleEnded(): void {
        this.tokenContractService.hasEnded()
            .takeWhile(() => this.alive)
            .subscribe((isClosed: boolean) => {
                    this.hasEnded = isClosed;

                    if (this.hasEnded === false) {
                        this.hasCrowdsaleStarted();
                    }
                }, error => {
                    console.error(error);
                    this.error = 'CODE.ERROR';
                },
                () => {
                }
            )
    }

    /**
     * Check to see if the token sale has ended
     */
    private hasCrowdsaleStarted(): void {
        this.tokenContractService.hasStarted()
            .takeWhile(() => this.alive)
            .subscribe((isOpen: boolean) => {
                    this.hasStarted = isOpen;
                }, error => {
                    console.error(error);
                    this.error = 'CODE.ERROR';
                },
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
                    this.dto = new TokenPurchase(accounts[0]);
                    this.dto.populateFormValues(this.form);

                    // check that the provider exists
                    this.provider = this.web3Service.getProviderName();
                    if (this.provider == null) {
                        this.status = 'CODE.NOT_CONNECTED';
                    }

                    // retrieve current account balance in Ether
                    this.getAccountBalance(accounts[0]);
                },
                error => {
                    console.error(error);
                    this.error = 'CODE.ERROR';
                },
                () => {
                }
            );
    }

    buyTokens(): void {
        this.loading = true;
        this.error = null;
        this.status = 'TOKEN_CONTRACT.INITIATING_TRANSACTION';

        this.dto.updateFromFormValues(this.form);
        this.tokenContractService.buyTokens(this.dto.account, this.dto.amount)
            .takeWhile(() => this.alive)
            .subscribe((tx: TransactionResult) => {
                    console.log(tx);
                },
                error => {
                    this.loading = false;
                    this.status = null;
                    console.error(error);
                    this.error = 'CODE.ERROR';
                },
                () => {
                    this.loading = false;
                    this.status = null;
                }
            );

    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.hasCrowdsaleEnded();
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
        // this timer is there for investors waiting to there to be able to invest
        Observable.interval(5000)
            .takeWhile(() => this.alive && this.hasStarted === false)
            .subscribe(() => {
                this.hasCrowdsaleEnded();
            });
    }

    constructor(private web3Service: Web3Service,
                private tokenContractService: TokenContractService,
                private ngZone: NgZone) {
    }
}
