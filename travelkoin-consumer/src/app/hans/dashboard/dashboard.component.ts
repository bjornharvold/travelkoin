import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../core/user.service';
import {TokenContractService} from '../../core/token-contract.service';
import {User} from '../../model/user';
import {MandrillService} from '../../core/mandrill.service';
import {Observable} from 'rxjs/Observable';
import {W3} from 'soltsice';
import TransactionResult = W3.TX.TransactionResult;
import {Web3Service} from '../../core/web3.service';
import {TransactionLogService} from '../../core/transaction-log.service';

@Component({
    selector: 'app-hans-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
    private alive = true;
    private accounts: Array<string>;
    error: string = null;
    loading = false;

    private retrieveAccounts(): void {

        this.web3Service.getAccounts()
            .takeWhile(() => this.alive)
            .subscribe((accounts) => {
                    if (accounts != null && accounts.length > 0) {
                        this.accounts = accounts;
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

    private emailUserSuccessMessage(emails: Array<string>): void {
        if (emails != null && emails.length > 0) {
            for (let email of emails) {
                this.mandrillService.sendEmail(email);
            }
        }
    }

    private addManyToWhitelist(addresses: Array<string>, emails: Array<string>): void {
        this.tokenContractService.addManyToWhitelist(this.accounts[0], addresses)
            .takeWhile(() => this.alive)
            .subscribe((tx: TransactionResult) => {
                    if (tx != null) {
                        this.transactionLogService.logTransaction(tx);
                        this.emailUserSuccessMessage(emails);
                    }
                },
                error => {
                    this.loading = false;
                    console.error(error);
                    this.error = 'CODE.ERROR';
                },
                () => this.loading = false)
    }

    private loadApprovedUsers(): void {
        this.userService.listApproved()
            .takeWhile(() => this.alive)
            .subscribe((list: Array<User>) => {
                    if (this.accounts != null && list != null && list.length > 0) {
                        // grab all Ethereum addresses
                        const addresses: Array<string> = [];
                        const emails: Array<string> = [];
                        for (let user of list) {
                            addresses.push(user.ethWalletAddress);
                            emails.push(user.email);
                        }

                        this.addManyToWhitelist(addresses, emails);
                    } else {
                        this.loading = false;
                    }
                },
                error => {
                    this.loading = false;
                    console.error(error);
                    this.error = 'CODE.ERROR';
                },
                () => {
                })
    }

    /**
     * Fetches all approved users from Firebase and adds them to the contract
     */
    addUsersToWhitelist(): void {
        this.error = null;
        this.loading = true;
        this.loadApprovedUsers();
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        Observable.interval(2000)
            .takeWhile(() => this.alive)
            .subscribe(() => {
                this.retrieveAccounts();
            });
    }

    constructor(private web3Service: Web3Service,
                private userService: UserService,
                private tokenContractService: TokenContractService,
                private mandrillService: MandrillService,
                private transactionLogService: TransactionLogService) {
    }
}
