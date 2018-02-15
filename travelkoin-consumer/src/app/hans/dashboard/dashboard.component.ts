import {Component, OnInit} from '@angular/core';
import {MandrillService} from '../../core/mandrill.service';

@Component({
    selector: 'app-hans-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    ngOnInit() {
    }

    sendEmail(): void {
        this.mandrillService.sendEmail('bjorn@harvold.com');
    }

    constructor(private mandrillService: MandrillService) {
    }
}
