/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegisterComponent} from './register/register.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {LoginComponent} from './login/login.component';
import {PhoneVerifierComponent} from './phone-verifier/phone-verifier.component';
import {PhoneGuardService} from './phone-guard.service';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'verify',
        component: PhoneVerifierComponent,
        canLoad: [PhoneGuardService],
        canActivate: [PhoneGuardService]
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'forgot',
        component: ForgotPasswordComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class AuthRoutingModule {
}
