import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../model/user';
import {UserSessionService} from '../../core/user-session.service';
import {AngularFireAuth} from 'angularfire2/auth';
import {WalletTransactions} from '../../model/wallet-transactions';
import {EthereumService} from '../../core/ethereum.service';
import {EthereumTransaction} from '../../model/ethereum-transaction';
import {EthereumTransactions} from '../../model/ethereum-transactions';

@Component({
    selector: 'app-secure-invested-ether',
    templateUrl: './invested-ether.component.html',
    styleUrls: ['./invested-ether.component.scss']
})
export class InvestedEtherComponent implements OnInit, OnDestroy {
    private alive = true;
    private user: User = null;
    wallet: WalletTransactions = null;
    loading = false;
    error = false;
    errorMessage: string = null;

    // private loadEthereumTransactions(user: User): void {
    //     const txs: Array<Transaction> = user.etherTransactions;
    //     if (txs != null && txs.length > 0) {
    //         this.loading = true;
    //         this.ethereumService.loadTransactions(txs)
    //             .takeWhile(() => this.alive)
    //             .subscribe((txs: Array<EthereumTransaction>) => {
    //                     this.wallet = new EthereumTransactions(WalletType.ETH, txs);
    //                 },
    //                 error => {
    //                     this.loading = false;
    //                     this.error = true;
    //                     this.errorMessage = error.error;
    //                 },
    //                 () => this.loading = false
    //             );
    //     }
    // }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        // this.userSessionService.getUser()
        //     .takeWhile(() => this.alive)
        //     .subscribe((user: User) => {
        //             if (user != null) {
        //                 this.user = user;
        //                 if (this.user != null) {
        //                     this.loadEthereumTransactions(this.user);
        //                 }
        //             }
        //         },
        //         error => console.warn(error)
        //     );
    }

    constructor(private afAuth: AngularFireAuth,
                private ethereumService: EthereumService,
                private userSessionService: UserSessionService) {
    }

}
