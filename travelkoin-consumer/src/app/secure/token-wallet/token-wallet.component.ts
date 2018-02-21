import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Web3Service} from '../../core/web3.service';
import {TokenContractService} from '../../core/token-contract.service';
import {BigNumber} from 'bignumber.js';

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
    status: string = null;
    stake: string = null;
    balance: string = null;

    /**
     * This is the user's current investment in the crowdsale
     * @param {string} account
     */
    private getUserStakeDuringCrowdsale(account: string): void {
        this.tokenContractService.stakesPerUser(account)
            .takeWhile(() => this.alive)
            .subscribe((stake: BigNumber) => {
                    this.stake = stake.div(1000000000000000).toFormat();
                },
                error => {
                    console.error(error);
                    this.status = 'CODE.ERROR';
                },
                () => {
                }
            );
    }

    /**
     * This is the user's current investment in the crowdsale
     * @param {string} account
     */
    private getUserTokens(account: string): void {
        this.tokenContractService.balanceOf(account)
            .takeWhile(() => this.alive)
            .subscribe((balance: BigNumber) => {
                    this.balance = balance.div(1000000000000000).toFormat();
                },
                error => {
                    console.error(error);
                    this.status = 'CODE.ERROR';
                },
                () => {
                }
            );
    }

    /**
     * User can only claim tokens after event is over
     */
    private hasCrowdsaleEnded(): void {
        this.tokenContractService.hasEnded()
            .takeWhile(() => this.alive)
            .subscribe((hasEnded: boolean) => {
                    this.hasEnded = hasEnded;

                    if (this.hasEnded === true) {
                        this.getUserStakeDuringCrowdsale(this.account);
                        this.getUserTokens(this.account);
                    } else {
                        this.hasCrowdsaleStarted();
                    }
                },
                error => {
                    console.error(error);
                    this.status = 'CODE.ERROR';
                },
                () => {
                }
            );
    }

    /**
     * User can only claim tokens after event is over
     */
    private hasCrowdsaleStarted(): void {
        this.tokenContractService.hasStarted()
            .takeWhile(() => this.alive)
            .subscribe((hasStarted: boolean) => {
                    this.hasStarted = hasStarted;
                    if (this.hasStarted === true) {
                        this.getUserStakeDuringCrowdsale(this.account);
                    }
                },
                error => {
                    console.error(error);
                    this.status = 'CODE.ERROR';
                },
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
                    this.account = accounts[0];
                    this.hasCrowdsaleEnded();
                },
                error => {
                    console.error(error);
                    this.status = 'CODE.ERROR';
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
    }

    constructor(private web3Service: Web3Service,
                private tokenContractService: TokenContractService,
                private ngZone: NgZone) {
    }
}
