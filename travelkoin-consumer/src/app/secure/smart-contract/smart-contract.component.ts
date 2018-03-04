import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {TokenContractService} from '../../core/token-contract.service';
import {FormHelper} from '../../model/form-helper';
import {DateService} from '../../core/date.service';
import {Web3Service} from '../../core/web3.service';
import {BigNumber} from 'bignumber.js';

@Component({
    selector: 'app-smart-contract',
    templateUrl: './smart-contract.component.html',
    styleUrls: ['./smart-contract.component.scss']
})
export class SmartContractComponent implements OnInit, OnDestroy {
    private alive = true;
    loading = false;
    form: FormGroup;
    error: string;

    private loadStartDate(form: FormGroup): void {
        this.tokenContractService.startTime()
            .takeWhile(() => this.alive)
            .subscribe((unixTime: BigNumber) => {
                    FormHelper.addOrReplaceFormControl(form, 'startDate', new FormControl({value: DateService.bigNumberToMoment(unixTime), disabled: true}))
                },
                error => this.error = error,
                () => {
                }
            )
    }

    private loadEndDate(form: FormGroup): void {
        this.tokenContractService.endTime()
            .takeWhile(() => this.alive)
            .subscribe((unixTime: BigNumber) => {
                    FormHelper.addOrReplaceFormControl(form, 'endDate', new FormControl({value: DateService.bigNumberToMoment(unixTime), disabled: true}))
                },
                error => this.error = error,
                () => {
                }
            )
    }

    private loadTotalSupply(form: FormGroup): void {
        this.tokenContractService.totalSupply()
            .takeWhile(() => this.alive)
            .subscribe((totalSupply: BigNumber) => {
                    FormHelper.addOrReplaceFormControl(form, 'totalSupply', new FormControl({value: totalSupply.toFormat(), disabled: true}))
                },
                error => this.error = error,
                () => {
                }
            )
    }

    private loadCrowdsaleAddress(form: FormGroup): void {
        this.tokenContractService.crowdsaleAddress()
            .takeWhile(() => this.alive)
            .subscribe((address: string) => {
                    FormHelper.addOrReplaceFormControl(form, 'crowdsaleAddress', new FormControl({value: address, disabled: true}))
                },
                error => this.error = error,
                () => {
                }
            )
    }

    private loadTokenAddress(form: FormGroup): void {
        this.tokenContractService.tokenAddress()
            .takeWhile(() => this.alive)
            .subscribe((address: string) => {
                    FormHelper.addOrReplaceFormControl(form, 'tokenAddress', new FormControl({value: address, disabled: true}))
                },
                error => this.error = error,
                () => {
                }
            )
    }

    private loadMinContribution(form: FormGroup): void {
        this.tokenContractService.minContribution()
            .takeWhile(() => this.alive)
            .subscribe((minContribution: BigNumber) => {
                    FormHelper.addOrReplaceFormControl(form, 'minContribution', new FormControl({value: this.web3Service.weiToEther(minContribution), disabled: true}))
                },
                error => this.error = error,
                () => {
                }
            )
    }

    private loadDayOneMaxContribution(form: FormGroup): void {
        this.tokenContractService.dayOneMaxContribution()
            .takeWhile(() => this.alive)
            .subscribe((dayOneMaxContribution: BigNumber) => {
                    FormHelper.addOrReplaceFormControl(form, 'dayOneMaxContribution', new FormControl({value: this.web3Service.weiToEther(dayOneMaxContribution), disabled: true}))
                },
                error => this.error = error,
                () => {
                }
            )
    }

    private loadRate(form: FormGroup): void {
        this.tokenContractService.rate()
            .takeWhile(() => this.alive)
            .subscribe((rate: BigNumber) => {
                    FormHelper.addOrReplaceFormControl(form, 'rate', new FormControl({value: rate.toFormat(), disabled: true}))
                },
                error => this.error = error,
                () => {
                }
            )
    }

    private loadCrowdsaleCap(form: FormGroup): void {
        this.tokenContractService.cap()
            .takeWhile(() => this.alive)
            .subscribe((cap: BigNumber) => {
                    FormHelper.addOrReplaceFormControl(form, 'cap', new FormControl({value: this.web3Service.weiToEther(cap).toFormat(), disabled: true}))
                },
                error => this.error = error,
                () => {
                }
            )
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.form = new FormGroup({});

        this.loadTokenAddress(this.form);
        this.loadCrowdsaleAddress(this.form);
        this.loadStartDate(this.form);
        this.loadEndDate(this.form);
        this.loadTotalSupply(this.form);
        this.loadMinContribution(this.form);
        this.loadDayOneMaxContribution(this.form);
        this.loadRate(this.form);
        this.loadCrowdsaleCap(this.form);
    }

    constructor(private web3Service: Web3Service,
                private tokenContractService: TokenContractService) {
    }

}
