import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormHelper} from './form-helper';
import * as moment from 'moment';
import {DateService} from '../core/date.service';

export class TokenPurchase {
    amount: number;

    populateFormValues(form: FormGroup): void {
        if (this.account != null) {
            FormHelper.addOrReplaceFormControl(form, 'account',
                new FormControl({value: this.account, disabled: true}, Validators.required));
        }

        // now we need to check whether we put in a max number here and we do that by checking whether we are in the first 24 hours of the ICO
        const now: moment.Moment = DateService.getInstanceOfNow();
        if (DateService.isSameOrAfter(now, this.startDate) && DateService.isSameOrBefore(now, this.endDate)) {
            // now we check whether we are within the first 24 hours of the event
            const plus24Hours = DateService.addDaysToMoment(this.startDate, 1);
            if (DateService.isSameOrBefore(now, plus24Hours)) {
                // ok limit here is 1 Ether
                FormHelper.addOrReplaceFormControl(form, 'amount', new FormControl({value: '', disabled: false}, [Validators.required, Validators.minLength(1), Validators.min(0.1), Validators.maxLength(1), Validators.max(1)]));
            } else {
                // No limit
                FormHelper.addOrReplaceFormControl(form, 'amount', new FormControl({value: '', disabled: false}, [Validators.required, Validators.minLength(1), Validators.min(0.1)]));
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

    constructor(private readonly startDate: moment.Moment,
                private readonly endDate: moment.Moment,
                private readonly account: string,
                private readonly receiver: string) {
    }
}
