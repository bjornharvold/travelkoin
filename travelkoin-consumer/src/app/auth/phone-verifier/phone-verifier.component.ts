import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {AngularFireAuth} from 'angularfire2/auth';
import {UserSessionService} from '../../core/user-session.service';
import {environment} from '../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import * as firebase from 'firebase';
import {TranslateService} from '@ngx-translate/core';
import ConfirmationResult = firebase.auth.ConfirmationResult;

declare global {
    interface Window {
        recaptchaVerifier: any;
    }
}

@Component({
    selector: 'app-phone-verifier',
    templateUrl: './phone-verifier.component.html',
    styleUrls: ['./phone-verifier.component.scss']
})
export class PhoneVerifierComponent implements OnInit, OnDestroy {
    private alive = true;
    private user: firebase.User = null;
    loading = false;
    recaptchaAPIKey: string = environment.recaptchaAPIKey;
    linkPhoneForm: FormGroup;
    language = 'en';
    verifyForm: FormGroup;
    message: string = null;
    showVerificationError = false;
    phoneNumberExists: boolean = null;
    confirmationResult: ConfirmationResult = null;
    phoneNumber: FormControl = new FormControl('', Validators.required);
    captcha: FormControl = new FormControl();
    verificationCode: FormControl = new FormControl('', Validators.required);

    private doLinkPhoneNumber(promise: Promise<any>): void {
        this.loading = true;
        Observable.fromPromise(promise)
            .takeWhile(() => this.alive)
            .subscribe((result: ConfirmationResult) => {
                    this.ngZone.run(() => {
                        console.log(result);
                        this.confirmationResult = result;
                        const user = this.afAuth.auth.currentUser;
                        if (user.phoneNumber != null) {
                            this.phoneNumberExists = true;
                        }
                    });
                },
                error => {
                    this.ngZone.run(() => {
                        this.loading = false;
                        this.message = error.message
                    });
                },
                () => {
                    this.loading = false;
                });
    }

    private confirmCode(promise: Promise<any>): void {
        this.loading = true;
        Observable.fromPromise(promise)
            .takeWhile(() => this.alive)
            .subscribe((result: any) => {
                    this.ngZone.run(() => {
                        const user: firebase.User = this.afAuth.auth.currentUser;
                        this.userSessionService.login(user);
                    });
                },
                error => {
                    this.ngZone.run(() => {
                        this.loading = false;
                        this.showVerificationError = true;
                    });
                },
                () => {
                    this.loading = false;
                });
    }

    linkPhoneNumber(): void {
        this.message = null;

        this.doLinkPhoneNumber(this.afAuth.auth.signInWithPhoneNumber(this.phoneNumber.value, this.captcha.value));

    }

    enterVerificationCode(): void {
        this.message = null;
        this.confirmCode(this.confirmationResult.confirm(this.verificationCode.value));
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.user = this.afAuth.auth.currentUser;

        if (this.user != null) {
            this.phoneNumberExists = this.user.phoneNumber != null;

            if (this.phoneNumberExists === true) {

            }
        }

        this.linkPhoneForm = this.fb.group({
            phoneNumber: this.phoneNumber,
            captcha: this.captcha
        });
        this.verifyForm = this.fb.group({
            verificationCode: this.verificationCode
        });

        this.language = this.translateService.currentLang;

        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
        window.recaptchaVerifier.render();
    }

    constructor(private userSessionService: UserSessionService,
                private translateService: TranslateService,
                private fb: FormBuilder,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private afAuth: AngularFireAuth,
                private ngZone: NgZone) {
    }
}
