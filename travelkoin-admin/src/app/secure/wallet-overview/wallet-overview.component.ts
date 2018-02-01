import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {User} from '../../model/user';
import {UserSessionService} from '../../core/user-session.service';
import {AngularFireAuth} from 'angularfire2/auth';
import {WalletType} from '../../model/wallet-type.enum';
import {Transaction} from '../../model/transaction';
import {WalletTransactions} from '../../model/wallet-transactions';
import {BitcoinTransactions} from '../../model/bitcoin-transactions';
import {BitcoinTransaction} from '../../model/bitcoin-transaction';
import {BitcoinService} from '../../core/bitcoin.service';
import {EthereumService} from '../../core/ethereum.service';
import {EthereumTransaction} from '../../model/ethereum-transaction';
import {EthereumTransactions} from '../../model/ethereum-transactions';

@Component({
    selector: 'app-secure-wallet-overview',
    templateUrl: './wallet-overview.component.html',
    styleUrls: ['./wallet-overview.component.scss']
})
export class WalletOverviewComponent implements OnInit, OnChanges, OnDestroy {
    private alive = true;
    private user: User = null;
    @Input() type: string;
    @Input() showTitle: boolean = true;
    @Input() showButton: boolean = true;
    @Input() customTitle: string = null;
    wallet: WalletTransactions = null;
    loading = false;
    error = false;
    errorMessage: string = null;

    private loadBitcoinTransactions(user: User): void {
        const txs: Array<Transaction> = user.bitcoinTransactions;
        if (txs != null && txs.length > 0) {
            this.loading = true;
            this.bitcoinService.loadTransactions(txs)
                .takeWhile(() => this.alive)
                .subscribe((txs: Array<BitcoinTransaction>) => {
                        this.wallet = new BitcoinTransactions(WalletType.BTC, txs);
                    },
                    error => {
                        this.loading = false;
                        this.error = true;
                        this.errorMessage = error.error;
                    },
                    () => this.loading = false
                );
        }
    }

    private loadEthereumTransactions(user: User): void {
        const txs: Array<Transaction> = user.etherTransactions;
        if (txs != null && txs.length > 0) {
            this.loading = true;
            this.ethereumService.loadTransactions(txs)
                .takeWhile(() => this.alive)
                .subscribe((txs: Array<EthereumTransaction>) => {
                        this.wallet = new EthereumTransactions(WalletType.ETH, txs);
                    },
                    error => {
                        this.loading = false;
                        this.error = true;
                        this.errorMessage = error.error;
                    },
                    () => this.loading = false
                );
        }
    }

    private loadWalletByType(user: User): void {
        this.error = false;
        this.errorMessage = null;

        switch (WalletType[this.type]) {
            case WalletType.BTC:
                this.loadBitcoinTransactions(user);
                break;
            case WalletType.ETH:
                this.loadEthereumTransactions(user);
                break;
            case WalletType.TKT:
                break;
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        const type: SimpleChange = changes.type;
        if (this.user != null && type != null && type.currentValue !== type.previousValue) {
            this.type = type.currentValue;
            this.wallet = null;
            this.loadWalletByType(this.user);
        }
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.userSessionService.getUser()
            .takeWhile(() => this.alive)
            .subscribe((user: User) => {
                    if (user != null) {
                        this.user = user;
                        if (this.user != null) {
                            this.loadWalletByType(this.user);
                        }
                    }
                },
                error => console.warn(error)
            );
    }

    constructor(private afAuth: AngularFireAuth,
                private bitcoinService: BitcoinService,
                private ethereumService: EthereumService,
                private userSessionService: UserSessionService) {
    }

}
