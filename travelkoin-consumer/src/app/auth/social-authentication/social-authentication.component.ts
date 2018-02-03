import {Component, EventEmitter, NgZone, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import * as firebase from 'firebase';
import {UserSessionService} from '../../core/user-session.service';
import {AngularFireAuth} from 'angularfire2/auth';
import {environment} from '../../../environments/environment';
import {User} from '../../model/user';
import AuthProvider = firebase.auth.AuthProvider;

const REDIRECT_URL: string = '/secure/dashboard';

@Component({
    selector: 'app-auth-social-authentication',
    templateUrl: './social-authentication.component.html',
    styleUrls: ['./social-authentication.component.scss']
})
export class SocialAuthenticationComponent implements OnInit {
    loading = false;
    @Output() onResponse: EventEmitter<string>;

    private login(promise: Promise<any>): void {
        this.loading = true;
        Observable.fromPromise(promise)
            .subscribe((result: any) => {
                    this.ngZone.run(() => {
                        const user: firebase.User = this.afAuth.auth.currentUser;
                        this.userSessionService.login(user)
                            .subscribe((user: User) => {
                            this.router.navigate([REDIRECT_URL]);
                        });
                    });
                },
                error => {
                    this.ngZone.run(() => {
                        this.loading = false;
                        this.onResponse.emit(error.message);
                    });
                },
                () => {
                    this.loading = false;
                });
    }

    private auth(provider: AuthProvider): void {
        this.onResponse.emit(null);

        if (environment.production) {
            Observable.fromPromise(this.afAuth.auth.setPersistence(firebase.auth.Auth.Persistence.NONE))
                .subscribe(() => {
                    this.login(this.afAuth.auth.signInWithPopup(provider));
                });
        } else {
            this.login(this.afAuth.auth.signInWithPopup(provider));
        }
    }

    signInWithGoogle(): void {
        this.auth(new firebase.auth.GoogleAuthProvider());
    }

    signInWithFacebook(): void {
        this.auth(new firebase.auth.FacebookAuthProvider());
    }

    signInWithTwitter(): void {
        this.auth(new firebase.auth.TwitterAuthProvider());
    }

    signInWithGithub(): void {
        this.auth(new firebase.auth.GithubAuthProvider());
    }

    ngOnInit() {
    }

    constructor(private router: Router,
                private userSessionService: UserSessionService,
                private afAuth: AngularFireAuth,
                private ngZone: NgZone) {
        this.onResponse = new EventEmitter(true);
    }

}
