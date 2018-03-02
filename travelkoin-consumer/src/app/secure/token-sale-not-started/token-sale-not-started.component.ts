import {Component, OnDestroy, OnInit} from '@angular/core';
import * as moment from 'moment';
import {DateService} from '../../core/date.service';
import {BigNumber} from 'bignumber.js';
import {TokenContractService} from '../../core/token-contract.service';

@Component({
    selector: 'app-token-sale-not-started',
    templateUrl: './token-sale-not-started.component.html',
    styleUrls: ['./token-sale-not-started.component.scss']
})
export class TokenSaleNotStartedComponent implements OnInit, OnDestroy {
    private alive = true;
    startDate: moment.Moment;
    error = null;

    /**
     * Save start time
     */
    private displayStartTime(): void {
        this.tokenContractService.startTime()
            .takeWhile(() => this.alive)
            .subscribe((startTime: BigNumber) => {
                    this.startDate = DateService.bigNumberToMoment(startTime);
                    // console.log(this.startDate.format());
                }, error => {
                    console.error(error);
                    this.error = 'CODE.ERROR';
                },
                () => {
                }
            )
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.displayStartTime();
    }

    constructor(
        private tokenContractService: TokenContractService,) {
    }

}
