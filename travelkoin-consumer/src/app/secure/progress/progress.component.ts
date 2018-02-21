import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbProgressbarConfig} from '@ng-bootstrap/ng-bootstrap';
import {TokenContractService} from '../../core/token-contract.service';
import {BigNumber} from 'bignumber.js';
import {Web3Service} from '../../core/web3.service';

@Component({
    selector: 'app-secure-progress',
    templateUrl: './progress.component.html',
    styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit, OnDestroy {
    private alive = true;
    value = 0;
    valueString = '0';
    valueBigNumber: BigNumber;
    max = 0;
    maxBigNumber: BigNumber;
    maxString = '0';
    error: string = null;

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.tokenContractService.travelkoinBalance()
            .takeWhile(() => this.alive)
            .subscribe((value: BigNumber) => {
                    // console.log(`saleSupply: ${this.web3Service.weiToEther(value)}`);
                    // simplify by adding rate here (1 ETH = 1000 TKT)
                    this.maxBigNumber = value.div(1000000000000000);
                    this.max = this.maxBigNumber.toNumber();
                    this.maxString = this.maxBigNumber.toFormat();
                },
                error => this.error = error,
                () => {
                }
            );

        this.tokenContractService.weiRaised()
            .takeWhile(() => this.alive)
            .subscribe((value: BigNumber) => {
                    // console.log(`travelkoinBalance: ${this.web3Service.weiToEther(value)}`);
                    this.valueBigNumber = value.div(1000000000000000);
                    this.value = this.valueBigNumber.toNumber();
                    this.valueString = this.valueBigNumber.toFormat();
                },
                error => this.error = error,
                () => {
                });
    }

    constructor(private tokenContractService: TokenContractService,
                private web3Service: Web3Service,
                private config: NgbProgressbarConfig) {
        // customize default values of progress bars used by this component tree
        config.striped = true;
        config.animated = true;
        config.type = 'info';
        config.height = '50px';
    }
}
