import {Component, OnDestroy, OnInit} from '@angular/core';
import {Web3Service} from '../../core/web3.service';
import {TokenContractService} from '../../core/token-contract.service';
import {BigNumber} from 'bignumber.js';
import {CrowdsaleTimerService} from '../../core/crowdsale-timer.service';
import {Observable} from 'rxjs/Observable';
import {AccountsService} from '../../core/accounts.service';
import {W3} from 'soltsice';
import TransactionResult = W3.TX.TransactionResult;
import {TransactionLogService} from '../../core/transaction-log.service';

@Component({
    selector: 'app-secure-token-wallet',
    templateUrl: './token-wallet.component.html',
    styleUrls: ['./token-wallet.component.scss']
})
export class TokenWalletComponent implements OnInit, OnDestroy {
    private alive = true;
    accounts: string[];
    hasStarted = false;
    hasEnded = false;
    loading = false;
    claimed = false;
    status: string = null;
    error = null;
    balance: string = "0";

    /**
     * This is the user's current investment in the crowdsale
     */
    private crowdsaleBalance(): void {
        if (this.accounts != null && this.accounts.length > 0) {
            this.loading = true;
            this.tokenContractService.balances(this.accounts[0])
                .takeWhile(() => this.alive)
                .subscribe((stake: BigNumber) => {
                        if (stake.greaterThan(0)) {
                            this.claimed = false;
                            this.balance = this.web3Service.weiToEther(stake).toFormat();
                        }
                    },
                    error => {
                        this.loading = false;
                        console.error(error);
                        this.status = 'CODE.ERROR';
                    },
                    () => this.loading = false
                );
        }
    }

    /**
     * This is the user's claimed tokens available after the crowdsale
     */
    private tokenBalance(): void {
        if (this.accounts != null && this.accounts.length > 0) {
            this.loading = true;
            this.tokenContractService.balanceOf(this.accounts[0])
                .takeWhile(() => this.alive)
                .subscribe((balance: BigNumber) => {
                        if (balance.greaterThan(0)) {
                            this.claimed = true;
                            this.balance = this.web3Service.weiToEther(balance).mul(1000).toFormat();
                        }
                    },
                    error => {
                        this.loading = false;
                        console.error(error);
                        this.status = 'CODE.ERROR';
                    },
                    () => this.loading = false
                );
        }
    }

    withdrawTokens(): void {
        this.loading = true;
        this.error = null;
        this.status = 'TOKEN_CONTRACT.INITIATING_TRANSACTION';

        this.tokenContractService.withdrawTokens(this.accounts[0])
            .takeWhile(() => this.alive)
            .subscribe((tx: TransactionResult) => {
                    this.transactionLogService.logTransaction(tx);
                    this.claimed = true;
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

        this.accountsService.accountsUpdatedEvent
            .takeWhile(() => this.alive)
            .subscribe((accounts: Array<string>) => {
                if (accounts != null) {
                    this.accounts = accounts;
                } else {
                    this.error = 'CODE.ERROR';
                }
            });

        this.crowdsaleTimerService.errorEvent
            .takeWhile(() => this.alive)
            .subscribe((error: string) => this.error = error);

        Observable.interval(2000)
            .takeWhile(() => this.alive)
            .subscribe(() => {
                if (this.hasStarted === true || this.hasEnded === true && this.claimed === false) {
                    this.crowdsaleBalance();
                }

                if (this.hasEnded === true) {
                    this.tokenBalance();
                }
            });
    }

    constructor(private web3Service: Web3Service,
                private tokenContractService: TokenContractService,
                private accountsService: AccountsService,
                private crowdsaleTimerService: CrowdsaleTimerService,
                private transactionLogService: TransactionLogService) {
    }
}
