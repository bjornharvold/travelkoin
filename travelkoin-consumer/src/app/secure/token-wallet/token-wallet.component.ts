import {Component, OnDestroy, OnInit} from '@angular/core';
import {Web3Service} from '../../core/web3.service';
import {TokenContractService} from '../../core/token-contract.service';
import {BigNumber} from 'bignumber.js';
import {CrowdsaleTimerService} from '../../core/crowdsale-timer.service';
import {Observable} from 'rxjs/Observable';
import {AccountsService} from '../../core/accounts.service';

@Component({
    selector: 'app-secure-token-wallet',
    templateUrl: './token-wallet.component.html',
    styleUrls: ['./token-wallet.component.scss']
})
export class TokenWalletComponent implements OnInit, OnDestroy {
    private alive = true;
    accounts: string[];
    loading = false;
    balanceString: string = '0';
    balance: number = 0;

    /**
     * This is the user's claimed tokens available after the crowdsale
     */
    private tokenBalance(): void {
        if (this.accounts != null && this.accounts.length > 0) {
            this.loading = true;
            this.tokenContractService.balanceOf(this.accounts[0])
                .takeWhile(() => this.alive)
                .subscribe((balance: BigNumber) => {
                        if (balance != null) {
                            this.balance = this.web3Service.weiToEther(balance).toNumber();
                            this.balanceString = this.web3Service.weiToEther(balance).toFormat();
                        }
                    },
                    error => {
                        this.loading = false;
                        console.error(error);
                    },
                    () => this.loading = false
                );
        }
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {

        this.accountsService.accountsUpdatedEvent
            .takeWhile(() => this.alive)
            .subscribe((accounts: Array<string>) => {
                if (accounts != null) {
                    this.accounts = accounts;
                }
            });

        this.crowdsaleTimerService.errorEvent
            .takeWhile(() => this.alive)
            .subscribe((error: string) => console.error(error));

        Observable.interval(2000)
            .takeWhile(() => this.alive)
            .subscribe(() => {
                this.tokenBalance();
            });
    }

    constructor(private web3Service: Web3Service,
                private tokenContractService: TokenContractService,
                private accountsService: AccountsService,
                private crowdsaleTimerService: CrowdsaleTimerService) {
    }
}
