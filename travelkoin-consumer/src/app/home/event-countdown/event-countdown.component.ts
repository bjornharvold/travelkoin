import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {DateService} from '../../core/date.service';
import * as moment from 'moment';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'app-home-event-countdown',
    templateUrl: './event-countdown.component.html',
    styleUrls: ['./event-countdown.component.scss']
})
export class EventCountdownComponent implements OnInit, AfterViewInit, OnDestroy {
    private alive = true;
    private eventStartTimeEpochInMilliseconds = environment.eventStartTimeEpochInMilliseconds;
    private eventEndTimeEpochInMilliseconds = environment.eventEndTimeEpochInMilliseconds;
    hasStarted = false;
    hasEnded = false;

    ngOnDestroy() {
        this.alive = false;
    }

    hasFinished(): void {
        this.hasEnded = true;
    }

    ngAfterViewInit() {
        //stuff that doesn't do view changes
        setTimeout(() => {
            const now: moment.Moment = DateService.getInstanceOfNow();
            const startDate: moment.Moment = DateService.timestampToMoment(this.eventStartTimeEpochInMilliseconds);
            const endDate: moment.Moment = DateService.timestampToMoment(this.eventEndTimeEpochInMilliseconds);

            if (DateService.isAfter(now, startDate) && DateService.isBefore(now, endDate)) {
                this.hasStarted = true;
            } else if (DateService.isAfter(now, endDate)) {
                this.hasEnded = true;
            }

            Observable.interval(1000)
                .takeWhile(() => this.alive && !this.hasStarted)
                .subscribe(() => {
                    const now = DateService.getInstanceOfNow();
                    if (DateService.isAfter(now, startDate) && DateService.isBefore(now, endDate)) {
                        this.hasStarted = true;
                    }
                });
        });
    }

    ngOnInit() {


    }

    constructor() {
    }

}
