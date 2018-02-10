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
    selector: 'app-secure-token-wallet',
    templateUrl: './token-wallet.component.html',
    styleUrls: ['./token-wallet.component.scss']
})
export class TokenWalletComponent implements OnInit, OnDestroy, AfterViewInit {
    private alive = true;
    accounts: string[];
    provider: string;
    currentAccountBalanceWei: number = 0;
    currentAccountBalanceEther: string = '';
    currentTokenBalance: number = 0;
    form: FormGroup;
    startDate: moment.Moment;
    endDate: moment.Moment;
    status = null;
    started = false;
    error: string = null;

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

    ngOnDestroy() {
        this.alive = false;
    }

    // web3 MetaMask should be injected by now
    ngAfterViewInit(): void {

        // this.retrieveAccounts();
    }

    ngOnInit() {
    }

    constructor(private web3Service: Web3Service,
                private tokenContractService: TokenContractService,
                private ngZone: NgZone) {
    }
}
