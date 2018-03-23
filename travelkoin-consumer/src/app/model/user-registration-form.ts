import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {FormHelper} from './form-helper';
import {ImprovedMultimedia} from './improved-multimedia';

export class UserRegistrationForm {
    ethWalletAddress: string;

    static deserializeObject(obj: any): UserRegistrationForm {
        const result: UserRegistrationForm = new UserRegistrationForm();

        if (obj != null) {
            if (obj.ethWalletAddress != null) {
                result.ethWalletAddress = obj.ethWalletAddress;
            }
        }

        return result;
    }

    populateFormValues(form: FormGroup): void {
        if (this.ethWalletAddress != null) {
            FormHelper.addOrReplaceFormControl(form, 'ethWalletAddress',
                new FormControl({value: this.ethWalletAddress, disabled: false}));
        } else {
            FormHelper.addOrReplaceFormControl(form, 'ethWalletAddress',
                new FormControl({value: '', disabled: false}));
        }
    }

    updateFromFormValues(form: FormGroup): void {
        if (form != null) {

            if (form.contains('ethWalletAddress')) {
                this.ethWalletAddress = form.get('ethWalletAddress').value;
            }
        }
    }

    constructor() {
    }
}
