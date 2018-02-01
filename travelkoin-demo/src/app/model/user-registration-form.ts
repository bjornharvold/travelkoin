import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {FormHelper} from './form-helper';
import {ImprovedMultimedia} from './improved-multimedia';

export class UserRegistrationForm {
    btcWalletAddress: string;
    ethWalletAddress: string;
    multimedia: Array<ImprovedMultimedia>;

    static deserializeObject(obj: any): UserRegistrationForm {
        const result: UserRegistrationForm = new UserRegistrationForm();

        if (obj != null) {
            if (obj.btcWalletAddress != null) {
                result.btcWalletAddress = obj.btcWalletAddress;
            }
            if (obj.ethWalletAddress != null) {
                result.ethWalletAddress = obj.ethWalletAddress;
            }
            if (obj.multimedia != null) {
                result.multimedia = obj.multimedia;
            }
        }

        return result;
    }

    populateFormValues(form: FormGroup): void {
        if (this.btcWalletAddress != null) {
            FormHelper.addOrReplaceFormControl(form, 'btcWalletAddress',
                new FormControl({value: this.btcWalletAddress, disabled: true}));
        } else {
            FormHelper.addOrReplaceFormControl(form, 'btcWalletAddress',
                new FormControl({value: '', disabled: false}));
        }
        if (this.ethWalletAddress != null) {
            FormHelper.addOrReplaceFormControl(form, 'ethWalletAddress',
                new FormControl({value: this.ethWalletAddress, disabled: true}));
        } else {
            FormHelper.addOrReplaceFormControl(form, 'ethWalletAddress',
                new FormControl({value: '', disabled: false}));
        }
        
        if (this.multimedia != null) {

            const formArray: Array<FormGroup> = [];
            for (let i = 0; i < this.multimedia.length; i++) {
                const mm: ImprovedMultimedia = this.multimedia[i];
                const mmFG: FormGroup = new FormGroup({});
                mm.populateFormValues(mmFG, false);

                formArray.push(mmFG);
            }
            FormHelper.addOrReplaceFormControl(form, 'multimedia', new FormArray(formArray, [Validators.required, Validators.minLength(2)]));
        } else {
            FormHelper.addOrReplaceFormControl(form, 'multimedia', new FormArray([], [Validators.required, Validators.minLength(2)]));
        }
    }

    updateFromFormValues(form: FormGroup): void {
        if (form != null) {
            if (form.contains('btcWalletAddress')) {
                this.btcWalletAddress = form.get('btcWalletAddress').value;
            }

            if (form.contains('ethWalletAddress')) {
                this.ethWalletAddress = form.get('ethWalletAddress').value;
            }
        }
    }
    
    populateMultimediaFormValues(form: FormGroup): void {
        if (this.multimedia != null) {

            const formArray: Array<FormGroup> = [];
            for (let i = 0; i < this.multimedia.length; i++) {
                const mm: ImprovedMultimedia = this.multimedia[i];
                const mmFG: FormGroup = new FormGroup({});
                mm.populateFormValues(mmFG, false);

                formArray.push(mmFG);
            }
            FormHelper.addOrReplaceFormControl(form, 'multimedia', new FormArray(formArray, [Validators.minLength(2)]));
        } else {
            FormHelper.addOrReplaceFormControl(form, 'multimedia', new FormArray([], [Validators.minLength(2)]));
        }
    }

    constructor() {
    }
}
