/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Language} from './model/language';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    private alive = true;

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit(): void {

        this.translate.setDefaultLang(Language.getDefaultLanguage());
        this.translate.addLangs(Language.getCurrentlyTranslatedLanguageCodes());
        this.translate.use(Language.getDefaultLanguage());

        // TODO this is FUGLY should not have direct access to window
        this.router.events
            .takeWhile(() => this.alive)
            .subscribe(event => {
                if (!(event instanceof NavigationEnd)) {
                    return;
                }
                window.scrollTo(0, 0);
            });
    }

    constructor(private router: Router,
                private translate: TranslateService) {
    }
}
