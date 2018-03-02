import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../core/user.service';
import {TokenContractService} from '../../core/token-contract.service';
import {User} from '../../model/user';
import {MandrillService} from '../../core/mandrill.service';
import {W3} from 'soltsice';
import {TransactionLogService} from '../../core/transaction-log.service';
import {AccountsService} from '../../core/accounts.service';
import TransactionResult = W3.TX.TransactionResult;

@Component({
    selector: 'app-hans-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
    private alive = true;
    private accounts: Array<string>;
    private users: Array<User> = null;
    error: string = null;
    loading = false;

    private whitelistUsersInFirebase(): void {
        if (this.users != null && this.users.length > 0) {
            for (let user of this.users) {
                user.whitelisted = true;
                this.userService.update(user.uid, user)
                    .takeWhile(() => this.alive)
                    .subscribe(() => console.log(`User ${user.email} has been whitelisted`), error => console.error(error), () => {});
            }
        }
    }

    private emailUserSuccessMessage(): void {
        if (this.users != null && this.users.length > 0) {
            for (let user of this.users) {
                this.mandrillService.sendEmail(user.email);
            }
        }
    }

    private addManyToWhitelist(): void {
        if (this.users.length > 0) {

            // grab all Ethereum addresses
            const addresses = [];
            for (let user of this.users) {
                addresses.push(user.ethWalletAddress);
            }

            this.tokenContractService.addManyToWhitelist(this.accounts[0], addresses)
                .takeWhile(() => this.alive)
                .subscribe((tx: TransactionResult) => {
                        if (tx != null) {
                            this.transactionLogService.logTransaction(tx);
                            this.emailUserSuccessMessage();
                            this.whitelistUsersInFirebase();
                        }
                    },
                    error => {
                        this.loading = false;
                        console.error(error);
                        this.error = 'CODE.ERROR';
                    },
                    () => this.loading = false)
        }
    }

    private loadApprovedUsers(): void {
        this.userService.listApproved()
            .takeWhile(() => this.alive)
            .subscribe((list: Array<User>) => {
                    if (list != null && list.length > 0) {
                        this.users = list;
                    }
                },
                error => {
                    this.loading = false;
                    console.error(error);
                    this.error = 'CODE.ERROR';
                },
                () => this.loading = false)
    }

    /**
     * Fetches all approved users from Firebase and adds them to the contract
     */
    addUsersToWhitelist(): void {
        this.error = null;
        this.loading = true;
        this.addManyToWhitelist();
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.loadApprovedUsers();

        this.accountsService.accountsUpdatedEvent
            .takeWhile(() => this.alive)
            .subscribe((accounts: Array<string>) => {
                this.accounts = accounts;
            });
    }

    constructor(private userService: UserService,
                private tokenContractService: TokenContractService,
                private mandrillService: MandrillService,
                private transactionLogService: TransactionLogService,
                private accountsService: AccountsService) {
    }
}
