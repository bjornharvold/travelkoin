import {Component, OnDestroy, OnInit} from '@angular/core';
import {Web3Service} from '../../core/web3.service';
import {TokenPurchase} from '../../model/TokenPurchase';
import {FormGroup} from '@angular/forms';
import * as moment from 'moment';
import {TokenContractService} from '../../core/token-contract.service';
import {BigNumber} from 'bignumber.js';
import {DateService} from '../../core/date.service';
import {W3} from 'soltsice';
import {CrowdsaleTimerService} from '../../core/crowdsale-timer.service';
import {Observable} from 'rxjs/Observable';
import {TransactionLogService} from '../../core/transaction-log.service';
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
    status = null;
    error = null;
    hasStarted = false;
    hasEnded = false;
    loading = false;
    isCrowdsaleOpen = false;
    maxContribution = null;
    minContribution = null;

    private updateFormValidators(): void {
        if (this.dto != null && this.minContribution != null && this.maxContribution != null) {
            this.dto.updateContributionValidator(this.form, this.minContribution, this.maxContribution);
        }
    }

    private getMaxContribution(): void {
        if (this.accounts != null && this.accounts.length > 0) {
            this.tokenContractService.howMuchCanIContributeNow(this.accounts[0])
                .takeWhile(() => this.alive)
                .subscribe((maxLimit: BigNumber) => {
                        if (maxLimit != null) {
                            this.maxContribution = maxLimit.div(1000000000000000000).toNumber();
                            this.updateFormValidators();
                            // console.log(this.maxContribution);
                        }
                    }, error => {
                        console.error(error);
                        this.error = 'CODE.ERROR';
                    },
                    () => {
                    }
                )
        }
    }

    private getMinContribution(): void {
        if (this.accounts != null && this.accounts.length > 0) {
            this.tokenContractService.minContribution()
                .takeWhile(() => this.alive)
                .subscribe((minLimit: BigNumber) => {
                        if (minLimit != null) {
                            this.minContribution = minLimit.div(1000000000000000000).toNumber();
                            this.updateFormValidators();
                            // console.log(this.minContribution);
                        }
                    }, error => {
                        console.error(error);
                        this.error = 'CODE.ERROR';
                    },
                    () => {
                    }
                )
        }
    }

    private getAccountBalance(): void {
        if (this.accounts != null && this.accounts.length > 0) {
            this.web3Service.getAccountBalance(this.accounts[0])
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
    }

    /**
     * This is our form for submitting payment
     */
    private initFormGroup(): void {
        if (this.dto == null && this.accounts != null) {
            this.dto = new TokenPurchase(this.accounts[0]);
            this.dto.populateFormValues(this.form);
        }
    }

    /**
     * Save start time
     */
    private displayStartTime(): void {
        this.tokenContractService.startTime()
            .takeWhile(() => this.alive)
            .subscribe((startTime: BigNumber) => {
                    this.startDate = DateService.bigNumberToMoment(startTime);
                    // console.log(this.startDate.format());
                }, error => {
                    console.error(error);
                    this.error = 'CODE.ERROR';
                },
                () => {
                }
            )
    }

    private retrieveAccounts(): void {
        if (this.provider == null) {
            this.error = 'CODE.NOT_CONNECTED';
        } else {
            this.web3Service.getAccounts()
                .takeWhile(() => this.alive)
                .subscribe((accounts) => {
                        if (accounts == null || accounts.length === 0) {
                            this.error = 'CODE.PROVIDER_LOG_IN';
                        } else {
                            this.accounts = accounts;
                            this.initFormGroup();
                        }
                    },
                    error => {
                        console.error(error);
                        this.error = 'CODE.ERROR';
                    },
                    () => {
                    }
                );
        }
    }

    private clearForm(): void {
        if (this.dto != null) {
            this.dto.amount = null;
            this.dto.populateFormValues(this.form);
        }
    }

    buyTokens(): void {
        this.loading = true;
        this.error = null;
        this.status = 'TOKEN_CONTRACT.INITIATING_TRANSACTION';

        this.dto.updateFromFormValues(this.form);
        this.tokenContractService.buyTokens(this.dto.account, this.dto.amount)
            .takeWhile(() => this.alive)
            .subscribe((tx: TransactionResult) => {
                    this.transactionLogService.logTransaction(tx);
                    this.clearForm();
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

        if (this.web3Service.isConnected()) {
            this.displayStartTime();
            this.provider = this.web3Service.getProviderName();
            this.retrieveAccounts();

            this.form = new FormGroup({});

            // listen to events
            this.crowdsaleTimerService.hasStartedEvent
                .takeWhile(() => this.alive)
                .subscribe((started: boolean) => {
                    this.hasStarted = started;
                });

            this.crowdsaleTimerService.hasEndedEvent
                .takeWhile(() => this.alive)
                .subscribe((ended: boolean) => {
                    this.hasEnded = ended;
                });

            this.crowdsaleTimerService.errorEvent
                .takeWhile(() => this.alive)
                .subscribe((error: string) => this.error = error);


            Observable.interval(2000)
                .takeWhile(() => this.hasStarted === true && this.hasEnded === false)
                .subscribe(() => {
                    // check for 1 ETH limit time
                    this.getMaxContribution();
                    this.getMinContribution();
                    this.getAccountBalance();
                });
        } else {
            this.status = 'CODE.NOT_LOGGED_IN';
        }

    }

    constructor(private web3Service: Web3Service,
                private tokenContractService: TokenContractService,
                private crowdsaleTimerService: CrowdsaleTimerService,
                private transactionLogService: TransactionLogService) {
    }
}
