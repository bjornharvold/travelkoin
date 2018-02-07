import {Component, OnDestroy, OnInit} from '@angular/core';
import {ImprovedMultimedia} from '../../model/improved-multimedia';
import {UserService} from '../../core/user.service';
import {User} from '../../model/user';

@Component({
  selector: 'app-hans-waiting-for-approval-users',
  templateUrl: './waiting-for-approval-users.component.html',
  styleUrls: ['./waiting-for-approval-users.component.scss']
})
export class WaitingForApprovalUsersComponent implements OnInit, OnDestroy {
    private alive = true;
    limit: number = 25;
    list: Array<User> = [];
    openModalButtonClicked = false;
    modalImage: ImprovedMultimedia = null;

    private listUsers(): void {
        this.userService.list(this.limit, false, true, false)
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

    approveUser(index: number): void {
        const user: User = this.list[index];
        this.userService.approveUser(user);
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.listUsers();
    }

    constructor(private userService: UserService) {
    }
}