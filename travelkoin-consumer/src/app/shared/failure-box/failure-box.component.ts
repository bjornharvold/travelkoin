/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-failure-box',
    templateUrl: './failure-box.component.html',
    styleUrls: ['./failure-box.component.scss']
})
export class FailureBoxComponent implements OnInit {
    @Input() url: string;
    @Input() failureHeaderText = 'FAILURE_BOX.FAILURE';
    @Input() failureMainText = 'FAILURE_BOX.RECORD_FAILURE';
    @Input() failureButtonText = 'FAILURE_BOX.TRY_AGAIN';
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
