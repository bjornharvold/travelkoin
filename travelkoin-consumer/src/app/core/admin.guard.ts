import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {UserSessionService} from './user-session.service';
import {AngularFireAuth} from 'angularfire2/auth';
import {User} from '../model/user';

@Injectable()
export class AdminGuard implements CanActivate, CanLoad {
    private isAdmin(url: string): Observable<boolean> {
        return this.userSessionService.getUser()
            .map((user: User) => {
                return user.isHans;
            });
    }

    // ===== IMPLEMENTED INTERFACES =====
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const url: string = state.url;

        return this.isAdmin(url);
    }

    canLoad(route: Route): Observable<boolean> {
        const url = `/${route.path}`;

        return this.isAdmin(url);
    }

    constructor(private readonly afAuth: AngularFireAuth,
                private readonly userSessionService: UserSessionService) {
    }
}
