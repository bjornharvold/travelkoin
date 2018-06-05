import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import * as firebase from 'firebase';
import {AngularFireAuth} from 'angularfire2/auth';
import {UserSessionService} from './user-session.service';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthenticatedGuard implements CanActivate, CanLoad {
    private isAuthenticated(url: string): Observable<boolean> {
        return this.userSessionService.getAuthUser().pipe(
            map((user: firebase.User) => {
                return user != null && user.uid != null;
            }));
    }

    // ===== IMPLEMENTED INTERFACES =====
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const url: string = state.url;

        return this.isAuthenticated(url);
    }

    canLoad(route: Route): Observable<boolean> {
        const url = `/${route.path}`;

        return this.isAuthenticated(url);
    }

    constructor(private readonly afAuth: AngularFireAuth,
                private readonly userSessionService: UserSessionService) {
    }
}
