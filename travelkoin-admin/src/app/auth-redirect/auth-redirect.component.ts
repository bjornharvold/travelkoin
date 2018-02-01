import {Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AngularFireAuth} from 'angularfire2/auth';
import {Observable} from 'rxjs/Observable';
import {UserSessionService} from '../core/user-session.service';
import {environment} from '../../environments/environment';
import * as firebase from 'firebase';

@Component({
    selector: 'app-auth-redirect',
    templateUrl: './auth-redirect.component.html',
    styleUrls: ['./auth-redirect.component.scss']
})
export class AuthRedirectComponent implements OnInit {
    private login(promise: Promise<firebase.User>): void {
        Observable.fromPromise(promise)
            .subscribe((result: firebase.User) => {
                this.ngZone.run(() => {
                    console.log(result);
                    this.userSessionService.login(result);
                    window.close();
                });
            });
    }

    private auth(authToken: string): void {
        console.log(authToken);
        if (environment.production) {
            Observable.fromPromise(this.afAuth.auth.setPersistence(firebase.auth.Auth.Persistence.NONE))
                .subscribe(() => {
                    this.login(this.afAuth.auth.signInWithCustomToken(authToken));
                });
        } else {
            this.login(this.afAuth.auth.signInWithCustomToken(authToken));
        }
    }

    ngOnInit() {
        const code = this.route.snapshot.queryParamMap.get('code');
        if (code) {
            console.log(`code: ${code}`);
            const url = `https://us-central1-travelkoin-bc173.cloudfunctions.net/token?code=${code}`;
            this.http.post<any>(url, {})
                .subscribe(res => {
                    console.log(res);
                    this.auth(res.authToken);
                })
        }
    }

    constructor(private http: HttpClient,
                private route: ActivatedRoute,
                private userSessionService: UserSessionService,
                private afAuth: AngularFireAuth,
                private ngZone: NgZone) {
    }
}
