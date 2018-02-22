import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbProgressbarConfig} from '@ng-bootstrap/ng-bootstrap';
import {TokenContractService} from '../../core/token-contract.service';
import {BigNumber} from 'bignumber.js';
import {Web3Service} from '../../core/web3.service';
import {Observable} from 'rxjs/Observable';
import {CrowdsaleTimerService} from '../../core/crowdsale-timer.service';

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
    loading = false;
    hasStarted = false;
    hasEnded = false;

    private fetchWeiRaised(): void {
        this.loading = true;
        this.tokenContractService.weiRaised()
            .takeWhile(() => this.alive)
            .subscribe((value: BigNumber) => {
                    this.valueBigNumber = value.div(1000000000000000);
                    this.value = this.valueBigNumber.toNumber();
                    this.valueString = this.valueBigNumber.toFormat();
                },
                error => {
                    this.loading = false;
                    this.error = error;
                },
                () => this.loading = false
            );
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.loading = true;
        this.tokenContractService.travelkoinBalance()
            .takeWhile(() => this.alive)
            .subscribe((value: BigNumber) => {
                    // console.log(`saleSupply: ${this.web3Service.weiToEther(value)}`);
                    // simplify by adding rate here (1 ETH = 1000 TKT)
                    this.maxBigNumber = value.div(1000000000000000);
                    this.max = this.maxBigNumber.toNumber();
                    this.maxString = this.maxBigNumber.toFormat();
                    this.loading = false;
                },
                error => this.error = error,
                () => {
                }
            );

        Observable.interval(5000)
            .takeWhile(() => this.alive)
            .subscribe(() => {
                this.fetchWeiRaised();
            });

        // listen to events
        this.crowdsaleTimerService.hasStartedEvent
            .takeWhile(() => this.alive)
            .subscribe((started: boolean) => {
                this.hasStarted = started;
            });

        this.crowdsaleTimerService.hasEndedEvent
            .takeWhile(() => this.alive)
            .subscribe((ended: boolean) => {
                this.hasEnded = ended;
            });
    }

    constructor(private tokenContractService: TokenContractService,
                private crowdsaleTimerService: CrowdsaleTimerService,
                private web3Service: Web3Service,
                private config: NgbProgressbarConfig) {
        // customize default values of progress bars used by this component tree
        config.striped = true;
        config.animated = true;
        config.type = 'info';
        config.height = '50px';
    }
}
