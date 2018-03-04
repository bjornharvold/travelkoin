import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormHelper} from './form-helper';

export class TokenPurchase {
    private minContribution: number;
    private maxContribution: number;
    amount: number;
    account: string;

    populateFormValues(form: FormGroup): void {
        FormHelper.addOrReplaceFormControl(form, 'account', new FormControl({value: this.account, disabled: true}, Validators.required));

        if (this.amount != null && form.get('amount').value !== this.amount) {
            FormHelper.addOrReplaceFormControl(form, 'amount', new FormControl({value: this.amount, disabled: false}));
        } else {
            FormHelper.addOrReplaceFormControl(form, 'amount', new FormControl({value: '', disabled: false}));
        }

    }

    updateContributionValidator(formGroup: FormGroup, minContribution: number, maxContribution: number): void {
        if (minContribution != null && maxContribution != null) {
            // only update if a change occurred
            if (this.minContribution != minContribution || this.maxContribution != this.maxContribution) {
                this.minContribution = minContribution;
                this.maxContribution = maxContribution;
                formGroup.get('amount').setValidators([Validators.required, Validators.min(minContribution), Validators.max(maxContribution)]);
                formGroup.get('amount').updateValueAndValidity();
            }
        }
    }

    updateFromFormValues(form: FormGroup): void {
        if (form != null) {
            if (form.contains('amount')) {
                this.amount = form.get('amount').value;
            }
        }
    }

    constructor() {
    }
}
