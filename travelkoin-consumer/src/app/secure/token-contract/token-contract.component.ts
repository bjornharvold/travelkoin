import {AfterViewInit, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Web3Service} from '../../core/web3.service';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'app-secure-token-contract',
    templateUrl: './token-contract.component.html',
    styleUrls: ['./token-contract.component.scss']
})
export class TokenContractComponent implements OnInit, OnDestroy, AfterViewInit {
    private alive = true;
    accounts: string[];

    model = {
        amount: 5,
        receiver: '',
        balance: 0,
        account: ''
    };

    status = '';

    private updateBalance(coin: any): void {
        Observable.fromPromise(coin.getBalance.call(this.model.account))
            .takeWhile(() => this.alive)
            .subscribe((balance: any) => {
                    this.model.balance = balance;
                },
                error => this.status = error,
                () => {
                }
            );
    }

    private refreshBalance() {
        console.log('Refreshing balance');

        this.web3Service.getToken()
            .takeWhile(() => this.alive)
            .subscribe((token: any) => {
                    Observable.fromPromise(token.deployed())
                        .takeWhile(() => this.alive)
                        .subscribe((token: any) => {
                                this.updateBalance(token);
                            },
                            error => this.status = `Token deployed error: ${error}`,
                            () => {
                            }
                        );
                },
                error => this.status = error,
                () => {}
            );
    }

    private retrieveAccount() {
        this.web3Service.getAccounts()
            .takeWhile(() => this.alive)
            .subscribe((accounts) => {
                this.accounts = accounts;
                this.model.account = accounts[0];
                this.refreshBalance();
            });
    }

    buyTokens(): void {
        this.status = 'Initiating transaction... (please wait)';

        this.web3Service.getToken()
            .takeWhile(() => this.alive)
            .subscribe((token: any) => {
                    Observable.fromPromise(token.deployed())
                        .takeWhile(() => this.alive)
                        .subscribe((token: any) => {
                                console.log(`Buying ${this.model.amount} tokens...`);
                            },
                            error => this.status = `Transaction failed: ${error}`,
                            () => {
                            }
                        );
                },
                error => this.status = error,
                () => {}
            );
    }

    ngOnDestroy() {
        this.alive = false;
    }

    // web3 MetaMask should be injected by now
    ngAfterViewInit(): void {
        this.retrieveAccount();

    }

    ngOnInit() {
    }

    constructor(private web3Service: Web3Service,
                private ngZone: NgZone) {
    }
}
