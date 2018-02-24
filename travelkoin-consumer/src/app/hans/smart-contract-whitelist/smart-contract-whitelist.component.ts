import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {TokenContractService} from '../../core/token-contract.service';
import {FormControl, FormGroup} from '@angular/forms';
import {W3} from 'soltsice';
import {FormHelper} from '../../model/form-helper';
import TransactionResult = W3.TX.TransactionResult;

@Component({
  selector: 'app-hans-smart-contract-whitelist',
  templateUrl: './smart-contract-whitelist.component.html',
  styleUrls: ['./smart-contract-whitelist.component.scss']
})
export class SmartContractWhitelistComponent implements OnInit, OnChanges, OnDestroy {
    private alive = true;
    @Input() account: string;
    loading = false;
    whitelistForm: FormGroup;
    error: string;
    tx: TransactionResult = null;

    addToWhitelist(): void {
        this.loading = true;
        this.tx = null;
        this.error = null;
        const address: string = this.whitelistForm.get('address').value;

        this.tokenContractService.setWhitelist(this.account, [address], [])
            .takeWhile(() => this.alive)
            .subscribe((tx: TransactionResult) => {
                    this.tx = tx;
                },
                error => {
                    this.loading = false;
                    console.log(Object.getOwnPropertyNames(error));
                    // console.error(error);
                    this.error = 'CODE.ERROR';
                },
                () => {
                    this.loading = false;
                }
            );
    }

    ngOnChanges(changes: SimpleChanges) {
        const account: SimpleChange = changes.account;

        if (this.account != account.currentValue) {
            this.account = account.currentValue;
        }
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.whitelistForm = new FormGroup({});
        FormHelper.addOrReplaceFormControl(this.whitelistForm, 'address', new FormControl({value: '', disabled: false}))
    }

    constructor(private tokenContractService: TokenContractService) {
    }
}
