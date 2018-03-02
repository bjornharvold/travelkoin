import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-secure-user-status',
    templateUrl: './user-status.component.html',
    styleUrls: ['./user-status.component.scss']
})
export class UserStatusComponent implements OnInit {
    @Input() blocked: boolean;
    @Input() whitelisted: boolean;
    @Input() account: string;

    ngOnInit() {
    }

    constructor() {
    }

}
