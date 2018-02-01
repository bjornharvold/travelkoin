import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormHelper} from './form-helper';

export class WalletExchange {
    type: string;
    amount: number;

    populateFormValues(form: FormGroup): void {
        if (this.amount != null) {
            FormHelper.addOrReplaceFormControl(form, 'amount',
                new FormControl({value: this.amount, disabled: false}, {validators: Validators.required}));
        } else {
            FormHelper.addOrReplaceFormControl(form, 'amount',
                new FormControl({value: '', disabled: false}, {validators: Validators.required}));
        }
        if (this.type != null) {
            FormHelper.addOrReplaceFormControl(form, 'type',
                new FormControl({value: this.type, disabled: false}, {validators: Validators.required}));
        } else {
            FormHelper.addOrReplaceFormControl(form, 'type',
                new FormControl({value: '', disabled: false}, {validators: Validators.required}));
        }
    }

    updateFromFormValues(form: FormGroup): void {
        if (form != null) {
            if (form.contains('amount')) {
                this.amount = form.get('amount').value;
            }

            if (form.contains('type')) {
                this.type = form.get('type').value;
            }
        }
    }

    constructor(type: string) {
        this.type = type;
    }
}
