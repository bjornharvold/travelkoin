import {Component, OnInit, ViewChild} from '@angular/core';
import {TimerComponent} from '../../shared/timer/timer.component';

@Component({
    selector: 'app-home-countdown',
    templateUrl: './countdown.component.html',
    styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit {
    @ViewChild(TimerComponent) timer: TimerComponent;

    ngOnInit() {
        setTimeout(() => {
            this.timer.startTimer();
        }, 1000);
    }

    constructor() {
    }

}
