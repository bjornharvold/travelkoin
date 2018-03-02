import {EventEmitter, Injectable, Output} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as _ from 'lodash';
import {Web3Service} from './web3.service';

@Injectable()
export class AccountsService {
    private accounts: Array<string>;

    @Output() accountsUpdatedEvent: EventEmitter<Array<string> | null>;

    private retrieveAccounts(): void {
        this.web3Service.getAccounts()
            .subscribe((accounts) => {
                    if (accounts != null && this.accounts == null) {
                        this.accounts = accounts;
                        this.accountsUpdatedEvent.emit(this.accounts);
                    } else {
                        // only update if the current list of accounts does not match the new list of accounts
                        const equal: Array<string> = _.differenceWith(accounts, this.accounts, _.isEqual);

                        if (equal.length > 0) {
                            this.accounts = accounts;
                            this.accountsUpdatedEvent.emit(this.accounts);
                        }
                    }
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
