import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit, OnDestroy {
    private alive = true;
    type: string = null;
    listView = true;

    showTransactionView(): void {
        this.listView = false;
    }

    showListView(): void {
        this.listView = true;
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.activatedRoute.params
            .map(params => params['type'])
            .takeWhile(() => this.alive)
            .subscribe(type => {
                    if (type != null) {
                        this.type = type;
                        this.listView = true;
                    }
                }
            );
    }

    constructor(private activatedRoute: ActivatedRoute) {
    }

}
