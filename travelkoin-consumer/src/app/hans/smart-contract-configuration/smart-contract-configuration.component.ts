import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {FormHelper} from '../../model/form-helper';
import {DateService} from '../../core/date.service';
import {BigNumber} from 'bignumber.js';
import {Web3Service} from '../../core/web3.service';
import {TokenContractService} from '../../core/token-contract.service';
import {W3} from 'soltsice';
import TransactionResult = W3.TX.TransactionResult;
import TxParams = W3.TX.TxParams;

@Component({
    selector: 'app-smart-contract-configuration',
    templateUrl: './smart-contract-configuration.component.html',
    styleUrls: ['./smart-contract-configuration.component.scss']
})
export class SmartContractConfigurationComponent implements OnInit, OnDestroy {
    private alive = true;
    loading = false;
    dateRangeForm: FormGroup;
    error: string;

    private loadStartDate(dateRangeForm: FormGroup): void {
        this.tokenContractService.startTime()
            .takeWhile(() => this.alive)
            .subscribe((unixTime: BigNumber) => {
                    // console.log(`startDate: ${unixTime}`);
                    FormHelper.addOrReplaceFormControl(dateRangeForm, 'startDate', new FormControl({value: DateService.bigNumberToMoment(unixTime).utc().format(), disabled: false}))
                },
                error => this.error = error,
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
                error => this.error = error,
                () => {
                }
            )
    }

    updateDates(): void {
        this.loading = true;
        const startDate: string = this.dateRangeForm.get('startDate').value;
        const endDate: string = this.dateRangeForm.get('endDate').value;

        const startDateUnix = DateService.utcToMoment(startDate).unix();
        const endDateUnix = DateService.utcToMoment(endDate).unix();

        this.web3Service.getAccounts()
            .takeWhile(() => this.alive)
            .subscribe((ary: Array<string>) => {
                    const params: TxParams = {
                        from: ary[0],
                        gas: 21000,
                        gasPrice: 4,
                        value: 0
                    };

                    this.tokenContractService.updateDates(startDateUnix, endDateUnix, params)
                        .takeWhile(() => this.alive)
                        .subscribe((tx: TransactionResult) => {
                                console.log(tx);
                            },
                            error => {
                                this.loading = false;
                                console.error(error);
                                this.error = 'CODE.ERROR';
                            },
                            () => {
                                this.loading = false;
                            }
                        )
                },
                error => this.error = error,
                () => {
                }
            );


    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.dateRangeForm = new FormGroup({});
        this.loadStartDate(this.dateRangeForm);
        this.loadEndDate(this.dateRangeForm);
    }

    constructor(private web3Service: Web3Service,
                private tokenContractService: TokenContractService) {
    }

}
