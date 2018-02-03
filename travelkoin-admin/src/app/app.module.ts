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
import {HomeComponent} from './home/home.component';
import {MissingTranslationHandler, MissingTranslationHandlerParams, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {Cloudinary} from 'cloudinary-core';
import {CloudinaryModule} from '@cloudinary/angular-5.x';
import {Observable} from 'rxjs/Observable';
import {LoginComponent} from './home/login/login.component';

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
        CoreModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        LogoComponent,
        LoginComponent,
        HomeComponent
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
