import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
    selector: 'app-secure',
    templateUrl: './secure.component.html',
    styleUrls: ['./secure.component.scss']
})
export class SecureComponent implements OnInit {
    isChromeDesktop = false;

    ngOnInit() {
        this.isChromeDesktop = this.deviceService.isDesktop() && this.deviceService.browser === 'chrome';
    }

    constructor(private deviceService: DeviceDetectorService) {
    }
}
