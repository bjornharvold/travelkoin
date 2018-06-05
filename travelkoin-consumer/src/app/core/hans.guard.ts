import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {UserSessionService} from './user-session.service';
import {AngularFireAuth} from 'angularfire2/auth';
import {User} from '../model/user';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class HansGuard implements CanActivate, CanLoad {
    private isHans(url: string): Observable<boolean> {
        return this.userSessionService.getUser().pipe(
            map((user: User) => user.isHans));
    }

    // ===== IMPLEMENTED INTERFACES =====
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const url: string = state.url;

        return this.isHans(url);
    }

    canLoad(route: Route): Observable<boolean> {
        const url = `/${route.path}`;

        return this.isHans(url);
    }

    constructor(private readonly afAuth: AngularFireAuth,
                private readonly userSessionService: UserSessionService) {
    }
}
