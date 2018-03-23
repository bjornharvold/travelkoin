import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../core/user.service';
import {User} from '../../model/user';
import {MandrillService} from '../../core/mandrill.service';

@Component({
    selector: 'app-hans-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
    private alive = true;
    users: Array<User> = null;
    error: string = null;
    loading = false;

    private whitelistUsersInFirebase(): void {
        if (this.users != null && this.users.length > 0) {
            for (let user of this.users) {
                user.whitelisted = true;
                this.userService.update(user.uid, user)
                    .takeWhile(() => this.alive)
                    .subscribe(() => console.log(`User ${user.email} has been whitelisted`), error => console.error(error), () => {});
            }
        }
    }

    private emailUserSuccessMessage(): void {
        if (this.users != null && this.users.length > 0) {
            for (let user of this.users) {
                this.mandrillService.sendEmail(user.email);
            }
        }
    }

    private loadApprovedUsers(): void {
        this.userService.listApproved()
            .takeWhile(() => this.alive)
            .subscribe((list: Array<User>) => {
                    if (list != null && list.length > 0) {
                        this.users = list;
                    }
                },
                error => {
                    this.loading = false;
                    console.error(error);
                    this.error = 'CODE.ERROR';
                },
                () => this.loading = false)
    }

    /**
     * Fetches all approved users from Firebase and adds them to the contract
     */
    addUsersToWhitelist(): void {
        this.error = null;
        this.loading = true;
        this.emailUserSuccessMessage();
        this.whitelistUsersInFirebase();
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.loadApprovedUsers();
    }

    constructor(private userService: UserService,
                private mandrillService: MandrillService) {
    }
}
