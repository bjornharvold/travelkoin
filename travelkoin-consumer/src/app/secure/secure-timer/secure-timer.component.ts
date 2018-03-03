import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'app-secure-secure-timer',
    templateUrl: './secure-timer.component.html',
    styleUrls: ['./secure-timer.component.scss']
})
export class SecureTimerComponent implements OnInit, OnDestroy {
    private alive = true;
    eventStartTimeEpochInMilliseconds: number = environment.eventStartTimeEpochInMilliseconds;
    eventEndTimeEpochInMilliseconds: number = environment.eventEndTimeEpochInMilliseconds;
    hasStarted = false;
    hasEnded = false;

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        Observable.interval(1000)
            .takeWhile(() => this.alive)
            .subscribe(() => {
                const now = new Date().getTime();
                if (this.eventStartTimeEpochInMilliseconds < now) {
                    this.hasStarted = true;
                }
                if (this.eventEndTimeEpochInMilliseconds < now) {
                    this.hasEnded = true;
                }
            });
    }

    constructor() {
    }

}
