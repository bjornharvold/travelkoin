import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../core/user.service';
import {User} from '../../model/user';
import {ImprovedMultimedia} from '../../model/improved-multimedia';

@Component({
    selector: 'app-hans-users-by-status',
    templateUrl: './users-by-status.component.html',
    styleUrls: ['./users-by-status.component.scss']
})
export class UsersByStatusComponent implements OnInit, OnDestroy {
    private alive = true;
    @Input() approved = false;
    @Input() submittedDocuments = false;
    @Input() blocked = false;
    limit: number = 25;
    list: Array<User> = [];
    openModalButtonClicked = false;
    modalImage: ImprovedMultimedia = null;

    private listUsers(): void {
        this.userService.list(this.limit, this.approved, this.submittedDocuments, this.blocked)
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

    toggleBlockUser(index: number): void {
        const user: User = this.list[index];
        user.blocked = !user.blocked;
        this.userService.update(user.uid, user);
    }

    approveUser(index: number): void {
        const user: User = this.list[index];
        user.approved = true;
        this.userService.update(user.uid, user);
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
