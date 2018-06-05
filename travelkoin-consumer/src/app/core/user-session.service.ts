/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */


import {map, mergeMap, switchMap} from 'rxjs/operators';
import {EventEmitter, Injectable, Output} from '@angular/core';
import {AuthenticationTokenService} from './authentication-token.service';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from '@angular/router';
import {UserService} from './user.service';
import * as firebase from 'firebase';
import {User} from '../model/user';
import {of as observableOf, Observable} from 'rxjs';


@Injectable({providedIn: 'root'})
export class UserSessionService {
    private authUser: firebase.User = null;
    @Output() userAuthenticatedEvent: EventEmitter<firebase.User>;
    @Output() rememberMeEvent: EventEmitter<firebase.User>;
    @Output() userLoggedOutEvent: EventEmitter<any>;
    @Output() userAuthenticationFailedEvent: EventEmitter<any>;

    /**
     * Returns the newly created user
     * @param {firebase.User} user
     * @returns {Observable<User | null>}
     */
    private createUser(user: firebase.User): Observable<User | null> {
        const newUser: User = new User();
        newUser.uid = user.uid;
        newUser.email = user.email;
        newUser.approved = false;
        newUser.blocked = false;
        newUser.submitted = false;
        newUser.whitelisted = false;

        return this.userService.set(newUser.uid, newUser).pipe(
            map(() => newUser));
    }

    private figureItOut(authUser: firebase.User, dbUser: User): Observable<User | null> {
        let result: Observable<User | null>;

        if (dbUser != null && dbUser.uid != null) {
            result = observableOf(dbUser);
        } else {
            result = this.createUser(authUser);
        }

        return result;
    }

    /**
     * Retrieves the user, creates a user session at the same time
     * @returns {user}
     */
    getAuthUser(): Observable<firebase.User | null> {
        let result: Observable<firebase.User | null>;
        if (this.authUser != null) {
            result = observableOf(this.authUser);
        } else {
            result = this.afAuth.authState;
        }
        return result;
    }

    getUser(): Observable<User | null> {
        return this.afAuth.authState.pipe(
            switchMap((user: firebase.User) => user != null ? this.userService.get(user.uid) : observableOf(null)));
    }

    updateUser(uid: string, user: User): Observable<void> {
        return this.userService.update(uid, user);
    }

    /**
     * Authenticates the user with the REST end point
     * @returns {boolean}
     * @param user
     */
    login(user: firebase.User): Observable<User | null> {
        let result: Observable<User | null>;

        if (user != null) {
            // set the user in memory
            this.authUser = user;

            // tell everyone who's listening that the user logged in
            this.userAuthenticatedEvent.emit(this.authUser);

            // we also need to see if we have to create the user in Firestore
            result = this.getUser().pipe(mergeMap((dbUser: User) => this.figureItOut(user, dbUser)));
        }
        else {
            console.error('User is not properly logged in');
            result = observableOf(null);
        }

        return result;
    }

    /**
     * Logs user out on both the server and the SPA
     */
    logout(): void {
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
