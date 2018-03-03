import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import * as moment from 'moment';
import {DateService} from '../../core/date.service';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../../environments/environment';

@Component({
    selector: 'app-home-event-finished',
    templateUrl: './event-finished.component.html',
    styleUrls: ['./event-finished.component.scss']
})
export class EventFinishedComponent implements OnInit, OnDestroy {
    private alive = true;
    private eventEndTimeEpochInMilliseconds = environment.eventEndTimeEpochInMilliseconds;
    hasEnded = false;

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        const now: moment.Moment = DateService.getInstanceOfNow();
        const countdownDate: moment.Moment = DateService.timestampToMoment(this.eventEndTimeEpochInMilliseconds);

        if (DateService.isAfter(now, countdownDate)) {
            this.hasEnded = true;
        }

        Observable.interval(1000)
            .takeWhile(() => this.alive && !this.hasEnded)
            .subscribe(() => {
                const now = new Date().getTime();
                if (this.eventEndTimeEpochInMilliseconds < new Date().getTime()) {
                    this.hasEnded = true;
                }
            });
    }

    constructor() {
    }

}
