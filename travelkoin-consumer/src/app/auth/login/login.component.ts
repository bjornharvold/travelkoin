/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserSessionService} from '../../core/user-session.service';
import {environment} from '../../../environments/environment';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase';
import {Observable} from 'rxjs/Observable';
import {User} from '../../model/user';

const REDIRECT_URL: string = '/secure/dashboard';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    private alive = true;
    loading = false;
    authenticated = false;
    environment: string = environment.environment;
    loginForm: FormGroup;
    message: string = null;
    verified: boolean = null;
    username: FormControl = new FormControl('', Validators.required);
    password: FormControl = new FormControl('', Validators.required);

    private login(promise: Promise<any>): void {
        this.loading = true;
        Observable.fromPromise(promise)
            .subscribe((result: any) => {
                    this.ngZone.run(() => {
                        const user: firebase.User = this.afAuth.auth.currentUser;
                        if (user.emailVerified === true) {
                            // at this point we can save / update the user in Firestore
                            this.userSessionService.login(user)
                                .subscribe((user: User) => {
                                    this.router.navigate([REDIRECT_URL]);
                                });
                        } else {
                            this.verified = false;
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

    updateMessage(message: string): void {
        this.message = message;
    }

    signInWithUsernameAndPassword(): void {
        this.message = null;

        let persistence: firebase.auth.Auth.Persistence = firebase.auth.Auth.Persistence.LOCAL;

        Observable.fromPromise(this.afAuth.auth.setPersistence(persistence))
            .subscribe(() => {
                this.login(this.afAuth.auth.signInWithEmailAndPassword(this.username.value, this.password.value));
            });
    }

    logout(): void {
        this.userSessionService.logout();
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.userSessionService.getAuthUser()
            .takeWhile(() => this.alive)
            .subscribe((user: firebase.User) => {
                if (user != null) {
                    this.authenticated = true;
                }
            });

        this.loginForm = this.fb.group({
            username: this.username,
            password: this.password
        });

        this.activatedRoute.params
            .map(params => params['verified'])
            .takeWhile(() => this.alive)
            .subscribe(verified => {
                if (verified != null) {
                    this.verified = eval(verified);
                    }
                }
            );

        this.userSessionService.userLoggedOutEvent
            .takeWhile(() => this.alive)
            .subscribe(() => {
                this.authenticated = false;
            });

        this.userSessionService.userAuthenticatedEvent
            .takeWhile(() => this.alive)
            .subscribe(() => {
                this.authenticated = true;
            })
    }

    constructor(private userSessionService: UserSessionService,
                private fb: FormBuilder,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private afAuth: AngularFireAuth,
                private ngZone: NgZone) {
    }
}
