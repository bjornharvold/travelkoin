import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {User} from '../../model/user';
import {environment} from '../../../environments/environment';
import {UserSessionService} from '../../core/user-session.service';
import {GridComponent, GridDataResult} from '@progress/kendo-angular-grid';

@Component({
    selector: 'app-secure-ether-wallet',
    templateUrl: './ether-wallet.component.html',
    styleUrls: ['./ether-wallet.component.scss']
})
export class EtherWalletComponent implements OnInit, OnDestroy {
    private alive = true;
    @ViewChild(GridComponent) grid: GridComponent;
    view: GridDataResult = null;
    loading = false;
    recipient: string = null;
    hasAddress = false;
    user: User = null;

    private loadTransactionsByType(user: User): void {
                this.hasAddress = user.ethWalletAddress != null;
                this.recipient = environment.ethWalletAddress;
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.loading = true;
        this.userSessionService.getUser()
            .takeWhile(() => this.alive)
            .subscribe((user: User) => {
                    if (user != null) {
                        this.loading = false;
                        this.user = user;
                    }
                },
                error => this.loading = false
            );
    }

    constructor(private userSessionService: UserSessionService) {
    }
}
