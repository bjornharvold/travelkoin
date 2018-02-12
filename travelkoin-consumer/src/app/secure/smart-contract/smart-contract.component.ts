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
                    FormHelper.addOrReplaceFormControl(form, 'totalSupply', new FormControl({value: this.web3Service.weiToEther(totalSupply), disabled: true}))
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

    private loadRate(form: FormGroup): void {
        this.tokenContractService.rate()
            .takeWhile(() => this.alive)
            .subscribe((rate: BigNumber) => {
                    FormHelper.addOrReplaceFormControl(form, 'rate', new FormControl({value: rate.toNumber(), disabled: true}))
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
                    FormHelper.addOrReplaceFormControl(form, 'cap', new FormControl({value: this.web3Service.weiToEther(cap), disabled: true}))
                },
                error => this.error = error,
                () => {
                }
            )
    }

    private saleSupply(form: FormGroup): void {
        this.tokenContractService.saleSupply()
            .takeWhile(() => this.alive)
            .subscribe((saleSupply: BigNumber) => {
                    FormHelper.addOrReplaceFormControl(form, 'saleSupply', new FormControl({value: this.web3Service.weiToEther(saleSupply), disabled: true}))
                },
                error => this.error = error,
                () => {
                }
            )
    }

    private bountySupply(form: FormGroup): void {
        this.tokenContractService.bountySupply()
            .takeWhile(() => this.alive)
            .subscribe((bountySupply: BigNumber) => {
                    FormHelper.addOrReplaceFormControl(form, 'bountySupply', new FormControl({value: this.web3Service.weiToEther(bountySupply), disabled: true}))
                },
                error => this.error = error,
                () => {
                }
            )
    }

    private communitySupply(form: FormGroup): void {
        this.tokenContractService.communitySupply()
            .takeWhile(() => this.alive)
            .subscribe((communitySupply: BigNumber) => {
                    FormHelper.addOrReplaceFormControl(form, 'communitySupply', new FormControl({value: this.web3Service.weiToEther(communitySupply), disabled: true}))
                },
                error => this.error = error,
                () => {
                }
            )
    }

    private threeMonthHODLSupply(form: FormGroup): void {
        this.tokenContractService.threeMonthHODLSupply()
            .takeWhile(() => this.alive)
            .subscribe((threeMonthHODLSupply: BigNumber) => {
                    FormHelper.addOrReplaceFormControl(form, 'threeMonthHODLSupply', new FormControl({value: this.web3Service.weiToEther(threeMonthHODLSupply), disabled: true}))
                },
                error => this.error = error,
                () => {
                }
            )
    }

    private sixMonthHODLSupply(form: FormGroup): void {
        this.tokenContractService.sixMonthHODLSupply()
            .takeWhile(() => this.alive)
            .subscribe((sixMonthHODLSupply: BigNumber) => {
                    FormHelper.addOrReplaceFormControl(form, 'sixMonthHODLSupply', new FormControl({value: this.web3Service.weiToEther(sixMonthHODLSupply), disabled: true}))
                },
                error => this.error = error,
                () => {
                }
            )
    }

    private nineMonthHODLSupply(form: FormGroup): void {
        this.tokenContractService.nineMonthHODLSupply()
            .takeWhile(() => this.alive)
            .subscribe((nineMonthHODLSupply: BigNumber) => {
                    FormHelper.addOrReplaceFormControl(form, 'nineMonthHODLSupply', new FormControl({value: this.web3Service.weiToEther(nineMonthHODLSupply), disabled: true}))
                },
                error => this.error = error,
                () => {
                }
            )
    }

    private founderSupply(form: FormGroup): void {
        this.tokenContractService.founderSupply()
            .takeWhile(() => this.alive)
            .subscribe((founderSupply: BigNumber) => {
                    FormHelper.addOrReplaceFormControl(form, 'founderSupply', new FormControl({value: this.web3Service.weiToEther(founderSupply), disabled: true}))
                },
                error => this.error = error,
                () => {
                }
            )
    }

    private investorSupply(form: FormGroup): void {
        this.tokenContractService.investorSupply()
            .takeWhile(() => this.alive)
            .subscribe((investorSupply: BigNumber) => {
                    FormHelper.addOrReplaceFormControl(form, 'investorSupply', new FormControl({value: this.web3Service.weiToEther(investorSupply), disabled: true}))
                },
                error => this.error = error,
                () => {
                }
            )
    }

    private teamSupply(form: FormGroup): void {
        this.tokenContractService.teamSupply()
            .takeWhile(() => this.alive)
            .subscribe((teamSupply: BigNumber) => {
                    FormHelper.addOrReplaceFormControl(form, 'teamSupply', new FormControl({value: this.web3Service.weiToEther(teamSupply), disabled: true}))
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
        this.loadRate(this.form);
        this.loadCrowdsaleCap(this.form);
    }

    constructor(private web3Service: Web3Service,
                private tokenContractService: TokenContractService) {
    }

}
