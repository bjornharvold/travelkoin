import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormHelper} from './form-helper';
import * as moment from 'moment';
import {DateService} from '../core/date.service';

export class TokenPurchase {
    amount: number;

    populateFormValues(form: FormGroup): void {
        FormHelper.addOrReplaceFormControl(form, 'account', new FormControl({value: this.account, disabled: true}, Validators.required));
        FormHelper.addOrReplaceFormControl(form, 'amount', new FormControl({value: '', disabled: false}));
    }

    updateValidator(formGroup: FormGroup, startDate: moment.Moment): void {
        const now: moment.Moment = DateService.getInstanceOfNow();
        if (DateService.isSameOrAfter(now, startDate)) {
            // now we check whether we are within the first 24 hours of the event
            const plus24Hours = DateService.addDaysToMoment(startDate, 1);
            if (DateService.isSameOrBefore(now, plus24Hours)) {
                // ok limit here is 1 Ether
                formGroup.get('amount').setValidators([Validators.required, Validators.min(0.1), Validators.max(1)]);
            } else {
                // No limit
                formGroup.get('amount').setValidators([Validators.required, Validators.min(0.1)]);
            }

            formGroup.get('amount').updateValueAndValidity();
        }
    }

    updateFromFormValues(form: FormGroup): void {
        if (form != null) {
            if (form.contains('amount')) {
                this.amount = form.get('amount').value;
            }
        }
    }

    constructor(public readonly account: string) {
    }
}
