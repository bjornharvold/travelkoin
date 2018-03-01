import {Component, OnDestroy, OnInit} from '@angular/core';
import {TransactionLogService} from '../../core/transaction-log.service';
import {W3} from 'soltsice';
import TransactionResult = W3.TX.TransactionResult;
import {TokenContractService} from '../../core/token-contract.service';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'app-shared-transaction-log',
    templateUrl: './transaction-log.component.html',
    styleUrls: ['./transaction-log.component.scss']
})
export class TransactionLogComponent implements OnInit, OnDestroy {
    private alive = true;
    loading = false;
    txs: Array<TransactionResult> = [];
    logs: Array<W3.Log> = [];

    ngOnDestroy(): void {
        this.alive = false;
    }

    ngOnInit() {
        this.transactionLogService.eventStream
            .takeWhile(() => this.alive)
            .subscribe((tx: TransactionResult) => {
                console.log(tx);
                this.txs.push(tx);

                // fix this array at 10 items
                if (this.txs.length > 10) {
                    this.txs.splice(9, 1);
                }
            });

        Observable.interval(5000)
            .takeWhile(() => this.alive)
            .subscribe(() => {
                this.tokenContractService.listenToEvents()
                    .takeWhile(() => this.alive)
                    .subscribe((logs: Array<W3.Log>) => {
                        // console.log(logs);
                        this.logs = logs;
                    });
            });


    }

    constructor(private transactionLogService: TransactionLogService,
                private tokenContractService: TokenContractService) {
    }

}
