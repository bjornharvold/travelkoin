import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormHelper} from './form-helper';

export class Transaction {
    amount: number;
    sender: string;
    recipient: string;
    type: string;
    transactionID: string;

    static serializeObject(dto: Transaction): any {
        return {
            amount: dto.amount,
            sender: dto.sender,
            recipient: dto.recipient,
            transactionID: dto.transactionID,
            type: dto.type
        };
    }

    static deserializeObject(obj: any): Transaction {
        let result: Transaction = null;

        if (obj != null) {
            if (obj.sender != null && obj.type != null && obj.recipient != null) {
                result = new Transaction(obj.type, obj.recipient, obj.sender);

                if (obj.amount != null) {
                    result.amount = obj.amount;
                }
                if (obj.transactionID != null) {
                    result.transactionID = obj.transactionID;
                }
            }
        }

        return result;
    }

    resetForm(form: FormGroup): void {
        if (form.contains('amount')) {
            FormHelper.addOrReplaceFormControl(form, 'amount',
                new FormControl({value: '', disabled: false}, {validators: Validators.required}));
        }
        if (form.contains('transactionID')) {
            FormHelper.addOrReplaceFormControl(form, 'transactionID',
                new FormControl({value: '', disabled: false}, {validators: Validators.required}));
        }
    }

    populateFormValues(form: FormGroup): void {
        if (this.amount != null) {
            FormHelper.addOrReplaceFormControl(form, 'amount',
                new FormControl({value: this.amount, disabled: false}, {validators: Validators.required}));
        } else {
            FormHelper.addOrReplaceFormControl(form, 'amount',
                new FormControl({value: '', disabled: false}, {validators: Validators.required}));
        }
        if (this.sender != null) {
            FormHelper.addOrReplaceFormControl(form, 'sender',
                new FormControl({value: this.sender, disabled: true}, {validators: Validators.required}));
        } else {
            FormHelper.addOrReplaceFormControl(form, 'sender',
                new FormControl({value: '', disabled: true}, {validators: Validators.required}));
        }
        if (this.recipient != null) {
            FormHelper.addOrReplaceFormControl(form, 'recipient',
                new FormControl({value: this.recipient, disabled: true}, {validators: Validators.required}));
        } else {
            FormHelper.addOrReplaceFormControl(form, 'recipient',
                new FormControl({value: '', disabled: true}, {validators: Validators.required}));
        }
        if (this.type != null) {
            FormHelper.addOrReplaceFormControl(form, 'type',
                new FormControl({value: this.type, disabled: true}, {validators: Validators.required}));
        } else {
            FormHelper.addOrReplaceFormControl(form, 'type',
                new FormControl({value: '', disabled: true}, {validators: Validators.required}));
        }
        if (this.transactionID != null) {
            FormHelper.addOrReplaceFormControl(form, 'transactionID',
                new FormControl({value: this.transactionID, disabled: false}, {validators: Validators.required}));
        } else {
            FormHelper.addOrReplaceFormControl(form, 'transactionID',
                new FormControl({value: '', disabled: false}, {validators: Validators.required}));
        }
    }

    updateFromFormValues(form: FormGroup): void {
        if (form != null) {
            if (form.contains('amount')) {
                this.amount = form.get('amount').value;
            }

            if (form.contains('sender')) {
                this.sender = form.get('sender').value;
            }

            if (form.contains('recipient')) {
                this.recipient = form.get('recipient').value;
            }

            if (form.contains('type')) {
                this.type = form.get('type').value;
            }

            if (form.contains('transactionID')) {
                this.transactionID = form.get('transactionID').value;
            }
        }
    }

    constructor(type: string, recipient: string, sender: string) {
        this.type = type;
        this.recipient = recipient;
        this.sender = sender;
    }
}
