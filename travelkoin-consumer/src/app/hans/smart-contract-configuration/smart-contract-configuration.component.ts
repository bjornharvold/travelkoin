import {Component, OnDestroy, OnInit} from '@angular/core';
import {Web3Service} from '../../core/web3.service';

@Component({
    selector: 'app-hans-smart-contract-configuration',
    templateUrl: './smart-contract-configuration.component.html',
    styleUrls: ['./smart-contract-configuration.component.scss']
})
export class SmartContractConfigurationComponent implements OnInit, OnDestroy {
    private alive = true;
    account: string = null;
    loading = false;
    error: string;

    private getAccount(): void {
        this.loading = true;
        this.web3Service.getAccounts()
            .takeWhile(() => this.alive)
            .subscribe((accounts: Array<string>) => {
                    this.account = accounts[0];
                },
                error => {
                    console.error(error);
                    this.error = 'CODE.ERROR';
                    this.loading = false;
                },
                () => this.loading = false
            )
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.getAccount();
    }

    constructor(private web3Service: Web3Service) {
    }

}
