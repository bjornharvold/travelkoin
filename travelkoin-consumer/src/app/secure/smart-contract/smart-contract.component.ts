import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {TokenContractService} from '../../core/token-contract.service';
import {FormHelper} from '../../model/form-helper';
import {DateService} from '../../core/date.service';
import {Web3Service} from '../../core/web3.service';

@Component({
    selector: 'app-smart-contract',
    templateUrl: './smart-contract.component.html',
    styleUrls: ['./smart-contract.component.scss']
})
export class SmartContractComponent implements OnInit, OnDestroy {
    private alive = true;
    loading = false;
    form: FormGroup;

    private loadStartDate(form: FormGroup): void {
        this.tokenContractService.startTime()
            .takeWhile(() => this.alive)
            .subscribe((unixTime: BigNumber) => {
                FormHelper.addOrReplaceFormControl(form, 'startDate', new FormControl({value: DateService.bigNumberToMoment(unixTime), disabled: true}))
            })
    }

    private loadEndDate(form: FormGroup): void {
        this.tokenContractService.endTime()
            .takeWhile(() => this.alive)
            .subscribe((unixTime: BigNumber) => {
                FormHelper.addOrReplaceFormControl(form, 'endDate', new FormControl({value: DateService.bigNumberToMoment(unixTime), disabled: true}))
            })
    }

    private loadTotalSupply(form: FormGroup): void {
        this.tokenContractService.totalSupply()
            .takeWhile(() => this.alive)
            .subscribe((totalSupply: BigNumber) => {
                FormHelper.addOrReplaceFormControl(form, 'totalSupply', new FormControl({value: Web3Service.weiToEther(totalSupply), disabled: true}))
            })
    }

    private loadCrowdsaleAddress(form: FormGroup): void {
        this.tokenContractService.crowdsaleAddress()
            .takeWhile(() => this.alive)
            .subscribe((address: string) => {
                FormHelper.addOrReplaceFormControl(form, 'crowdsaleAddress', new FormControl({value: address, disabled: true}))
            })
    }

    private loadTokenAddress(form: FormGroup): void {
        this.tokenContractService.tokenAddress()
            .takeWhile(() => this.alive)
            .subscribe((address: string) => {
                FormHelper.addOrReplaceFormControl(form, 'tokenAddress', new FormControl({value: address, disabled: true}))
            })
    }

    private loadMinContribution(form: FormGroup): void {
        this.tokenContractService.minContribution()
            .takeWhile(() => this.alive)
            .subscribe((minContribution: BigNumber) => {
                FormHelper.addOrReplaceFormControl(form, 'minContribution', new FormControl({value: Web3Service.weiToEther(minContribution), disabled: true}))
            })
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
    }

    constructor(private tokenContractService: TokenContractService) {
    }

}
