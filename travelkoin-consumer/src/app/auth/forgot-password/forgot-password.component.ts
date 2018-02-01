/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EmailValidators} from 'ng2-validators';
import {AngularFireAuth} from 'angularfire2/auth';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
    private alive = true;
    requestPasswordResetForm: FormGroup;
    email: FormControl = new FormControl('', [Validators.required, EmailValidators.normal]);
    message: string = null;
    showResetMessage = false;
    showErrorMessage = false;

    resetPassword(): void {
        this.showResetMessage = false;
        this.showErrorMessage = false;
        Observable.fromPromise(this.afAuth.auth.sendPasswordResetEmail(this.email.value))
            .takeWhile(() => this.alive)
            .subscribe(result => {
                    this.showResetMessage = true;
                }, error => {
                    this.showErrorMessage = true;
                },
                () => {
                }
            )
    }

    updateMessage(message: string): void {
        this.message = message;
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        // for resending welcome email
        this.requestPasswordResetForm = this.fb.group({
            email: this.email
        });
    }

    constructor(private fb: FormBuilder,
                private afAuth: AngularFireAuth) {
    }

}
