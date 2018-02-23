import {Component, OnDestroy, OnInit} from '@angular/core';
import {Web3Service} from '../../core/web3.service';
import {TokenContractService} from '../../core/token-contract.service';
import {BigNumber} from 'bignumber.js';
import {DateService} from '../../core/date.service';
import * as moment from 'moment';
import {CrowdsaleTimerService} from '../../core/crowdsale-timer.service';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'app-secure-token-wallet',
    templateUrl: './token-wallet.component.html',
    styleUrls: ['./token-wallet.component.scss']
})
export class TokenWalletComponent implements OnInit, OnDestroy {
    private alive = true;
    accounts: string[];
    account: string;
    hasStarted = false;
    hasEnded = false;
    loading = false;
    status: string = null;
    error = null;
    stake: string = null;
    balance: string = null;
    startDate: moment.Moment;
    endDate: moment.Moment;
    nowDate: moment.Moment = DateService.getInstanceOfNow();

    /**
     * This is the user's current investment in the crowdsale
     */
    private getUserStakeDuringCrowdsale(): void {
        if (this.account != null) {
            this.loading = true;
            this.tokenContractService.stakesPerUser(this.account)
                .takeWhile(() => this.alive)
                .subscribe((stake: BigNumber) => {
                        this.stake = stake.div(1000000000000000).toFormat();
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
    private getUserTokens(): void {
        if (this.account != null) {
            this.loading = true;
            this.tokenContractService.balanceOf(this.account)
                .takeWhile(() => this.alive)
                .subscribe((balance: BigNumber) => {
                        this.balance = balance.div(1000000000000000).toFormat();
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
     * Grab the active account from Ethereum provider
     */
    private retrieveAccounts(): void {
        this.web3Service.getAccounts()
            .takeWhile(() => this.alive)
            .subscribe((accounts) => {
                    this.accounts = accounts;
                    this.account = accounts[0];
                },
                error => {
                    console.error(error);
                    this.error = 'CODE.ERROR';
                },
                () => {
                }
            );
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.retrieveAccounts();

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
            .takeWhile(() => this.alive)
            .subscribe(() => {
                if (this.hasStarted === true && this.hasEnded === false) {
                    this.getUserStakeDuringCrowdsale();
                }

                if (this.hasStarted === true && this.hasEnded === true) {
                    this.getUserTokens();
                }
            });
    }

    constructor(private web3Service: Web3Service,
                private tokenContractService: TokenContractService,
                private crowdsaleTimerService: CrowdsaleTimerService) {
    }
}
