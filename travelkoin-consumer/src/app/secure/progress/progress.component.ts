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
    max = 0;
    maxString = '0';
    error: string = null;

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.tokenContractService.saleSupply()
            .takeWhile(() => this.alive)
            .subscribe((value: BigNumber) => {
                    // console.log(`saleSupply: ${this.web3Service.weiToEther(value)}`);
                    this.max = value.toNumber();
                    this.maxString = this.web3Service.weiToEther(value);
                },
                error => this.error = error,
                () => {
                }
            );

        this.tokenContractService.travelkoinBalance()
            .takeWhile(() => this.alive)
            .subscribe((value: BigNumber) => {
                    // console.log(`travelkoinBalance: ${this.web3Service.weiToEther(value)}`);
                    this.value = value.toNumber();
                    this.valueString = this.web3Service.weiToEther(value);
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
