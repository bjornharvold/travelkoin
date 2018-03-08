import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TokenContractService} from '../../core/token-contract.service';
import {FormControl, FormGroup} from '@angular/forms';
import {W3} from 'soltsice';
import {FormHelper} from '../../model/form-helper';
import {AccountsService} from '../../core/accounts.service';
import TransactionResult = W3.TX.TransactionResult;

@Component({
    selector: 'app-hans-smart-contract-whitelist',
    templateUrl: './smart-contract-whitelist.component.html',
    styleUrls: ['./smart-contract-whitelist.component.scss']
})
export class SmartContractWhitelistComponent implements OnInit, OnDestroy {
    private alive = true;
    private account: string;
    loading = false;
    whitelistForm: FormGroup;
    error: string;
    tx: TransactionResult = null;

    addToWhitelist(): void {
        this.loading = true;
        this.tx = null;
        this.error = null;
        const address: string = this.whitelistForm.get('address').value;

        this.tokenContractService.addToWhitelist(this.account, address)
            .takeWhile(() => this.alive)
            .subscribe((tx: TransactionResult) => {
                    // console.log(tx);
                    this.tx = tx;
                },
                error => {
                    this.loading = false;
                    this.error = error;
                    // console.log(error);
                },
                () => {
                    this.loading = false;
                }
            );
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.whitelistForm = new FormGroup({});
        FormHelper.addOrReplaceFormControl(this.whitelistForm, 'address', new FormControl({value: '', disabled: false}));

        this.accountsService.accountsUpdatedEvent
            .takeWhile(() => this.alive)
            .subscribe((accounts: Array<string>) => {
                if (accounts != null) {
                    this.account = accounts[0];
                }
            });
    }

    constructor(private tokenContractService: TokenContractService,
                private accountsService: AccountsService) {
    }
}
