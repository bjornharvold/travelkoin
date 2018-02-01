import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Transaction} from '../../model/transaction';
import {WalletType} from '../../model/wallet-type.enum';
import {BitcoinService} from '../../core/bitcoin.service';
import {BitcoinTransaction} from '../../model/bitcoin-transaction';
import {EthereumService} from '../../core/ethereum.service';
import {EthereumTransaction} from '../../model/ethereum-transaction';
import {WalletTransaction} from '../../model/wallet-transaction';

@Component({
    selector: 'app-secure-transaction-details',
    templateUrl: './transaction-details.component.html',
    styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent implements OnInit, OnDestroy {
    private alive = true;
    @Input() type: string;
    @Input() tx: Transaction;
    confirmedTransaction: WalletTransaction = null;
    loading = false;
    error = false;
    errorMessage: string = null;

    private loadBitcoinTransaction(): void {
        this.loading = true;
        this.bitcoinService.loadTransaction(this.tx)
            .takeWhile(() => this.alive)
            .subscribe((tx: BitcoinTransaction) => {
                    this.confirmedTransaction = tx;
                },
                error => {
                    this.loading = false;
                    this.error = true;
                    this.errorMessage = error.error;
                },
                () => this.loading = false
            );

    }

    private loadEthereumTransaction(): void {
        this.loading = true;
        this.ethereumService.loadTransaction(this.tx)
            .takeWhile(() => this.alive)
            .subscribe((tx: EthereumTransaction) => {
                    this.confirmedTransaction = tx;
                },
                error => {
                    this.loading = false;
                    this.error = true;
                    this.errorMessage = error.error;
                },
                () => this.loading = false
            );

    }

    private loadTransactionByType(): void {
        switch (WalletType[this.type]) {
            case WalletType.BTC:
                this.loadBitcoinTransaction();
                break;
            case WalletType.ETH:
                this.loadEthereumTransaction();
                break;
            case WalletType.TKT:
                break;
        }
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.loadTransactionByType();
    }

    constructor(private bitcoinService: BitcoinService,
                private ethereumService: EthereumService) {
    }
}
