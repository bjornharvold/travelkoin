/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {FormControl, FormGroup} from '@angular/forms';
import {FormHelper} from './form-helper';

export class ImprovedMultimedia {
    identifier: string;
    width: number;
    height: number;
    type: string;

    // transient: used only while uploading
    fileUid: string;
    fileName: string;
    fileExt: string;
    fileSize: number;
    uploading = false;
    uploadPercent = 0;

    static deserializeObject(obj: any): ImprovedMultimedia {
        const result: ImprovedMultimedia = new ImprovedMultimedia();

        if (obj != null) {
            if (obj.identifier != null) {
                result.identifier = obj.identifier;
            }
            if (obj.width != null) {
                result.width = obj.width;
            }
            if (obj.height != null) {
                result.height = obj.height;
            }
            if (obj.type != null) {
                result.type = obj.type;
            }
        }
        return result;
    }

    static serializeObject(dto: ImprovedMultimedia): any {
        return {
            identifier: dto.identifier,
            type: dto.type,
            width: dto.width,
            height: dto.height
        };
    }

    populateFormValues(formGroup: FormGroup, readOnly: boolean): void {

        if (this.identifier != null) {
            FormHelper.addOrReplaceFormControl(formGroup, 'identifier',
                new FormControl({value: this.identifier, disabled: readOnly}));
        } else {
            FormHelper.addOrReplaceFormControl(formGroup, 'identifier',
                new FormControl({value: '', disabled: readOnly}));
        }

        if (this.width != null) {
            FormHelper.addOrReplaceFormControl(formGroup, 'width',
                new FormControl({value: this.width, disabled: readOnly}));
        } else {
            FormHelper.addOrReplaceFormControl(formGroup, 'width',
                new FormControl({value: '', disabled: readOnly}));
        }

        if (this.height != null) {
            FormHelper.addOrReplaceFormControl(formGroup, 'height',
                new FormControl({value: this.height, disabled: readOnly}));
        } else {
            FormHelper.addOrReplaceFormControl(formGroup, 'height',
                new FormControl({value: '', disabled: readOnly}));
        }

        if (this.type != null) {
            FormHelper.addOrReplaceFormControl(formGroup, 'type',
                new FormControl({value: this.type, disabled: readOnly}));
        } else {
            FormHelper.addOrReplaceFormControl(formGroup, 'type',
                new FormControl({value: '', disabled: readOnly}));
        }
    }

    updateFromFormValues(formGroup: FormGroup): void {
        if (formGroup != null) {

            if (formGroup.contains('identifier')) {
                this.identifier = formGroup.get('identifier').value;
            }

            if (formGroup.contains('width')) {
                this.width = formGroup.get('width').value;
            }

            if (formGroup.contains('height')) {
                this.height = formGroup.get('height').value;
            }

            if (formGroup.contains('type')) {
                this.type = formGroup.get('type').value;
            }

        }
    }

}
