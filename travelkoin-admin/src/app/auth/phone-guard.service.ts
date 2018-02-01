/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';

@Injectable()
export class PhoneGuardService implements CanActivate, CanLoad {

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const url: string = state.url;

        return this.checkLogin(url);
    }

    canLoad(route: Route): boolean {
        const url = `/${route.path}`;

        return this.checkLogin(url);
    }

    checkLogin(url: string): boolean {
        let result = false;

        if (this.afAuth.auth.currentUser != null) {
            result = true;
        } else {
            // Navigate to the login page with extras
            this.router.navigate(['/auth/login']);
        }

        return result;
    }

    constructor(private afAuth: AngularFireAuth,
                private router: Router) {
    }

}
