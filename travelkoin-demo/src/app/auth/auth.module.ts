/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {NgModule} from '@angular/core';

import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {RegisterComponent} from './register/register.component';
import {SharedModule} from '../shared/shared.module';
import {AuthRoutingModule} from './auth-routing.module';
import {LoginComponent} from './login/login.component';
import {SocialAuthenticationComponent} from './social-authentication/social-authentication.component';
import {PhoneVerifierComponent} from './phone-verifier/phone-verifier.component';
import {ReCaptchaDirective} from './re-captcha.directive';
import {PhoneGuardService} from './phone-guard.service';

@NgModule({
    imports: [
        SharedModule,
        AuthRoutingModule
    ],
    declarations: [
        RegisterComponent,
        ForgotPasswordComponent,
        LoginComponent,
        SocialAuthenticationComponent,
        PhoneVerifierComponent,
        ReCaptchaDirective
    ],
    providers: [
        PhoneGuardService
    ]
})
export class AuthModule {
}
