import {Component, OnDestroy, OnInit} from '@angular/core';
import {ImprovedMultimedia} from '../../model/improved-multimedia';
import {UserService} from '../../core/user.service';
import {User} from '../../model/user';
import {MandrillService} from '../../core/mandrill.service';

@Component({
  selector: 'app-hans-waiting-for-approval-users',
  templateUrl: './waiting-for-approval-users.component.html',
  styleUrls: ['./waiting-for-approval-users.component.scss']
})
export class WaitingForApprovalUsersComponent implements OnInit, OnDestroy {
    private alive = true;
    list: Array<User> = [];
    openModalButtonClicked = false;
    modalImage: ImprovedMultimedia = null;

    private listUsers(): void {
        this.userService.listWaitingForApproval()
            .takeWhile(() => this.alive)
            .subscribe((list: Array<User>) => {
                this.list = list;
            })
    }

    openModal(mm: ImprovedMultimedia): void {
        this.modalImage = mm;
        this.openModalButtonClicked = true;
    }

    closeModal(): void {
        this.openModalButtonClicked = false;
        this.modalImage = null;
    }

    /**
     * Sets the user flag to true and emails the user the good news
     * @param {number} index
     */
    approveUser(index: number): void {
        const user: User = this.list[index];
        this.userService.approveUser(user)
            .takeWhile(() => this.alive)
            .subscribe(() => this.mandrillService.sendEmail(user.email));
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.listUsers();
    }

    constructor(private userService: UserService,
                private mandrillService: MandrillService) {
    }
}
