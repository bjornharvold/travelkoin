/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-multimedia-div',
    templateUrl: './multimedia-div.component.html',
    styleUrls: ['./multimedia-div.component.scss']
})
export class MultimediaDivComponent implements OnInit {

    @Input() type: string;
    @Input() identifier: string;
    @Input() source: string;
    @Input() thumbnail = false;

    ngOnInit() {
    }

    constructor() {
    }

}
