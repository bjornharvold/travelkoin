import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChange, SimpleChanges, ViewChild} from '@angular/core';
import {GridComponent, GridDataResult} from '@progress/kendo-angular-grid';
import {WalletType} from '../../model/wallet-type.enum';
import {User} from '../../model/user';
import {UserSessionService} from '../../core/user-session.service';
import {Transaction} from '../../model/transaction';
import {environment} from '../../../environments/environment';

@Component({
    selector: 'app-secure-wallet-value',
    templateUrl: './wallet-value.component.html',
    styleUrls: ['./wallet-value.component.scss']
})
export class WalletValueComponent implements OnInit, OnChanges, OnDestroy {
    private alive = true;
    @ViewChild(GridComponent) grid: GridComponent;
    @Input() type: string;
    @Output() onAddTransaction: EventEmitter<boolean>;
    view: GridDataResult = null;
    loading = false;
    recipient: string = null;
    hasAddress = false;
    user: User = null;

    private loadTransactions(txs: Array<Transaction>): void {
        if (txs != null && txs.length > 0) {
            this.view = {
                data: txs,
                total: txs.length
            };
        } else {
            this.view = null;
        }
    }

    private loadTransactionsByType(user: User): void {
        switch (WalletType[this.type]) {
            case WalletType.BTC:
                this.hasAddress = user.btcWalletAddress != null;
                this.recipient = environment.btcWalletAddress;
                this.loadTransactions(user.bitcoinTransactions);
                break;
            case WalletType.ETH:
                this.hasAddress = user.ethWalletAddress != null;
                this.recipient = environment.ethWalletAddress;
                this.loadTransactions(user.etherTransactions);
                break;
            case WalletType.TKT:
                break;
        }
    }

    addTransaction(): void {
        this.onAddTransaction.emit(true);
    }

    deleteEntry(transactionIdentifier: string): void {
        if (this.user != null && this.user.transactions != null && this.user.transactions.length > 0) {
            for (let i = 0; i < this.user.transactions.length; i++) {
                const tx = this.user.transactions[i];
                if (tx.transactionID === transactionIdentifier) {
                    this.user.transactions.splice(i, 1);
                    this.userSessionService.updateUser(this.user.uid, User.serializeObjectToPartialUser(this.user))
                        .takeWhile(() => this.alive)
                        .subscribe(() => {
                                // nothing to do
                            },
                            error => {
                                // nothing to do
                            },
                            () => {
                            }
                        );
                    break;
                }
            }
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        const type: SimpleChange = changes.type;
        if (this.user != null && type != null && type.currentValue !== type.previousValue) {
            this.type = type.currentValue;
            this.view = null;
            this.loadTransactionsByType(this.user);
        }
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.loading = true;
        this.userSessionService.getUser()
            .takeWhile(() => this.alive)
            .subscribe((user: User) => {
                    if (user != null) {
                        this.loading = false;
                        this.user = user;
                        if (this.user != null) {
                            this.loadTransactionsByType(this.user);
                        }
                    }
                },
                error => this.loading = false
            );
    }

    constructor(private userSessionService: UserSessionService) {
        this.onAddTransaction = new EventEmitter<boolean>(true);
    }
}
