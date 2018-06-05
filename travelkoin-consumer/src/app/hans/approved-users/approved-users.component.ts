import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ImprovedMultimedia} from '../../model/improved-multimedia';
import {UserService} from '../../core/user.service';
import {User} from '../../model/user';
import {takeWhile} from 'rxjs/operators';

@Component({
  selector: 'app-hans-approved-users',
  templateUrl: './approved-users.component.html',
  styleUrls: ['./approved-users.component.scss']
})
export class ApprovedUsersComponent implements OnInit, OnDestroy {
    private alive = true;
    @Input() approved = false;
    @Input() submittedDocuments = false;
    @Input() blocked = false;
    list: Array<User> = [];
    openModalButtonClicked = false;
    modalImage: ImprovedMultimedia = null;

    private listUsers(): void {
        this.userService.listApproved().pipe(
            takeWhile(() => this.alive))
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
        this.userService.toggleBlockUser(user);
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
