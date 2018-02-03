import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Transaction} from '../../model/transaction';
import {WalletType} from '../../model/wallet-type.enum';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {UserSessionService} from '../../core/user-session.service';
import {User} from '../../model/user';

@Component({
    selector: 'app-secure-wallet-send',
    templateUrl: './wallet-send.component.html',
    styleUrls: ['./wallet-send.component.scss']
})
export class WalletSendComponent implements OnInit, OnDestroy {
    private alive = true;
    private user: User = null;
    @Input() type: string;
    @Output() onTransactionComplete: EventEmitter<boolean>;
    form: FormGroup;
    dto: Transaction;
    updateButtonClicked = false;
    loading = false;
    codeCopied = false;

    set copyCode(copied: boolean) {
        this.codeCopied = copied;
        Observable.timer(2500)
            .takeWhile(() => this.alive)
            .subscribe(() => {
                this.codeCopied = false;
            });
    }

    reset(): void {
        this.dto.resetForm(this.form);
        this.onTransactionComplete.emit(true);
    }

    onSubmit(): void {
        this.loading = true;
        this.dto.updateFromFormValues(this.form);
        this.user.addTransaction(this.dto);
        this.userSessionService.updateUser(this.user.uid, this.user)
            .takeWhile(() => this.alive)
            .subscribe(() => {
                    this.onTransactionComplete.emit(true);
                    this.loading = false;
                    this.updateButtonClicked = false;
                },
                error => {
                    this.onTransactionComplete.emit(true);
                    this.loading = false;
                    this.updateButtonClicked = false;
                },
                () => {
                }
            );
    }

    showDialog() {
        this.updateButtonClicked = true;
    }

    completeDialogClose() {
        this.updateButtonClicked = false;
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {

        this.userSessionService.getUser()
            .takeWhile(() => this.alive)
            .subscribe((user: User) => {
                    if (user != null) {
                        this.user = user;

                        let recipient: string = null;
                        let sender: string = null;
                        switch (WalletType[this.type]) {
                            case WalletType.ETH:
                                recipient = environment.ethWalletAddress;
                                console.log(recipient);
                                sender = user.ethWalletAddress;
                                break;
                        }

                        this.dto = new Transaction(this.type, recipient, sender);
                        this.form = new FormGroup({});
                        this.dto.populateFormValues(this.form);
                    }
                },
                error => console.warn(error)
            );
    }

    constructor(private userSessionService: UserSessionService) {
        this.onTransactionComplete = new EventEmitter<boolean>(true);
    }
}
