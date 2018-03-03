import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {MyTimer} from '../../model/my-timer';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'app-timer',
    templateUrl: './timer.component.html',
    styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnChanges, OnDestroy {
    private alive = true;
    @Output() hasFinishedEvent: EventEmitter<boolean>;
    @Input() countdownTimeInMilliseconds: number;
    timer: MyTimer;

    private static getSecondsAsDigitalClock(timeInMilliSeconds: number) {
        const now: Date = new Date();
        let futureDate: Date = new Date();
        futureDate.setTime(timeInMilliSeconds);

        const timeToGoInSeconds = (futureDate.getTime() - now.getTime()) / 1000;

        const sec_num = parseInt(timeToGoInSeconds.toString(), 10); // don't forget the second param
        const days = Math.floor(sec_num / 86400);
        const hours = Math.floor((sec_num - (days * 86400)) / 3600);
        const minutes = Math.floor((sec_num - (days * 86400) - (hours * 3600)) / 60);
        const seconds = sec_num - (days * 86400) - (hours * 3600) - (minutes * 60);
        let daysString = '';
        let hoursString = '';
        let minutesString = '';
        let secondsString = '';
        daysString = (days < 10) ? '0' + days : days.toString();
        hoursString = (hours < 10) ? '0' + hours : hours.toString();
        minutesString = (minutes < 10) ? '0' + minutes : minutes.toString();
        secondsString = (seconds < 10) ? '0' + seconds : seconds.toString();
        return daysString + 'd ' + hoursString + 'h ' + minutesString + 'm ' + secondsString + 's';
    }

    private tick(): void {
        // console.log('tick');
        // console.log(`hasFinished: ${this.timer.hasFinished}`);
        // console.log(`secondsRemaining: ${this.timer.secondsRemaining}`);
        Observable.interval(1000)
            .takeWhile(() => this.alive && !this.timer.hasFinished)
            .subscribe(() => {
                this.timer.secondsRemaining--;
                this.timer.displayTime = TimerComponent.getSecondsAsDigitalClock(this.timer.secondsRemaining);
                const now = new Date().getTime();
                // console.log(`secondsRemaining inside: ${this.timer.seconds} vs ${now}`);
                if (this.timer.seconds < new Date().getTime()) {
                    // console.log('timer has finished');
                    this.timer.hasFinished = true;
                    this.hasFinishedEvent.emit(true);
                }
            });
    }

    private initTimer() {
        this.timer = {
            seconds: this.countdownTimeInMilliseconds,
            runTimer: false,
            hasStarted: false,
            hasFinished: false,
            secondsRemaining: this.countdownTimeInMilliseconds,
        };

        this.timer.displayTime = TimerComponent.getSecondsAsDigitalClock(this.timer.secondsRemaining);
    }

    private startTimer() {
        // console.log('Starting timer');
        this.initTimer();
        this.timer.hasStarted = true;
        this.timer.runTimer = true;
        this.tick();

    }

    ngOnChanges(changes: SimpleChanges) {
        // console.log('changes');
        const countdownTimeInMilliseconds: SimpleChange = changes.countdownTimeInMilliseconds;
        // console.log(`${countdownTimeInMilliseconds.currentValue}`);
        // console.log(`${this.countdownTimeInMilliseconds}`);
        const now = new Date().getTime();

        if (countdownTimeInMilliseconds != null && countdownTimeInMilliseconds.currentValue !== this.countdownTimeInMilliseconds && now < countdownTimeInMilliseconds.currentValue) {
            this.countdownTimeInMilliseconds = countdownTimeInMilliseconds.currentValue;
            // console.log('starting timer');
            this.startTimer()
        }
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        if (this.countdownTimeInMilliseconds != null) {
            // console.log('starting timer');
            this.startTimer();
        }
    }

    constructor() {
        this.hasFinishedEvent = new EventEmitter<boolean>(true);
    }
}
