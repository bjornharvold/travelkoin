import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {DateService} from '../../core/date.service';
import {TokenContractService} from '../../core/token-contract.service';
import {FormHelper} from '../../model/form-helper';
import {FormControl, FormGroup} from '@angular/forms';
import {W3} from 'soltsice';
import {BigNumber} from 'bignumber.js';
import TransactionResult = W3.TX.TransactionResult;

@Component({
    selector: 'app-hans-smart-contract-date-time',
    templateUrl: './smart-contract-date-time.component.html',
    styleUrls: ['./smart-contract-date-time.component.scss']
})
export class SmartContractDateTimeComponent implements OnInit, OnChanges, OnDestroy {
    private alive = true;
    @Input() account: string;
    loading = false;
    dateRangeForm: FormGroup;
    error: string;
    tx: TransactionResult = null;

    private loadStartDate(dateRangeForm: FormGroup): void {
        this.tokenContractService.startTime()
            .takeWhile(() => this.alive)
            .subscribe((unixTime: BigNumber) => {
                    // console.log(`startDate: ${unixTime}`);
                    FormHelper.addOrReplaceFormControl(dateRangeForm, 'startDate', new FormControl({value: DateService.bigNumberToMoment(unixTime).utc().format(), disabled: false}))
                },
                error => {
                    console.error(error);
                    this.error = 'CODE.ERROR';
                },
                () => {
                }
            )
    }

    private loadEndDate(dateRangeForm: FormGroup): void {
        this.tokenContractService.endTime()
            .takeWhile(() => this.alive)
            .subscribe((unixTime: BigNumber) => {
                    // console.log(`endDate: ${unixTime}`);
                    FormHelper.addOrReplaceFormControl(dateRangeForm, 'endDate', new FormControl({value: DateService.bigNumberToMoment(unixTime).utc().format(), disabled: false}))
                },
                error => {
                    console.error(error);
                    this.error = 'CODE.ERROR';
                },
                () => {
                }
            )
    }

    updateDates(): void {
        this.loading = true;
        this.tx = null;
        this.error = null;
        const startDate: string = this.dateRangeForm.get('startDate').value;
        const endDate: string = this.dateRangeForm.get('endDate').value;

        const startDateUnix = DateService.utcToMoment(startDate).unix();
        const endDateUnix = DateService.utcToMoment(endDate).unix();

        this.tokenContractService.setTimes(this.account, startDateUnix, endDateUnix)
            .takeWhile(() => this.alive)
            .subscribe((tx: TransactionResult) => {
                    this.tx = tx;
                },
                error => {
                    this.loading = false;
                    console.log(Object.getOwnPropertyNames(error));
                    // console.error(error);
                    this.error = 'CODE.ERROR';
                },
                () => {
                    this.loading = false;
                }
            );
    }

    ngOnChanges(changes: SimpleChanges) {
        const account: SimpleChange = changes.account;

        if (this.account != account.currentValue) {
            this.account = account.currentValue;
        }
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.dateRangeForm = new FormGroup({});
        this.loadStartDate(this.dateRangeForm);
        this.loadEndDate(this.dateRangeForm);
    }

    constructor(private tokenContractService: TokenContractService) {
    }

}
