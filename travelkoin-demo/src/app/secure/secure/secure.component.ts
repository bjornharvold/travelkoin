import {Component, OnInit, ViewChild} from '@angular/core';
import {TimerComponent} from '../../shared/timer/timer.component';

@Component({
    selector: 'app-secure',
    templateUrl: './secure.component.html',
    styleUrls: ['./secure.component.scss']
})
export class SecureComponent implements OnInit {
    @ViewChild(TimerComponent) timer: TimerComponent;

    ngOnInit() {
        setTimeout(() => {
            this.timer.startTimer();
        }, 1000);
    }
}
