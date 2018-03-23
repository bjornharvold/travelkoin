/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ServiceWorkerModule} from '@angular/service-worker';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {AppRoutingModule} from './app-routing.module';
import {environment} from '../environments/environment';
import {CoreModule} from './core/core.module';
import {SharedModule} from './shared/shared.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MediaTypeHttpInterceptorService} from './core/media-type-http-interceptor.service';
import {AuthenticationHttpInterceptorService} from './core/authentication-http-interceptor.service';
import {TimezoneOffsetHttpInterceptorService} from './core/timezone-offset-http-interceptor.service';
import {ServerErrorHttpInterceptorService} from './core/server-error-http-interceptor.service';
import {LogoComponent} from './logo/logo.component';
import {PaymentgatewayComponent} from './home/payment-gateway/payment-gateway.component';
import {WhatAreYouWaitingForComponent} from './home/what-are-you-waiting-for/what-are-you-waiting-for.component';
import {HomeComponent} from './home/home.component';
import {GlobalLoyaltyPlatformComponent} from './home/global-loyalty-platform/global-loyalty-platform.component';
import {MarketingHeaderComponent} from './home/marketing-header/marketing-header.component';
import {MailchimpComponent} from './home/mailchimp/mailchimp.component';
import {NutshellComponent} from './home/nutshell/nutshell.component';
import {AdvisorsComponent} from './home/advisors/advisors.component';
import {TimelineComponent} from './home/timeline/timeline.component';
import {FeaturesComponent} from './home/features/features.component';
import {TestimonialsComponent} from './home/testimonials/testimonials.component';
import {MissingTranslationHandler, MissingTranslationHandlerParams, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TermsComponent} from './terms/terms.component';
import {PrivacyComponent} from './privacy/privacy.component';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {Cloudinary} from 'cloudinary-core';
import {CloudinaryModule} from '@cloudinary/angular-5.x';
import {ShareButtonsModule} from '@ngx-share/buttons';
import {IShareButtons} from '@ngx-share/core';
import {Observable} from 'rxjs/Observable';
import {TeamComponent} from './home/team/team.component';
import {BackersComponent} from './home/backers/backers.component';
import {NewsComponent} from './home/news/news.component';
import {AirdropComponent} from './home/airdrop/airdrop.component';

/**
 * In case the key cannot be found in the translation file
 */
export class MyMissingTranslationHandler implements MissingTranslationHandler {
    handle(params: MissingTranslationHandlerParams) {
        console.warn(`|${params.key}| could not be found in the default or current language pack`);
        return `Could not translate: ${params.key}`;
    }
}

export class WebpackTranslateLoader implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
        return Observable.fromPromise(System.import(`../assets/i18n/${lang}.json`));
    }
}

export const cloudinaryLib = {
    Cloudinary: Cloudinary
};

export const cloudinaryConfig = {
    cloud_name: 'traveliko',
    upload_preset: 'traveliko_default_preset'
};

const prop: IShareButtons = {
    facebook: {
        icon: 'fab fa-facebook-f'
    },
    twitter: {
        icon: 'fab fa-twitter'
    },
    reddit: {
        icon: 'fab fa-reddit-alien'
    },
    linkedin: {
        icon: 'fab fa-linkedin-in'
    },
    google: {
        icon: 'fab fa-google-plus-g'
    },
    pinterest: {
        icon: 'fab fa-pinterest-p'
    },
    telegram: {
        icon: 'fab fa-telegram-plane'
    },
    tumblr: {
        icon: 'fab fa-tumblr'
    }
};

@NgModule({
    imports: [
        BrowserModule,
        SharedModule,
        BrowserAnimationsModule,
        ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
        HttpClientModule,
        NgbModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: WebpackTranslateLoader
            },
            missingTranslationHandler: {provide: MissingTranslationHandler, useClass: MyMissingTranslationHandler}
        }),
        CloudinaryModule.forRoot(cloudinaryLib, cloudinaryConfig),
        ShareButtonsModule.forRoot({prop: prop}),
        CoreModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        LogoComponent,
        FeaturesComponent,
        AdvisorsComponent,
        PaymentgatewayComponent,
        WhatAreYouWaitingForComponent,
        MarketingHeaderComponent,
        GlobalLoyaltyPlatformComponent,
        NutshellComponent,
        TestimonialsComponent,
        TimelineComponent,
        MailchimpComponent,
        HomeComponent,
        AirdropComponent,
        TermsComponent,
        PrivacyComponent,
        TeamComponent,
        BackersComponent,
        NewsComponent
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: MediaTypeHttpInterceptorService,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TimezoneOffsetHttpInterceptorService,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthenticationHttpInterceptorService,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ServerErrorHttpInterceptorService,
            multi: true,
        }]
})
export class AppModule {
}
