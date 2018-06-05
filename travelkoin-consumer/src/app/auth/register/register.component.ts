/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {EmailValidators, PasswordValidators} from 'ng2-validators';
import {UserSessionService} from '../../core/user-session.service';
import * as firebase from 'firebase';
import {from as observableFrom, Observable} from 'rxjs';
import {AngularFireAuth} from 'angularfire2/auth';
import {environment} from '../../../environments/environment';
import ActionCodeSettings = firebase.auth.ActionCodeSettings;
import {takeWhile} from 'rxjs/operators';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
    private alive = true;
    private actionCodeSettings: ActionCodeSettings = {
        url: environment.siteUrl + '/auth/login;verified=true'
    };
    loading = false;
    message: string = null;
    registerForm: FormGroup;
    // NOTE: this took FOREVER. If you want to inject anything into a validator your have to bind like this example [BH]
    username: FormControl = new FormControl(
        '',
        [Validators.required, EmailValidators.normal]
    );
    password: FormControl = new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64),
        PasswordValidators.alphabeticalCharacterRule(1),
        PasswordValidators.digitCharacterRule(1),
        PasswordValidators.lowercaseCharacterRule(1),
        PasswordValidators.uppercaseCharacterRule(1),
        PasswordValidators.specialCharacterRule(1)
    ]);
    confirmPassword = new FormControl('');

    private validateEmail(): void {
        const user: firebase.User = this.afAuth.auth.currentUser;
        if (user != null) {
            observableFrom(user.sendEmailVerification(this.actionCodeSettings)).pipe(
                takeWhile(() => this.alive))
                .subscribe(result => {
                        // console.log(result);
                        this.router.navigate(['/auth/login', {verified: false}]);
                    }, error => {
                        this.message = error.message;
                    },
                    () => {
                    }
                )
        }
    }

    private login(promise: Promise<any>): void {
        this.loading = true;
        observableFrom(promise)
            .subscribe((result: any) => {
                    this.ngZone.run(() => {
                        this.validateEmail();
                    });
                },
                error => {
                    this.ngZone.run(() => {
                        this.loading = true;
                        this.message = error.message
                    });
                },
                () => {
                    this.loading = true;
                });
    }

    updateMessage(message: string): void {
        this.message = message;
    }

    createUserWithEmailAndPassword(): void {
        this.message = null;

        this.login(this.afAuth.auth.createUserWithEmailAndPassword(this.username.value, this.password.value));
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        // for registering user
        this.registerForm = this.fb.group({
            username: this.username,
            password: this.password,
            confirmPassword: this.confirmPassword
        });

        this.registerForm.setValidators(PasswordValidators.mismatchedPasswords('password', 'confirmPassword'));

    }

    constructor(private fb: FormBuilder,
                private userSessionService: UserSessionService,
                private router: Router,
                private afAuth: AngularFireAuth,
                private ngZone: NgZone) {
    }

}
