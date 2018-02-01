import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {UserSessionService} from './user-session.service';
import {User} from '../model/user';

@Injectable()
export class RegisteredGuard implements CanActivate, CanLoad {
    private isRegistered(url: string): Observable<boolean> {
        return this.userSessionService.getUser()
            .map((user: User) => {
                let result = true;

                if (user == null) {
                    result = false;
                } else if (user.multimedia == null || user.multimedia.length < 2) {
                    result = false;
                }

                // this is where we handle page state in case the documents have not yet been uploaded
                if (result) {
                    this.router.navigate(['/secure/forms']);
                }

                return result;
            });
    }

    // ===== IMPLEMENTED INTERFACES =====
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const url: string = state.url;

        return this.isRegistered(url);
    }

    canLoad(route: Route): Observable<boolean> {
        const url = `/${route.path}`;

        return this.isRegistered(url);
    }

    constructor(private readonly userSessionService: UserSessionService,
                private readonly router: Router) {
    }
}
