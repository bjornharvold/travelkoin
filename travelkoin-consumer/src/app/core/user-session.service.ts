/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {EventEmitter, Injectable, Output} from '@angular/core';
import {AuthenticationTokenService} from './authentication-token.service';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';
import {UserService} from './user.service';
import * as firebase from 'firebase';
import {User} from '../model/user';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UserSessionService {
    private authUser: firebase.User = null;
    private redirectUrl: string = null; // used if user needs to log in and return to previous url
    @Output() userAuthenticatedEvent: EventEmitter<firebase.User>;
    @Output() rememberMeEvent: EventEmitter<firebase.User>;
    @Output() userLoggedOutEvent: EventEmitter<any>;
    @Output() userAuthenticationFailedEvent: EventEmitter<any>;

    private createUser(user: firebase.User): void {
        const newUser: User = new User();
        newUser.uid = user.uid;
        newUser.email = user.email;

        this.userService.set(newUser.uid, newUser)
            .subscribe(() => {
                    // console.log('user created successfully');
                },
                error => {
                    console.log(error);
                })
    }

    private loginPostProcess(user: firebase.User): void {
        if (user != null) {
            // set the user in memory
            this.authUser = user;

            // tell everyone who's listening that the user logged in
            this.userAuthenticatedEvent.emit(this.authUser);

            // we also need to see if we have to create the user in Firestore
            this.userService.get(user.uid)
                .subscribe((dbUser: User) => {
                    if (dbUser == null) {
                        this.createUser(user);
                    }
                });
        } else {
            console.error('User is not properly logged in');
        }
    }

    /**
     * Retrieves the user, creates a user session at the same time
     * @returns {user}
     */
    getAuthUser(): Observable<firebase.User | null> {
        let result: Observable<firebase.User | null>;
        if (this.authUser != null) {
            result = Observable.of(this.authUser);
        } else {
            result = this.afAuth.authState;
        }
        return result;
    }

    getUser(): Observable<User | null> {
        return this.afAuth.authState
            .switchMap((user: firebase.User) => user != null ? this.userService.get(user.uid) : Observable.of(null));
    }

    updateUser(uid: string, user: Partial<User>): Observable<void> {
        return this.userService.update(uid, user);
    }

    /**
     * Authenticates the user with the REST end point
     * @returns {boolean}
     * @param user
     */
    login(user: firebase.User) {
        this.loginPostProcess(user);

        // finally we go back to where the user came from
        let redirectUrl = '/secure/dashboard'; // default
        if (this.redirectUrl != null) {
            redirectUrl = this.redirectUrl;
        }

        this.router.navigate([redirectUrl]);
    }

    /**
     * Logs user out on both the server and the SPA
     */
    logout(): void {
        this.redirectUrl = null;
        this.authUser = null;

        // remove auth token globally
        this.userLoggedOutEvent.emit({});

        // log out the social user as well
        this.afAuth.auth.signOut();

        this.router.navigate(['/']);
    }


    // ===== IMPLEMENTED INTERFACES =====

    constructor(private router: Router,
                private authenticationTokenService: AuthenticationTokenService,
                private afAuth: AngularFireAuth,
                private userService: UserService) {
        this.userAuthenticatedEvent = new EventEmitter(true);
        this.userAuthenticationFailedEvent = new EventEmitter(true);
        this.userLoggedOutEvent = new EventEmitter(true);
        this.rememberMeEvent = new EventEmitter(true);

        afAuth.authState
            .subscribe((user: firebase.User) => {
                if (user != null && user.uid != null) {
                    // tell everyone who's listening that the user logged in
                    this.rememberMeEvent.emit(user);
                }
            });
    }
}
