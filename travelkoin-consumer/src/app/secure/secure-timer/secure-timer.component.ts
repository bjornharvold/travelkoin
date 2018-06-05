import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {interval as observableInterval} from 'rxjs';
import {takeWhile} from 'rxjs/operators';

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
        observableInterval(1000).pipe(
            takeWhile(() => this.alive))
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
