import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Web3Service} from '../../core/web3.service';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'app-token-contract',
    templateUrl: './token-contract.component.html',
    styleUrls: ['./token-contract.component.scss']
})
export class TokenContractComponent implements OnInit, OnDestroy, AfterViewInit {

    private alive = true;
    accounts: string[];

    model = {
        amount: 5,
        receiver: '',
        balance: 0,
        account: ''
    };

    status = '';

    private updateBalance(coin: any): void {
        Observable.fromPromise(coin.getBalance.call(this.model.account))
            .takeWhile(() => this.alive)
            .subscribe((balance: any) => {
                    this.model.balance = balance;
                },
                error => this.setStatus('Error getting balance; see log.'),
                () => {}
            );
    }

    watchAccount() {
        this.web3Service.accountsObservable.subscribe((accounts) => {
            this.accounts = accounts;
            this.model.account = accounts[0];
            this.refreshBalance();
        });
    }

    setStatus(status) {
        this.status = status;
    }

    async sendCoin() {
        if (!this.web3Service.token) {
            this.setStatus('Travelkoin token is not loaded, unable to send transaction');
            return;
        }

        const amount = this.model.amount;
        const receiver = this.model.receiver;

        console.log('Sending coins' + amount + ' to ' + receiver);

        this.setStatus('Initiating transaction... (please wait)');
        try {
            const deployedMetaCoin = await this.web3Service.token.deployed();
            const transaction = await deployedMetaCoin.sendCoin.sendTransaction(receiver, amount, {from: this.model.account});

            if (!transaction) {
                this.setStatus('Transaction failed!');
            } else {
                this.setStatus('Transaction complete!');
            }
        } catch (e) {
            console.log(e);
            this.setStatus('Error sending coin; see log.');
        }
    }

    refreshBalance() {
        console.log('Refreshing balance');

        Observable.fromPromise(this.web3Service.token.deployed())
            .takeWhile(() => this.alive)
            .subscribe((coin: any) => {
                this.updateBalance(coin);
                },
                error => this.setStatus('Error getting balance; see log.'),
                () => {}
            );
    }

    clickAddress(e) {
        this.model.account = e.target.value;
        this.refreshBalance();
    }

    setAmount(e) {
        console.log('Setting amount: ' + e.target.value);
        this.model.amount = e.target.value;
    }

    setReceiver(e) {
        console.log('Setting receiver: ' + e.target.value);
        this.model.receiver = e.target.value;
    }

    ngOnDestroy() {
        this.alive = false;
    }

    // web3 MetaMask should be injected by now
    ngAfterViewInit(): void {
        this.web3Service.bootstrapWeb3();

        this.watchAccount();
    }

    ngOnInit() {
    }

    constructor(private web3Service: Web3Service) {
    }
}
