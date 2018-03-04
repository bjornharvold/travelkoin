import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TimerComponent} from '../../shared/timer/timer.component';
import {environment} from '../../../environments/environment';
import {DateService} from '../../core/date.service';
import * as moment from 'moment';

@Component({
    selector: 'app-home-countdown',
    templateUrl: './countdown.component.html',
    styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit, AfterViewInit, OnDestroy {
    private alive = true;
    eventStartTimeEpochInMilliseconds: number = environment.eventStartTimeEpochInMilliseconds;
    @ViewChild(TimerComponent) timer: TimerComponent;
    hasStarted = false;
    hasEnded = false;

    hasFinished(): void {
        this.hasEnded = true;
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngAfterViewInit() {
        //stuff that doesn't do view changes
        setTimeout(() => {
            const now: moment.Moment = DateService.getInstanceOfNow();
            const startDate: moment.Moment = DateService.timestampToMoment(this.eventStartTimeEpochInMilliseconds);

            if (DateService.isBefore(now, startDate)) {
                // console.log('not yet started');
                this.hasStarted = true;
            } else if (DateService.isAfter(now, startDate)) {
                this.hasEnded = true;
            }
        });
    }

    ngOnInit() {


    }

    constructor() {
    }

}
