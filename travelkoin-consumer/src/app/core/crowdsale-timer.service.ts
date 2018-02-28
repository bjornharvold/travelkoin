import {EventEmitter, Injectable, Output} from '@angular/core';
import {TokenContractService} from './token-contract.service';
import {Observable} from 'rxjs/Observable';
import {DateService} from './date.service';
import {BigNumber} from 'bignumber.js';
import * as moment from 'moment';

@Injectable()
export class CrowdsaleTimerService {
    private hasEnded: boolean = false;
    private hasStarted: boolean = false;

    @Output() hasEndedEvent: EventEmitter<boolean>;
    @Output() hasStartedEvent: EventEmitter<boolean>;
    @Output() errorEvent: EventEmitter<string>;

    /**
     * Save start time
     */
    private startTime(): void {
        this.tokenContractService.startTime()
            .subscribe((startTime: BigNumber) => {
                    const now: moment.Moment = DateService.getInstanceOfNow();
                    const startDate: moment.Moment = DateService.bigNumberToMoment(startTime);

                    if (DateService.isSameOrAfter(startDate, now)) {
                        this.hasStarted = true;
                    }
                    this.hasStartedEvent.emit(this.hasStarted);

                    // console.log(this.startDate.format());
                }, error => {
                    console.error(error);
                    this.errorEvent.emit('CODE.ERROR');
                },
                () => {
                }
            )
    }

    private checkForEndTime(): void {
        this.tokenContractService.endTime()
            .subscribe((endTime: BigNumber) => {
                    const now: moment.Moment = DateService.getInstanceOfNow();
                    const endDate = DateService.bigNumberToMoment(endTime);

                    if (DateService.isAfter(now, endDate)) {
                        this.hasEnded = true;
                        // console.log(`hasEnded ${this.hasEnded} on ${endDate.format()}`);
                    }

                    this.hasEndedEvent.emit(this.hasEnded);
                    // console.log(this.endDate.format());
                }, error => {
                    console.error(error);
                    this.errorEvent.emit('CODE.ERROR');
                },
                () => {
                }
            )
    }

    /**
     * Save end time
     */
    private endTime(): void {
        // first check if cap has been reached - then check the time
        this.tokenContractService.capReached()
            .subscribe((capReached: boolean) => {
                // console.log(capReached);
                if (capReached === true) {
                    this.hasEnded = true;

                    this.hasEndedEvent.emit(this.hasEnded);
                } else {
                    this.checkForEndTime();
                }
            });
    }

    constructor(private tokenContractService: TokenContractService) {
        this.hasEndedEvent = new EventEmitter<boolean>(true);
        this.hasStartedEvent = new EventEmitter<boolean>(true);
        this.errorEvent = new EventEmitter<string>(true);

        Observable.interval(2000)
            .subscribe(() => {
                this.startTime();
            });

        Observable.interval(2000)
            .subscribe(() => {
                this.endTime();
            });
    }

}
