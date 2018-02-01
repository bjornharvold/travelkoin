/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import 'rxjs/add/operator/takeWhile';

@Component({
    selector: 'app-home-marketing-header',
    templateUrl: './marketing-header.component.html',
    styleUrls: ['./marketing-header.component.scss']
})
export class MarketingHeaderComponent implements OnInit, OnDestroy {
    private alive = true;

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
    }

    constructor(private router: Router) {

        // TODO this is fugly but fragments are currently not working with Angular 4
        router.events
            .takeWhile(() => this.alive)
            .subscribe(event => {
                if (event instanceof NavigationEnd) {
                    const tree = router.parseUrl(router.url);
                    if (tree.fragment) {
                        const element = document.querySelector('#' + tree.fragment);
                        if (element != null) {
                            element.scrollIntoView(true);
                        }
                    }
                }
            });
    }

}
