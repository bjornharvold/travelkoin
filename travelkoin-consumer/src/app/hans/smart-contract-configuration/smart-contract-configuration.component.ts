import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {FormHelper} from '../../model/form-helper';
import {DateService} from '../../core/date.service';
import {BigNumber} from 'bignumber.js';
import {Web3Service} from '../../core/web3.service';
import {TokenContractService} from '../../core/token-contract.service';
import {W3} from 'soltsice';
import TransactionResult = W3.TX.TransactionResult;

@Component({
    selector: 'app-smart-contract-configuration',
    templateUrl: './smart-contract-configuration.component.html',
    styleUrls: ['./smart-contract-configuration.component.scss']
})
export class SmartContractConfigurationComponent implements OnInit, OnDestroy {
    private alive = true;
    private account: string = null;
    loading = false;
    dateRangeForm: FormGroup;
    error: string;
    tx: TransactionResult = null;

    private getAccount(): void {
        this.web3Service.getAccounts()
            .takeWhile(() => this.alive)
            .subscribe((accounts: Array<string>) => {
                    this.account = accounts[0];
                },
                error => {
                    console.error(error);
                    this.error = 'CODE.ERROR';
                },
                () => {
                }
            )
    }

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

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.getAccount();

        this.dateRangeForm = new FormGroup({});
        this.loadStartDate(this.dateRangeForm);
        this.loadEndDate(this.dateRangeForm);

        this.tokenContractService.listenToEvents()
            .takeWhile(() => this.alive)
            .subscribe((event: any) => console.error(event));
    }

    constructor(private web3Service: Web3Service,
                private tokenContractService: TokenContractService) {
    }

}
