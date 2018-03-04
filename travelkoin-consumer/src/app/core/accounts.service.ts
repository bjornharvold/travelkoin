import {EventEmitter, Injectable, Output} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Web3Service} from './web3.service';

@Injectable()
export class AccountsService {
    private accounts: Array<string>;

    @Output() accountsUpdatedEvent: EventEmitter<Array<string> | null>;

    private retrieveAccounts(): void {
        this.web3Service.getAccounts()
            .subscribe((accounts) => {
                    this.accounts = accounts;
                    this.accountsUpdatedEvent.emit(this.accounts);
                },
                error => {
                    console.error(error);
                },
                () => {
                }
            );
    }

    constructor(private web3Service: Web3Service) {
        this.accountsUpdatedEvent = new EventEmitter<Array<string>>(true);

        Observable.interval(1000)
            .subscribe(() => {
                this.retrieveAccounts();
            });
    }

}
