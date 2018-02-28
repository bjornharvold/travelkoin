import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MyTimer} from '../../model/my-timer';

@Component({
    selector: 'app-timer',
    templateUrl: './timer.component.html',
    styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {
    private alive = true;
    @Input() timeInMilliSeconds: number;
    timer: MyTimer;

    static getSecondsAsDigitalClock(timeInMilliSeconds: number) {
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

    hasFinished() {
        return this.timer.hasFinished;
    }

    initTimer() {
        if (!this.timeInMilliSeconds) {
            this.timeInMilliSeconds = 0;
        }

        this.timer = {
            seconds: this.timeInMilliSeconds,
            runTimer: false,
            hasStarted: false,
            hasFinished: false,
            secondsRemaining: this.timeInMilliSeconds
        };

        this.timer.displayTime = TimerComponent.getSecondsAsDigitalClock(this.timer.secondsRemaining);
    }

    startTimer() {
        if (this.timer != null) {
            this.timer.hasStarted = true;
            this.timer.runTimer = true;
            this.timerTick();
        }
    }

    timerTick() {
        setTimeout(() => {
            if (!this.timer.runTimer) {
                return;
            }
            this.timer.secondsRemaining--;
            this.timer.displayTime = TimerComponent.getSecondsAsDigitalClock(this.timer.secondsRemaining);
            if (this.timer.secondsRemaining > 0) {
                this.timerTick();
            }
            else {
                this.timer.hasFinished = true;
            }
        }, 1000);
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.initTimer();
    }

    constructor() {

    }
}
