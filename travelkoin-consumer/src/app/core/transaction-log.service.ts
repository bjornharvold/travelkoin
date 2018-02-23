import {EventEmitter, Injectable, Output} from '@angular/core';
import {W3} from 'soltsice';
import TransactionResult = W3.TX.TransactionResult;

@Injectable()
export class TransactionLogService {
    @Output() eventStream: EventEmitter<TransactionResult>;

    logTransaction(tx: TransactionResult): void {
        this.eventStream.emit(tx);
    }

    constructor() {
        this.eventStream = new EventEmitter<TransactionResult>(true);
    }

}
