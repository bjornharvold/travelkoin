import {Component, Input, OnDestroy, OnInit} from '@angular/core';
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
    confirmedTransaction: WalletTransaction = null;
    loading = false;
    error = false;
    errorMessage: string = null;

    // private loadEthereumTransaction(): void {
    //     this.loading = true;
    //     this.ethereumService.loadTransaction(this.tx)
    //         .takeWhile(() => this.alive)
    //         .subscribe((tx: EthereumTransaction) => {
    //                 this.confirmedTransaction = tx;
    //             },
    //             error => {
    //                 this.loading = false;
    //                 this.error = true;
    //                 this.errorMessage = error.error;
    //             },
    //             () => this.loading = false
    //         );
    //
    // }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        // this.loadEthereumTransaction();
    }

    constructor(private ethereumService: EthereumService) {
    }
}
