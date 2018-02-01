/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-success-box',
    templateUrl: './success-box.component.html',
    styleUrls: ['./success-box.component.scss']
})
export class SuccessBoxComponent implements OnInit {
    @Input() url: string;
    @Input() headerText = 'SUCCESS_BOX.SUCCESS';
    @Input() mainText = 'SUCCESS_BOX.RECORD_SUCCESS';
    @Input() buttonText = 'SUCCESS_BOX.CONTINUE';
    @Output() buttonClicked: EventEmitter<boolean>;
    date: Date;

    clicked(): void {
        if (this.url != null) {
            this.router.navigate([this.url]);
        } else {
            this.buttonClicked.emit(true);
        }
    }

    ngOnInit() {
        this.date = new Date();
    }

    constructor(private router: Router) {
        this.buttonClicked = new EventEmitter(true);
    }
}
