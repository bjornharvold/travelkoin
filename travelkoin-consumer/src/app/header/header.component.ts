/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserSessionService} from '../core/user-session.service';
import {NavigationEnd, Router} from '@angular/router';
import {KeyValuePair} from '../model/key-value-pair';
import {Language} from '../model/language';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../../environments/environment';
import * as firebase from 'firebase';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
    private alive = true;
    isAuth = false;
    isCollapsed = true;
    isHome = false;
    languages: Array<KeyValuePair>;
    credentials: firebase.User = null;
    language: string;
    languageEnabled = environment.featureLanguage;
    loginEnabled = environment.featureLogin;
    showMobileNav = false;
    showLanguageWarning = false;

    logout(): void {
        this.userSessionService.logout();
    }

    toggleCollapsed(): void {
        this.isCollapsed = !this.isCollapsed;
    }

    completeLanguageDialogClose(): void {
        this.showLanguageWarning = false;
    }

    changeLanguage(languageCode: string): void {
        if (this.translateService.getLangs().indexOf(languageCode) > -1) {
            this.translateService.use(languageCode);
            this.language = languageCode;
        } else {
            this.showLanguageWarning = true;
        }
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.userSessionService.userAuthenticatedEvent
            .takeWhile(() => this.alive)
            .subscribe((user: firebase.User) => {
                this.credentials = user;
            });

        this.userSessionService.rememberMeEvent
            .takeWhile(() => this.alive)
            .subscribe((user: firebase.User) => {
                this.credentials = user;
            });

        this.userSessionService.userLoggedOutEvent
            .takeWhile(() => this.alive)
            .subscribe(() => {
                this.credentials = null;
            });

        this.userSessionService.userAuthenticationFailedEvent
            .takeWhile(() => this.alive)
            .subscribe(() => {
                this.credentials = null;
            });

        this.router.events
            .takeWhile(() => this.alive)
            .subscribe((val) => {
                if (val instanceof NavigationEnd) {
                    const nav: NavigationEnd = <NavigationEnd>val;
                    this.isHome = nav.url === '/';
                    this.isAuth = nav.url.indexOf('/auth/') > -1;
                }
            });

        this.languages = Language.getSupportedLanguages();
        this.language = this.translateService.currentLang;
    }

    constructor(private router: Router,
                private translateService: TranslateService,
                private userSessionService: UserSessionService,
                private config: NgbDropdownConfig) {
        // config.placement = 'top-left';
        config.autoClose = true;
    }
}
