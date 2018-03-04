import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../model/user';
import {UserSessionService} from '../../core/user-session.service';
import {CrowdsaleTimerService} from '../../core/crowdsale-timer.service';
import {AccountsService} from '../../core/accounts.service';
import {TokenContractService} from '../../core/token-contract.service';
import {Web3Service} from '../../core/web3.service';

@Component({
    selector: 'app-secure-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
    private alive = true;
    private accounts: Array<string>;
    user: User = null;
    hasStarted = false;
    hasEnded = false;
    isWhitelisted = false;
    provider: string = null;

    ngOnDestroy() {
        this.alive = false;
    }

    private whitelist(): void {
        if (this.accounts != null && this.accounts.length > 0) {
            this.tokenContractService.whitelist(this.accounts[0])
                .takeWhile(() => this.alive)
                .subscribe((isWhitelisted: boolean) => {
                        // console.log(`isWhitelisted: ${isWhitelisted}`);
                        this.isWhitelisted = isWhitelisted;
                    }, error => {
                        console.error(error);
                    },
                    () => {
                    }
                )
        }
    }

    ngOnInit() {
        if (this.web3Service.getProviderName() != null) {
            this.provider = this.web3Service.getProviderName();
            console.log(`Found ${this.provider}`);
        } else {
            console.error('Missing web3 provider. Please use MetaMask / Mist / Parity');
        }

        this.accountsService.accountsUpdatedEvent
            .takeWhile(() => this.alive)
            .subscribe((accounts: Array<string>) => {
                if (accounts != null && accounts.length > 0) {
                    this.accounts = accounts;
                    this.whitelist();
                }
            });

        this.userSessionService.getUser()
            .takeWhile(() => this.alive)
            .subscribe((user: User) => {
                    if (user != null) {
                        this.user = user;
                    }
                },
                error => console.warn(error)
            );

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

        this.crowdsaleTimerService.errorEvent
            .takeWhile(() => this.alive)
            .subscribe((error: string) => console.error(error));
    }

    constructor(private readonly userSessionService: UserSessionService,
                private readonly accountsService: AccountsService,
                private readonly web3Service: Web3Service,
                private readonly tokenContractService: TokenContractService,
                private readonly crowdsaleTimerService: CrowdsaleTimerService) {
    }
}
