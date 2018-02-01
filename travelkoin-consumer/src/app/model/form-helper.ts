/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {AbstractControl, FormGroup} from '@angular/forms';

export class FormHelper {

    static addOrReplaceFormControl(formGroup: FormGroup, name: string, formControl: AbstractControl): void {
        if (formGroup.get(name) != null) {
            formGroup.setControl(name, formControl);
        } else {
            formGroup.addControl(name, formControl);
        }
    }

    static enableOrDisableFormControl(formGroup: FormGroup, name: string, readOnly: boolean): void {
        if (formGroup.get(name) != null) {
            if (readOnly) {
                formGroup.get(name).disable();
            } else {
                formGroup.get(name).enable();
            }
        }
    }

    static updateFormControl(formGroup: FormGroup, name: string, formControl: AbstractControl): void {
        if (formGroup.get(name) != null) {
            formGroup.get(name).setValue(formControl.value);
            FormHelper.enableOrDisableFormControl(formGroup, name, formControl.disabled);
        } else {
            formGroup.addControl(name, formControl);
        }
    }

}
